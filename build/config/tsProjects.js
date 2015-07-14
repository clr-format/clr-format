var config = require("./main.js");
var paths = require("./paths.js");

var tsc = require("gulp-typescript");
var typescript = require("typescript");

module.exports = {
    npm: tsc.createProject(config.sourcesDir + paths.tsConfig, { typescript: typescript }),
    core: tsc.createProject(paths.core + paths.tsConfig, { typescript: typescript }),
    config: tsc.createProject(paths.config + paths.tsConfig, { typescript: typescript }),
    tests: tsc.createProject(config.testsDir + paths.tsConfig, { typescript: typescript })
};
