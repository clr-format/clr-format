/// <reference path="../use-strict" />

/// <reference path="API" />

/// <reference path="Utils/Text" />
/// <reference path="Utils/Types" />
/// <reference path="Utils/Numeric" />
/// <reference path="Utils/Padding" />
/// <reference path="Utils/Enumerable" />
/// <reference path="Utils/FormatItemOptions" />

/// <reference path="Globalization/CultureInfo" />
/// <reference path="Globalization/FormatProvider" />
/// <reference path="Globalization/CustomFormatter" />

/// <reference path="Errors/FormatError" />
/// <reference path="Errors/ArgumentNullError" />

/**
 * The CLR Format main module and namespace.
 *
 * The [[StringConstructor.format]] method exposes the core API of the project. Optional configuration methods are stored in the [[Format.Config]] sub-module.
 */
namespace Format {

    String.format = (...args: Object[]): string => {

        if (typeof args[0] === "string") {
            return innerFormat(undefined, <string> args.shift(), args);
        }

        let provider = <Globalization.FormatProvider> args[0];
        if (provider && typeof provider.getFormatter !== "function") {
            throw new Errors.ArgumentError(
                `Argument 'provider' of type '${ Utils.Function.getName(provider.constructor) }' does not implement the FormatProvider interface`);
        }

        let format = <string> args[1];

        args.splice(0, 2);

        return innerFormat(provider, format, args);
    };

    /**
     * Converts the value of objects to strings based on the formats specified and inserts them into another string.
     *
     * This project-internal (but externally visible) version does not support arbitrary argument overloads.
     * @param provider An object that supplies culture-specific formatting information.
     * @param format A composite format string. See: https://msdn.microsoft.com/en-us/library/txafckwd.aspx
     * @param args An array of arguments that contains zero or more objects to format.
     */
    export function innerFormat(provider: Globalization.FormatProvider, format: string, args: Object[]): string {

        if (format == null) {
            throw new Errors.ArgumentNullError("format");
        }

        provider = provider || Globalization.CultureInfo.CurrentCulture;

        return format.replace(formatItemRegExp, (formatItem: string, indexComponent: string, alignmentComponent: string, formatStringComponent: string) =>
            replaceFormatItem(provider, args, {
                formatItem,
                indexComponent,
                alignmentComponent,
                formatStringComponent
            }));
    }
    /** @private */
    var formatItemRegExp = /{+(\d+)(?:,(.+?))?(?::(.+?))?}+/g;

    /** @private */
    var replaceFormatItem = (provider: Globalization.FormatProvider, args: Object[], options: Utils.FormatItemOptions): string => {

        let escapedBracesCount = Math.floor(getBracesCount(options.formatItem, "{") / 2);
        if (isFullyEscaped(options.formatItem)) {
            return options.formatItem.substring(escapedBracesCount, options.formatItem.length - escapedBracesCount);
        }

        let result = applyFormatting(provider, args, options);

        if (options.alignmentComponent) {
            result = applyAlignment(result, options);
        }

        if (escapedBracesCount > 0) {
            result = padBraces(result, escapedBracesCount, "{");
            result = padBraces(result, escapedBracesCount, "}");
        }

        return result;
    };

    /** @private */
    export var getBracesCount = (formatItem: string, braceChar: string): number => {

        let splits = formatItem.split(braceChar);

        if (braceChar === "}") {
            splits = splits.reverse();
        }

        return Utils.Enumerable.takeWhile(splits, Utils.Text.isNullOrWhitespace).length;
    };

    /** @private */
    var isFullyEscaped = (formatItem: string): boolean => {

        let openingBracesCount = getBracesCount(formatItem, "{"),
            closingBracesCount = getBracesCount(formatItem, "}");

        if (openingBracesCount !== closingBracesCount) {
            throw new Errors.FormatError(`Opening and closing brackets for item '${formatItem}' do not match`);
        }

        return Utils.Numeric.isEven(openingBracesCount);
    };

    /** @private */
    var applyFormatting = (provider: Globalization.FormatProvider, args: Object[], options: Utils.FormatItemOptions): string => {

        let index = +options.indexComponent;

        if (index >= args.length) {
            throw new Errors.FormatError(
                "Index (zero based) must be strictly less than the size of the argument's array");
        }

        let value = args[index], valueType = Utils.getType(value);

        try {
            return provider.getFormatter(valueType).format(options.formatStringComponent, value);
        }
        catch (error) {
            throw new Errors.FormatError(
                `Format string component '${options.formatStringComponent}' in format item '${options.formatItem}' cannot be applied: ${error.message}`,
                error);
        }
    };

    /** @private */
    let directions = Utils.Padding.Direction;
    /** @private */
    var applyAlignment = (formattedString: string, options: Utils.FormatItemOptions): string => {

        let totalWidth = +options.alignmentComponent;
        if (!Utils.Numeric.isInteger(totalWidth)) {
            throw new Errors.FormatError(
                `Alignment component '${options.alignmentComponent}' in format item '${options.formatItem}' must be an integer`);
        }

        let direction = totalWidth < 0 ? directions.Right : directions.Left;
        totalWidth = Math.abs(totalWidth);

        return Utils.Padding.pad(formattedString, { totalWidth, direction });
    };

    /** @private */
    var padBraces = (formattedString: string, escapedBracesCount: number, paddingChar: string): string => {

        let direction = paddingChar === "}" ? directions.Right : directions.Left,
            totalWidth = formattedString.length + escapedBracesCount;

        return Utils.Padding.pad(formattedString, { totalWidth, direction, paddingChar });
    };
}
