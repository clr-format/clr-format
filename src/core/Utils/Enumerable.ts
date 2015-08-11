/// <reference path="../../use-strict" />

/// <reference path="../Errors/ArgumentNullError" />

module Format.Utils.Enumerable {
    /**
     * Returns elements from a sequence as long as the specified condition is true.
     * @param array An array instance.
     * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
     */
    export function takeWhile<T>(array: T[], predicate: (item: T, index?: number) => boolean): T[] {

        if (array == null) {
            throw new Errors.ArgumentNullError("array");
        }

        if (typeof predicate !== "function") {
            throw new TypeError("Cannot call method 'takeWhile' without a predicate function");
        }

        let result: T[] = [];

        for (let i = 0, len = array.length; i < len; i += 1) {
            if (!predicate(array[i], i)) { break; }

            result.push(array[i]);
        }

        return result;
    }
}
