module.exports = function(grunt) {

    // Imports
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jekyll');
    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-regarde');
    grunt.loadNpmTasks('grunt-contrib-livereload');

    // Project configuration.
    var happyPlan = grunt.file.readJSON('happy-plan.json');

    grunt.initConfig({

        happyPlan : happyPlan,
        
        jshint: happyPlan.grunt.jshint,

        clean: {
            build: {
                src: ['<%= happyPlan.build.path %>']
            },
            jekyll: {
                 src: ['<%= happyPlan.build.path %>/jekyll']
            }
        },

        jekyll: {
            server : {
                src:            '<%= happyPlan.src.path %>',
                dest:           '<%= happyPlan.build.path %>',
                server:         true,
                server_port:    8000,
                auto:           false,
                baseurl:        '<%= happyPlan.baseUrl %>'
            },
            build: {
                src:            'build/jekyll/',
                dest:           'build/',
                baseurl:        '<%= happyPlan.baseUrl %>',
                pygments:       true
            }
        },

        copy: {
            jekyllPages: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/pages/',
                        src: ['**'],
                        dest: 'build/jekyll/'
                    }
                ]
            },
            jekyllPosts: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/posts/',
                        src: ['**'],
                        dest: 'build/jekyll/_posts/'
                    }
                ]
            },
            jekyllLayouts: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/layouts/',
                        src: ['**'],
                        dest: 'build/jekyll/_layouts/'
                    }
                ]
            },
            jekyllPartials: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/partials/',
                        src: ['**'],
                        dest: 'build/jekyll/_includes/'
                    }
                ]
            },
            jekyllConfig: {
                files: [
                    {
                        src: 'src/config/config.yml',
                        dest: 'build/jekyll/_config.yml'
                    }
                ]
            },
            fonts: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= happyPlan.src.assets.fonts %>',
                        src: ['**'],
                        dest: '<%= happyPlan.build.assets.fonts %>/'
                    }
                ]
            },
            // to avoid imagemin when dev
            fakeImagemin: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= happyPlan.src.assets.images %>/',
                        src: ['**'],
                        dest: '<%= happyPlan.build.assets.images %>/'
                    }
                ]
            },
            fakeUglify: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= happyPlan.src.assets.scripts %>',
                        src: ['livereload.js'],
                        dest: '<%= happyPlan.build.assets.scripts %>/'
                    }
                ]
            }
        },

        concat: {
            build: {
                src: [
                    '<%= happyPlan.src.assets.scripts %>/script.js'
                ],
                dest: '<%= happyPlan.build.assets.scripts %>/script.js'
            }
        },

        webfont: {
            icons: {
                src: '<%= happyPlan.src.assets.fontcustom %>/icons/*.svg',
                dest: '<%= happyPlan.build.assets.fonts %>/icons',
                destCss: '<%= happyPlan.src.assets.styles %>',
                options: {
                    styles: 'icon',
                    stylesheet: 'scss',
                    hashes: false
                }
            }
        },

        compass: {
            dev: {
                options: {
                    sassDir: '<%= happyPlan.src.assets.styles %>',
                    cssDir: '<%= happyPlan.build.assets.styles %>',
                    imagesDir: '<%= happyPlan.src.assets.images %>',
                    javascriptsDir: '<%= happyPlan.src.assets.scripts %>',
                    fontsDir: '<%= happyPlan.src.assets.fonts %>',

                    // here we give to compass build path (without build root)
                    raw: [
                        'httppath = "' + happyPlan.baseUrl + '"',
                        'http_images_path = "' + happyPlan.baseUrl + happyPlan.build.assets.images.replace(happyPlan.build.path, '') + '"',
                        'http_javascripts_path = "' + happyPlan.baseUrl + happyPlan.build.assets.scripts.replace(happyPlan.build.path, '') + '"',
                        'http_fonts_path = "' + happyPlan.baseUrl + happyPlan.build.assets.fonts.replace(happyPlan.build.path, '') + '"'
                    ].join("\n"),

                    outputStyle: 'expanded',
                    noLineComments: false,
                    debugInfo: true
                }
            },
            dist: {
                options: {
                    sassDir: '<%= happyPlan.src.assets.styles %>',
                    cssDir: '<%= happyPlan.build.assets.styles %>',
                    imagesDir: '<%= happyPlan.src.assets.images %>',
                    javascriptsDir: '<%= happyPlan.src.assets.scripts %>',
                    fontsDir: '<%= happyPlan.src.assets.fonts %>',

                    // here we give to compass build path (without build root)
                    raw: [
                        'httppath = "' + happyPlan.baseUrl + '"',
                        'http_images_path = "' + happyPlan.baseUrl + happyPlan.build.assets.images.replace(happyPlan.build.path, '') + '"',
                        'http_javascripts_path = "' + happyPlan.baseUrl + happyPlan.build.assets.scripts.replace(happyPlan.build.path, '') + '"',
                        'http_fonts_path = "' + happyPlan.baseUrl + happyPlan.build.assets.fonts.replace(happyPlan.build.path, '') + '"'
                    ].join("\n"),

                    outputStyle: 'compressed',
                    noLineComments: true,
                    force: true
                }
            }
        },

        uglify: {
            build: {
                files: {
                    '<%= happyPlan.build.assets.scripts %>/script.js': ['<%= happyPlan.build.assets.scripts %>/script.js']
                }
            }
        },

        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 7,
                    progressive: true
                },
                files: {
                    '<%= happyPlan.build.assets.images %>': '<%= happyPlan.src.assets.images %>/**/*',
                    '<%= happyPlan.build.medias %>': '<%= happyPlan.build.medias %>/**/*'
                }
            }
        },

        regarde: {
            jshint: {
                files: [
                    '**/*.js',
                    '**/*.json'
                ],
                tasks: ['jshint']
            },
            html: {
                files: [
                    '<%= happyPlan.src.path %>/**/*.{html,md,txt}'
                ],
                tasks: ['dev']
            },
            js: {
                files: ['<%= happyPlan.src.assets.scripts %>/**/*'],
                tasks: ['concat:build']
            },
            scss: {
                files: ['<%= happyPlan.src.assets.styles %>/**/*'],
                tasks: ['compass:dev']
            },
            fonts: {
                files: ['<%= happyPlan.src.assets.fonts %>/**/*'],
                tasks: ['copy:fonts']
            },
            images: {
                files: ['<%= happyPlan.src.assets.images %>/**/*.scss'],
                tasks: ['copy:fakeImagemin']
            },
            icons: {
                files: ['<%= happyPlan.src.assets.fontcustom %>/icons/*.svg'],
                tasks: 'webfont:icons'
            },
            livereload: {
                files: ['<%= happyPlan.build.assets.path %>/**'],
                tasks: 'livereload'
            }
        }
    });

    grunt.registerTask('default', ['dev', 'livereload-start', 'regarde']);
    grunt.registerTask('build', ['clean:build', 'jekyll:copy', 'jekyll:build', 'clean:jekyll', 'copy:fonts', 'concat:build']);
    grunt.registerTask('dev', ['jshint', 'build', 'compass:dev', 'copy:fakeUglify', 'copy:fakeImagemin']);
    grunt.registerTask('dist', ['jshint', 'build', 'compass:dist', 'uglify:build', 'imagemin:dist']);

    grunt.registerTask('jekyll:copy', ['copy:jekyllPages', 'copy:jekyllPosts', 'copy:jekyllPartials', 'copy:jekyllConfig', 'copy:jekyllLayouts']);

    grunt.registerTask('server', 'jekyll:server');
};
