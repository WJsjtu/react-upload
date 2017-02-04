const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const Logger = require('./Logger');
const makeDirectory = require('./makeDirectory');
const webpackTask = require('./webpackTask');

const distPath = path.resolve(__dirname, '../dist/');
const sourcePath = path.resolve(__dirname, '../src/');

makeDirectory(distPath);

const ChainedPromise = require('./ChainedPromise');

ChainedPromise(
    () => {
        const logger = new Logger('build-uncompressed: uploader', 'index.js');
        logger.start();

        return webpackTask(
            {
                entry: path.join(sourcePath, 'index.js'),
                output: {
                    path: distPath,
                    filename: 'uploader.js',
                    //library: 'Uploader',
                    //libraryTarget: 'umd'
                },
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env': {
                            NODE_ENV: JSON.stringify('development')
                        }
                    })
                ]
            }, function (options) {
                options.module.rules.forEach(function (rule, index) {
                    if (rule.test instanceof RegExp) {
                        if ('test.js'.match(rule.test)) {
                            options.module.rules[index].use.push(
                                {
                                    loader: 'comment-loader',
                                    options: {
                                        definition: ['DEBUG']
                                    }
                                }
                            );
                        }
                    }
                });
            }
        ).then(logger.finish.bind(logger), logger.error.bind(logger));
    }
    ,
    () => {
        const logger = new Logger('build-compressed: uploader', 'index.js');
        logger.start();
        return webpackTask(
            {
                entry: path.join(sourcePath, 'index.js'),
                output: {
                    path: distPath,
                    filename: 'uploader.min.js',
                    //library: 'uploader',
                    //libraryTarget: 'umd'
                },
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env': {
                            NODE_ENV: JSON.stringify('production')
                        }
                    }),
                    new webpack.optimize.UglifyJsPlugin({
                        sourceMap: false,
                        compress: {
                            dead_code: true,
                            drop_debugger: true,
                            unused: true,
                            if_return: true,
                            warnings: false,
                            join_vars: true
                        },
                        output: {
                            comments: false
                        }
                    })
                ]
            }, function (options) {
                options.module.rules.forEach(function (rule, index) {
                    if (rule.test instanceof RegExp) {
                        if ('test.js'.match(rule.test)) {
                            options.module.rules[index].use.push(
                                {
                                    loader: 'comment-loader',
                                    options: {
                                        definition: ['RELEASE']
                                    }
                                }
                            );
                        }
                    }
                });

            }
        ).then(logger.finish.bind(logger), logger.error.bind(logger));
    }
);
