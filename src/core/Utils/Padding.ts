/// <reference path="../../use-strict" />

/// <reference path="../Format" />
/// <reference path="Indexable" />

/// <reference path="../Errors/ArgumentError" />
/// <reference path="../Errors/ArgumentNullError" />

module Format.Utils.Padding {
    /** Defines possible options for a string padding operation. */
    export interface Options {
        /** The number of characters in the resulting string, equal to the number of original characters plus any additional padding characters. */
        totalWidth: number;
        /** Optional padding character. Defaults to space (' '). */
        paddingChar?: string;
        /** Optional position of the padded characters relative to the original string. Defaults to Right. */
        direction?: Direction;
    }

    /** An enumeration describing the possible positioning strategies of padded characters relative to the string that's being padded. */
    export enum Direction {
        /** Position padding characters before the string. */
        Left = 1,
        /** Position padding characters after the string. */
        Right,
        /** Position padding characters before and after the string, while keeping it centered. */
        Both
    }

    /**
     * Returns a new string of a specified length in which the beginning and/or ending of the current string is padded with spaces or with a specified character.
     * @param value The string to apply padding to.
     * @param options A Padding.Options object defining the desired output.
     */
    export function pad(value: string, options: Options): string {

        if (value == null) {
            throw new Errors.ArgumentNullError("value");
        }

        setDefaultOptions(options);
        validateOptions(options);

        if (isPaddingRequired(value, options)) {
            value = directionStrategies[options.direction](value, options);
        }

        return value;
    };

    var setDefaultOptions = (options: Options) => {
        options.direction = options.direction || Direction.Right;
        options.paddingChar = options.paddingChar || " ";
    };

    var validateOptions = (options: Options) => {

        if (!isValidTotalWidth(options.totalWidth)) {
            throw new Errors.ArgumentError(String.format(
                "Option 'totalWidth' with value '{0}' must be a positive non-zero integer value",
                options.totalWidth + ""));
        }

        if (options.paddingChar.length > 1) {
            throw new Errors.ArgumentError(String.format(
                "Option 'paddingChar' with value '{0}' must be a single character string",
                options.paddingChar + ""));
        }

        if (Direction[options.direction] == null) {
            throw new Errors.ArgumentError(String.format(
                "Option 'direction' with value '{0}' must be one of Padding.Direction enum values",
                options.direction + ""));
        }
    };

    var isValidTotalWidth = (totalWidth: number) => totalWidth > 0 && totalWidth === totalWidth >> 0;

    var isPaddingRequired = (value: string, options: Options): boolean => options.totalWidth > value.length;

    var getPadWidth = (value: string, options: Options): number => options.totalWidth - value.length;

    var getPadding = (padWidth: number, options: Options): string => new Array(padWidth + 1).join(options.paddingChar);

    var directionStrategies: Indexable<(value: string, options: Options) => string> = {};

    directionStrategies[Direction.Left] = (value: string, options: Options): string =>
        getPadding(getPadWidth(value, options), options) + value;

    directionStrategies[Direction.Right] = (value: string, options: Options): string =>
        value + getPadding(getPadWidth(value, options), options);

    directionStrategies[Direction.Both] = (value: string, options: Options): string => {

        let padWidth = getPadWidth(value, options),
            right = Math.ceil(padWidth / 2),
            left = padWidth - right;

        return [
            getPadding(left, options), value, getPadding(right, options)
        ].join("");
    };
}
