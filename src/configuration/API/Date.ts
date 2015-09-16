/**
 * Extends the built-in javascript `Date` object's prototype.
 *
 * The [[Format.Config.addToStringOverload]] method must be called in order to access the definitions.
 */
interface Date {
    /**
     * Converts the date value of this instance to its equivalent string representation, using the specified format.
     *
     * Must call [[Format.Config.addToStringOverload]] to be defined.
     * @param format A standard or custom date format string.
     * @returns The formatted date value.
     */
    toString(format: string): string;

    /**
     * Converts the date value of this instance to its equivalent string representation using the specified culture-specific format information.
     *
     * Must call [[Format.Config.addToStringOverload]] to be defined.
     * @param provider An object that supplies culture-specific formatting information.
     * @returns The formatted date value.
     */
    toString(provider: Format.Globalization.FormatProvider): string;

    /**
     * Converts the date value of this instance to its equivalent string representation using the specified format and culture-specific format information.
     *
     * Must call [[Format.Config.addToStringOverload]] to be defined.
     * @param format A standard or custom date format string.
     * @param provider An object that supplies culture-specific formatting information.
     * @returns The formatted date value.
     */
    toString(format: string, provider: Format.Globalization.FormatProvider): string;
}
