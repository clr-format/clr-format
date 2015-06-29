/// <reference path="CustomFormatter" />

declare module Format.Globalization {
    /** Provides a mechanism for retrieving an object to control formatting. */
    interface FormatProvider {
        /**
         * Returns an object that provides formatting services for the specified type.
         * @param type A string indicating the type of the custom formatter to return, i.e. '[object Array]'.
         */
        getFormatter(type: string): CustomFormatter;
    }
}
