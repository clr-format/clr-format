/// <reference path="../../../../use-strict" />

/// <reference path="../../../Utils/Object" />

namespace Format.Globalization.DateTime.Specifiers {
    /**
     * Provides a compilation enforced mapping of the [Standard Date and Time Format Specifiers](https://msdn.microsoft.com/en-us/library/az4se3k1.aspx).
     * @param T The type of the specifier's value/handler.
     */
    export interface StandardSpecifiersMap<T> extends Indexable<T> {
        /** Format specifier `d` represents a custom date and time format string that is defined by a specific culture's [[DateTimeFormatInfo.ShortDatePattern]] property. */
        shortDate: T;
        /** Format specifier `D` represents a custom date and time format string that is defined by a specific culture's [[DateTimeFormatInfo.LongDatePattern]] property. */
        longDate: T;
        /** Format specifier `f` represents a combination of the long date `D` and short time `t` patterns, separated by a space. */
        fullDateShortTime: T;
        /** Format specifier `F` represents a custom date and time format string that is defined by the current [[DateTimeFormatInfo.FullDateTimePattern]] property. */
        fullDateLongTime: T;
        /** Format specifier `g` represents a combination of the short date `d` and short time `t` patterns, separated by a space. */
        generalDateShortTime: T;
        /** Format specifier `G` represents a combination of the short date `d` and long time `T` patterns, separated by a space. */
        generalDateLongTime: T;
        /** Format specifier `M` or `m` represents a custom date and time format string that is defined by the current [[DateTimeFormatInfo.MonthDayPattern]] property. */
        monthDate: T;
        /** Format specifier `O` or `o` represents a custom date and time format string using a pattern that preserves time zone information and emits a result string that complies with ISO 8601. */
        roundTrip: T;
        /** Format specifier `R` or `r` represents a custom date and time format string that is defined by the [[DateTimeFormatInfo.RFC1123Pattern]] property. */
        rfc1123: T;
        /** Format specifier `s` represents a custom date and time format string that is defined by the [[DateTimeFormatInfo.SortableDateTimePattern]] property. */
        sortable: T;
        /** Format specifier `t` represents a custom date and time format string that is defined by the current [[DateTimeFormatInfo.ShortTimePattern]] property. */
        shortTime: T;
        /** Format specifier `T` represents a custom date and time format string that is defined by a specific culture's [[DateTimeFormatInfo.LongTimePattern]] property. */
        longTime: T;
        /** Format specifier `u` represents a custom date and time format string that is defined by the [[DateTimeFormatInfo.UniversalSortableDateTimePattern]] property. */
        universalSortable: T;
        /** Format specifier `U` represents a custom date and time format string that is defined by a specified culture's [[DateTimeFormatInfo.FullDateTimePattern]] property. */
        universalFull: T;
        /** Format specifier `Y` or `y` represents a custom date and time format string that is defined by the [[DateTimeFormatInfo.YearMonthPattern]] property of a specified culture. */
        yearMonth: T;
    }

    /**
     * Exposes a map of the standard date and time format specifiers to their alphabetic character(s) representation as well as the inverse relation.
     *
     * A standard date and time format string uses a single format specifier to define the text representation of a date and time value.
     * Any date and time format string that contains more than one character, including white space, is interpreted as a custom date and time format string.
     *
     * See: https://msdn.microsoft.com/en-us/library/az4se3k1.aspx
     */
    export let StandardSpecifiers = Utils.mapValuesAsKeys(<StandardSpecifiersMap<string>> {
        shortDate: "d",
        longDate: "D",
        fullDateShortTime: "f",
        fullDateLongTime: "F",
        generalDateShortTime: "g",
        generalDateLongTime: "G",
        monthDate: "M",
        roundTrip: "O",
        rfc1123: "R",
        sortable: "s",
        shortTime: "t",
        longTime: "T",
        universalSortable: "u",
        universalFull: "U",
        yearMonth: "Y"
    });
}
