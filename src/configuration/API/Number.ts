/**
 * Extends the built-in javascript `Number` object's static API.
 *
 * The [[Format.Config.addUtilsToGlobals]] method must be called in order to access the definitions.
 */
interface NumberConstructor {
    /**
     * Determines whether the passed value is an integer.
     * @param value The number to test.
     * @returns `true` if the value parameter is an integer.
     */
    isInteger(value: number): boolean;

    /**
     * Determines whether the passed value is a counting number (positive integer excluding `0`).
     * @param value The number to test.
     * @returns `true` if the value parameter is a positive integer excluding `0`.
     */
    isCounting(value: number): boolean;

    /**
     * Determines whether the passed value is a whole number (positive integer including `0`).
     * @param value The number to test.
     * @returns `true` if the value parameter is a positive integer including `0`.
     */
    isWhole(value: number): boolean;

    /**
     * Determines whether the passed value is an even number.
     *
     * Throws an error if the value is not an integer (when [[isInteger]] returns `false`).
     * @param value The number to test.
     * @returns `true` if the value parameter is an even number.
     */
    isEven(value: number): boolean;
}

/**
 * Extends the built-in javascript `Number` object's prototype.
 *
 * The [[Format.Config.addUtilsToPrototype]] method must be called in order to access the definitions.
 */
interface Number {
    /**
     * Determines whether the value is an integer.
     * @returns `true` if the value is an integer.
     */
    isInteger(): boolean;

    /**
     * Determines whether the passed value is a counting number (positive integer excluding `0`).
     * @returns `true` if the value is a positive integer excluding `0`.
     */
    isCounting(): boolean;

    /**
     * Determines whether the passed value is a whole number (positive integer including `0`).
     * @returns `true` if the value is a positive integer including `0`.
     */
    isWhole(): boolean;

    /**
     * Determines whether the value is an even number.
     *
     * Throws an error if the value is not an integer (when [[isInteger]] returns `false`).
     * @returns `true` if the value is an even number.
     */
    isEven(): boolean;
}
