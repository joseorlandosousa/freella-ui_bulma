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
function clean(cb) {
  return del([DEST], cb);
};
exports.clean = clean;


// HTML
function html() {

  return gulp.src('./index.html')
    .pipe(htmlmin({collapseWhitespace: true}).on('error', handleError))
    .pipe(gulp.dest(DEST + '/'))
};
exports.html = html;

// Gerando estilos complementares
function css() {
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
};
exports.css = css;

function server () {
  browserSync.init({
      server: {
          baseDir: './'
      },
      startPath: './index.html'
  });
};

exports.server = server;

function deploy() {
  return surge({
    project: './public',         // Path to your static build directory
    domain: domain  // Your domain or Surge subdomain
  })
}



function watch(done) {
   // Watch .sass files
  gulp.watch([SRC + 'sass/*.scss', SRC + 'sass/*/*.scss'], gulp.series('css', browserSync.reload));
  // Watch .html files
  gulp.watch('*.html', browserSync.reload);
  done();
};

exports.watch = watch;


exports.deploy = gulp.series(html, css, deploy);
exports.default = gulp.series(watch, server, sass);
