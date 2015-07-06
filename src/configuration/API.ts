interface String {
    /**
     * Converts the value of objects to strings based on the formats specified and inserts them into this string.
     * @param args A list of arguments that contains zero or more objects to format.
     */
    format(...args: Object[]): string;
    /**
     * Converts the value of objects to strings based on the formats specified and inserts them into this string.
     * @param provider An object that supplies culture-specific formatting information.
     * @param args A list of arguments that contains zero or more objects to format.
     */
    format(provider: Format.Globalization.FormatProvider, ...args: Object[]): string;
}
