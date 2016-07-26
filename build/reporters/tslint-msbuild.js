module.exports.MSBuild = function (failures, file) {
    failures.forEach(function (failure) {
        var startLine = failure.startPosition.line + 1;
        var startPos = failure.startPosition.character + 1;
        console.log(
            `${file.path}(${startLine},${startPos}): error (${failure.ruleName}): ${failure.failure}`);
    });
};
