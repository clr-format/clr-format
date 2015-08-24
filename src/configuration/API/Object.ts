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
     * Returns the actual type of an object (unlike `typeof`), i.e. `"[object Date]"`.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param object The object to resolve for its type.
     */
    getType(object: Object): string;

    /**
     * Returns a string representing the actual type of an object, i.e. `"[object Array]"`.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param type The type to wrap into a type string.
     */
    getTypeString(type: string): string;
}
