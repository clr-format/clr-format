var dirs = require("../config/dirs.js");
var files = require("../config/files.js");
var paths = require("../config/paths.js");
var readJSON = require("../utils/readJSON.js");

var gulp = require("gulp");
var fs = require("fs");
var del = require("del");
var nuget = require("gulp-nuget");
var request = require("request");

function clean() {
    del.sync(paths.nugetPackage);
}

module.exports.download = function (done) {

    if (fs.existsSync(paths.nugetExe)) {
        return done();
    }

    return request.get("http://nuget.org/nuget.exe")
        .pipe(fs.createWriteStream(paths.nugetExe));
};

module.exports.pack = function () {
    return gulp.src("")
        .pipe(nuget.pack({ nuspec: ".nuspec", nuget: paths.nugetExe, version: readJSON(files.package).version }))
        .pipe(gulp.dest(dirs.output))
        .on("end", clean);
    //  .pipe(nuget.push({ feed: "http://your-nuget-feed.org/", nuget: nugetPath, apiKey: "secret-key-goes-here" }));

};
