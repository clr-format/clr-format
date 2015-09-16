/**
 * Extends the built-in javascript `Number` object's static API.
 *
 * The [[Format.Config.addUtilsToGlobals]] method must be called in order to access the definitions.
 */
interface NumberConstructor {
    /**
     * Determines whether the passed value is an integer.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param value The number to test.
     * @returns `true` if the value parameter is an integer.
     */
    isInteger(value: number): boolean;

    /**
     * Determines whether the passed value is a counting number (positive integer excluding `0`).
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param value The number to test.
     * @returns `true` if the value parameter is a positive integer excluding `0`.
     */
    isCounting(value: number): boolean;

    /**
     * Determines whether the passed value is a whole number (positive integer including `0`).
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param value The number to test.
     * @returns `true` if the value parameter is a positive integer including `0`.
     */
    isWhole(value: number): boolean;

    /**
     * Determines whether the passed value is an even number.
     *
     * Throws an error if the value is not an integer (when [[isInteger]] returns `false`).
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param value The number to test.
     * @returns `true` if the value parameter is an even number.
     */
    isEven(value: number): boolean;

    /**
     * Returns the best fitting formatted value, returned by the `Number.toFixed` method, given a minimum and/or maximum digits precision.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param value The number to format.
     * @param minDigits The minimum number of digits to include in the format.
     * @param maxDigits The maximum number of digits to include in the format.
     */
    toFixedMinMax(value: number, minDigits: number, maxDigits: number): string;

    /**
     * Returns the best fitting formatted value, returned by the `Number.toExponential` method, given a minimum and/or maximum digits precision.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param value The number to format.
     * @param minDigits The minimum number of digits to include in the format.
     * @param maxDigits The maximum number of digits to include in the format.
     */
    toExponentialMinMax(value: number, minDigits: number, maxDigits: number): string;

    /**
     * Returns the best fitting formatted value, returned by the `Number.toPrecision` method, given a minimum and/or maximum digits precision.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param value The number to format.
     * @param minDigits The minimum number of digits to include in the format.
     * @param maxDigits The maximum number of digits to include in the format.
     */
    toPrecisionMinMax(value: number, minDigits: number, maxDigits: number): string;
}

/**
 * Extends the built-in javascript `Number` object's prototype.
 *
 * Various [[Format.Config]] methods can be called in order to access the additional definitions, see each method for more details.
 */
interface Number {
    /**
     * Converts the numeric value of this instance to its equivalent string representation, using the specified format.
     *
     * Must call [[Format.Config.addToStringOverload]] to be defined.
     * @param format A standard or custom numeric format string.
     * @returns The formatted numeric value.
     */
    toString(format: string): string;

    /**
     * Converts the numeric value of this instance to its equivalent string representation using the specified culture-specific format information.
     *
     * Must call [[Format.Config.addToStringOverload]] to be defined.
     * @param provider An object that supplies culture-specific formatting information.
     * @returns The formatted numeric value.
     */
    toString(provider: Format.Globalization.FormatProvider): string;

    /**
     * Converts the numeric value of this instance to its equivalent string representation using the specified format and culture-specific format information.
     *
     * Must call [[Format.Config.addToStringOverload]] to be defined.
     * @param format A standard or custom numeric format string.
     * @param provider An object that supplies culture-specific formatting information.
     * @returns The formatted numeric value.
     */
    toString(format: string, provider: Format.Globalization.FormatProvider): string;

    /**
     * Determines whether the value is an integer.
     *
     * Must call [[Format.Config.addUtilsToPrototype]] to be defined.
     * @returns `true` if the value is an integer.
     */
    isInteger(): boolean;

    /**
     * Determines whether the passed value is a counting number (positive integer excluding `0`).
     *
     * Must call [[Format.Config.addUtilsToPrototype]] to be defined.
     * @returns `true` if the value is a positive integer excluding `0`.
     */
    isCounting(): boolean;

    /**
     * Determines whether the passed value is a whole number (positive integer including `0`).
     *
     * Must call [[Format.Config.addUtilsToPrototype]] to be defined.
     * @returns `true` if the value is a positive integer including `0`.
     */
    isWhole(): boolean;

    /**
     * Determines whether the value is an even number.
     *
     * Throws an error if the value is not an integer (when [[isInteger]] returns `false`).
     *
     * Must call [[Format.Config.addUtilsToPrototype]] to be defined.
     * @returns `true` if the value is an even number.
     */
    isEven(): boolean;

    /**
     * Returns the best fitting formatted value, returned by the `Number.toFixed` method, given a minimum and/or maximum digits precision.
     *
     * Must call [[Format.Config.addUtilsToPrototype]] to be defined.
     * @param minDigits The minimum number of digits to include in the format.
     * @param maxDigits The maximum number of digits to include in the format.
     */
    toFixedMinMax(minDigits: number, maxDigits: number): string;

    /**
     * Returns the best fitting formatted value, returned by the `Number.toExponential` method, given a minimum and/or maximum digits precision.
     *
     * Must call [[Format.Config.addUtilsToPrototype]] to be defined.
     * @param minDigits The minimum number of digits to include in the format.
     * @param maxDigits The maximum number of digits to include in the format.
     */
    toExponentialMinMax(minDigits: number, maxDigits: number): string;

    /**
     * Returns the best fitting formatted value, returned by the `Number.toPrecision` method, given a minimum and/or maximum digits precision.
     *
     * Must call [[Format.Config.addUtilsToPrototype]] to be defined.
     * @param minDigits The minimum number of digits to include in the format.
     * @param maxDigits The maximum number of digits to include in the format.
     */
    toPrecisionMinMax(minDigits: number, maxDigits: number): string;
}
