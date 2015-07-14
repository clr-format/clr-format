var config = require("./main.js");

module.exports = {
    sources: config.sourcesDir + config.allTS,
    tests: config.testsDir + config.allTS,
    dists: config.outputDir + config.allJS,
    core: config.sourcesDir + "/core",
    config: config.sourcesDir + "/configuration",
    tsConfig: "/tsconfig.json",
    references: config.sourcesDir + "/**/references.ts",
    npmExports: config.sourcesDir + "/exports.js",
    nugetExe: config.buildDir + "/nuget.exe"
};
