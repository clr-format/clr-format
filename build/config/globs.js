var files = require("./files.js");

module.exports = {
    all: "/*",
    allFiles: "/*.*",
    allTS: "/**/*.ts",
    allJS: "/**/*.js",
    allDTS: "/**/*.d.ts",
    allNPM: "/**/*npm*",
    allHTML: "/**/*.html",
    allRefs: "/**/" + files.references,
    allMinJS: "/**/*.min.js",
    allNupkg: "/*.nupkg"
};
