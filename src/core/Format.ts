/// <reference path="../use-strict" />

/// <reference path="API" />

/// <reference path="Utils/Text" />
/// <reference path="Utils/Types" />
/// <reference path="Utils/Numeric" />
/// <reference path="Utils/Padding" />
/// <reference path="Utils/Enumerable" />

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

    /** @private */
    let CultureInfo = Globalization.CultureInfo;

    /**
     * Sets the current default culture (the [[CurrentCulture]] property) based on the supplied locale parameter.
     * @param locale A string holding a [BCP 47 language tag](http://tools.ietf.org/html/rfc5646).
     */
    export function setCulture(locale: string): void {
        CultureInfo.CurrentCulture = locale === "" ?
            CultureInfo.InvariantCulture :
            new CultureInfo(locale);
    }

    /**
     * Sets the current default currency (the [[CurrentCurrency]] property) based on the supplied currency code.
     * @param currencyCode The currency to use in currency formatting. See [current currency & funds code list](http://www.currency-iso.org/home/tables/table-a1.html).
     */
    export function setCurrency(currencyCode: string): void {

        if (currencyCode == null) {
            throw new Errors.ArgumentNullError("currencyCode");
        }

        Globalization.NumberFormatInfo.CurrentCurrency = currencyCode;
    }

    /**
     * Converts the value of objects to strings based on the formats specified and inserts them into another string.
     *
     * This project-internal (but externally visible) version does not support arbitrary argument overloads.
     * @param provider An object that supplies culture-specific formatting information.
     * @param format A composite format string. See: https://msdn.microsoft.com/library/txafckwd.aspx
     * @param args An array of arguments that contains zero or more objects to format.
     * @returns A copy of the format string in which the format items have been replaced by the string representation of the corresponding objects in args.
     */
    export function innerFormat(provider: Globalization.FormatProvider, format: string, args: Object[]): string {

        if (format == null) {
            throw new Errors.ArgumentNullError("format");
        }

        provider = provider || CultureInfo.CurrentCulture;

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

    /**
     * Converts the object's value to string based on the format specified and returns it.
     * @param formatStringComponent A format string component (part of the composite format string). See: https://msdn.microsoft.com/library/txafckwd.aspx
     * @param value The object to format.
     * @param provider An object that supplies culture-specific formatting information.
     * @returns The string representation of the object's value, formatted as specified by the format string component and provider.
     */
    export function innerComponentFormat(formatStringComponent: string, value: Object, provider?: Globalization.FormatProvider): string {
        let valueType = Utils.getType(value);
        provider = provider || CultureInfo.CurrentCulture;
        return provider.getFormatter(valueType).format(formatStringComponent, value);
    }

    /** Defines possible options for a string format replacement operation. */
    interface FormatItemOptions {
        /** A format string matching the Format Item Syntax. */
        formatItem: string;
        /** The mandatory index component, also called a parameter specifier, is a number starting from 0 that identifies a corresponding item in the list of objects. */
        indexComponent: string;
        /** The optional alignment component is a signed integer indicating the preferred formatted field width. */
        alignmentComponent: string;
        /** The optional formatString component is a format string that is appropriate for the type of object being formatted. */
        formatStringComponent: string;
    }

    /** @private */
    var replaceFormatItem = (provider: Globalization.FormatProvider, args: Object[], options: FormatItemOptions): string => {

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
    var applyFormatting = (provider: Globalization.FormatProvider, args: Object[], options: FormatItemOptions): string => {

        let index = +options.indexComponent;

        if (index >= args.length) {
            throw new Errors.FormatError(
                "Index (zero based) must be strictly less than the size of the argument's array");
        }

        try {
            return innerComponentFormat(options.formatStringComponent, args[index], provider);
        }
        catch (error) {
            throw new Errors.FormatError(
                `Format string component '${options.formatStringComponent}' in format item '${options.formatItem}' cannot be applied: ${error.message}`,
                error);
        }
    };

    /** @private */
    let padding = Utils.Padding, paddingDirection = padding.Direction;

    /** @private */
    var applyAlignment = (formattedString: string, options: FormatItemOptions): string => {

        let totalWidth = +options.alignmentComponent;
        if (!Utils.Numeric.isInteger(totalWidth)) {
            throw new Errors.FormatError(
                `Alignment component '${options.alignmentComponent}' in format item '${options.formatItem}' must be an integer`);
        }

        let direction = totalWidth < 0 ? paddingDirection.Right : paddingDirection.Left;
        totalWidth = Math.abs(totalWidth);

        return padding.pad(formattedString, { totalWidth, direction });
    };

    /** @private */
    var padBraces = (formattedString: string, escapedBracesCount: number, paddingChar: string): string => {

        let direction = paddingChar === "}" ? paddingDirection.Right : paddingDirection.Left,
            totalWidth = formattedString.length + escapedBracesCount;

        return padding.pad(formattedString, { totalWidth, direction, paddingChar });
    };
}
