/// <reference path="../../../../use-strict" />

/// <reference path="../../../Utils/Object" />

namespace Format.Globalization.Numeric.Specifiers {
    /**
     * A standard numeric format string takes the form `Axx`, where:
     * - `A` is a single alphabetic character called the format specifier.
     * Any numeric format string that contains more than one alphabetic character, including white space, is interpreted as a custom numeric format string;
     * - `xx` is an optional integer called the precision specifier. The precision specifier ranges from 0 to 99 and affects the number of digits in the result.
     * Note that the precision specifier controls the number of digits in the string representation of a number. It does not round the number itself.
     * To perform a rounding operation, use the `Math.ceil`, `Math.floor`, or `Math.round` methods;
     *
     * When precision specifier controls the number of fractional digits in the result string, the result strings reflect numbers that are rounded away from zero.
     */
    export let StandardSpecifierRexExp = /^([a-z])(\d*)$/i;

    /** The default standard exponential precision specifier. */
    export let DefaultStandardExponentialPrecision = 6;

    /**
     * Provides a compilation enforced mapping of the [Standard Numeric Format Specifiers](https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx).
     * @param T The type of the specifier's value/handler.
     */
    export interface StandardSpecifiersMap<T> extends Indexable<T> {
        /** Format specifier `C` represents a currency value. */
        currency: T;
        /** Format specifier `D` represents a value's integer digits with optional negative sign. */
        decimal: T;
        /** Format specifier `E` represents a value's exponential notation. */
        exponential: T;
        /** Format specifier `F` represents a value's integral and decimal digits with optional negative sign. */
        fixedPoint: T;
        /** Format specifier `G` represents the most compact of either fixed-point or scientific notation. */
        general: T;
        /** Format specifier `N` represents a value's integral and decimal digits, group separators, and a decimal separator with optional negative sign. */
        number: T;
        /** Format specifier `P` represents a value multiplied by 100 and displayed with a percent symbol. */
        percent: T;
        /** Format specifier `R` formats a string that can round-trip to an identical number value. */
        roundTrip: T;
        /** Format specifier `X` represents a hexadecimal string. */
        hex: T;
    }

    /**
     * Exposes a map of the standard numeric format specifiers to their alphabetic character representation as well as the inverse relation.
     *
     * See: https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx
     */
    export let StandardSpecifiers = Utils.mapValuesAsKeys(<StandardSpecifiersMap<string>> {
        currency: "C",
        decimal: "D",
        exponential: "E",
        fixedPoint: "F",
        general: "G",
        number: "N",
        percent: "P",
        roundTrip: "R",
        hex: "X"
    });
}
