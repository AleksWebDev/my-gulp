const gulp = require('gulp');

const fileInclude = require('gulp-file-include');

const scss = require('gulp-sass')(require('sass'));

const server = require('gulp-server-livereload');

const clean = require('gulp-clean');

const fileSystem = require('fs');

const sourceMaps = require('gulp-sourcemaps');

const gcmq = require('gulp-group-css-media-queries');

const plumber = require('gulp-plumber');

const notify = require('gulp-notify');

const webpack = require('webpack-stream');

const babel = require('gulp-babel');

const imagemin = require('gulp-imagemin');


const plumberNotify = (title) => {
    return {
        errorHandler: notify.onError({
            title: title,
            message: 'Error <%= error.message %>',
            sound: false
        }),
    };
}

const plumberSassConfig = {
    errorHandler: notify.onError({
        title: 'Stylec',
        message: 'Error <%= error.message %>',
        sound: false
    })
}

const plumberHtmlConfig = {
    errorHandler: notify.onError({
        title: 'HTML',
        message: 'Error <%= error.message %>',
        sound: false
    })
}

gulp.task('clean', function(done){
    if(fileSystem.existsSync('./dist/')){
        return gulp.src('./dist/', {read: false})
        .pipe(clean());
    }
    done();
})


gulp.task('html', function(){
    return gulp.src('./src/*.html')
        .pipe(plumber(plumberNotify('HTML')))
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./dist/'))
})


gulp.task('scss', function(){
    return gulp.src('./src/scss/*.scss')
    .pipe(plumber(plumberNotify('SCSS')))
        .pipe(sourceMaps.init())
        .pipe(scss())
        .pipe(gcmq())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./dist/css/'))
})


gulp.task('img', function(){
    return gulp.src('./src/img/**/*')

        .pipe(imagemin({verbose:true}))

        .pipe(gulp.dest('./dist/img/'));
})

gulp.task('fonts', function(){
    return gulp.src('./src/fonts/**/')
        .pipe(gulp.dest('./dist/fonts/'));
})

gulp.task('files', function(){
    return gulp.src('./src/files/**/*')
        .pipe(gulp.dest('./dist/files/'));
})


gulp.task('js', function(){
    return gulp.src('./src/js/*.js')
        .pipe(plumber(plumberNotify('JS')))
        .pipe(babel())
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./dist/js'))
})


gulp.task('server', function(){
    return gulp.src('./dist')
        .pipe(server({
            livereload: true,
            open: true
        }))
})

gulp.task('watch', function(){
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('scss'));
    gulp.watch('./src/**/*.html', gulp.parallel('html'));
    gulp.watch('./src/img/**/*', gulp.parallel('img'));
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts'));
    gulp.watch('./src/files/**/*', gulp.parallel('files'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('js'));
})

gulp.task('default', gulp.series('clean', 
    gulp.parallel('html', 'scss', 'img', 'fonts', 'files', 'js'), 
    gulp.parallel('server', 'watch')
));