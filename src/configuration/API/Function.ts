/**
 * Extends the built-in javascript `Function` object's static API.
 *
 * The [[Format.Config.addUtilsToGlobals]] method must be called in order to access the definitions.
 */
interface FunctionConstructor {
    /**
     * Returns a memoized function wrapper of the function. All calls with the same arguments to the original function are cached after the first use.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param T The type/signature of the original function.
     * @param func The function whose results will be cached.
     * @param resolver A cache key resolver function used to store the call arguments' list as a string key. Defaults to `JSON.stringify`.
     * @param resolver.argumentValues An array containing the call arguments for the function.
     */
    memoize<T extends Function>(func: T, resolver?: (argumentValues: Object[]) => string): T;

    /**
     * Returns the name of a function.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param func A functional object.
     * @returns The name of a function or `"anonymous"` for lambda functions.
     */
    getName(func: Function): string;

    /**
     * Returns the rightmost accessor's name of the function's first returned variable.
     *
     * For example a return expression like `return this.field;` will yield `"field"` as a value.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param func A functional object.
     * @return The text of the last literal contained in the first return expression of the function.
     */
    getReturnName(func: Function): string;

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

    /** If the function is memoized, contains the current function calls' cached results. */
    cache: Indexable<Object>;

    /**
     * Returns a memoized function wrapper of the function. All calls with the same arguments to the original function are cached after the first use.
     *
     * Must call [[Format.Config.addUtilsToPrototype]] to be defined.
     * @param resolver A cache key resolver function used to store the call arguments' list as a string key. Defaults to `JSON.stringify`.
     * @param resolver.argumentValues An array containing the call arguments for the function.
     */
    memoize(resolver?: (argumentValues: Object[]) => string): Function;

    /**
     * Returns the name of a function.
     *
     * Must call [[Format.Config.addUtilsToPrototype]] to be defined.
     * @returns The name of a function or `"anonymous"` for lambda functions.
     */
    getName(): string;

    /**
     * Returns the rightmost accessor's name of the function's first returned variable.
     *
     * For example a return expression like `return this.field;` will yield `"field"` as a value.
     *
     * Must call [[Format.Config.addUtilsToPrototype]] to be defined.
     * @return The text of the last literal contained in the first return expression of the function.
     */
    getReturnName(): string;
}
