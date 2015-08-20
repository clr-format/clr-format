module Format.Globalization {
    /**
     * Defines a method that supports custom formatting of the value of an object.
     *
     * See: https://msdn.microsoft.com/en-us/library/system.icustomformatter.aspx
     */
    export interface CustomFormatter {
        /**
         * Converts the value of a specified object to an equivalent string representation using specified format and culture-specific formatting information.
         * @param format A format string containing formatting specifications.
         * @param value An object to format.
         */
        format(format: string, value: Object): string;
    }
}
