module.exports = function (grunt) {
    grunt.initConfig({

    // define source files and their destinations
    uglify: {
        files: { 
            src: ['2_transpiled/*.js', '!2_transpiled/mapping.js'],  // source files mask
            dest: '3_minified/',    // destination folder
            expand: true,    // allow dynamic building
            flatten: true,   // remove all unnecessary nesting
            ext: '.min.js'   // replace .js to .min.js
        }
    },
    watch: {
        js:  { files: ['2_transpiled/*.js', '!2_transpiled/mapping.js'], tasks: [ 'uglify' ] },
    }
});

// load plugins
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-uglify');

// register at least this one task
grunt.registerTask('default', [ 'uglify' ]);


};