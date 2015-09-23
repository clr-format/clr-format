var dirs = require("../build/config/dirs.js");
var files = require("../build/config/files.js");
var readJSON = require("../build/utils/readJSON.js");

module.exports = function () {
    var format = require([dirs.parent, readJSON(files.package).main].join(dirs.separator));

    testCore(format);
    testIntl(format);
    testConfig(format);
};

function testCore(format) {
    try {
        format("{0}", 1);
    }
    catch (error) {
        logError("Core cannot be loaded", error);
    }
}

function testIntl(format) {
    try {
        format.setCulture("en-US");
        format.setCurrency("USD");
        format("Value: {0,-6:C}{1}", 1, "text");
        format("Value: {0,-6:d}{1}", new Date(), "text");
    }
    catch (error) {
        logError("Intl module cannot be loaded", error);
    }
    finally {
        format.setCurrency("");
        format.setCulture("");
    }
}

function testConfig(format) {
    try {
        format.Config.addFormatToPrototype().addToStringOverload();
        "{0}".format(1);
        new Date().toString("mm");
        (123.456).toString("E3");
    }
    catch (error) {
        logError("Config module cannot be loaded", error);
    }
    finally {
        delete String.prototype.format;
        format.Config.removeToStringOverload();
    }
}

function logError(message, error) {
    console.error("NPM exports test: " + message);
    throw error;
}
