var through                 = require('through2');
var path                    = require('path');
var fs                      = require('fs');
var temp                    = require("temp");
var File                    = require('vinyl');
var process                 = require('process');

/**
 * Wraps the shell call to JSPM,
 * writes the output to a temp file,
 * and then returns the Vinyl file as if it were streamed
 * Why? Because JSPM passes fileName arg to SystemJS...
 * there is no way to write the output to stdout,
 * and I wasn't able to find someone else that had done this
 * @param options - options.args are raw cmdline args to pass to jspm process
 */


// TODO: If there is demand, implement other jspm calls
// for now, I only need bundleSfx because the others
// can be replaced by direct calls to bundle or babel
module.exports.bundleSfx = function(options){

    options = options || {};
    options.args = options.args || "";

    return through.obj(function(file, enc, cb){
        var basename = path.basename(file.path);
        var tempPath = path.join(temp.path(), basename);
        var jspmIn = file.path.substring(file.base.length);

        var args = 'bundle-sfx ' + jspmIn + ' ' + tempPath;
        var self = this;
        var exec = require('child_process').exec;

        exec("jspm" + " " + args + " " + options.args, function(error, stdout, stderr){
            if(error){
                error.message = stdout; // for some reason jspm writes errors to stdout
                cb(error);
            }
            else {
                if(options && !options.quiet) {
                    console.log(stdout);
                }

                fs.readFile(tempPath, {'encoding' : 'utf8'}, function(err, data){
                    file.contents = new Buffer(data);
                    // delete the temporary file
                    fs.unlink(tempPath);

                    // jspm optionally writes a source map file, which we also want to include in the stream
                    var fileMapPath = tempPath + ".map";

                    if(fs.existsSync(fileMapPath)){
                        var fileMap = file.clone();
                        fileMap.path = fileMap.path + ".map";

                        fs.readFile(fileMapPath, {'encoding': 'utf8'}, function(err, data){
                            fileMap.contents = new Buffer(data);
                            self.push(fileMap);

                            // note: streams API seems to require cb() after all pushes
                            cb(null, file);

                            // delete the temporary source map file
                            fs.unlink(fileMapPath);
                        });
                    }
                    else {
                        // do not add the source map
                        cb(null, file);
                    }

                }); // end read compiled JS
            }
        });
    });
}