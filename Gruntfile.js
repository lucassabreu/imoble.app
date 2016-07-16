/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    exec:{
        prepare:{
            command:"cordova prepare",
            stdout:true,
            stderror:true
        },
        bowerInstall : {
        	command : "bower install",
            stdout:true,
            stderror:true
        },
        copyFonts0 : {
            command : "cp src/fonts/* www/font",
            stdout:true,
            stderror:true
        },
        copyFonts1 : {
            command : "cp src/sass/materialize/font/* -r www/font",
            stdout:true,
            stderror:true
        }
    },
    sass: {
        index : {
            files : {
                "www/css/index.css": "src/sass/index.scss"
            }
        },
        dist: {
            files: {
                "www/css/materialize.css": "src/sass/materialize/sass/materialize.scss",
            }
        }
    },
    cssmin: {
        options: {
            shorthandCompacting: false,
            roundingPrecision: -1
        },
        index: {
            files: {
                'www/css/index.min.css': ['www/css/index.css']
            }
        },
        dist : {
            files : {
                'www/css/materialize.min.css': ['www/css/materialize.css']                
            }
        }
    },
    bowerInstall: {
      target: {

        // Point to the files that should be updated when 
        // you run `grunt bower-install` 
        src: [
          'www/views/**/*.html',   // .html support... 
          'www/*.html',   // .html support... 
          'www/views/**/*.jade',   // .jade support... 
          'www/styles/index.scss',  // .scss & .sass support... 
          'www/config.yml'         // and .yml & .yaml support out of the box! 
        ],
      }
    },
    watch : {
        files : ["src/**/*"],
        tasks: ['css']
    },
});

grunt.loadNpmTasks('grunt-exec');
grunt.loadNpmTasks('grunt-bower-install');
grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-copy');

// Default task(s).
grunt.registerTask('bowerInstalAll', ["exec:bowerInstall",'bowerInstall']);
grunt.registerTask('copyFonts', ["exec:copyFonts0",'exec:copyFonts1']);
grunt.registerTask('css', ["sass:index",'cssmin:index']);
grunt.registerTask('default', ["sass", "cssmin","copyFonts",'bowerInstalAll','exec:prepare']);

};
