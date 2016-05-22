/**
 *  Grunt Task for Docma.
 *  @author   Onur Yıldırım (onur@cutepilot.com)
 *  @license  MIT
 */
module.exports = function (grunt) {
    'use strict';

    // Core modules
    var fs = require('fs');

    // Own modules
    var Docma = require('docma');

    // Dep modules
    var _ = require('lodash'),
        Promise = require('bluebird'),
        stripJsonComments = require('strip-json-comments');

    // vars
    var promiseReadFile = Promise.promisify(fs.readFile);

    // --------------------------------
    //  HELPER METHODS
    // --------------------------------

    // fs.exists does not conform to the common Node callback
    // signature (i.e. function (err, result) {..}). So instead of
    // using .promisify(), we'll write the long version.
    function promiseExists(filePath, callback) {
        return new Promise(function (resolve, reject) {
            fs.exists(filePath, function (exists) {
                resolve(exists);
            });
        });
    }

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

        // TASK ROUTINE

        var docmaConfig;

        Promise.resolve()
            .then(function () {
                if (typeof options.config === 'string') {
                    grunt.verbose.writeln('Building from configuration file: ' + options.config);
                    // we could use `Docma.fromFile()` but in this grunt task,
                    // `src` and `dest` properties might be defined within the
                    // task.options rather than in the file (or
                    // task.options.config).
                    return promiseExists(options.config)
                        .then(function (exists) {
                            if (!exists) {
                                throw new Error('Configuration file does not exist: ' + options.config);
                            }
                            // grunt.verbose.writeln('Config file exists: ' + options.config);
                            return promiseReadFile(options.config, 'utf8');
                        })
                        .then(function (json) {
                            var parsed = JSON.parse(stripJsonComments(json));
                            grunt.verbose.writeln('Configuration file parsed...');
                            return parsed;
                        });
                }
                return options.config || {};
            })
            .then(function (docmaConf) {
                if (conf.src && conf.dest) {
                    docmaConfig = _.defaultsDeep({
                        src: conf.src,
                        dest: conf.dest
                    }, docmaConf);
                } else {
                    docmaConfig = docmaConf;
                }
                grunt.verbose.writeln('Building with configuration:');
                grunt.verbose.writeln(JSON.stringify(docmaConfig));
                return Docma.create(docmaConfig).build();
            })
            .then(function () {
                var name = _.get(docmaConfig, 'template.document.title')
                    || _.get(docmaConfig, 'template.options.title')
                    || '';
                name = name ? '"' + name + '" d' : 'D';
                grunt.log.ok(name + 'ocumentation is successfully built @ ' + docmaConfig.dest);
            })
            .catch(function (error) {
                grunt.log.error(error.stack || error);
            })
            .finally(taskComplete);

    });
};
