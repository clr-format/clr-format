var dirs = require("./dirs.js");
var globs = require("./globs.js");
var files = require("./files.js");

module.exports = {
    sources: dirs.sources + globs.allTS,
    tests: dirs.tests + globs.allTS,
    dists: dirs.output + globs.allJS,
    docs: dirs.docs + globs.allHTML,
    core: [dirs.sources, dirs.core].join(dirs.separator),
    config: [dirs.sources, dirs.config].join(dirs.separator),
    tsConfig: dirs.separator + files.tsconfig,
    references: dirs.sources + globs.allRefs,
    npmExports: [dirs.sources, files.exports].join(dirs.separator),
    nugetExe: [dirs.build, files.nuget].join(dirs.separator)
};
