module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      html: {
        files: ['src/*.*', 'src/includes/*.*'],
        tasks: ['jade'],
        options: {
          interrupt: true
        }
      }
    },
    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: [
          {
            expand: true,
            cwd: 'src',
            src: '*.jade',
            dest: './',
            ext: '.html'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
};