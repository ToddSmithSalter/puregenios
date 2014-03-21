var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');

var paths = {
    scripts : {
        src : './assets/js/**/*.js',
        dest : './dist/js',
        bootstrapsrc : [
            './assets/vendor/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/transition.js',
            './assets/vendor/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/collapse.js',
            './assets/vendor/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/scrollspy.js'
        ]
    },
    styles: {
        src : './assets/sass/**/*.scss',
        dest : './dist/css'
    }
};


// compile, autoprefix, and minify css
gulp.task('styles', function() {
    gulp.src('./assets/vendor/bootstrap-sass-official/vendor/assets/stylesheets/*.scss')
        .pipe(sass())
//        .pipe(minifycss())
        .pipe(gulp.dest('./dist/css'));
    gulp.src(paths.styles.src)
        .pipe(sass({sourceComments: 'map', errLogToConsole: true}))
        .pipe(prefix("last 2 versions", "ie 8"))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(notify("Stylesheets rebuilt!"))
        .pipe(livereload());
});

// jshint, uglify scripts
gulp.task('scripts', function() {
    gulp.src(paths.scripts.bootstrapsrc)
        .pipe(concat('bootstrap.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest));
   gulp.src(paths.scripts.src)
       .pipe(jshint())
       .pipe(jshint.reporter('default'))
       .pipe(uglify({outSourceMap: true}))
       .pipe(gulp.dest(paths.scripts.dest))
       .pipe(livereload())
       .pipe(notify("Scripts rebuilt!"));
});


// watch stuff, do stuff
gulp.task('watch', function() {
    var server = livereload();
    gulp.watch(paths.scripts.src, ['scripts']);
    gulp.watch(paths.styles.src, ['styles']);
    gulp.watch('./*.html').on('change', function(file) {
        server.changed(file.path)
    });


    // Add this snippet
    // <script src="http://192.168.33.10:35729/livereload.js?snipver=1"></script>
});


gulp.task('default', ['styles', 'scripts', 'watch']);