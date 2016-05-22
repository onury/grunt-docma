/* eslint */

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        docma: grunt.file.readYAML('config/docma.conf.yml')
    });

    // grunt.loadNpmTasks('grunt-docma');
    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['docma:code', 'docma:other']);
    grunt.registerTask('single', ['docma:code']);

};
