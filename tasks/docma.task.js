/**
 *  Grunt Task for Docma.
 *  @author   Onur Yıldırım (onur@cutepilot.com)
 *  @license  MIT
 */
module.exports = function (grunt) {
    'use strict';

    // Own modules
    var fs = require('fs');

    // Own modules
    var Docma = require('docma');

    // Dep modules
    var _ = require('lodash'),
        Promise = require('bluebird'),
        stripJsonComments = require('strip-json-comments');

    var promiseReadFile = Promise.promisify(fs.readFile);

    // --------------------------------
    //  UTILITY METHODS
    // --------------------------------

    // --------------------------------
    //  TASK DEFINITION
    // --------------------------------

    grunt.registerMultiTask('docma', 'Grunt Task for Docma.', function () {
        var task = this,
            // Mark the task as async
            taskComplete = task.async(),
            conf = grunt.config.get([this.name, this.target]);

        var options = task.options({
            // Task related options
            traceFatal: false,
            // Docma config
            // defaults are set by Docma
            config: {}
        });

        // UNCAUGHT/FATAL EXCEPTION STACKS

        // On a fatal error (i.e. uncaughtException), Grunt exits the process
        // without a stack trace. We'll force Grunt to output the stack trace.
        // This can be done by the --stack option which is false by default.
        // But this will also output warnings (such as "task failed") in addition
        // to fatal errors.

        // We need a named function to check whether this is previously added.
        // Bec. since this is a "multi" task, this handler will get added
        // every time.
        function _taskFatalHandler_(e) {
            var err = e ? (e.stack || e.message || e) : 'Unknown Error';
            grunt.fatal(err, grunt.fail.code.TASK_FAILURE);
        }
        // The default Grunt handler:
        // function (e) { fail.fatal(e, fail.code.TASK_FAILURE); }

        if (options.traceFatal === 1 || options.traceFatal === true) {
            var handlers = process.listeners('uncaughtException'),
                alreadyAdded = handlers.some(function (handler) {
                    return handler.name === '_taskFatalHandler_';
                });
            if (!alreadyAdded) {
                process.removeAllListeners('uncaughtException');
                // add the handler before any other
                handlers.unshift(_taskFatalHandler_);
                handlers.forEach(function (handler) {
                    process.on('uncaughtException', handler);
                });
            }
        } else if (options.traceFatal === 2) {
            grunt.option('stack', true);
        }

        // grunt.log.writeln('conf', conf);
        var docmaConfig;

        Promise.resolve()
            .then(function () {
                if (typeof options.config === 'string') {
                    return promiseReadFile(options.config)
                        .then(function (json) {
                            return JSON.parse(stripJsonComments(json));
                        });
                }
                return options.config || {};
            })
            .then(function (docmaConf) {
                docmaConfig = _.defaultsDeep(docmaConf, {
                    src: conf.src,
                    dest: conf.dest
                });
                return Docma.create(docmaConfig).build();
            })
            .then(function () {
                var name = _.get(docmaConfig, 'template.document.title')
                    || _.get(docmaConfig, 'template.options.title')
                    || '';
                name = name ? '"' + name + '" d' : 'D';
                grunt.log.writeln(name + 'ocumentation is successfully built @ ' + docmaConfig.dest);
            })
            .catch(function (error) {
                grunt.log.error(error);
            })
            .finally(taskComplete);

    });
};
