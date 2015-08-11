var dirs = require("../config/dirs.js");
var globs = require("../config/globs.js");
var paths = require("../config/paths.js");
var getVersion = require("../utils/getVersion.js");

var gulp = require("gulp");
var fs = require("fs");
var del = require("del");
var nuget = require("gulp-nuget");
var request = require("request");

module.exports.download = function (done) {

    if (fs.existsSync(paths.nugetExe) && fs.statSync(paths.nugetExe).size > 0) {
        done();
        return;
    }

    request.get("http://nuget.org/nuget.exe")
        .pipe(fs.createWriteStream(paths.nugetExe))
        .on('close', done);
};

module.exports.pack = function () {
    return gulp.src("")
        .pipe(nuget.pack({ nuget: paths.nugetExe, nuspec: ".nuspec", version: getVersion() }))
        .pipe(gulp.dest(dirs.output))
        .on("end", clean);
};

module.exports.push = function (callback) {
    return gulp.src(dirs.output + globs.allNupkg)
        .pipe(nuget.push({ nuget: paths.nugetExe, feed: "https://www.nuget.org" }))
        .on("end", callback);;
};

function clean() {
    del.sync(dirs.root + globs.allNupkg);
}
