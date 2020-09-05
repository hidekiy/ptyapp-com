'use strict';
const gulp = require('gulp');
const del = require('del');
const hb = require('gulp-hb');

const dist = 'dist';

gulp.task('clean', () => {
    return del(dist);
});

gulp.task('handlebars', () => {
    return gulp.src('src/templates/**/*.html')
        .pipe(hb().partials('src/partials/**/*.hbs'))
        .pipe(gulp.dest(dist));
});

gulp.task('static', () => {
    return gulp.src('src/static/**/*')
        .pipe(gulp.dest(dist));
});

gulp.task('build', gulp.parallel('handlebars', 'static'));

gulp.task('default', gulp.series('clean', 'build'));
