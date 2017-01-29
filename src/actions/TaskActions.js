import * as types from '../constants/ActionTypes';

export function addFile(data, id) {
    return {
        type: types.ADD_FILE,
        data,
        id
    };
}

export function processFile(id) {
    return {
        type: types.PROCESS_FILE,
        id
    };
}


export function startFile(id) {
    return {
        type: types.START_FILE,
        id
    };
}

export function cancelFile(id) {
    return {
        type: types.CANCEL_FILE,
        id
    }

}

export function removeFile(id) {
    return {
        type: types.REMOVE_FILE,
        id
    };
}

export function pauseFile(id) {
    return {
        type: types.PAUSE_FILE,
        id
    };
}

export function resumeFile(id) {
    return {
        type: types.RESUME_FILE,
        id
    };
}

export function doneFile(id) {
    return {
        type: types.DONE_FILE,
        id
    };
}

export function errorFile(id, error) {
    return {
        type: types.ERROR_FILE,
        id,
        error
    };
}

export function updateFileName(id, name) {
    return {
        type: types.UPDATE_FILE_NAME,
        id,
        name
    };
}

export function updateFileSize(id, size) {
    return {
        type: types.UPDATE_FILE_SIZE,
        id,
        size
    };
}

export function updateFileLoaded(id, loaded) {
    return {
        type: types.UPDATE_FILE_LOADED,
        id,
        loaded
    }
}