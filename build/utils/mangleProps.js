var uglify = require('uglify-js');
var through = require('through2');

module.exports = function (options) {

    options = options || {};

    return through.obj(function (file, encoding, callback) {

        var ast = uglify.parse(String(file.contents));

        ast.figure_out_scope();
        ast.compute_char_frequency();

        ast = uglify.mangle_properties(ast, {
            regex: options.regex
        });

        /* global Buffer */
        file.contents = new Buffer(ast.print_to_string());

        callback(null, file);
    });
};
