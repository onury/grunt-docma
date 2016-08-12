# grunt-docma

![npm](https://img.shields.io/npm/v/grunt-docma.svg)
![release](https://img.shields.io/github/release/onury/grunt-docma.svg)
![dependencies](https://david-dm.org/onury/grunt-docma.svg)
![license](http://img.shields.io/npm/l/grunt-docma.svg)

> © 2016, Onur Yıldırım (@onury). MIT License.

Grunt task for **[Docma][docma]**, a powerful JSDoc and Markdown to HTML documentation generator, with a cool template. See [Docma documentation][docma-doc] for details and a live demo.

### Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm i grunt-docma --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-docma');
```

## `docma` Task

_Run this task with the `grunt docma` command._  

Task targets and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Task Options

<table>
    <tr>
        <td><b>Option</b></td>
        <td><b>Type</b></td>
        <td><b>Default</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td><code><b>config</b></code></td>
        <td><code>Object|String</code></td>
        <td>(Default Config)</td>
        <td>
        Either a Docma configuration object, or a path to a Docma config file. See <a href="https://github.com/onury/docma#build-configuration">build configuration</a> and <a href="https://github.com/onury/docma/tree/master/templates/default#docma-default-template">default template options</a>.
        </td>
    </tr>
    <tr>
        <td><code><b>traceFatal</b></code></td>
        <td><code>Boolean|Number</code></td>
        <td><code>false</code></td>
        <td>
        On a fatal error (i.e. <code>uncaughtException</code>), Grunt exits the process without a stack trace. This option forces Grunt to output the stack trace. Possible integer values: 0 to 2. Set to <code>1</code> (or <code>true</code>) to only trace fatal errors. Set to <code>2</code> to also trace grunt warnings. This can also be achieved by the <code>grunt --stack</code> command.
        </td>
    </tr>
</table>

_Note that, if you set `config` option to a config-file path, you can also define `src` and `dest` within that configuration file. But if you additionally define these within the task configuration, it will be used instead._

**CAUTION:** Destination directory (`dest`) will be emptied before the build. Make sure you set `dest` to a correct path.

### Example Task Configuration
```js
grunt.initConfig({
    docma: {
        // Default options
        options: {
            // Task specific options
            traceFatal: true, // (0|false)|(1|true)|2
            // Docma specific config
            // See all @ https://github.com/onury/docma
            config: {
                jsdoc: {
                    encoding: 'utf8',
                    recurse: false,
                    pedantic: false,
                    access: null, // ['private'],
                    package: null,
                    module: true,
                    undocumented: false,
                    undescribed: false,
                    hierarchy: true,
                    sort: 'alphabetic',
                    // 'relativePath': '../code',
                    filter: null
                },
                debug: 0
            }
        },
        code: {
            // target specific options
            options: {
                // Docma config
                config: {
                    template: {
                        path: 'default',
                        // See all default-template options @
                        // https://github.com/onury/docma/tree/master/templates/default
                        options: {
                            sidebar: true,
                            collapsed: false,
                            badges: true,
                            search: true,
                            navbar: true
                        }
                    },
                    app: {
                        title: 'Documentation',
                        routing: 'query'
                    }
                }
            },
            // files to be processed
            src: [
                './test/code/**/*.js'
            ],
            dest: './test/doc'
        },
        fromFile: {
            options: {
                config: './test/docma.config.json'
            },
            // overwrites src and dest defined in config file, if any.
            src: [
                './test/code/**/*.js'
            ],
            dest: './test/doc2'
        }
    }
});
```

---

### Change Log

#### v0.6.4
- Updated dependencies (including **Docma**) to their latest versions.

#### v0.6.1
- Fix package version.

#### v0.6.0
- Updated Docma to initial release version 1.0.0. See [Docma documentation][docma-doc] for (**breaking**) changes.

#### v0.5.3
- Task fails and aborts with stack and warnings instead of outputting only the stack.
- Updated tests.

#### v0.5.2 (2016-05-22)
- Added config from file support.
- Updated Docma core.
- Minor revisions.

#### v0.5.0 (2016-05-20)
- Initial commit.

---

### License

MIT.

[docma]:https://github.com/onury/docma
[docma-doc]:https://onury.github.io/docma
