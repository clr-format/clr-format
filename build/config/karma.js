var getVersion = require("../utils/getVersion.js");

module.exports.browsers = {
    sl_firefox: { base: "SauceLabs", browserName: "firefox" },
    sl_chrome: { base: "SauceLabs", browserName: "chrome" },
    sl_ie_edge: { base: "SauceLabs", browserName: "microsoftedge" },
    sl_ie_11: { base: "SauceLabs", browserName: "internet explorer", version: "11", platform: "Windows 8.1" },
};

module.exports.getOptions = function (config, options, customLaunchers) {
    return {
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",

        captureTimeout: 300000,

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["jasmine"],

        // list of files / patterns to load in the browser
        files: options.files,

        // list of files to exclude
        exclude: options.exclude || [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},

        // test results reporter to use
        // possible values: "dots", "progress"
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["dots", "saucelabs"],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: Object.keys(customLaunchers || module.exports.browsers),

        sauceLabs: {
            testName: options.testName,
            startConnect: false,
            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
            recordScreenshots: false
        },

        customLaunchers: customLaunchers || module.exports.browsers,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    };
};
