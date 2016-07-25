/// <reference path="../../use-strict" />

/// <reference path="Harmony" />

/// <reference path="../Errors/ArgumentError" />

/* tslint:disable:no-bitwise */

/** A [[Format.Utils]] sub-module containing methods related to numeric operations. */
declare namespace Format.Utils.Numeric {
    /**
     * Determines whether the passed value is an integer.
     * @param value The number to test.
     * @returns `true` if the value parameter is an integer.
     */
    function isInteger(value: number): boolean;
}

namespace Format.Utils.Numeric {

    /**
     * Determines whether the passed value is a counting number (positive integer excluding `0`).
     * @param value The number to test.
     * @returns `true` if the value parameter is a positive integer excluding `0`.
     */
    export function isCounting(value: number): boolean {
        return value > 0 && isInteger(value);
    }

    /**
     * Determines whether the passed value is a whole number (positive integer including `0`).
     * @param value The number to test.
     * @returns `true` if the value parameter is a positive integer including `0`.
     */
    export function isWhole(value: number): boolean {
        return value >= 0 && isInteger(value);
    }

    /**
     * Determines whether the passed value is an even number.
     *
     * Throws an error if the value is not an integer (when [[isInteger]] returns `false`).
     * @param value The number to test.
     * @returns `true` if the value parameter is an even number.
     */
    export function isEven(value: number): boolean {

        if (!isInteger(value)) {
            throw new Errors.ArgumentError("Argument 'value' must be an integer");
        }

        return (value & 1) === 0;
    }

    Numeric.isInteger = Number.isInteger || function (value: number): boolean {
        return value !== null && value === value >> 0;
    };

    /**
     * Returns the best fitting formatted value, returned by the `Number.toFixed` method, given a minimum and/or maximum digits precision.
     * @param value The number to format.
     * @param minDigits The minimum number of digits to include in the format.
     * @param maxDigits The maximum number of digits to include in the format.
     */
    export function toFixedMinMax(value: number, minDigits: number, maxDigits: number): string {
        return toMinMax(getToFixedHandler(value), minDigits, maxDigits);
    }

    /**
     * Returns the best fitting formatted value, returned by the `Number.toExponential` method, given a minimum and/or maximum digits precision.
     * @param value The number to format.
     * @param minDigits The minimum number of digits to include in the format.
     * @param maxDigits The maximum number of digits to include in the format.
     */
    export function toExponentialMinMax(value: number, minDigits: number, maxDigits: number): string {
        return toMinMax(getToExponentialHandler(value), minDigits, maxDigits);
    }

    /**
     * Returns the best fitting formatted value, returned by the `Number.toPrecision` method, given a minimum and/or maximum digits precision.
     * @param value The number to format.
     * @param minDigits The minimum number of digits to include in the format.
     * @param maxDigits The maximum number of digits to include in the format.
     */
    export function toPrecisionMinMax(value: number, minDigits: number, maxDigits: number): string {
        return toMinMax(getToPrecisionHandler(value), minDigits, maxDigits);
    }

    /** An interface servicing similar [[toMinMax]] method implementations that differ by the wrapped delegate function. */
    interface NumberHandler {
        /** A number precision format handler function that contains a value to call in its closure. */
        delegate: (digits: number) => string;
        /** The minimum number of digits to include in the format if maximum such are specified. */
        defaultMinDigits: number;
    }

    /** @private */
    var toMinMax = (numberHandler: NumberHandler, minDigits: number, maxDigits: number): string => {

        if (minDigits == null) { minDigits = undefined; }
        if (maxDigits == null) { maxDigits = undefined; }

        if (minDigits === undefined && maxDigits !== undefined) {
            minDigits = numberHandler.defaultMinDigits;
        }

        validateToMinMaxDigitsArguments(numberHandler, minDigits, maxDigits);

        return applyMinMax(numberHandler, minDigits, maxDigits);
    };

    /** @private */
    var validateToMinMaxDigitsArguments = (numberHandler: NumberHandler, minDigits: number, maxDigits: number) => {

        if (minDigits !== undefined && !isFinite(minDigits)) {
            throw new Errors.ArgumentError("Argument 'minDigits' cannot be NaN or infinite");
        }

        if (maxDigits !== undefined && !isFinite(maxDigits)) {
            throw new Errors.ArgumentError("Argument 'maxDigits' cannot be NaN or infinite");
        }

        if (minDigits > maxDigits) {
            throw new RangeError(`Argument 'minDigits=${minDigits}' cannot be greater than argument 'maxDigits=${maxDigits}'`);
        }

        if (maxDigits - minDigits > 20) {
            throw new RangeError(`The difference between arguments 'minDigits=${minDigits}' and 'maxDigits=${maxDigits}' cannot exceed 20`);
        }
    };

    /** @private */
    var applyMinMax = (numberHandler: NumberHandler, minDigits: number, maxDigits: number): string => {

        let maxValue = numberHandler.delegate(maxDigits);
        if (minDigits === maxDigits) {
            return maxValue;
        }

        let targetValue = +maxValue,
            minValue = numberHandler.delegate(minDigits);

        if (targetValue === +minValue) {
            return minValue;
        }

        return iterateMinMax(numberHandler, { minDigits, maxDigits, targetValue }) || maxValue;
    };

    /** @private */
    var iterateMinMax = (numberHandler: NumberHandler, options: { minDigits: number, maxDigits: number, targetValue: number }) => {
        for (let i = options.minDigits + 1; i < options.maxDigits; i += 1) {
            let minValue = numberHandler.delegate(i);
            if (options.targetValue === +minValue) {
                return minValue;
            }
        }
    };

    /** @private */
    var getToFixedHandler = (value: number): NumberHandler => {

        validateValueArgument(value);

        return {
            defaultMinDigits: 0,
            delegate: (digits: number): string => digits != null ?
                value.toFixed(digits) :
                value.toString()
        };
    };

    /** @private */
    var getToExponentialHandler = (value: number): NumberHandler => {

        validateValueArgument(value);

        return {
            defaultMinDigits: 0,
            delegate: (digits: number): string => digits !== undefined ?
                value.toExponential(digits) :
                value.toExponential()
        };
    };

    /** @private */
    var getToPrecisionHandler = (value: number): NumberHandler => {

        validateValueArgument(value);

        return {
            defaultMinDigits: 1,
            delegate: (digits: number): string => digits !== null ?
                value.toPrecision(digits) :
                value.toPrecision()
        };
    };

    /** @private */
    var validateValueArgument = (value: number): void => {
        if (value == null) {
            throw new Errors.ArgumentNullError("value");
        }

        if (!isFinite(value)) {
            throw new Errors.ArgumentError("Argument 'value' cannot be NaN or infinite");
        }
    };
}
