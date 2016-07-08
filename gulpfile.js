'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const htmlToBl = require('html2bl');
const htmlmin = require('gulp-htmlmin');
const cssnano = require('gulp-cssnano');
const respons = require('gulp-responsive-images');
const imgOpt = require('gulp-image-optimization');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const param = {
    out: 'public/',
    htmlSrc: 'index.html',
    levels: ['blocks']
};

param.fileNames = htmlToBl.getFileNames(param);

gulp.task('default', ['server', 'build']);

gulp.task('build', ['html', 'css', 'copy files']);

gulp.task('html-watch', ['html'], browserSync.reload);
gulp.task('css-watch', ['css'], browserSync.reload);

gulp.task('server', () => {
    browserSync.init({
        server: param.out
    });
    gulp.watch('*.html', ['html-watch']);
    gulp.watch(param.levels.map((level) => level + '/**/*.css'), ['css-watch']);

});

gulp.task('html', () => {
    gulp.src(param.htmlSrc)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(param.out))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('css', () => {
    param.fileNames
        .then((files) => {
            return gulp.src(files.css)
                .pipe(concat('styles.css'))
                .pipe(postcss([autoprefixer()]))
                .pipe(cssnano())
                .pipe(gulp.dest(param.out + '/css'))
                .pipe(reload({
                    stream: true
                }));
        })
        .done();
});

gulp.task('copy files', () => {
    gulp.src('favicon.ico')
        .pipe(gulp.dest(param.out));
    gulp.src('tile.png')
        .pipe(gulp.dest(param.out));
    gulp.src('tile-wide.png')
        .pipe(gulp.dest(param.out));
    gulp.src('browserconfig.xml')
        .pipe(gulp.dest(param.out));
    gulp.src('apple-touch-icon.png')
        .pipe(gulp.dest(param.out));
    gulp.src('js/**/*')
        .pipe(gulp.dest(param.out + '/js'));
    gulp.src('css/**/*')
        .pipe(gulp.dest(param.out + '/css'));
    gulp.src('img/**/*')
        .pipe(respons({
            '*.jpeg': [
                {
                    width: 1680
                },
                {
                    width: 600,
                    suffix: '-600'
                },
                {
                    width: 400,
                    suffix: '-400'
                },
                {
                    width: 300,
                    suffix: '-300'
                }
            ]
        }))
        .pipe(imgOpt({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(param.out + '/img'));
});
