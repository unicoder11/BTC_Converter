var gulp = require('gulp');
var sass = require('gulp-sass');
var ejs = require("gulp-ejs")

var sassSource = 'styles/*.scss',
    cssDist = 'public/styles/css/';

gulp.task('styles', function() {
    gulp.src(sassSource)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(cssDist));
});

gulp.task('watch',function() {
    gulp.watch(sassSource,['styles']);
});
