/*
 * ngsrc
 * git://github.com/tomastrajan/grunt-ngsrc
 *
 * Copyright (c) 2015 Tomas Trajan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    // load all npm grunt tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        // Lint JavaScript
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/**/*.js',
                '<%= nodeunit.test %>'
            ],
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            test: ['tmp']
        },

        // Copy test fixtures to tmp folder before replacing placeholders to preserve test data
        copy: {
            test: {
                files: [
                    { cwd: 'test/fixtures/', expand: true, src: ['**/*.*'], dest: 'tmp/basic/' },
                    { cwd: 'test/fixtures/', expand: true, src: ['**/*.*'], dest: 'tmp/full/' },
                    { cwd: 'test/fixtures/', expand: true, src: ['**/*.*'], dest: 'tmp/notFoundSrc/' },
                    { cwd: 'test/fixtures/', expand: true, src: ['**/*.*'], dest: 'tmp/notFoundDest/' }
                ]
            }
        },

        // Configuration to be run (and then tested).
        ngsrc: {

            basic: {
                src: ['tmp/basic/src/**/*Module.js', 'tmp/basic/src/**/*.js', '!tmp/basic/src/**/*.spec.js'],
                dest: ['tmp/basic/**/*.html']
            },
            full: {
                options: {
                    path: 'path/to/files/after/build/process/',
                    placeholder: '<!-- my-custom-placeholder-regex -->'
                },
                cwd: 'tmp/full/src/',
                src: ['**/*.Module.js', '**/*.js', '!**/*.spec.js'],
                dest: ['tmp/full/**/*.html']
            },
            notFoundSrc: {
                src: ['bad/path/**/*Module.js', 'bad/path/**/*.js', '!bad/path/**/*.spec.js'],
                dest: ['tmp/notfound/**/*.html']
            },
            notFoundDest: {
                src: ['tmp/notFoundDest/**/*Module.js', 'tmp/notFoundDest/**/*.js', '!tmp/notFoundDest/**/*.spec.js'],
                dest: ['bad/path/**/*.html']
            }
        },

        // Unit tests.
        nodeunit: {
            test: ['test/*.spec.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'copy', 'ngsrc', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
