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
    }
}
