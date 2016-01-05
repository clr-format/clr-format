/// <reference path="../../Utils/Indexable" />

declare module Intl {
    /** Represents an object that provides formatting options according to the Intl.NumberFormat object's constructor. */
    interface NumberFormatOptions {
        /** The no digits flag indicates whether the digits part should be fully omitted. The sign character is preserved. */
        noDigits?: boolean;
        /** The no leading zero integer digit flag indicates whether the integral part can be fully omitted if it has a value of 0. */
        noLeadingZeroIntegerDigit?: boolean;
        /** The upper case flag indicates a specifier that controls whether parts of the formatted string should be upper-cased. */
        upperCase?: boolean;
        /** Indicates that a sign character should precede only negative exponents. */
        negativellySignedExponent?: boolean;
        /** The minimum number of exponent digits to use. */
        minimumExponentDigits?: number;
        /** The divisor that will be applied to the value before formatting. */
        valueDivisor?: number;
        /** A string that will be added before the numeric format value. */
        prefixDecorator?: string;
        /**
         * A map of index-to-text values which are inside the numeric part of the format. The key's value and sign indicate an offset from the decimal point:
         * - Negative number: backwards (right-to-left) index relative to the decimal point;
         * - Positive number: index relative to the decimal point;
         */
        internalDecorators?: Indexable<string>;
        /** A string that will be added after the numeric format value. */
        suffixDecorator?: string;
    }
}
