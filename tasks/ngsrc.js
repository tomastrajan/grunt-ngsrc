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
                moduleDiscriminator: 'module.js',
                path: undefined,
                placeholder: '<!-- ngsrc -->'
            });
            this.files.forEach(function(files) {
                var replacementPaths = getReplacementPaths(getSortedPaths(files.src)),
                    replacement = createTemplate(replacementPaths),
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

            function getSortedPaths(paths) {
                var pathsModules = [],
                    pathsOther = [];
                paths.forEach(function(path) {
                    if (getFilename(path).indexOf(options.moduleDiscriminator) > -1) {
                        pathsModules.push(path);
                    } else {
                        pathsOther.push(path);
                    }
                });
                pathsModules.sort(sortByDepth);
                pathsOther.sort(sortByDepth);
                return pathsModules.concat(pathsOther);

                function sortByDepth(p1, p2){
                    if (hasDepth(p1) && hasDepth(p2)) {
                        if (getDepth(p1) < getDepth(p2)) {
                            return -1;
                        }
                        if (getDepth(p1) > getDepth(p2)) {
                            return 1;
                        }
                    } else {
                        return 0;
                    }
                }

                function hasDepth(path) {
                    return path && path.split && path.split('/').length
                }

                function getDepth(path) {
                    return path.split('/').length;
                }

                function getFilename(path) {
                    if (hasDepth(path)) {
                        var tokens = path.split('/');
                        return tokens[tokens.length - 1];
                    }
                    return path;
                }
            }

            function getReplacementPaths(paths) {
                var replacementPaths = [];
                paths.forEach(function(p) {
                    if (p && p.split && p.split('/').length) {
                        var origPathArray = p.split('/'),
                            origFileName = origPathArray[origPathArray.length - 1],
                            origPathToFile = origPathArray.splice(0, origPathArray.length - 1),
                            pathToFile = options.path ? options.path + origPathToFile.join('/') + '/' : origPathToFile.join('/') + '/',
                            replacementPath = pathToFile + origFileName;
                        replacementPaths.push(replacementPath);
                    }
                });
                return replacementPaths;
            }

            function createTemplate(replacementPaths) {
                var result;
                replacementPaths.forEach(function(path, index) {
                    result = result ? result : '';
                    var offset = index === 0 ? '' : '        ',
                        newline = index === replacementPaths.length - 1 ? '' : '\n';
                    result += (offset + '<script src="' + path + '"></script>' + newline);
                });
                result = result ? result : options.placeholder;
                return grunt.util.normalizelf(result);
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

        });

};
