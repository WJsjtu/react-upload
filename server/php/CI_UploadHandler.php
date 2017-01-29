<?php
require('UploadHandler.php');

class CI_UploadHandler extends UploadHandler {
    public function __construct($path) {
        parent::__construct(
            array(
                'script_url' => $this->get_full_url() . DIRECTORY_SEPARATOR . basename($this->get_server_var('SCRIPT_NAME')),
                'upload_dir' => rtrim(FCPATH, '/') . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . (is_null($path) ? '' : $path . DIRECTORY_SEPARATOR),
                'upload_url' => base_url() . 'uploads' . DIRECTORY_SEPARATOR . (is_null($path) ? '' : $path . DIRECTORY_SEPARATOR),

                'image_versions' => array()
            )
        );
    }


    protected function getFileTempName($fileName) {
        $componentId = isset($_POST['componentId']) ? $_POST['componentId'] : false;
        $fileId = isset($_POST['fileId']) ? $_POST['fileId'] : false;

        $extension = pathinfo($fileName, PATHINFO_EXTENSION);
        $name = sha1($fileName) . '.' . $extension;

        return ($componentId || $fileId) ? sha1(($componentId || '') . ($fileId || '')) . '-' . $name : $name;
    }


    protected function getFileFinalName($file_path, $content_range) {
        $hash = md5(hash_file('md5', $file_path)) . '.' . pathinfo($file_path, PATHINFO_EXTENSION);

        /**
         * Maybe the same file will be uploaded several times, how to deal with them is up to you.
         * Both here and `get_unique_filename` allow you to do something.
         * Here we just perform default get_unique_filename..
         */

        return $this->get_unique_filename($file_path, $hash, null, null, null, null, $content_range);
    }

    protected function handleUploadedFile($file_path, $raw_name, $file, $content_range) {

        $newName = $this->getFileFinalName($file_path, $content_range);

        //Rename the file name since the file name is up to the nonce if it is uploaded by chunks.
        rename($file_path, dirname($file_path) . DIRECTORY_SEPARATOR . $newName);


        /**
         * Some DB operation here.
         */
        $CI = &get_instance();
        $CI->db->trans_start();
        $extension = pathinfo($newName, PATHINFO_EXTENSION);
        $type = preg_match('/(bmp|jpe?g|tiff|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|png)$/i', $extension) ? 'img' : 'file';
        //$type = preg_match('/(bmp|jpe?g|gif|ico|png)$/i', $extension) ? 'img' : 'file';
        $result = $CI->db->insert('files', [
            'file_name' => $raw_name,
            'native_path' => 'uploads' . DIRECTORY_SEPARATOR . 'files' . DIRECTORY_SEPARATOR . $newName,
            'file_size' => $file->size,
            'type' => $type
        ]);
        if ($result) {
            $result = $CI->db->insert_id();
            $file->insert_id = $result;
        }
        $CI->db->trans_complete();

        $file->raw_name = $raw_name;
        $file->name = $newName;
    }

    protected function get_unique_filename($file_path, $name, $size, $type, $error,
                                           $index, $content_range) {
        return parent::get_unique_filename($file_path, $name, $size, $type, $error,
            $index, $content_range);
    }

    protected function get_download_url($file_name, $version = null, $direct = false) {
        //Server on Windows use \ instead of /
        return str_replace('\\', '/', parent::get_download_url($file_name, $version, $direct));
    }

    protected function handle_file_upload($uploaded_file, $name, $size, $type, $error,
                                          $index = null, $content_range = null) {
        //CI change name for each file
        /**
         * $uploaded_file refers to the tmp_name of the post which is fixed when submit,
         * it is a server path to tell where the file is, for each upload instance the server and PHP will create
         * a new tmp_name, so there is few possible that two upload instance will have the same tmp_name
         *
         * $name is the name of the file uploaded by user which is most likely to be the same as another file,
         * so it is necessary to rename it to avoid such things from happening.
         * Although this script provides `get_unique_filename` function to do something by adding numbers after file name,
         * it has a serious problem that when two users are uploading two exact the same file by chunks at same time,
         * the `get_unique_filename` will end up with mixing two file chunks,
         * since it cannot tell which chunk to append and which chunk need to create a new file on server.
         * Therefore sme data from front-end to identify the file is a good way to avoid mixing chunks.
         * `getFileTempName` function is extended for this reason, it fix the name with some nonce passed from front-end.
         */

        $rawName = $name;
        $name = $this->getFileTempName($name);

        $file = new \stdClass();
        $file->name = $this->get_file_name($uploaded_file, $name, $size, $type, $error,
            $index, $content_range);
        $file->size = $this->fix_integer_overflow((int)$size);
        $file->type = $type;
        if ($this->validate($uploaded_file, $file, $error, $index)) {
            $this->handle_form_data($file, $index);
            $upload_dir = $this->get_upload_path();
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, $this->options['mkdir_mode'], true);
            }
            $file_path = $this->get_upload_path($file->name);
            $append_file = $content_range && is_file($file_path) &&
                $file->size > $this->get_file_size($file_path);
            if ($uploaded_file && is_uploaded_file($uploaded_file)) {
                // multipart/formdata uploads (POST method uploads)
                if ($append_file) {
                    file_put_contents(
                        $file_path,
                        fopen($uploaded_file, 'r'),
                        FILE_APPEND
                    );
                } else {
                    move_uploaded_file($uploaded_file, $file_path);
                }
            } else {
                // Non-multipart uploads (PUT method support)
                file_put_contents(
                    $file_path,
                    fopen($this->options['input_stream'], 'r'),
                    $append_file ? FILE_APPEND : 0
                );
            }
            $file_size = $this->get_file_size($file_path, $append_file);
            if ($file_size === $file->size) {


                /**
                 * Given a chance to log upload finish event, putting the process before url generation is for changing file name.
                 */
                $this->handleUploadedFile($file_path, $rawName, $file, $content_range);

                $file->url = $this->get_download_url($file->name);
                if ($this->is_valid_image_file($file_path)) {
                    $this->handle_image_file($file_path, $file);
                }

            } else {
                $file->size = $file_size;
                if (!$content_range && $this->options['discard_aborted_uploads']) {
                    unlink($file_path);
                    $file->error = $this->get_error_message('abort');
                }
            }
            $this->set_additional_file_properties($file);
        }
        return $file;
    }
}