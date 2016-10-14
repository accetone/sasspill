const gulp = require('gulp'),
    gutil = require('gulp-util'),
    Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs')),
    bs = require('browser-sync').create(),
    sass = require('gulp-sass'),
    bourbon = require('bourbon'),
    csso = require('gulp-csso'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

gulp.task('browser-sync-init', function () {
    bs.init({
        proxy: 'http://localhost:3000'
    });
});

gulp.task('compile__css', function () {
    return gulp.src([
            './public/scss/generic.scss',
            './public/scss/base*.scss',
            './public/scss/component*.scss',
            './public/scss/wins*.scss'
        ])
        .pipe(sass())
        .on('error', function (error) {
            bs.notify('Error on compiling SCSS', 5000);
            gutil.log('\n\n', gutil.colors.red(error.stack), '\n\n');
            this.emit('end');
        })

        .pipe(concat('site.css'))
        .pipe(gulp.dest('./public/css'))

        .pipe(sourcemaps.init())
        .pipe(csso())
        .pipe(sourcemaps.write('.'))
        .pipe(rename(function (path) {
            if (path.extname === '.map') return;

            path.basename += '.min';
        }))

        .pipe(gulp.dest('./public/css'));
});

gulp.task('build__css', ['compile__css'], function () {
    gulp.src('./public/css/**/*')
        .pipe(bs.stream({match: '**/*.css'}));
});

gulp.task('watch__css', ['build__css'], function () {
    gulp.watch('./public/scss/**/*.scss', ['build__css']);
});

gulp.task('compile__js', function () {
    return gulp.src([
            './public/js/**/*.js',
            '!./public/js/**/*.min.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .on('error', function (error) {
            bs.notify('Error on compiling JS', 5000);
            gutil.log('\n\n', gutil.colors.red(error.stack), '\n\n');
            this.emit('end');
        })
        .pipe(sourcemaps.write('.'))
        .pipe(rename(function (path) {
            if (path.extname === '.map') return;

            path.basename += '.min';
        }))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('build__js', ['compile__js'], function () {
    bs.reload();
});

gulp.task('watch__js', ['build__js'], function () {
    gulp.watch([
        './public/js/**/*.js',
        '!./public/js/**/*.min.js'
    ], ['build__js']);
});

gulp.task('build__html', function () {
    bs.reload();
});

gulp.task('watch__html', ['build__html'], function () {
    gulp.watch('./public/*.html', ['build__html']);
});

gulp.task('build__bourbon', function () {
    fs.readFile(`${bourbon.includePaths}/_bourbon.scss`, (err, data) => {
        let promises = [];

        let imports = data
            .toString()
            .split('\n')
            .filter((i) => {
                return i.startsWith('@import');
            });

        for (let i of imports) {
            let filename = i
                .substr(0, i.length - 2)
                .split('@import "')[1]
                .split('/');

            if (filename.length === 1) {
                filename = `${bourbon.includePaths}/_${filename[0]}.scss`;
            } else {
                filename[0] = `${bourbon.includePaths}/${filename[0]}`;
                filename[filename.length - 1] = `_${filename[filename.length - 1]}.scss`;
                filename = filename.join('/');
            }

            promises.push(fs.readFileAsync(filename));
        }

        Promise.all(promises)
            .then((files) => {
                return files.join('\n\n');
            })
            .then((bourbon) => {
                bourbon = bourbon
                    .split('\n')
                    .filter((line) => {
                        return !line.startsWith('@charset')
                            && !line.startsWith('//')
                            && line !== '';
                    })
                    .join('\n');

                return fs.writeFileAsync(`${__dirname}/public/scss/tools.bourbon.scss`, bourbon);
            })
            .then(() => {
                gutil.log(gutil.colors.green('Bourbon builded'));
            })
            .catch((error) => {
                gutil.log('\n\n', gutil.colors.red(error), '\n\n');
            });
    });
});

gulp.task('build__rxjs', function () {
    fs.readFileAsync(`${__dirname}/bower_components/rxjs/dist/rx.lite.js`)
        .then((file) => {
            return fs.writeFileAsync(`${__dirname}/public/js/rx.lite.js`, file);
        })
        .then(() => {
            gutil.log(gutil.colors.green('RxJs builded'));
        })
        .catch((error) => {
            gutil.log('\n\n', gutil.colors.red(error), '\n\n');
        });
});

gulp.task('build__axios', function () {
    fs.readFileAsync(`${__dirname}/bower_components/axios/dist/axios.js`)
        .then((file) => {
            return fs.writeFileAsync(`${__dirname}/public/js/axios.js`, file);
        })
        .then(() => {
            gutil.log(gutil.colors.green('Axios builded'));
        })
        .catch((error) => {
            gutil.log('\n\n', gutil.colors.red(error), '\n\n');
        });
});

gulp.task('watch', ['browser-sync-init', 'watch__css', 'watch__js', 'watch__html'], function() {});