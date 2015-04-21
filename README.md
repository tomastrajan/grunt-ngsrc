# ngsrc

> tl;dr Find and add your Angular.js source files into index.html automatically

Find and add Angular.js files to index.html automatically and in correct order (also applicable for source files of any other framework). Great for development builds, inspired by [usemin](https://github.com/yeoman/grunt-usemin) which is strongly recommended for handling of production builds.

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install ngsrc --save-dev
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
          src: [],
          dest: []
        }
    },
})
```

### Options

#### options.path
Type: `String`<br />
Default value: `undefined`, (original path to file will be used if no value is specified)

Path used in `<script src=PATH/file.js></script>` that are inserted to destination files (usually index.html), 

#### options.placeholder
Type: `String`, `Regexp`<br />
Default value: `<!-- ngsrc -->`

A placeholder to put into your destination files (usually index.html)

## Use case
Lets say you have Angular.js application and grunt build process to perform concat and minify for your production build.
Usually you have to add all the files you create in `index.html` manually like this:

```html
<!-- index.html snippet -->
<script src="src\app\appModule.js"></script>
<script src="src\app\common\commonModule.js"></script>
<script src="src\app\componentA\componentA_Module.js"></script>
<script src="src\app\componentA\componentA_controller.js"></script>
<script src="src\app\componentA\componentA_service.js"></script>
```

This can be a pretty tedious task, easy to forget about and then you get those errors in browser's console too... 
What if it would be enough to just add the new source file to your source folder. Reference would then be automatically 
inserted to specified `index.html` file in place of specified placeholder:

```html
<!-- ngsrc -->
```

> Don't forget to copy original `index.html` file to some new location (eg: tmp, build_dev, ...) to preserve
original index.html file so that you preserve the placeholder for repeated builds


### Usage Examples

#### Default Options
In this example, the default options.

```js
grunt.initConfig({
    ngsrc: {
        options: {},
        src: [],
        dest: []
    },
})
```

#### Custom Options
In this example, custom options 

```js
grunt.initConfig({
    ngsrc: {
        options: {
            path: 'path/to/files/'
            placeholder: 'myCustomPlaceholder'
        },
        src: [],
        dest: []
    },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2015 Tomas Trajan. Licensed under the MIT license.
