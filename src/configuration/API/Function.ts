/**
 * Extends the built-in javascript `Function` object's static API.
 *
 * The [[Format.Config.addUtilsToGlobals]] method must be called in order to access the definitions.
 */
interface FunctionConstructor {
    /**
     * Returns the name of a function.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param func A functional object.
     * @returns The name of a function or `"anonymous"` for lambda functions.
     */
    getName(func: Function): string;

    /**
     * Returns an empty parameterless function which returns `undefined`. Useful for defaulting optional callback arguments instead of creating new anonymous empty functions.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param T The return type of the empty callback.
     */
    getEmpty<T>(): () => T;
}

/**
 * Extends the built-in javascript `Function` object's prototype.
 *
 * The [[Format.Config.addUtilsToPrototype]] method must be called in order to access the definitions.
 */
interface Function {
    /**
     * Returns the name of a function.
     *
     * Must call [[Format.Config.addUtilsToPrototype]] to be defined.
     * @returns The name of a function or `"anonymous"` for lambda functions.
     */
    getName(): string;
}
