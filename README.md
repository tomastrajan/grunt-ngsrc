# grunt-ngsrc

> Find and add your angular.js source files into index.html automatically

Find and add angular.js files to index.html automatically and in correct order (also applicable for source files of any other framework). Great for development builds, inspired by [usemin](https://github.com/yeoman/grunt-usemin) which is strongly recommended for handling of production builds.

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ngsrc --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('ngsrc');
```

## The "ngsrc" task

### Overview
In your project's Gruntfile, add a section named `ngsrc` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    ngsrc: {
        target: {
            src: ['src/app/**/*.js', '!src/app/**/*.spec.js'],
            dest: ['tmp/index.html']
        }
    },
})
```

## Use case
Lets say you have angular.js application and grunt build process. Usually you have to add all `.js` files you create 
in `index.html` manually. This can be a pretty tedious task. It's easy to forget to insert new file and then you get 
those errors in browser's console too... What if it would be enough to just add the new file to your source folder 
and reference would be then automatically (for example as part of `watch` task) inserted into specified `index.html` 
files in place of placeholder:

```html
<!-- ngsrc -->
```

> Don't forget to copy original `index.html` file to some new location (eg: tmp, build_dev, ...) to preserve
original index.html file so that you preserve the placeholder for repeated builds.

### Target

#### target.src
Type: `String`, `Array`

angular.js source files to be injected as script tags into your `index.html`

#### IMPORTANT - Ensure correct order of generated script tags

> In angular.js we define modules with their dependencies (other angular.js modules) and then we add controllers,
services, directives (etc ...) to those existing modules. These modules and components are usually defined in their respective
source files. Order of the script tags referencing angular.js source files in index.html is important because of angular's dependency injection mechanism.
If they are referenced in incorrect order there will be errors that you are referencing module which is not yet available.


```js
  // Example of correct order of module & component definitions

  // src/app/moduleA/moduleA.module.js
  angular.module('moduleA', ['moduleB'])
  
  // src/app/moduleA/moduleB/moduleB.module.js
  angular.module('moduleB', [])
  
  // src/app/moduleA/moduleB/moduleB.controller.js
  angular.module('moduleB')
      .controller('ModuleControllerB', function() { //... });
```

### Solution
To make `ngsrc` work reliably, you have to use some naming convention for files that contain  your `module` definitions.
In the example above we specified two `String`s in `src` array of `ngsrc`

  1. `'src/app/**/*.js'`        - get all javascript source files (modules and other)
  2. `'!src/app/**/*.spec.js'`  - exclude all test files (we don't want to include test files in our `index.html` file)
  
All files containing `angular.module('someModule', []);` definitions which follow specified convention 
( by default `*module.js` eg: `some.module.js` or `someAwesome_module.js`, ... ) will be inserted as first, 
followed by other files. All the files will be then ordered by _depth of their path_ (number of folders in their path) 
which gives you reliable and predictable way for modeling of your dependency tree.

Example of generated index.html

```html
<!-- modules are specified as first, ordered by _depth of their path_ -->
<script src="tmp/basic/src/app/app.module.js"></script>
<script src="tmp/basic/src/app/common/common.module.js"></script>
<script src="tmp/basic/src/app/componentA/componentA.module.js"></script>
<script src="tmp/basic/src/app/componentB/componentB.module.js"></script>
<script src="tmp/basic/src/app/componentA/subcomponentC/subcomponentC.module.js"></script>

<!-- other source files are specified as second also ordered by _depth of their path_ -->
<script src="tmp/basic/src/app/componentA/componentA.controller.js"></script>
<script src="tmp/basic/src/app/componentA/componentA.service.js"></script>
<script src="tmp/basic/src/app/componentB/componentB.controller.js"></script>
<script src="tmp/basic/src/app/common/service/service.js"></script>
<script src="tmp/basic/src/app/componentA/subcomponentC/subcomponentC.directive.js"></script>
```

### Options

#### options.moduleDiscriminator
Type: `String`<br />
Default value: `module.js`, (convention for naming of files which contain module definitions eg: `my.module.js`)

#### options.path
Type: `String`<br />
Default value: `undefined`

Path used in `<script src=PATH/original/path/to/file/file.js></script>` that are inserted to the destination (usually index.html).
Can be also combined with grunt's `cwd` globbing option to preserve desired part of original path vs specified path.
 

#### options.placeholder
Type: `String`, `Regexp`<br />
Default value: `<!-- ngsrc -->`

A placeholder to put into your destination files (usually index.html)

### Usage Examples

#### Default Options
In this example, the default options.

```js
grunt.initConfig({
    ngsrc: {
        src: ['src/app/**/*.js', '!src/app/**/*.spec.js'],
        dest: ['tmp/index.html']
    },
})
```

#### Custom Options
In this example, custom options specify custom path that will be used in generated script tags and custom placeholder to put into index.html file.

```js
grunt.initConfig({
    ngsrc: {
        options: {
            moduleDiscriminator: '_MODULE.js',
            path: 'js/'
        },
        cwd: 'src/',
        src: ['app/**/*.js', '!app/**/*.spec.js'],
        dest: ['build_dev/index.html']
    },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 2015-04-27    v0.2.0      [Dawn](https://github.com/tomastrajan/grunt-ngsrc/releases/tag/v0.2.0)

## License
Copyright (c) 2015 Tomas Trajan. Licensed under the MIT license.
