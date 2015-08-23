/// <reference path="../../use-strict" />

/// <reference path="../API/String" />

/**
 * An internal [[Format.Config]] sub-module containing methods wrapped in a chainable API by its parent.
 *
 * Because the module and its members cannot be truly internal refrain from calling its methods directly.
 */
namespace Format.Config.Definitions {

    export var addFormatToPrototype = () => {
        String.prototype.format = formatProto;
    };

    export var removeFormatFromPrototype = () => {
        if (String.prototype.format === formatProto) {
            delete String.prototype.format;
        }
    };

    export var addPaddingToPrototype = () => {
        String.prototype.padLeft = padLeftProto;
        String.prototype.padRight = padRightProto;
    };

    export var removePaddingFromPrototype = () => {
        if (String.prototype.padLeft === padLeftProto) {
            delete String.prototype.padLeft;
        }

        if (String.prototype.padRight === padRightProto) {
            delete String.prototype.padRight;
        }
    };

    var formatProto = function(...args: Object[]): string {

        let provider = <Format.Globalization.FormatProvider> args[0];
        if (provider && typeof provider.getFormatter === "function") {
            args.shift();
            return Format.innerFormat(provider, this, args);
        }

        return Format.innerFormat(undefined, this, args);
    };

    let getPaddingProto = function(direction: Utils.Padding.Direction): (width: number, char?: string) => string {
        return function(totalWidth: number, paddingChar?: string): string {
            return Utils.Padding.pad(this, { direction, totalWidth, paddingChar });
        };
    };

    var padLeftProto = getPaddingProto(Utils.Padding.Direction.Left),
        padRightProto = getPaddingProto(Utils.Padding.Direction.Right);
}
