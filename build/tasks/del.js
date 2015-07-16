var dirs = require("../config/dirs.js");
var globs = require("../config/globs.js");

var del = require("del");

module.exports.output = function () {
    del.sync(dirs.output + globs.all);
};

module.exports.build = function () {
    del.sync(dirs.build + globs.allFiles);
};
