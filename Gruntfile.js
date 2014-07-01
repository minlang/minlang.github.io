/* jshint node: true */
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // grunt-contrib-connect
        connect: {
            server: {
                options: {
                    port: 4000,
                    base: '_site/'
                }
            }
        },

        // grunt-contrib-cssmin
        cssmin: {
            minify: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> | <%= pkg.homepage %> */'
                },
                expand: true,
                cwd: 'css/',
                src: ['**/*.css', '!*.min.css'],
                dest: 'css/',
                ext: '.min.css'
            }
        },

        // grunt-contrib-jasmine
        jasmine: {
            src: 'js/**/*.js',
            options: {
                specs: 'test/**/*spec.js',
                vendor: [
                    'js/vendor/*.js',
                    'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js'
                ]
            }
        },

        // grunt-contrib-jshint
        jshint: {
            files: [
                'gruntfile.js',
                'js/**/*.js',
                'test/**/*.js',
                '!**/*.min.js'
            ],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },

        // grunt-contrib-uglify
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> | <%= pkg.homepage %> */\n',
                compress: {
                    drop_console: true
                }
            },
            build: {
                files: {
                    'js/default.min.js': ['js/default.js']
                }
            }
        },

        // grunt-contrib-watch
        watch: {
            options: {
                livereload: true
            },
            css: {
                files: [
                    'css/**/*.css',
                    '!css/**/*.min.css'
                ],
                tasks: ['cssmin']
            },
            html: {
                files: [
                    '_config.yml',
                    '_includes/**/*',
                    '_layouts/**/*',
                    '_plugins/**/*',
                    '_sass/*'
                ],
                tasks: ['exec:jekyll_build']
            },
            img: {
                files: 'img/**/*.*',
                tasks: ['imageoptim']
            },
            js: {
                files: ['<%= jshint.files %>'],
                tasks: [
                    'jshint',
                    'uglify'
                ]
            }
        },

        // grunt-exec
        exec: {
            install_gems: {
                command: 'bundle install --path _vendor/bundle'
            },
            jekyll_build: {
                command: 'bundle exec jekyll build'
            },
            jekyll_doctor: {
                command: 'bundle exec jekyll doctor'
            }
        },

        // grunt-imageoptim
        imageoptim: {
            options: {
                quitAfter: true
            },
            images: {
                files: [{
                    expand: true,
                    cwd: 'img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'img/'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-imageoptim');

    // default
    grunt.registerTask('default', [
        'jshint',
        'uglify',
        'cssmin'
    ]);

    // prepare
    grunt.registerTask('prepare', [
        'exec:install_gems'
    ]);

    // server
    grunt.registerTask('serve', [
        'default',
        'connect:server',
        'watch'
    ]);

    // tests
    grunt.registerTask('test', [
        'jshint',
        'jasmine',
        'exec:jekyll_doctor'
    ]);

};
