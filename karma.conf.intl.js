var karma = require("./build/config/karma.js");

module.exports = function (config) {

    var customLaunchers = karma.browsers;

    customLaunchers.sl_android = { base: "SauceLabs", browserName: "android", version: "5.1" };

    config.set(karma.getOptions(config, {
        testName: "clr-format Intl Unit Tests",
        files: [
            "dist/clr-format.min.js",
            "dist/clr-format-intl.min.js",
            "dist/clr-format-config.min.js",
            "build/tests-browser.js"
        ],
        buildSuffix: "-intl"
    }, customLaunchers));
};
