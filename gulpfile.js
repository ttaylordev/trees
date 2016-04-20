const babel = require( 'gulp-babel' );
const browserSync = require( 'browser-sync' ).create();
const cache = require( 'gulp-cache' );
const concat = require( 'gulp-concat' );
const concatCss = require( 'gulp-concat-css' );
const filesize = require( 'gulp-filesize' );
const gulpConfig = require( './gulp/gulpConfig.json' );
const gulpPaths = require( './gulp/gulpPaths.json' );
const gulp = require( 'gulp' );
const gutil = require( 'gulp-util' );
const imagemin = require( 'gulp-imagemin' );
const jshint = require( 'gulp-jshint' );
const annotate = require( 'gulp-ng-annotate' );
const pleeease = require( 'gulp-pleeease' );
const rename = require( 'gulp-rename' );
const sass = require( 'gulp-sass' );
const sourcemaps = require( 'gulp-sourcemaps' );
const uglify = require( 'gulp-uglify' );


// process Scss files and return one css file.
gulp.task( 'sass', function () {
  return gulp.src( './public/styles/scss/*.scss' )
    .pipe( sass( {
      includePaths: [ './public/styles/scss' ],
      sourcemap: true,
      errLogToConsole: true
    } ) )
    // .on('error', sass.logError))
    .on( 'error', function ( err ) {
      console.error( 'Error!', err.message );
    } )
    .pipe( sourcemaps.write( './', {
      includeContent: false,
      sourceRoot: '/public/styles/scss'
    } ) )
    .pipe( concat( '../postsSass.css' ) )
    .pipe( browserSync.stream( {
      match: 'public/css/*.css'
    } ) )
    .pipe( gulp.dest( './public/styles/css/css' ) )
} );

gulp.task( 'sass:watch', function () {
  gulp.watch( '.public/styles/scss/**/*.scss', [ 'sass' ] );
} );


// process CSS files and return the stream
gulp.task( 'css', function () {
  return gulp.src( [ './public/styles/css/*.css' ] )
    .pipe( pleeease() )
    .pipe( concat( 'bundle.css' ) )
    .pipe( gulp.dest( './public/build/css' ) );
} );



// process JS files and return the stream.
gulp.task( 'js', function () {
  return gulp.src( './public/js/**/*.js' )
    .pipe( sourcemaps.init( {
      loadMaps: true
    } ) )
    .pipe( annotate() )
    .pipe( babel() )
    .pipe( browserSync.stream( {
      match: 'public/js/*.js'
    } ) )
    .pipe( uglify()
    .on('error', gutil.log))
    .pipe( concat( './../../build/js/bundle.js' ) )
    .pipe( sourcemaps.write( './maps', {
      includeContent: true,
      sourceRoot: '/public/js'
    } ) )
    .pipe( gulp.dest( 'public/dist/js' ) )
} );



gulp.task( 'browser-sync', function () {
  browserSync.init( {
    server: {
      baseDir: "./public/"
    }
  } );
} );


gulp.task( 'reload', function () {
  browserSync.reload();
} );

// gulp.task( 'default', [ 'uglify', 'browser-sync', 'reload' ], function () {
//   gulp.watch( "./public/js/**/*.js", [ 'uglify', 'reload' ] )
// } );


gulp.task( 'default', [ 'sass', 'css', 'js', 'browser-sync', 'reload' ], function () {
  gulp.watch( "./public/styles/scss/*.scss", [ 'sass'] )
  gulp.watch( "./public/styles/css/*.css", [ 'css', 'reload' ] )
  gulp.watch( "./public/js/**/*.js", [ 'js', 'reload' ] )
  // gulp.watch( "./public/js/**/*.js", [ 'uglify', 'reload' ] )
  gulp.watch( [ "./public/js/**/*.html", "./public/*.html" ], [ 'reload' ] )

} );
