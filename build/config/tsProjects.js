var dirs = require("./dirs.js");
var files = require("./files.js");
var paths = require("./paths.js");

var tsc = require("gulp-typescript");
var typescript = require("typescript");

module.exports = {
    npm: createProject(dirs.sources),
    core: createProject(paths.core),
    intl: createProject(paths.intl),
    config: createProject(paths.config),
    testsJasmine: createProject(dirs.tests),
    testsBrowser: { noImplicitAny: true, typescript: typescript }
};

function createProject(componentPath) {
    return tsc.createProject([componentPath, files.tsconfig].join(dirs.separator), {
        typescript: typescript
    });
}
