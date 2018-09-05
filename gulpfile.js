var gulp = require('gulp'),
    webpack = require('gulp-webpack'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create();
    clean = require('del');
    runSequence = require('run-sequence');


gulp.task('sass', function () {
    gulp.src('app/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie6', 'ie7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/css'))
        .pipe(sourcemaps.write('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('js', function () {
    return gulp.src('app/js/app.js')
        .pipe(webpack({
            output: {
                filename: 'app.min.js'
            },
            devtool: 'source-map'
        }))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('fonts', function () {
    gulp.src('app/fonts/*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('images', function () {
    gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(gulp.dest('dist/images')).pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task('html', function () {
    gulp.src('app/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('clean:dist', function () {
    return clean.sync('dist');
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
});

gulp.task('watch', ['browserSync'], function () {
    gulp.watch('app/scss/**/*.scss', ['sass', 'fonts', 'images', 'html']);
    gulp.watch('app/*.html', ['html']);
    gulp.watch('app/**/*.svg', ['images']);
    gulp.watch('app/js/*.js', ['js']);
});

gulp.task('build', function () {
    runSequence('clean:dist',
        ['sass', 'js', 'images', 'fonts', 'html'],
    )
});

gulp.task('default',['watch', 'build']);