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

    grunt.registerMultiTask('ngsrc', 'Adds your angular.js source files to index.html automatically', function () {
        var options = this.options({
            path: undefined,
            placeholder: '<!-- ngsrc -->'
        });
        this.files.forEach(function(files) {
            replace({
                regex: options.placeholder,
                replacement: getReplacement(files.src, options),
                paths: getDestinations(files.dest),
                recursive: true,
                silent: true
            });
        });
    });

    function getReplacement(paths, options) {
        var result;
        paths.forEach(function(p) {
            if (p && p.split && p.split('/').length) {
                result = result ? result : '';
                var origPathArray = p.split('/'),
                    origFileName = origPathArray[origPathArray.length - 1],
                    origPathToFile = origPathArray.splice(0, origPathArray.length - 1),
                    pathToFile = options.path ? options.path : origPathToFile.join('/') + '/';
                result += '<script src="' + path.normalize(pathToFile + origFileName) + '"></script>\n';
            }
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

};
