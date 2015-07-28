var exec = require("./exec.js");

module.exports = function (task) {
    return exec("git status --porcelain") === "";
};
