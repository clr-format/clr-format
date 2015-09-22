/// <reference path="../../use-strict" />

/// <reference path="../API/String" />

/**
 * An internal [[Format.Config]] sub-module containing methods wrapped in a chainable API by its parent.
 *
 * Because the module and its members cannot be truly internal, refrain from calling its methods directly.
 */
namespace Format.Config.Definitions {

    /** @private */
    export var addFormatToPrototype_ = () => {
        String.prototype.format = formatProto;
    };

    /** @private */
    export var removeFormatFromPrototype_ = () => {
        if (String.prototype.format === formatProto) {
            delete String.prototype.format;
        }
    };

    /** @private */
    export var addPaddingToPrototype_ = () => {
        String.prototype.padLeft = padLeftProto;
        String.prototype.padRight = padRightProto;
    };

    /** @private */
    export var removePaddingFromPrototype_ = () => {
        if (String.prototype.padLeft === padLeftProto) {
            delete String.prototype.padLeft;
        }

        if (String.prototype.padRight === padRightProto) {
            delete String.prototype.padRight;
        }
    };

    /** @private */
    export var addToStringOverload_ = () => {
        Number.prototype.toString = numberToStringOverload;
        Date.prototype.toString = dateToStringOverload;
    };

    /** @private */
    export var removeToStringOverload_ = () => {
        if (Number.prototype.toString === numberToStringOverload) {
            Number.prototype.toString = numberToStringProto;
        }

        if (Date.prototype.toString === dateToStringOverload) {
            Date.prototype.toString = dateToStringProto;
        }
    };

    /** @private */
    var formatProto = function(...args: Object[]): string {

        if (isProvider(args[0])) {
            let provider = <Format.Globalization.FormatProvider> args.shift();
            return innerFormat(provider, this, args);
        }

        return innerFormat(undefined, this, args);
    };

    /** @private */
    let padding = Utils.Padding,
        getPaddingProto = (direction: Utils.Padding.Direction): (width: number, char?: string) => string =>
            function(totalWidth: number, paddingChar?: string): string {
                return padding.pad(this, { direction, totalWidth, paddingChar });
            };

    /** @private */
    var paddingDirection = padding.Direction,
        padLeftProto = getPaddingProto(paddingDirection.Left),
        padRightProto = getPaddingProto(paddingDirection.Right),
        numberToStringProto = Number.prototype.toString,
        dateToStringProto = Date.prototype.toString;

    /** @private */
    let getToStringOverload = (originalProto: Function) =>
        function(...args: Object[]): string {

            if (typeof args[0] === "number" && originalProto === numberToStringProto) {
                return originalProto.apply(this, args);
            }

            let format = "";

            if (isProvider(args[0])) {
                return innerComponentFormat(format, this, <Format.Globalization.FormatProvider> args[0]);
            }

            if (typeof args[0] === "string") {
                format = <string> args[0];

                if (isProvider(args[1])) {
                    let provider = <Format.Globalization.FormatProvider> args[1];
                    return innerComponentFormat(format, this, provider);
                }

                return innerComponentFormat(format, this);
            }

            return originalProto.apply(this, args);
        };

    /** @private */
    var numberToStringOverload = getToStringOverload(numberToStringProto),
        dateToStringOverload = getToStringOverload(dateToStringProto);

    /** @private */
    var isProvider = (provider: Object): boolean => provider && typeof (<Format.Globalization.FormatProvider> provider).getFormatter === "function";
}
