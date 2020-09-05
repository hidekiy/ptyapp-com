'use strict';
const gulp = require('gulp');
const del = require('del');
const hb = require('gulp-hb');

const dest = 'dist';

gulp.task('clean', () => {
    return del(dest);
});

gulp.task('handlebars', () => {
    return gulp.src('src/templates/**/*.html')
        .pipe(hb().partials('src/partials/**/*.hbs'))
        .pipe(gulp.dest(dest));
});

gulp.task('static', () => {
    return gulp.src('src/static/**/*')
        .pipe(gulp.dest(dest));
});

gulp.task('build', gulp.parallel('handlebars', 'static'));

gulp.task('default', gulp.series('clean', 'build'));
