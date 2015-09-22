/// <reference path="../../../../use-strict" />

/// <reference path="../../../Utils/Object" />
/// <reference path="../../../Utils/Indexable" />

/** A [[Globalization.Numeric]] sub-module containing classes related to numeric format specifier operations. */
namespace Format.Globalization.Numeric.Specifiers {
    /**
     * A custom numeric exponent format string takes the form `Esxxx`, where:
     * - `E` is a single lower or uppercase 'E' character marking the begining of the exponential notation specifier.
     * - `s` is an optional single '+' or '-' sign which specifies the display behaviour of the same characters in the output string.
     * - `xxx` is a zero placeholders' string (at least 1) that determines the width of the output exponent's padding.
     */
    export let CustomExponentRexExp = /^E([-\+]?)(0+)/i;

    /**
     * Provides a compilation enforced mapping of the [Custom Numeric Format Specifiers](https://msdn.microsoft.com/library/0c899ak8.aspx).
     * @param T The type of the specifier's value/handler.
     */
    export interface CustomSpecifiersMap<T> extends Indexable<T> {
        /** Format specifier `0` replaces the zero with the corresponding digit if one is present; otherwise, zero appears in the result string. */
        zeroPlaceholder: T;
        /** Format specifier `#` replaces symbol with the corresponding digit if one is present; otherwise, no digit appears in the result string. */
        digitPlaceholder: T;
        /** Format specifier `.` determines the location of the decimal separator in the result string. */
        decimalPoint: T;
        /** Format specifier `,` serves as both a group separator and a number scaling specifier. */
        groupSeparatorOrNumberScaling: T;
        /** Format specifier `%` multiplies a number by 100 and inserts a localized percentage symbol in the result string. */
        percentagePlaceholder: T;
        /** Format specifier `‰` multiplies a number by 1000 and inserts a localized per mille symbol in the result string. */
        perMillePlaceholder: T;
        /**
         * Format specifier `e` or `E` followed by `+` or `-`, and at least one `0` determines the presence of an exponential notation specifier.
         *
         * The "E+" and "e+" formats indicate that a plus sign or minus sign should always precede the exponent.
         * The "E", "E-", "e", or "e-" formats indicate that a sign character should precede only negative exponents.
         */
        exponent: T;
        /** Format specifier `\` causes the next character to be interpreted as a literal rather than as a custom format specifier. */
        escapeChar: T;
        /** Format specifier `'` indicates that the enclosed characters should be copied to the result string unchanged. */
        literalStringDelimeterSingle: T;
        /** Format specifier `"` indicates that the enclosed characters should be copied to the result string unchanged. */
        literalStringDelimeterDouble: T;
        /**
         * Format specifier `;` defines sections with separate format strings for positive, negative, and zero numbers - in that order.
         *
         * To produce this behavior, a custom format string can contain up to three sections separated by semicolons:
         * - One section: The format string applies to all values;
         * - Two sections: The first section applies to positive values and zeros, and the second section applies to negative values.
         * If the number to be formatted is negative, but becomes zero after rounding according to the format in the second section, the resulting zero is formatted
         * according to the first section;
         * - Three sections: The first section applies to positive values, the second section applies to negative values, and the third section applies to zeros.
         * The second section can be left empty (by having nothing between the semicolons), in which case the first section applies to all nonzero values.
         * If the number to be formatted is nonzero, but becomes zero after rounding according to the format in the first or second section, the resulting zero
         * is formatted according to the third section.
         */
        sectionSeparator: T;
    }

    /**
     * Exposes a map of the custom numeric format specifiers to their character representation as well as the inverse relation.
     *
     * See: https://msdn.microsoft.com/library/0c899ak8.aspx
     */
    export let Custom = Utils.mapValuesAsKeys(<CustomSpecifiersMap<string>> {
        zeroPlaceholder: "0",
        digitPlaceholder: "#",
        decimalPoint: ".",
        groupSeparatorOrNumberScaling: ",",
        percentagePlaceholder: "%",
        perMillePlaceholder: "‰",
        exponent: "E",
        escapeChar: "\\",
        literalStringDelimeterSingle: "\'",
        literalStringDelimeterDouble: "\"",
        sectionSeparator: ";"
    });
}
