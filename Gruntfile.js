/*
 * ngsrc
 * git://github.com/tomastrajan/grunt-ngsrc
 *
 * Copyright (c) 2015 Tomas Trajan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

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

    jscs: {
      src: ['Gruntfile.js', 'tasks/**/*.js', 'test/*.js'],
      options: {
        config: '.jscsrc',
        verbose: true,
        fix: true
      }
    },

    clean: {
      test: ['tmp']
    },

    copy: {
      test: {
        files: [
          {cwd: 'test/fixtures/', expand: true, src: ['**/*.*'], dest: 'tmp/basic/'},
          {cwd: 'test/fixtures/', expand: true, src: ['**/*.*'], dest: 'tmp/full/'},
          {cwd: 'test/fixtures/', expand: true, src: ['**/*.*'], dest: 'tmp/notFoundSrc/'},
          {cwd: 'test/fixtures/', expand: true, src: ['**/*.*'], dest: 'tmp/notFoundDest/'}
        ]
      }
    },

    ngsrc: {

      basic: {
        src: ['tmp/basic/src/**/*.js', '!tmp/basic/src/**/*.spec.js'],
        dest: ['tmp/basic/**/*.html']
      },
      full: {
        options: {
          moduleDiscriminator: '.module.js',
          path: 'path/to/files/after/build/process/',
          placeholder: '<!-- my-custom-placeholder-regex -->'
        },
        cwd: 'tmp/full/src/',
        src: ['**/*.js', '!**/*.spec.js'],
        dest: ['tmp/full/**/*.html']
      },
      notFoundSrc: {
        src: ['bad/path/**/*.js', '!bad/path/**/*.spec.js'],
        dest: ['tmp/notFoundSrc/**/*.html']
      },
      notFoundDest: {
        src: ['tmp/notFoundDest/**/*.js', '!tmp/notFoundDest/**/*.spec.js'],
        dest: ['temp/path/**/*.html']
      }
    },

    nodeunit: {
      test: ['test/*.spec.js']
    }

  });

  grunt.loadTasks('tasks');

  grunt.registerTask('lint', ['jshint', 'jscs']);

  grunt.registerTask('test', ['clean', 'copy', 'ngsrc', 'nodeunit']);

  grunt.registerTask('default', ['lint', 'test']);

};
