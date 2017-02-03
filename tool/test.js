const UglifyJS = require('uglify-js');
const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, './../dist/uploader.js'), 'utf-8');

const ast = UglifyJS.parse(content);

const moduleMap = {};

var count = 0;

if (ast instanceof UglifyJS.AST_Toplevel) {
    /**
     * Webpack bundle is in following form.
     * !(function(modules) { // webpackBootstrap }([...modules]));
     *
     * The ; at last and the comments first will be detected as a statement.
     * The body is the statements content and can have several statements (Webpack has only one).
     * the only statement element in body contains a function call as its body.
     */

    if (Array.isArray(ast.body) && ast.body[0] instanceof UglifyJS.AST_SimpleStatement) {

        var webpackCallBody = ast.body[0].body;
        if (ast.body[0].body instanceof UglifyJS.AST_Call) {
            /**
             * if not start with !
             */
            webpackCallBody = ast.body[0].body;
        } else if (ast.body[0].body instanceof UglifyJS.AST_UnaryPrefix) {
            /**
             * if start with !
             */
            if (ast.body[0].body.expression instanceof UglifyJS.AST_Call) {
                webpackCallBody = ast.body[0].body.expression;
            } else {
                return;
            }

        } else {
            return;
        }


        /**
         * funcArgs refers to arguments of the call (array).
         */
        const funcArgs = webpackCallBody.args;

        if (Array.isArray(funcArgs) && funcArgs.length === 1) {

            if (funcArgs[0] instanceof UglifyJS.AST_Array) {
                /**
                 * funcArgs[0] refers to [...modules], it is an array.
                 */
                const modules = funcArgs[0].elements;

                console.log('The bundle has ' + modules.length + ' modules!');

                modules.forEach(function (module, index) {
                    /**
                     * Each module is a function.
                     */
                    if (module instanceof UglifyJS.AST_Function) {

                        if (module.argnames.length === 3) {

                            /**
                             * module, exports, __webpack_require__
                             */
                            moduleMap[index] = {
                                independent: false,
                                usage: []
                            };

                            count++;

                        } else if (module.argnames.length === 2) {
                            /**
                             * module, exports
                             */
                            moduleMap[index] = {
                                independent: true,
                                usage: []
                            };
                        }
                    }
                });

                modules.forEach(function (module, index) {
                    const walker = new UglifyJS.TreeWalker(function (node) {
                        if (node instanceof UglifyJS.AST_Call) {

                            if (node.expression instanceof UglifyJS.AST_SymbolRef) {
                                if (node.args.length == 1 && node.args[0] instanceof UglifyJS.AST_Constant) {
                                    if (node.expression.name === '__webpack_require__') {
                                        if (moduleMap[node.args[0].value]) {
                                            moduleMap[node.args[0].value].usage.push(index);
                                        }
                                        count++;
                                    }
                                }
                            }
                        }
                    });

                    module.walk(walker);
                });

                console.log(count);
                console.log(moduleMap);
            }
        }
    }
}
