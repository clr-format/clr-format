/// <reference path="clr-format.d.ts" />
/**
 * Extends the built-in javascript `Array` object's static API.
 *
 * The [[Format.Config.addUtilsToGlobals]] method must be called in order to access the definitions.
 */
interface ArrayConstructor {
    /**
     * Returns elements from a sequence as long as the specified condition is `true`.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param T The type of elements in the array.
     * @param array An array instance.
     * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
     * @param predicate.item A source element that is tested for a condition.
     * @param predicate.index The index of the source element.
     * @returns A new array instance containing only items for which the predicate function returned `true`.
     */
    takeWhile<T>(array: T[], predicate: (item: T, index?: number) => boolean): T[];
}
/**
 * Extends the built-in javascript `Array` object's prototype.
 *
 * The [[Format.Config.addUtilsToPrototype]] method must be called in order to access the definitions.
 * @param T The type of elements in the array.
 */
interface Array<T> {
    /**
     * Returns elements from a sequence as long as the specified condition is `true`.
     *
     * Must call [[Format.Config.addUtilsToPrototype]] to be defined.
     * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
     * @param predicate.item A source element that is tested for a condition.
     * @param predicate.index The index of the source element.
     * @returns A new array instance containing only items for which the predicate function returned `true`.
     */
    takeWhile(predicate: (item: T, index?: number) => boolean): T[];
}
/**
 * Extends the built-in javascript `Object` static API.
 *
 * The [[Format.Config.addUtilsToGlobals]] method must be called in order to access the definitions.
 */
interface ObjectConstructor {
    /**
     * Returns the actual type of an object (unlike `typeof`), i.e. `"[object Date]"`.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     */
    getType(object: Object): string;
    /**
     * Returns `true` if an object's type matches the given type argument.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param type A string indicating the expected type of the object, i.e. `"Array"`, `"RegExp"`, etc.
     * @param object The object to check for matching type.
     */
    isType(type: string, object: Object): boolean;
    /**
     * Returns `true` if an object is a pure object instance.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     */
    isObject(object: Object): boolean;
}
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
}
declare module Format.Utils.Function {
    /**
     * Returns a memoized function wrapper of the function. All calls with the same arguments to the original function are cached after the first use.
     *
     * Must load the [[Format.Config]] sub-module to be defined.
     * @param T The type/signature of the original function.
     * @param func The function whose results will be cached.
     * @param resolver A cache key resolver function used to store the call arguments' list as a string key. Defaults to `JSON.stringify`.
     * @param resolver.argumentValues An array containing the call arguments for the function.
     */
    function memoize<T extends Function>(func: T, resolver?: (argumentValues: Object[]) => string): T;
}
declare module Format.Config.Definitions {
    var addUtilsToGlobals: () => void;
    var addUtilsToPrototype: () => void;
    var removeUtilGlobals: () => void;
    var removeUtilsFromPrototype: () => void;
    var addToPrototype: (bareFunction: Function, hostObject: any, name: string) => void;
}
/**
 * An internal [[Format.Config]] sub-module containing methods wrapped in a chainable API by its parent.
 *
 * Because the module and its members cannot be truly internal refrain from calling its methods directly.
 */
declare module Format.Config.Definitions {
    var addFormatToPrototype: () => void;
    var removeFormatFromPrototype: () => void;
    var addPaddingToPrototype: () => void;
    var removePaddingFromPrototype: () => void;
}
declare module Format.Config.Definitions {
    function enableMemoization(): void;
    function disableMemoization(): void;
}
/**
 * An optional sub-module which contains various configurational methods.
 *
 * All methods can be chained like `Format.Config.addFormatToPrototype().addUtilsToGlobals()...`
 */
declare module Format.Config {
    /**
     * Adds a bare function (one that does not rely on any local `this` context) to the host object's prototype.
     * @param bareFunction A function the first argument of which can be replaced by the `this` context of the host object.
     * @param hostObject A host object (usually a constructor function) the prototype of which will be updated to contain the wrapped bare function.
     * @param name The name of the new prototype method which is added, defaults to the bare function's name. Required if the bare function is anonymous.
     */
    function addToPrototype(bareFunction: Function, hostObject: Object, name?: string): typeof Config;
    /**
     * Adds the [[String.format]] function, which allows for direct instance calls like `"{0}".format(val1, val2, ...)`.
     *
     * If the first argument of such calls is an object that implements the [[FormatProvider]] interface (or more precisely has a method [[getFormatter]]):
     * - It will be used to create the formatting context (same behaviour as with normal [[StringConstructor.format]] overloads)
     * - The trailing arguments will be used as replacement values starting from 0
     */
    function addFormatToPrototype(): typeof Config;
    /** Adds the [[String.padLeft]] and [[String.padRight]] functions, which allows for direct instance calls like `"123".padLeft(5, "0")`. */
    function addPaddingToPrototype(): typeof Config;
    /** Removes the [[String.format]] prototype wrapper that is defined by calling [[addFormatToPrototype]]. */
    function removeFormatFromPrototype(): typeof Config;
    /** Removes the [[String.padLeft]] and [[String.padRight]] functions that are defined by calling [[addPaddingToPrototype]]. */
    function removePaddingFromPrototype(): typeof Config;
    /**
     * Adds all [[Format.Utils]] methods (including ones in sub-modules like [[Format.Utils.Function]]) as static methods to respective global objects.
     *
     * For example [[ObjectConstructor.getType]] will be equivallent to calling [[Format.Utils.getType]].
     * The following mapping applies:
     * - [[Format.Utils]] methods => [[ObjectConstructor]]
     * - [[Format.Utils.Function]] => [[FunctionConstructor]]
     * - [[Format.Utils.Enumerable]] => [[ArrayConstructor]]
     */
    function addUtilsToGlobals(): typeof Config;
    /** Removes the static methods from global objects that are defined by calling [[addUtilsToGlobals]]. */
    function removeUtilGlobals(): typeof Config;
    /**
     * Adds all [[Format.Utils]] sub-modules' methods as wrapped instance methods to respective global objects.
     *
     * The method's first argument must match the global object's type.
     * For example [[Function.getName]] will be wrapped to have its first argument replaced by the `this` object in the prototype version. Other arguments are shifted accordingly in the process.
     * The following mapping applies:
     * - [[Format.Utils.Function]] => [[Function]]
     * - [[Format.Utils.Enumerable]] => [[Array]]
     */
    function addUtilsToPrototype(): typeof Config;
    /** Removes the instance methods from global objects that are defined by calling [[addUtilsToPrototype]]. */
    function removeUtilsFromPrototype(): typeof Config;
    /** Enables performance improvements through memoization of key inner functions at the cost of memory. */
    function enableMemoization(): typeof Config;
    /** Disables performance improvements through memoization of key inner functions and releases the used memory. */
    function disableMemoization(): typeof Config;
}
