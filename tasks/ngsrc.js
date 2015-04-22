/*
 * ngsrc
 * git://github.com/tomastrajan/grunt-ngsrc
 *
 * Copyright (c) 2015 Tomas Trajan
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash'),
    path = require('path'),
    replace = require('replace');


module.exports = function(grunt) {

    grunt.registerMultiTask(
        'ngsrc',
        'Find and add Angular.js files to index.html automatically and in correct order (also applicable for source files of any other framework). Great for development builds, inspired by usemin which is strongly recommended for handling of production builds.',
        function () {
            var options = this.options({
                path: undefined,
                placeholder: '<!-- ngsrc -->'
            });
            this.files.forEach(function(files) {
                var replacementPaths = getReplacementPaths(files.src, options),
                    replacement = createTemplate(replacementPaths, options),
                    destinations = getDestinations(files.dest);
                if (destinations.length) {
                    logVerbose(replacementPaths, destinations);
                    grunt.log.write('Adding script tags into ' + destinations.length + ' destination ' + (destinations.length === 1 ? 'file' : 'files') + ' ');
                    replace({
                        regex: options.placeholder,
                        replacement: replacement,
                        paths: destinations,
                        recursive: true,
                        silent: true
                    });
                    grunt.log.ok();
                } else {
                    grunt.fail.warn('No destination file found');
                }
            });
        });

    function getReplacementPaths(paths, options) {
        var replacementPaths = [];
        paths.forEach(function(p) {
            if (p && p.split && p.split('/').length) {
                var origPathArray = p.split('/'),
                    origFileName = origPathArray[origPathArray.length - 1],
                    origPathToFile = origPathArray.splice(0, origPathArray.length - 1),
                    pathToFile = options.path ? options.path + origPathToFile.join('/') + '/' : origPathToFile.join('/') + '/',
                    replacementPath = pathToFile + origFileName;
                    replacementPaths.push(path.normalize(replacementPath));
            }
        });
        return replacementPaths;
    }
    
    function createTemplate(replacementPaths, options) {
        var result;
        replacementPaths.forEach(function(path) {
            result = result ? result : '';
            result += '<script src="' + path + '"></script>\n';
        });
        return result ? '\n' + result : options.placeholder;
    }

    function getDestinations(paths) {
        var destinations = [];
        if (paths && paths.length) {
            paths.forEach(function(p) {
                grunt.file.expand(p).forEach(function(destPath) {
                    destinations.push(destPath);
                });
            });
        }
        return destinations;
    }
    
    function logVerbose(replacementPaths, destinations) {
        replacementPaths.forEach(function (path) {
            grunt.verbose.write('Src: ' + path + '...');
            grunt.verbose.ok();
        });
        grunt.verbose.writeln();
        destinations.forEach(function (path) {
            grunt.verbose.write('Dest: ' + path + '...');
            grunt.verbose.ok();
        });
        grunt.verbose.writeln();
    }

};
