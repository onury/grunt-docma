/* eslint */

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        docma: grunt.file.readYAML('config/docma.conf.yml')
    });

    // grunt.loadNpmTasks('grunt-docma');
    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['docma']); // all
    grunt.registerTask('single', ['docma:code']);
    grunt.registerTask('from-file', ['docma:fromFile', 'docma:fromFile2']);

};
