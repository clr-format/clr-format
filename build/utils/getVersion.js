var files = require("../config/files.js");
var readJSON = require("./readJSON.js");

module.exports = function (json) {

    if (!json) {
        json = readJSON(files.package);
    }

    return json.version;
};
