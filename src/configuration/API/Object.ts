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
     * @param T The type of object to update.
     * @param object The object to fill with the mapped unique values as keys.
     * @returns A new object with all of the original and inverted properties.
     */
    mapValuesAsKeys<T>(object: T): T;

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
