/// <reference path="clr-format.d.ts" />
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
declare module Format.Prototypes {
    function format(...args: Object[]): string;
}
declare module Format {
    class Configuration {
        addFormatToPrototype(): Configuration;
        removeFormatFromPrototype(): Configuration;
    }
    var Config: Configuration;
}
