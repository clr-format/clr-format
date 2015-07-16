var mversion = require('mversion');

module.exports = function (version) {
    return function (done) {
        mversion.update({ version: version, commitMessage: "Bumped to version %s" });
        done();
    };
};
