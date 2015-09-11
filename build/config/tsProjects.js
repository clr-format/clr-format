var dirs = require("./dirs.js");
var files = require("./files.js");
var paths = require("./paths.js");

var tsc = require("gulp-typescript");

module.exports = {
    npm: createProject(dirs.sources),
    core: createProject(paths.core),
    intl: createProject(paths.intl),
    config: createProject(paths.config),
    tests: createProject(dirs.tests)
};

function createProject(componentPath) {
    return tsc.createProject([componentPath, files.tsconfig].join(dirs.separator));
}
