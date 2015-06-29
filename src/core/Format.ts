/// <reference path="../use-strict" />

/// <reference path="API" />

/// <reference path="Utils/Array" />
/// <reference path="Utils/General" />
/// <reference path="Utils/Padding" />
/// <reference path="Utils/FormatItemOptions" />

/// <reference path="Errors/FormatError" />
/// <reference path="Errors/ArgumentNullError" />

module Format {

    String.format = (...args: Object[]): string => {

        if (typeof args[0] === "string") {
            return innerFormat(undefined, <string>args.shift(), args);
        }

        let provider = <Globalization.FormatProvider>args.shift();
        if (provider && typeof provider.getFormatter !== "function") {
            throw new Errors.ArgumentError(String.format(
                "Argument 'provider' of type '{0}' does not implement the FormatProvider interface",
                Utils.Function.getName(provider.constructor)));
        }

        return innerFormat(provider, <string>args.shift(), args);
    };

    var innerFormat = (provider: Globalization.FormatProvider, format: string, args: Object[]): string => {

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
    };
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

    class SimpleProvider implements Globalization.FormatProvider {

        private objectFormatter: Globalization.CustomFormatter;
        private otherFormatter: Globalization.CustomFormatter;

        constructor() {
            this.objectFormatter = new ObjectFormatter();
            this.otherFormatter = new OtherFormatter();
        }

        getFormatter(type: string): Globalization.CustomFormatter {

            return type === "[object Object]" || type === "[object Array]" ?
                this.objectFormatter :
                this.otherFormatter;
        }
    }

    class ObjectFormatter implements Globalization.CustomFormatter {

        format(formatString: string, value: Object) {

            if (formatString) {
                throw new Errors.FormatError("Values of type Object or Array do not accept a format string component");
            }

            return value ? JSON.stringify(value) : "";
        }
    }

    class OtherFormatter implements Globalization.CustomFormatter {

        format(formatString: string, value: Object) {

            if (formatString) {
                throw new Errors.FormatError(String.format(
                    "Formatter type '{0}' does not accept a format string component",
                    Utils.Function.getName(this.constructor)));
            }

            return value != null ? value + "" : "";
        }
    }

    var simpleProvider = new SimpleProvider();
}
