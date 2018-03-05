/* eslint-disable */
var domain = "freella-ui.surge.sh";

var gulp = require('gulp');
var path = require('path');
var browserSync = require('browser-sync').create();
var gutil = require('gulp-util');
var del = require('del');

// sass
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var cssimport = require("gulp-cssimport");
var sourcemaps = require("gulp-sourcemaps");

// html
var htmlmin = require('gulp-htmlmin');

// deploy
var surge = require('gulp-surge');

var SRC = 'src/';
var DEST = 'public/';


function handleError (error){
  gutil.log(gutil.colors.yellow(error));
}

// Limpa a pasta public
gulp.task('clean', function (cb) {
  return del([DEST], cb);
});


// HTML
gulp.task('html', function() {

  return gulp.src('./index.html')
    .pipe(htmlmin({collapseWhitespace: true}).on('error', handleError))
    .pipe(gulp.dest(DEST + '/'))
});


// Gerando estilos complementares
gulp.task('sass', function () {
  return gulp.src(SRC + 'sass/*.*')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['./node_modules/../'],
      outputStyle: 'compressed'
    }).on('error', handleError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cssimport({
      includePaths: './node_modules/*',
      matchPattern: "*.css" // process only css
    }).on('error', handleError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DEST+'/css'));
});


gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: './index.html'
    });
});

gulp.task('deploy', ['html', 'sass'],function () {
  return surge({
    project: './public',         // Path to your static build directory
    domain: domain  // Your domain or Surge subdomain
  })
})

gulp.task('watch', function() {
   // Watch .sass files
  gulp.watch([SRC + 'sass/*.scss', SRC + 'sass/*/*.scss'], ['sass', browserSync.reload]);
  // Watch .html files
  gulp.watch('*.html', browserSync.reload);

});

gulp.task('default', [ 'watch', 'browser-sync', 'sass']);
