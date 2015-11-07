Synopsis
======

Makes [JSPM](http://jspm.io/) available as a node stream so you can use it in gulp,
but since there is no direct depedency on [gulp](http://gulpjs.com/) it's not called "gulp-jspm."

command line

    npm install stream-jspm --save-dev

gulpfile.js


    var jspm = require("stream-jspm");
    var gulp = require("gulp");
    var options = {
        args : "", // this string will be appended to command line without modification
        quiet: true
    };
    var es6Stream = gulp.src(["src/main/es6/**.js", "src/main/es6/**.es6"])
                  .pipe(jspm.bundleSfx(options))
                  .on('error', function(e){
                      console.error("JSPM Build Failed", e.message);
                  })
                  .pipe(gulp.dest("build"))
                  ;
                  

                  
Depedencies
======

Assume that `jspm` is installed globally and available from the shell.

Considerations
======

JSPM doesn't support streaming, so this writes the output from JSPM to a tempfile
and rewrites the vinyl file so the consumer of the stream never knows.

Is it pure streaming?  No.

Do you have a project you need out the door and want to use gulp + jspm? Yes.

License
======
MIT +no-false-attribs License