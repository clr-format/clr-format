var fs = require("fs")

module.exports = function (fileName) {
    return JSON.parse(fs.readFileSync(fileName));
};
