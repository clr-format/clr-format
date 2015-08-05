interface ObjectConstructor {
    /**
     * Returns the actual type of an object (unlike typeof), i.e. [object Date].
     * Must call Format.Config.addUtilsToGlobals() to be defined.
     */
    getType(object: Object): string;

    /**
     * Returns true if an object's type matches the given type argument.
     * Must call Format.Config.addUtilsToGlobals() to be defined.
     * @param type A string indicating the expected type of the object, i.e. 'Array', 'RegExp', etc.
     * @param object The object to check for matching type.
     */
    isType(type: string, object: Object): boolean;

    /**
     * Returns true if an object is a pure object instance, false if it's not.
     * Must call Format.Config.addUtilsToGlobals() to be defined.
     */
    isObject(object: Object): boolean;
}
