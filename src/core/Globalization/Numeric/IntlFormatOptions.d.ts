/// <reference path="../../Utils/Indexable" />

declare module Intl {
    /** Represents an object that provides formatting options according to the Intl.NumberFormat object's constructor. */
    interface NumberFormatOptions {
        /** The minimum number of integer digits to use. Possible values are from 1 to 21; the default must be 1. */
        minimumIntegerDigits?: number;
        /** The minimum number of fraction digits to use. Possible values are from 0 to 20.
         * The default for plain number and percent formatting is 0
         * The default for currency formatting is the number of minor unit digits provided by the ISO 4217 currency code list (2 if the list doesn't provide that information).
         */
        minimumFractionDigits?: number;
        /**
         * The maximum number of fraction digits to use. Possible values are from 0 to 20;
         * The default for plain number formatting is the larger of minimumFractionDigits and 3.
         * The default for currency formatting is the larger of minimumFractionDigits and the number of minor unit digits provided by the ISO 4217 currency code list
         * (2 if the list doesn't provide that information).
         * The default for percent formatting is the larger of minimumFractionDigits and 0.
         */
        maximumFractionDigits?: number;
        /**
         * The minimum number of significant digits to use. Possible values are from 1 to 21; the default is 1.
         * If defined then minimumIntegerDigits, minimumFractionDigits and maximumFractionDigits are ignored.
         */
        minimumSignificantDigits?: number;
        /**
         * The maximum number of significant digits to use. Possible values are from 1 to 21; the default is minimumSignificantDigits.
         * If defined then minimumIntegerDigits, minimumFractionDigits and maximumFractionDigits are ignored.
         */
        maximumSignificantDigits?: number;
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
