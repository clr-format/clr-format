var karma = require("./build/config/karma.js");

module.exports = function (config) {

    var customLaunchers = karma.browsers;

    customLaunchers.sl_opera = { base: "SauceLabs", browserName: "opera" };
    customLaunchers.sl_safari_mac = { base: "SauceLabs", browserName: "safari", version: "6.0" };
    customLaunchers.sl_safari_win = { base: "SauceLabs", browserName: "safari", platform: "Windows 7" };
    customLaunchers.sl_ie_10 = { base: "SauceLabs", browserName: "internet explorer", version: "10", platform: "Windows 8" };
    customLaunchers.sl_ie_9 = { base: "SauceLabs", browserName: "internet explorer", version: "9", platform: "Windows 7" };
    customLaunchers.sl_ie_8 = { base: "SauceLabs", browserName: "internet explorer", version: "8", platform: "Windows XP" };
    customLaunchers.sl_android = { base: "SauceLabs", browserName: "android", version: "4.0" };
    customLaunchers.sl_iphone = { base: "SauceLabs", browserName: "iphone", version: "8.0" };

    config.set(karma.getOptions(config, {
        testName: "clr-format Core Unit Tests",
        files: [
            "dist/clr-format.js",
            "dist/clr-format-config.js",
            "build/tests-browser.js"
        ]
    }, customLaunchers));
};
