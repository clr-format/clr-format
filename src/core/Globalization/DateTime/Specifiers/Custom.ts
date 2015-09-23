/// <reference path="../../../../use-strict" />

/// <reference path="../../../Utils/Object" />
/// <reference path="../../../Utils/Indexable" />

/** A [[Globalization.DateTime]] sub-module containing classes related to date and time format specifier operations. */
namespace Format.Globalization.DateTime.Specifiers {

    /** The maximum allowed precision of a `Date` object's sub-seconds time. */
    export let MaxSubSecondPrecision = 3;

    /**
     * Provides a compilation enforced mapping of the [Custom Date and Time Format Specifiers](https://msdn.microsoft.com/library/8kb3ddd4.aspx).
     * @param T The type of the specifier's value/handler.
     */
    export interface CustomSpecifiersMap<T> extends Indexable<T> {
        /** Format specifier `d` (up to 4 times, plus any additional) represents the day of the month as a number from 1 through 31, or as an abbreviated or full day of the week. */
        dayPlaceholder: T;
        /** Format specifier `f` (up to [[MaxSubSecondPrecision]] times) represents the n-th most significant digit of the seconds fraction. */
        zeroSubSecondPlaceholder: T;
        /** Format specifier `F` (up to [[MaxSubSecondPrecision]] times) represents the n-th most significant digit of the seconds fraction. Nothing is displayed if the digit is zero. */
        digitSubSecondPlaceholder: T;
        /** Format specifier `g` or `gg` (plus any number of additional `g` specifiers) represents the period or era, such as A.D. */
        eraPlaceholder: T;
        /** Format specifier `h` or `hh` (plus any number of additional `h` specifiers) represents the hour as a number from (0)1 through 12. */
        hour12Placeholder: T;
        /** Format specifier `H` or `HH` (plus any number of additional `H` specifiers) represents the hour as a number from (0)0 through 23. */
        hour24Placeholdr: T;
        /** Format specifier `K` represents the time zone information of a date and time value. */
        timeZonePlaceholder: T;
        /** Format specifier `m` or `mm` (plus any number of additional `m` specifiers) represents the minute as a number from (0)0 through 59. */
        minutePlaceholder: T;
        /** Format specifier `M` (up to 4 times, plus any additional) represents the month as a number from (0)1 through 12, or as an abbreviated or full name of the month. */
        monthPlaceholder: T;
        /** Format specifier `s` or `ss` (plus any number of additional `s` specifiers) represents the minute as a number from (0)0 through 59. */
        secondPlaceholder: T;
        /** Format specifier `t` or `tt` (plus any number of additional `t` specifiers) represents the first or both characters of the AM/PM designator. */
        amPmPlaceholder: T;
        /** Format specifier `y` represents the year with a minimum number of digits equal to the times the specifier was repeated. */
        yearPlaceholder: T;
        /** Format specifier `z` represents the signed time offset from UTC, measured in hours. */
        hoursOffsetPlaceholder: T;
        /** Format specifier `:` represents the time separator, which is used to differentiate hours, minutes, and seconds. */
        timeSeparator: T;
        /** Format specifier `/` represents the date separator, which is used to differentiate years, months, and days. */
        dateSeparator: T;
        /** Format specifier `'` indicates that the enclosed characters should be copied to the result string unchanged. */
        literalStringDelimeterSingle: T;
        /** Format specifier `"` indicates that the enclosed characters should be copied to the result string unchanged. */
        literalStringDelimeterDouble: T;
        /** Format specifier `%` defines the following character as a custom format specifier. */
        singleCharFormatSpecifier: T;
        /** Format specifier `\` causes the next character to be interpreted as a literal rather than as a custom format specifier. */
        escapeChar: T;
    }

    /**
     * Exposes a map of the custom date and time format specifiers to their character representation as well as the inverse relation.
     *
     * See: https://msdn.microsoft.com/library/8kb3ddd4.aspx
     */
    export let Custom = Utils.mapValuesAsKeys(<CustomSpecifiersMap<string>> {
        dayPlaceholder: "d",
        zeroSubSecondPlaceholder: "f",
        digitSubSecondPlaceholder: "F",
        eraPlaceholder: "g",
        hour12Placeholder: "h",
        hour24Placeholdr: "H",
        timeZonePlaceholder: "K",
        minutePlaceholder: "m",
        monthPlaceholder: "M",
        secondPlaceholder: "s",
        amPmPlaceholder: "t",
        yearPlaceholder: "y",
        hoursOffsetPlaceholder: "z",
        timeSeparator: ":",
        dateSeparator: "/",
        literalStringDelimeterSingle: "\'",
        literalStringDelimeterDouble: "\"",
        singleCharFormatSpecifier: "%",
        escapeChar: "\\"
    });

    /** @private */
    let specifiers = Custom,
        getEscapePattern = (escapeChar: string): string => `\\${escapeChar}.`,
        getLiteralPattern = (literalStringDelimeter: string): string =>
            `${literalStringDelimeter}[^${literalStringDelimeter}]*?${literalStringDelimeter}`;

    /** A regular expression matching all custom date and time specifiers and escape literal combinations. */
    export let CustomSpecifiersRegExp = new RegExp(
        [
            getLiteralPattern(specifiers.literalStringDelimeterSingle),
            getLiteralPattern(specifiers.literalStringDelimeterDouble),
            getEscapePattern(specifiers.singleCharFormatSpecifier),
            getEscapePattern(specifiers.escapeChar),
            specifiers.timeZonePlaceholder,
            specifiers.timeSeparator,
            specifiers.dateSeparator,
            specifiers.literalStringDelimeterSingle,
            specifiers.literalStringDelimeterDouble,
            `[${[
                specifiers.dayPlaceholder,
                specifiers.zeroSubSecondPlaceholder,
                specifiers.digitSubSecondPlaceholder,
                specifiers.eraPlaceholder,
                specifiers.hour12Placeholder,
                specifiers.hour24Placeholdr,
                specifiers.minutePlaceholder,
                specifiers.monthPlaceholder,
                specifiers.secondPlaceholder,
                specifiers.amPmPlaceholder,
                specifiers.yearPlaceholder,
                specifiers.hoursOffsetPlaceholder
            ].join("") }]+`
        ].join("|"),
        "g");
}
