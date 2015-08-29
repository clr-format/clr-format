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
    /**
     * Removes "holes" (`undefined` elements) from the array making it compact/dense.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param T The type of elements in the array.
     * @param array An array instance.
     * @returns The same array instance without `undefined` elements.
     */
    compact<T>(array: T[]): T[];
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
    /**
     * Removes "holes" (`undefined` elements) from the array making it compact/dense.
     *
     * Must call [[Format.Config.addUtilsToPrototype]] to be defined.
     * @returns The same array instance without `undefined` elements.
     */
    compact(): T[];
}
/**
 * Extends the built-in javascript `Object` static API.
 *
 * The [[Format.Config.addUtilsToGlobals]] method must be called in order to access the definitions.
 */
interface ObjectConstructor {
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
     * @param object The object to test.
     */
    isObject(object: Object): boolean;
    /**
     * Returns the actual type of an object (unlike `typeof`), see [[Utils.Types]].
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param object The object to resolve for its type.
     */
    getType(object: Object): string;
    /**
     * Returns `true` if an object is empty (contains no enumerable properties).
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param object The object to test.
     */
    isEmpty(object: Object): boolean;
    /**
     * Maps the given object's values as keys with their keys as values and returns the extended object.
     *
     * Throws an error if the operation results in key duplication or keys with 'undefined' or 'null' values.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param T The type of indexable object to update.
     * @param object The object to fill with the mapped unique values as keys.
     * @returns The same instance that was passed as the object parameter updated with the new unique keys.
     */
    mapValuesAsKeys<T extends Indexable<number | string | symbol | RegExp> | string[]>(object: T): T;
    /**
     * Merge the contents of two or more objects together into the first object.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param T The type of the object to merge into.
     * @param target An object that will receive the new properties.
     * @param object An object containing additional properties to merge in.
     * @param objects A list of arguments that consists of more objects that contain additional properties to merge in.
     */
    extend<T>(target: T, object: Object, ...objects: Object[]): T;
    /**
     * Recursivelly merge the contents of two or more objects together into the first object.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param T The type of the object to merge into.
     * @param target An object that will receive the new properties.
     * @param object An object containing additional properties to merge in.
     * @param objects A list of arguments that consists of more objects that contain additional properties to merge in.
     */
    deepExtend<T>(target: T, object: Object, ...objects: Object[]): T;
    /**
     * Creates a new object that is a shallow or deep copy of the current instance.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param T The type of the cloned object.
     * @param object The object to clone.
     * @param deep A flag specifying whether the result should be a deep copy or not.
     */
    clone<T>(object: T, deep?: boolean): T;
    /**
     * Creates a new data object that is a deep data copy of the current instance.
     *
     * Non-data property values (functions or undefined) are **NOT** copied. In arrays any non-copy value is left as `null` so as to preserve the original indexing.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param T The type of the cloned object.
     * @param object The data object to clone.
     */
    fastClone<T>(object: T): T;
    /**
     * Removes all properties with `null` or `undefined` values.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param T The type of the object to remove from.
     * @param object The object to remove from.
     * @param deep Optional flag specifying whether the removal should be recursive.
     * @returns The same object instance without `null` or `undefined` elements.
     */
    removeUndefined<T>(object: T, deep?: boolean): T;
    /**
     * Removes all properties with `null`, `undefined` or `""` values.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param T The type of the object to remove from.
     * @param object The object to remove from.
     * @param deep Optional flag specifying whether the removal should be recursive.
     * @returns The same object instance without `null`, `undefined` or `""` elements.
     */
    removeEmpty<T>(object: T, deep?: boolean): T;
    /**
     * Removes all properties with falsy values (`null`, `undefined`, `""` or `0`).
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param T The type of the object to remove from.
     * @param object The object to remove from.
     * @param deep Optional flag specifying whether the removal should be recursive.
     * @returns The same object instance without falsy elements.
     */
    removeFalsy<T>(object: T, deep?: boolean): T;
}
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
 * The [[Format.Config.addUtilsToPrototype]] method must be called in order to access the definitions.
 */
interface Number {
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
     * @returns The name of a function or `""` for lambda functions.
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
     * @returns The name of a function or `""` for lambda functions.
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
 * Because the module and its members cannot be truly internal, refrain from calling its methods directly.
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
     * Adds all [[Format.Utils]] methods (including ones in sub-modules like [[Format.Utils.Function]]) as static methods to respective built-in types.
     *
     * For example [[ObjectConstructor.getType]] will be equivallent to calling [[Format.Utils.getType]].
     * The following mapping applies:
     * - [[Format.Utils]] methods => [[ObjectConstructor]]
     * - [[Format.Utils.Text]] => [[StringConstructor]]
     * - [[Format.Utils.Numeric]] => [[NumberConstructor]]
     * - [[Format.Utils.Function]] => [[FunctionConstructor]]
     * - [[Format.Utils.Enumerable]] => [[ArrayConstructor]]
     */
    function addUtilsToGlobals(): typeof Config;
    /** Removes the static methods from global objects that are defined by calling [[addUtilsToGlobals]]. */
    function removeUtilGlobals(): typeof Config;
    /**
     * Adds some [[Format.Utils]] sub-modules' methods as wrapped instance methods to respective built-in types.
     *
     * The method's first argument must match the global object's type.
     * For example [[Function.getName]] will be wrapped to have its first argument replaced by the `this` object in the prototype version. Other arguments are shifted accordingly in the process.
     * The following mapping applies:
     * - [[Format.Utils.Text]] => [[String]]
     * - [[Format.Utils.Numeric]] => [[Number]]
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
