declare module Format.Globalization {
    /** Defines a method that supports custom formatting of the value of an object. */
    interface CustomFormatter {
        /**
         * Converts the value of a specified object to an equivalent string representation using specified format and culture-specific formatting information.
         * @param formatString A format string containing formatting specifications.
         * @param value An object to format.
         */
        format(formatString: string, value: Object): string;
    }
}
