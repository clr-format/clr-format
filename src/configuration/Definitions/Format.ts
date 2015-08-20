/// <reference path="../../use-strict" />

/**
 * An internal [[Format.Config]] sub-module containing methods wrapped in a chainable API by its parent.
 *
 * Because the module and its members cannot be truly internal refrain from calling its methods directly.
 */
module Format.Config.Definitions {

    export function addFormatToPrototype() {
        String.prototype.format = formatProto;
    }

    export function removeFormatFromPrototype() {
        if (String.prototype.format === formatProto) {
            delete String.prototype.format;
        }
    }

    var formatProto = function(...args: Object[]) {

        let provider = <Format.Globalization.FormatProvider>args[0];
        if (provider && typeof provider.getFormatter === "function") {
            args.shift();
            return Format.innerFormat(provider, this, args);
        }

        return Format.innerFormat(undefined, this, args);
    };
}
