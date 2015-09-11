var dirs = require("./dirs.js");
var globs = require("./globs.js");
var files = require("./files.js");

module.exports = {
    sources: dirs.sources + globs.allTS,
    tests: dirs.tests + globs.allTS,
    dists: dirs.output + globs.allJS,
    docs: dirs.docs + globs.allHTML,
    core: [dirs.sources, dirs.core].join(dirs.separator),
    intl: [dirs.sources, dirs.intl].join(dirs.separator),
    config: [dirs.sources, dirs.config].join(dirs.separator),
    tsConfig: dirs.separator + files.tsconfig,
    references: dirs.sources + globs.allRefs,
    npmExports: [dirs.sources, files.exports].join(dirs.separator),
    nugetExe: [dirs.build, files.nuget].join(dirs.separator),
    testsBrowser: [dirs.build, files.testsBrowser].join(dirs.separator),
    coreTemplate: [dirs.build, dirs.templates, files.coreTemplate].join(dirs.separator),
    iifeTemplate: [dirs.build, dirs.templates, files.iifeTemplate].join(dirs.separator)
};
