module.exports.MSBuild = function (failures, file) {

    failures.forEach(function (failure) {

        var line = (failure.startPosition.line + 1),
            row = (failure.startPosition.character + 1);

        console.log(
            file.path + "(" + line + "," + row + "): error (" +
            failure.ruleName + "): " + failure.failure);
    });
};
