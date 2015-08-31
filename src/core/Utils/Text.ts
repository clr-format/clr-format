/// <reference path="../../use-strict" />

/// <reference path="../Errors/ArgumentNullError" />

/** A [[Format.Utils]] sub-module containing methods related to text operations. */
namespace Format.Utils.Text {
    /**
     * Indicates whether the specified string is `undefined`, `null`, `""`, or consists only of white-space characters.
     * @param value The string to test.
     * @returns `true` if the value parameter is `undefined`, `null`, `""`, or if value consists exclusively of white-space characters.
     */
    export function isNullOrWhitespace(value: string): boolean {
        return !(value && Polyfill.trim(value).length > 0);
    }

    /**
     * Returns a new string in which a specified string is inserted at a specified index position in the value instance.
     * @param value The string into which to insert.
     * @param startIndex The zero-based index position of the insertion.
     * @param insertValue The string to insert.
     * @returns A new string that is equivalent to the value instance, but with insertValue inserted at position startIndex.
     */
    export function insert(value: string, startIndex: number, insertValue: string): string {

        if (value == null) {
            throw new Errors.ArgumentNullError("value");
        }

        if (startIndex == null) {
            throw new Errors.ArgumentNullError("startIndex");
        }

        if (insertValue == null) {
            throw new Errors.ArgumentNullError("insertValue");
        }

        if (startIndex < 0 || startIndex > value.length || isNaN(startIndex)) {
            throw RangeError(`Argument 'startIndex=${startIndex}' is not an index inside of 'value="${value}"'`);
        }

        return value.substring(0, startIndex) + insertValue + value.substring(startIndex);
    }
}
