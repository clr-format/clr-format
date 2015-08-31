/// <reference path="../../use-strict" />

/// <reference path="../Errors/ArgumentNullError" />

/** A [[Format.Utils]] sub-module containing methods related to enumeration operations. */
namespace Format.Utils.Enumerable {
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

    /**
     * Removes "holes" (`undefined` elements) from the array making it compact/dense.
     * @param T The type of elements in the array.
     * @param array An array instance.
     * @returns The same array instance without `undefined` elements.
     */
    export function compact<T>(array: T[]): T[] {

        if (array == null) {
            throw new Errors.ArgumentNullError("array");
        }

        let j = 0;

        for (let i = 0, len = array.length; i < len; i += 1) {
            if (array[i] !== undefined) {
                array[j] = array[i];
                j += 1;
            }
        }

        array.length = j;

        return array;
    }
}
