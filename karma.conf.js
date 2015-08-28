// Karma configuration
// Generated on Fri Aug 28 2015 15:26:55 GMT+0300 (FLE Summer Time)

module.exports = function (config) {

    var customLaunchers = {
        sl_chrome: { base: "SauceLabs", browserName: "chrome" },
        sl_firefox: { base: "SauceLabs", browserName: "firefox" },
        // sl_opera: { base: "SauceLabs", browserName: "opera" },
        sl_safari_mac: { base: "SauceLabs", browserName: "safari", version: "6.0" },
        // sl_safari_win: { base: "SauceLabs", browserName: "safari" },
        sl_ie_edge: { base: "SauceLabs", browserName: "microsoftedge", version: "20.10240" },
        sl_ie_11: { base: "SauceLabs", browserName: "internet explorer", platform: "Windows 8.1", version: "11" },
        sl_ie_10: { base: "SauceLabs", browserName: "internet explorer", platform: "Windows 8", version: "10" },
        // sl_ie_9: { base: "SauceLabs", browserName: "internet explorer", version: "9" },
        // sl_ie_8: { base: "SauceLabs", browserName: "internet explorer", version: "8" },
        // sl_android: { base: "SauceLabs", browserName: "android", version: "4.0" },
        sl_iphone: { base: "SauceLabs", browserName: "iphone", version: "7.1" }
    };

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["jasmine"],


        // list of files / patterns to load in the browser
        files: [
            "dist/clr-format.js",
            "dist/clr-format-*.js",
            "build/tests-browser.js"
        ],


        // list of files to exclude
        exclude: [
            "dist/*-npm.js",
            "dist/*.min.js"
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },


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
        browsers: Object.keys(customLaunchers),


        sauceLabs: {
            testName: "clr-format Unit Tests",
            startConnect: false,
            /* global process */
            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
            recordScreenshots: false
        },


        customLaunchers: customLaunchers,


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    })
}
