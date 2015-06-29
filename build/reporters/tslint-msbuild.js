var format = require("clr-format");

module.exports.MSBuild = function (failures, file) {
    failures.forEach(function (failure) {
        console.log(format(
            "{0}({1},{2}): error ({3}): {4}",
            file.path,
            failure.startPosition.line + 1,
            failure.startPosition.character + 1,
            failure.ruleName,
            failure.failure));
    });
};
