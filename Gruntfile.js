module.exports = function( grunt )
{
  var gruntConfiguration = {
    pkg: grunt.file.readJSON('package.json'),

    clean: [ 
      'build', 
      'compile'
    ],

    copy: {
      build_app_assets: {
        files: [
          { 
            src: [ '**' ],
            dest: 'build/assets/',
            cwd: 'source/assets',
            expand: true
          }
       ]   
      },
      build_vendorjs: {
        files: [
          {
            src: [
              'bower_components/jquery/dist/jquery.js',
              'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
              'bower_components/underscore/underscore.js'
            ],
            dest: 'build/',
            cwd: '.',
            expand: true
          }
        ]
      },
      copy_html: {
        files: [
          {
            src:['source/index.html'],
            dest:'build/',
            expand: true,
            flatten: true
          }
        ]
      }
    },

    jshint: {
      source: {
        options: {
          strict: false,
          curly: true,
          eqeqeq: true,
          eqnull: true,
          browser: true,
          globals: {
            strict: false,
            $: false,
            _:false,
            createjs:false,
            console: false,
            jQuery: true
          }
        },
        files: {
          src: ['build/js/scripts.js']
        }
      }
    },

    concat: {
      js: {
        src:['source/app/js/**/*.js'],
        dest:'build/js/scripts.js'
      },
      lib: {
        src:['source/app/lib/**/*.js'],
        dest:'build/js/lib.js'
      }        
    },

    sass: {                            
      build: {                            
        files: {                 
          'build/assets/site.css': 'source/scss/site.scss'
        }
      },
      compile: {
      }
    },

    wiredep: {
      task: {
        src: ['build/index.html'],
        ignorePath: '../',
      }
    },
    
    watch: {
      html: {
        files: [
          'source/index.html'
        ],
        tasks: ['copy:copy_html', 'wiredep']
      },
      jssrc: {
        files: [
          'source/app/**/*.js'
        ],
        tasks: ['concat']
      },
      assets: {
        files: [ 
          'source/assets/**/*'
        ],
        tasks: [ 'copy:build_app_assets', 'copy:build_vendor_assets' ]
      },
      sass: {
        files: ['source/scss/**/*.scss'],
        tasks: ['sass:build', 'concat']
      }
    }    
  };

  // init grunt
  grunt.initConfig( gruntConfiguration );

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks("grunt-bower-install-simple");

  grunt.registerTask( 'run', [ 'build', 'watch' ] );
  grunt.registerTask( 'build', [
    'clean', 'sass:build', 'copy:build_app_assets', 'copy:build_vendorjs', 'copy:copy_html', 'concat', 'wiredep' 
  ]);

};