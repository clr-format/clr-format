var dirs = require("../config/dirs.js");
var paths = require("../config/paths.js");
var negate = require("../utils/negate.js");

var gulp = require("gulp");
var typedoc = require("gulp-typedoc");

module.exports = function (done) {
    return gulp.src([paths.sources, negate(paths.references)])
        .pipe(typedoc({
            out: dirs.docs,
            mode: "file",
            name: "CLR Format"
        }));
};
