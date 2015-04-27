'use strict';

var grunt = require('grunt');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

var REGEX_NEW_LINE = /(?:\\[rn]|[\r\n]+)+/g;

exports.ngsrc = {
    setUp: function (done) {
        done();
    },
    basic: function(test){
        var content = grunt.file.read('tmp/basic/src/index.html', {encoding: 'utf8'}),
            lines = content.split(REGEX_NEW_LINE);
        test.equal(lines[8], '<script src="tmp/basic/src/app/app.module.js"></script>');
        test.equal(lines[12], '<script src="tmp/basic/src/app/componentA/subcomponentC/subcomponentC.module.js"></script>');
        test.equal(lines[13], '<script src="tmp/basic/src/app/componentA/componentA.controller.js"></script>');
        test.done();
    },
    full: function(test){
        var content = grunt.file.read('tmp/full/src/index.html', {encoding: 'utf8'}),
            lines = content.split(REGEX_NEW_LINE);
        test.equal(lines[9], '<script src="path/to/files/after/build/process/app/app.module.js"></script>');
        test.equal(lines[13], '<script src="path/to/files/after/build/process/app/componentA/subcomponentC/subcomponentC.module.js"></script>');
        test.equal(lines[14], '<script src="path/to/files/after/build/process/app/componentA/componentA.controller.js"></script>');
        test.done();
    },
    notFoundSrc: function(test){
        var content = grunt.file.read('tmp/notFoundDest/src/index.html', {encoding: 'utf8'}),
            lines = content.split(REGEX_NEW_LINE);
        test.equal(lines.length, 13);
        test.equal(lines[7], '    <!-- ngsrc -->');
        test.equal(lines[8], '    <!-- my-custom-placeholder-regex -->');
        test.done();
    },
    notFoundDest: function(test){
        var content = grunt.file.read('tmp/notFoundSrc/src/index.html', {encoding: 'utf8'}),
            lines = content.split(REGEX_NEW_LINE);
        test.equal(lines.length, 13);
        test.equal(lines[7], '    <!-- ngsrc -->');
        test.equal(lines[8], '    <!-- my-custom-placeholder-regex -->');
        test.done();
    }

};
