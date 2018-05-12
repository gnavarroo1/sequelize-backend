// Gulpfile.js
var gulp = require('gulp')
, nodemon = require('gulp-nodemon')
, servletizer = require('./servletizer.js');

var sourcejs='./backend.js';
var targetjs='./dist/server.js';

gulp.task('servletizer', function () {
gulp.src('./controllers/**/*.js')
  .pipe(servletizer('./controllers',sourcejs,targetjs, ['./cleanup.js']))
  .pipe(gulp.dest('./dist'));
})

gulp.task('develop',['servletizer'], function () {
var stream = nodemon({ script: targetjs
        , ext: 'html js'
        , ignore: ['dist/*']
        , tasks: ['servletizer'] })

stream
    .on('restart', function () {
      console.log('restarted!')
    })
    .on('crash', function() {
      console.error('Application has crashed!\n')
       stream.emit('restart', 10)  // restart the server in 10 seconds
    })
})