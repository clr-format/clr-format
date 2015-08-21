/** Extends the built-in javascript `String` object's prototype. */
interface String {
    /**
     * Converts the value of objects to strings based on the formats specified and inserts them into this string.
     *
     * Must call [[Format.Config.addFormatToPrototype]] to be defined.
     * @param args A list of arguments that contains zero or more objects to format.
     */
    format(...args: Object[]): string;

    /**
     * Converts the value of objects to strings based on the formats specified and inserts them into this string.
     *
     * Must call [[Format.Config.addFormatToPrototype]] to be defined.
     * @param provider An object that supplies culture-specific formatting information.
     * @param args A list of arguments that contains zero or more objects to format.
     */
    format(provider: Format.Globalization.FormatProvider, ...args: Object[]): string;

    /**
     * Returns a new string of a specified length in which the beginning of the current string is padded with spaces or with a specified character.
     *
     * Must call [[Format.Config.addPaddingToPrototype]] to be defined.
     * @param totalWidth The number of characters in the resulting string, equal to the number of original characters plus any additional padding characters.
     * @param paddingChar A padding character. Defaults to [[Padding.Options.paddingChar]].
     */
    padLeft(totalWidth: number, paddingChar?: string): string;

    /**
     * Returns a new string of a specified length in which the ending of the current string is padded with spaces or with a specified character.
     *
     * Must call [[Format.Config.addPaddingToPrototype]] to be defined.
     * @param totalWidth The number of characters in the resulting string, equal to the number of original characters plus any additional padding characters.
     * @param paddingChar A padding character. Defaults to [[Padding.Options.paddingChar]].
     */
    padRight(totalWidth: number, paddingChar?: string): string;
}
