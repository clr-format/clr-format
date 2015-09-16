/**
 * Extends the built-in javascript `String` object's static API.
 *
 * The [[Format.Config.addUtilsToGlobals]] method must be called in order to access any additional definitions.
 */
interface StringConstructor {
    /**
     * Indicates whether the specified string is `undefined`, `null`, `""`, or consists only of white-space characters.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param value The string to test.
     * @returns `true` if the value parameter is `undefined`, `null`, `""`, or if value consists exclusively of white-space characters.
     */
    isNullOrWhitespace(value: string): boolean;

    /**
     * Returns a new string in which a specified string is inserted at a specified index position in the value instance.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param value The string into which to insert.
     * @param startIndex The zero-based index position of the insertion.
     * @param insertValue The string to insert.
     * @returns A new string that is equivalent to the value instance, but with insertValue inserted at position startIndex.
     */
    insert(value: string, startIndex: number, insertValue: string): string;
}

/**
 * Extends the built-in javascript `String` object's prototype.
 *
 * Various [[Format.Config]] methods can be called in order to access the additional definitions, see each method for more details.
 */
interface String {
    /**
     * Converts the value of objects to strings based on the formats specified and inserts them into this string.
     *
     * Must call [[Format.Config.addFormatToPrototype]] to be defined.
     * @param args A list of arguments that contains zero or more objects to format.
     * @returns A copy of the current instance in which the format items have been replaced by the string representation of the corresponding objects in args.
     */
    format(...args: Object[]): string;

    /**
     * Converts the value of objects to strings based on the formats specified and inserts them into this string.
     *
     * Must call [[Format.Config.addFormatToPrototype]] to be defined.
     * @param provider An object that supplies culture-specific formatting information.
     * @param args A list of arguments that contains zero or more objects to format.
     * @returns A copy of the current instance in which the format items have been replaced by the string representation of the corresponding objects in args.
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

    /**
     * Returns a new string in which a specified string is inserted at a specified index position in the instance.
     *
     * Must call [[Format.Config.addUtilsToPrototype]] to be defined.
     * @param startIndex The zero-based index position of the insertion.
     * @param insertValue The string to insert.
     * @returns A new string that is equivalent to the instance, but with insertValue inserted at position startIndex.
     */
    insert(startIndex: number, insertValue: string): string;
}
