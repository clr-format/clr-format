var files = require("./files.js");

module.exports = {
    all: "/*",
    allFiles: "/*.*",
    allTS: "/**/*.ts",
    allJS: "/**/*.js",
    allDTS: "/**/*.d.ts",
    allRefs: "/**/" + files.references,
    allNupkg: "/*.nupkg"
};
