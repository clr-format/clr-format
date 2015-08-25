/// <reference path="../../../use-strict" />

/// <reference path="../OptionsProvider" />

/** A [[Format.Globalization]] sub-module containing classes related to numeric format operations. */
namespace Format.Globalization.Numeric {
    /**
     * Provides a mechanism for retrieving concrete number formatting options.
     * @param TOptions The type of the options container.
     */
    export interface OptionsProvider<TOptions> extends Globalization.OptionsProvider<TOptions, number> {
        /** Returns the formatting style to use. */
        getStyle(): string;
        /** Returns whether to use grouping separators, such as thousands separators or thousand/lakh/crore separators. */
        useGrouping(): boolean;
        /** Returns the minimum number of integer digits to use. */
        getMinimumIntegerDigits(): number;
        /** Returns the minimum number of fraction digits to use. */
        getMinimumFractionDigits(): number;
        /** Returns the maximum number of fraction digits to use. */
        getMaximumFractionDigits(): number;
        /** Returns the minimum number of significant digits to use. */
        getMinimumSignificantDigits(): number;
        /** Returns the maximum number of significant digits to use. */
        getMaximumSignificantDigits(): number;
        /** Returns whether the digits part can be fully omitted. */
        hasNoDigits(): boolean;
        /** Returns whether the integral part can be fully omitted if it has a value of 0. */
        hasNoLeadingZeroIntegerDigit(): boolean;
        /** Returns whether parts of the formatted string should be upper-cased. */
        isUpperCase(): boolean;
        /** Returns whether a sign character should precede only negative exponents. */
        isNegativellySignedExponent(): boolean;
        /** Returns the minimum number of exponent digits to use. */
        getMinimumExponentDigits(): number;
        /** Returns the divisor that will be applied to the value before formatting. */
        getValueDivisor(): number;
        /** Returns the string that will be added before the numeric format value. */
        getPrefixDecorator(): string;
        /** Returns the map of index-to-text values which should be put inside the numeric part of the format. */
        getInternalDecorators(): Indexable<string>;
        /** Returns the string that will be added after the numeric format value. */
        getSuffixDecorator(): string;
    }
}
