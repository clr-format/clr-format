/// <reference path="../../use-strict" />

/// <reference path="Types" />
/// <reference path="Numeric" />

/// <reference path="../Errors/ArgumentError" />
/// <reference path="../Errors/ArgumentNullError" />

/* tslint:disable:no-bitwise */

/** A [[Format.Utils]] sub-module containing methods intended to act as polyfills. */
declare namespace Format.Utils.Polyfill {
    /**
     * Returns `true` if an object is an array; otherwise `false`.
     * @param object The object to test.
     */
    function isArray(object: Object): boolean;

    /**
     * Removes the leading and trailing white space and line terminator characters from a string.
     * @param value The string to trim.
     */
    function trim(value: string): string;
}

namespace Format.Utils.Polyfill {
    /**
     * Returns the first index at which a given element can be found in the array, or -1 if it is not present.
     * @param array An array instance.
     * @param searchElement The element to search for.
     * @param fromIndex The index to start the search at.
     */
    export function indexOf<T>(array: T[], searchElement: T, fromIndex?: number): number {

        if (array == null) {
            throw new Errors.ArgumentNullError("array");
        }

        fromIndex = +fromIndex || 0;

        if (!Numeric.isInteger(fromIndex)) {
            throw new Errors.ArgumentError(`Argument 'fromIndex' with value '${fromIndex}' must be an integer`);
        }

        if (array.indexOf) {
            return array.indexOf(searchElement, fromIndex);
        }

        return indexOfPolyfill(array, searchElement, fromIndex);
    };

    /**
     * Returns a supplied numeric expression rounded to the exponent number.
     * @param value The number to format.
     * @param exponent The exponent which to use as a rounding base.
     */
    export function round(value: number, exponent: number): number {

        if (value == null) {
            throw new Errors.ArgumentNullError("value");
        }

        exponent = exponent >> 0;
        if (!exponent || !isFinite(value)) {
            return Math.round(value);
        }

        let sign = value >= 0 ? 1 : -1;
        value = Math.round(shiftValue(value * sign, -exponent));

        return shiftValue(value, exponent) * sign;
    };

    /** @private */
    var shiftValue = (value: number, exponent: number): number => {

        let valueParts = (value + "").split("e");

        if (valueParts[1]) {
            exponent += +valueParts[1];
        }

        return +(valueParts[0] + "e" + exponent);
    };

    // IE8 rounding workaround
    if (+(0.005).toFixed(2) === 0) {
        let originalToFixed = Number.prototype.toFixed;
        Number.prototype.toFixed = function(fractionDigits: number): string {
            return originalToFixed.call(round(this, -fractionDigits), fractionDigits) + "";
        };
    }

    /** @private */
    var indexOfPolyfill = <T>(array: T[], searchElement: T, fromIndex: number): number => {

        let arrayObject = Object(array),
            length = arrayObject.length >>> 0;

        if (length === 0 || fromIndex >= length) {
            return -1;
        }

        for (let index = getIndexOfStartIndex(fromIndex, length); index < length; index += 1) {
            if (index in arrayObject && arrayObject[index] === searchElement) {
                return index;
            }
        }

        return -1;
    };

    /** @private */
    var getIndexOfStartIndex = (fromIndex: number, length: number): number => {

        if (fromIndex < 0) {
            fromIndex += length;
        }

        return Math.max(0, fromIndex);
    };

    Polyfill.isArray = Array.isArray || function(object: Object): boolean {
        return getType(object) === Types.Array;
    };

    Polyfill.trim = "".trim ?
        (value: string): string => {
            validateValueArgument(value);
            return value.trim();
        } :
        (value: string): string => {
            validateValueArgument(value);
            return value.replace(trimWhitespaceRegExp, "");
        };

    /** @private */
    var validateValueArgument = (value: string): void => {
        if (value == null) {
            throw new Errors.ArgumentNullError("value");
        }
    };

    /** @private */
    var trimWhitespaceRegExp = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
}
