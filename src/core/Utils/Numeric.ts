/// <reference path="../../use-strict" />

/// <reference path="Harmony" />

/// <reference path="../Errors/ArgumentError" />

/* tslint:disable:no-bitwise */

/** A [[Format.Utils]] sub-module containing methods related to numeric operations. */
namespace Format.Utils.Numeric {

    /** @private */
    let isIntegerPolyfill = Number.isInteger || function(value: number): boolean {
        return value === value >> 0;
    };

    /**
     * Determines whether the passed value is an integer.
     * @param value The number to test.
     * @returns `true` if the value parameter is an integer.
     */
    export function isInteger(value: number): boolean {
        return isIntegerPolyfill(value);
    }

    /**
     * Determines whether the passed value is a counting number (positive integer excluding `0`).
     * @param value The number to test.
     * @returns `true` if the value parameter is a positive integer excluding `0`.
     */
    export function isCounting(value: number): boolean {
        return value > 0 && isIntegerPolyfill(value);
    }

    /**
     * Determines whether the passed value is a whole number (positive integer including `0`).
     * @param value The number to test.
     * @returns `true` if the value parameter is a positive integer including `0`.
     */
    export function isWhole(value: number): boolean {
        return value >= 0 && isIntegerPolyfill(value);
    }

    /**
     * Determines whether the passed value is an even number.
     *
     * Throws an error if the value is not an integer (when [[isInteger]] returns `false`).
     * @param value The number to test.
     * @returns `true` if the value parameter is an even number.
     */
    export function isEven(value: number): boolean {

        if (!isIntegerPolyfill(value)) {
            throw new Errors.ArgumentError("Argument 'value' must be an integer");
        }

        return (value & 1) === 0;
    }
}
