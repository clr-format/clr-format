/// <reference path="Globalization/FormatProvider" />

/** The [[StringConstructor.format]] method exposes the core logic of the project. */
interface StringConstructor {
    /**
     * Converts the value of objects to strings based on the formats specified and inserts them into another string.
     * @param format A composite format string. See: https://msdn.microsoft.com/library/txafckwd.aspx
     * @param args A list of arguments that contains zero or more objects to format.
     * @returns A copy of the format string in which the format items have been replaced by the string representation of the corresponding objects in args.
     */
    format(format: string, ...args: Object[]): string;
    /**
     * Converts the value of objects to strings based on the formats specified and inserts them into another string.
     * @param provider An object that supplies culture-specific formatting information.
     * @param format A composite format string. See: https://msdn.microsoft.com/library/txafckwd.aspx
     * @param args A list of arguments that contains zero or more objects to format.
     * @returns A copy of the format string in which the format items have been replaced by the string representation of the corresponding objects in args.
     */
    format(provider: Format.Globalization.FormatProvider, format: string, ...args: Object[]): string;
}
