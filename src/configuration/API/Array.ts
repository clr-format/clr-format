interface ArrayConstructor {
    /**
     * Returns elements from a sequence as long as the specified condition is true.
     * Must call Format.Config.addUtilsToGlobals() to be defined.
     * @param array An array instance.
     * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
     */
    takeWhile<T>(array: T[], predicate: (item: T, index?: number) => boolean): T[];
}

interface Array<T> {
    /**
     * Returns elements from a sequence as long as the specified condition is true.
     * Must call Format.Config.addUtilsToPrototype() to be defined.
     * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
     */
    takeWhile(predicate: (item: T, index?: number) => boolean): T[];
}
