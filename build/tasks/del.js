var config = require("../config/main.js");

var del = require("del");

module.exports.outputDir = function () {
    del.sync(config.outputDir + config.all);
};

module.exports.buildDir = function () {
    del.sync(config.buildDir + config.allFiles);
};
