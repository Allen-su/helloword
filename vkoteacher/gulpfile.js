var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    jshint = require('gulp-jshint'),
    csscomb = require('gulp-csscomb');

gulp.task('scripts', function () {
	return gulp.src('src/js/**/*.js')
		.gulp.pipe(jshint('.jshintrc'))
		.gulp.pipe(jshint.reporter('default'));
});

gulp.task('csscomb', function () {
  return gulp.src('src/css/*.css')
    .pipe(csscomb())
    .pipe(gulp.dest('./build/css'));
});

gulp.task('default', function(){
	gulp.start('scripts');
});


gulp.task('watch', function() {
  // Watch .scss files
  //gulp.watch('src/styles/**/*.scss', ['styles']);
  // Watch .js files
  //gulp.watch('src/js/**/*.js', ['scripts']);//改变后自动执行scripts任务;
  // Watch image files
  //gulp.watch('src/images/**/*', ['images']);
});

gulp.task('watch', function() {
  // Create LiveReload server
  livereload.listen();
  // Watch any files in dist/, reload on change
  gulp.watch(['src/**/*']).on('change', livereload.changed);
});