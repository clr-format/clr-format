var files = require("./files.js");

module.exports = {
    all: "/*",
    allFiles: "/*.*",
    allTS: "/**/*.ts",
    allJS: "/**/*.js",
    allDTS: "/**/*.d.ts",
    allNPM: "/**/*npm*",
    allRefs: "/**/" + files.references,
    allNupkg: "/*.nupkg"
};
