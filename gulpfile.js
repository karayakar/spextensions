/// <binding Clean='clean' />
/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp'),
    bower = require('gulp-bower'),
    del = require('del'),
    plugins = require('gulp-load-plugins')(),
    log = plugins.util.log,
    merge = require('merge-stream'),
    config = require('./gulpfile.config.json');

gulp.task('build', ['clean:build','build:js','build:templates']);

gulp.task('build:js', function () {
    log(plugins.util.colors.yellow('*** JS | Bundling, minifying, and copying JavaScript'));

    return gulp
        .src(config.js)
        .pipe(plugins.concat("spextensions.min.js"))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(config.build + 'js'));
});

gulp.task('build:js', function () {
    log(plugins.util.colors.yellow('*** JS | Bundling, minifying, and copying JavaScript'));

    var compressedJs = gulp
        .src(config.js)
        .pipe(plugins.concat("spextensions.min.js"))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(config.build + 'js'));
        
    var uncompressedJs = gulp
        .src(config.js)
        .pipe(plugins.concat("spextensions.js"))
        .pipe(gulp.dest(config.build + 'js'));
    
    return merge(compressedJs, uncompressedJs);
});

gulp.task('build:templates', function () {
    log(plugins.util.colors.yellow('*** BUILD | TEMPLATES ***'));

    return gulp
        .src(config.templates)
        .pipe(plugins.concat('templates.html'))
        .pipe(gulp.dest(config.build + 'html'));
});

gulp.task('install:lib', function () {
    log(plugins.util.colors.yellow('*** INSTALL lib | Bower'));

    return bower()
        .pipe(gulp.dest(config.lib));
});

gulp.task('clean:build', function (cb) {
    log(plugins.util.colors.yellow('*** CLEAN | Cleaning: ' + plugins.util.colors.blue(config.build)));

    del.sync(config.build);
    cb();
});

gulp.task('clean:lib', function (cb) {
    log(plugins.util.colors.yellow('*** CLEAN | Cleaning: ' + plugins.util.colors.blue(config.lib)));

    del.sync(config.lib);
    cb();
});

gulp.task('clean:node', function (cb) {
    log(plugins.util.colors.yellow('*** CLEAN | Cleaning: ' + plugins.util.colors.blue(config.node)));

    del.sync(config.node);
    cb();
});

gulp.task('clean', ['clean:build', 'clean:lib', 'clean:node']);

gulp.task('help', plugins.taskListing);