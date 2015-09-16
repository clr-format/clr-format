declare module Intl {
    /** Represents an object that provides formatting options according to the Intl.NumberFormat object's constructor. */
    interface NumberFormatOptions {
        /** The minimum number of integer digits to use. Possible values are from 1 to 21; the default must be 1. */
        minimumIntegerDigits?: number;
    }
}
