/// <reference path="../use-strict" />

/// <reference path="API" />

/// <reference path="Utils/General" />
/// <reference path="Utils/Padding" />
/// <reference path="Utils/Enumerable" />
/// <reference path="Utils/FormatItemOptions" />

/// <reference path="Globalization/FormatProvider" />
/// <reference path="Globalization/CustomFormatter" />

/// <reference path="Errors/FormatError" />
/// <reference path="Errors/ArgumentNullError" />

/**
 * The CLR Format main module and namespace.
 *
 * The [[StringConstructor.format]] method exposes the core API of the project. Optional configuration methods are stored in the [[Format.Config]] sub-module.
 */
module Format {

    String.format = (...args: Object[]): string => {

        if (typeof args[0] === "string") {
            return innerFormat(undefined, <string>args.shift(), args);
        }

        let provider = <Globalization.FormatProvider>args[0];
        if (provider && typeof provider.getFormatter !== "function") {
            throw new Errors.ArgumentError(String.format(
                "Argument 'provider' of type '{0}' does not implement the FormatProvider interface",
                Utils.Function.getName(provider.constructor)));
        }

        let format = <string>args[1];

        args.splice(0, 2);

        return innerFormat(provider, format, args);
    };

    /**
     * Converts the value of objects to strings based on the formats specified and inserts them into another string.
     *
     * This internal version does not support arbitrary argument overloads.
     * @param provider An object that supplies culture-specific formatting information.
     * @param format A composite format string. See: https://msdn.microsoft.com/en-us/library/txafckwd.aspx
     * @param args An array of arguments that contains zero or more objects to format.
     */
    export function innerFormat(provider: Globalization.FormatProvider, format: string, args: Object[]): string {

        if (format == null) {
            throw new Errors.ArgumentNullError("format");
        }

        provider = provider || simpleProvider;

        return format.replace(formatItemRegExp, (formatItem, indexComponent, alignmentComponent, formatStringComponent) =>
            replaceFormatItem(provider, args, {
                formatItem,
                indexComponent,
                alignmentComponent,
                formatStringComponent
            }));
    }
    var formatItemRegExp = /{+(\d+)(?:,(.+?))?(?::(.+?))?}+/g;

    var replaceFormatItem = (provider: Globalization.FormatProvider, args: Object[], options: Utils.FormatItemOptions): string => {

        let escapedBracesCount = Math.floor(getBracesCount(options.formatItem, "{") / 2);
        if (isFullyEscaped(options.formatItem)) {
            return options.formatItem.substring(escapedBracesCount, options.formatItem.length - escapedBracesCount);
        }

        let result = applyFormatting(provider, args, options);

        if (options.alignmentComponent !== undefined) {
            result = applyAlignment(result, options);
        }

        if (escapedBracesCount > 0) {
            result = padBraces(result, escapedBracesCount, "{");
            result = padBraces(result, escapedBracesCount, "}");
        }

        return result;
    };

    // Can memoize
    var getBracesCount = (formatItem: string, braceChar: string): number => {

        let splits = formatItem.split(braceChar);

        if (braceChar === "}") {
            splits = splits.reverse();
        }

        return Utils.Enumerable.takeWhile(splits, isNullOrWhitespace).length;
    };

    var isNullOrWhitespace = (value: string): boolean => !(value && value.trim().length > 0);

    var isFullyEscaped = (formatItem: string): boolean => {

        let openingBracesCount = getBracesCount(formatItem, "{"),
            closingBracesCount = getBracesCount(formatItem, "}");

        if (openingBracesCount !== closingBracesCount) {
            throw new Errors.FormatError(String.format(
                "Opening and closing brackets for item '{0}' do not match",
                formatItem));
        }

        return isEven(openingBracesCount);
    };

    var isEven = (value: number) => !(value & 1);

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
                String.format(
                    "Format string component '{0}' in format item '{1}' cannot be applied: {2}",
                    options.formatStringComponent, options.formatItem, error.message),
                error);
        }
    };

    let directions = Utils.Padding.Direction;
    var applyAlignment = (formattedString: string, options: Utils.FormatItemOptions): string => {

        let totalWidth = +options.alignmentComponent;
        if (totalWidth !== totalWidth >> 0) {
            throw new Errors.FormatError(String.format(
                "Alignment component '{0}' in format item '{1}' must be a finite integer value",
                options.alignmentComponent, options.formatItem));
        }

        let direction = totalWidth < 0 ? directions.Right : directions.Left;
        totalWidth = Math.abs(totalWidth);

        return Utils.Padding.pad(formattedString, { totalWidth, direction });
    };

    var padBraces = (formattedString: string, escapedBracesCount: number, paddingChar: string): string => {

        let direction = paddingChar === "}" ? directions.Right : directions.Left,
            totalWidth = formattedString.length + escapedBracesCount;

        return Utils.Padding.pad(formattedString, { totalWidth, direction, paddingChar });
    };

    /** Basic internal core implementation of a [[FormatProvider]] which does not support format string components and globalization. */
    class SimpleProvider implements Globalization.FormatProvider {

        private objectFormatter: Globalization.CustomFormatter;
        private toStringFormatter: Globalization.CustomFormatter;

        constructor() {
            this.objectFormatter = new ObjectFormatter();
            this.toStringFormatter = new ToStringFormatter();
        }

        /**
         * Returns [[ObjectFormatter]] for `Object` and `Array` instances and [[OtherFormatter]] for other types.
         * @param type The type of the value object, i.e. `"[object Number]"`.
         */
        getFormatter(type: string): Globalization.CustomFormatter {

            return type === "[object Object]" || type === "[object Array]" ?
                this.objectFormatter :
                this.toStringFormatter;
        }
    }

    /** Basic internal core implementation of a [[CustomFormatter]] for `Object` and `Array` instances. Does not support format string components and globalization. */
    class ObjectFormatter implements Globalization.CustomFormatter {
        /**
         * Converts the value by passing it to `JSON.stringify`.
         * @param format An unsupported format string argument. Will result in a thrown [[FormatError]] if not left empty.
         * @param value An object to format.
         */
        format(format: string, value: Object) {

            if (format) {
                throw new Errors.FormatError("Values of type Object or Array do not accept a format string component");
            }

            return value ? JSON.stringify(value) : "";
        }
    }

    /** Basic internal core implementation of a [[CustomFormatter]] for any objects. Does not support format string components and globalization. */
    class ToStringFormatter implements Globalization.CustomFormatter {
        /**
         * Converts the value by forcing it into a `String` value.
         * @param format An unsupported format string argument. Will result in a thrown [[FormatError]] if not left empty.
         * @param value An object to format.
         */
        format(format: string, value: Object) {

            if (format) {
                throw new Errors.FormatError(String.format(
                    "Formatter type '{0}' does not accept a format string component",
                    Utils.Function.getName(this.constructor)));
            }

            return value != null ? value + "" : "";
        }
    }

    var simpleProvider = new SimpleProvider();
}
