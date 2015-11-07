// This should be the readme

var jspm = require('../');
var gulp = require('gulp');

var options = {
    args : "", // this string will be appended to command line without modification
    quiet: true
};
var es6Stream = gulp.src("test/examples/es6-example.js")
        .pipe(jspm.bundleSfx(options))
        .on('error', function(e){
            console.error("JSPM Build Failed", e.message);
        })
        .pipe(gulp.dest("test/build"))
    ;

es6Stream.on('finish', function() {
    console.log('Build Passed');
});