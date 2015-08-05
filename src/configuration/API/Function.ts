interface FunctionConstructor {
    /**
     * Returns the name of a function or "anonymous" for lambda functions.
     * Must call Format.Config.addUtilsToGlobals() to be defined.
     * @param func A functional object.
     */
    getName(func: Function): string;

    /**
     * Returns an empty parameterless function. Useful as the default for optional callback arguments instead of creating new anonymous empty functions.
     * Must call Format.Config.addUtilsToGlobals() to be defined.
     */
    getEmpty<T>(): () => T;
}

interface Function {
    /**
     * Returns the name of a function or "anonymous" for lambda functions.
     * Must call Format.Config.addUtilsToPrototype() to be defined.
     */
    getName(): string;
}
