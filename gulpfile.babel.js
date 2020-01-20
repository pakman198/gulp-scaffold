import gulp from 'gulp';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import cleanCSS from 'gulp-clean-css';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import concat from 'gulp-concat';
import babel from 'gulp-babel';

const server = browserSync.create();

gulp.task('markup', (done) => {
    return gulp.src('./index.html')
        .pipe( gulp.dest('./dist/') );

    // done();
});

gulp.task('sass', (done) => {
    return gulp.src('./src/scss/styles.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        // .pipe(cleanCSS())  // minimize the code
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'))

    //done();
});

gulp.task('scripts', (done) => {
    gulp.src([
        './src/js/index.js',
    ])
    .pipe(concat('bundle.js'))
    .pipe(babel()) // IE9 testing purposes
    .pipe(gulp.dest('dist/js'));

    done();
});

gulp.task('serve', (done) => {
    server.init({
        server: { baseDir: './dist/'}
    });

    // done();
});

const unlink = function(path, stats) {
    console.log('File ' + path + ' was removed');
    console.log('Watching for changes');
    server.reload();
}

const change = function(path, stats) {
    console.log('File ' + path + ' was changed');
    console.log('Watching for changes');
    server.reload();
};

// watcher
gulp.task('watch', (done) => {
    console.log('Watching for changes');

    gulp.watch('src/scss/**/*.scss', gulp.parallel('sass'))
    .on('change', change)
    .on('unlink', unlink);

    gulp.watch('src/js/*.js', gulp.parallel('scripts'))
    .on('change', change)
    .on('unlink', unlink);

    gulp.watch('index.html', gulp.parallel('markup'))
    .on('change', change)
    .on('unlink', unlink);

});

gulp.task('build', gulp.parallel('markup', 'sass', 'scripts'));

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'serve')));