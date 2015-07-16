var dirs = require("./dirs.js");
var paths = require("./paths.js");

var tsc = require("gulp-typescript");
var typescript = require("typescript");

module.exports = {
    npm: tsc.createProject(dirs.sources + paths.tsConfig, { typescript: typescript }),
    core: tsc.createProject(paths.core + paths.tsConfig, { typescript: typescript }),
    config: tsc.createProject(paths.config + paths.tsConfig, { typescript: typescript }),
    tests: tsc.createProject(dirs.tests + paths.tsConfig, { typescript: typescript })
};
