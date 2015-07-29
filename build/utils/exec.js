var shell = require("shelljs");

module.exports = function (commandOrOptions, errorMessage) {

    var command = commandOrOptions.command || commandOrOptions,
        options = {};


    if (commandOrOptions.silent) {
        options.silent = true;
    }

    errorMessage = errorMessage || "Could not execute command: " + command;

    var result = shell.exec(command, options);
    if (result.code !== 0) {
        throw new Error(errorMessage);
    }

    return result.output;
};
