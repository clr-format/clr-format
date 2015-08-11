var dirs = require("./dirs.js");
var paths = require("./paths.js");

var tsc = require("gulp-typescript");

module.exports = {
    npm: tsc.createProject(dirs.sources + paths.tsConfig),
    core: tsc.createProject(paths.core + paths.tsConfig),
    config: tsc.createProject(paths.config + paths.tsConfig),
    tests: tsc.createProject(dirs.tests + paths.tsConfig)
};
