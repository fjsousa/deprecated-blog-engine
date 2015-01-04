module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      html: {
        files: ['src/*.*', 'src/includes/*.*'],
        tasks: ['jade', 'markdown'],
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
            dest: 'html',
            ext: '.html'
          }
        ]
      }
    },
    markdown: {
      all: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: '*.md',
            dest: 'html',
            ext: '.html'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-markdown');

}