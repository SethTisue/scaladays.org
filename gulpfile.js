var gulp = require('gulp')
var stylus = require('gulp-stylus')


// Compile stylus files
gulp.task('stylus', function () {
  return gulp.src('assets/styl/main.styl')
      .pipe(stylus({use: ['nib']}))
      .pipe(gulp.dest('assets/css'))
})


// Default gulp task to run
gulp.task('default', function(){
  gulp.watch("assets/styl/**/*.styl", ['stylus'])
})


