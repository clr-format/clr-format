/// <reference path="CustomFormatter" />

module Format.Globalization {
    /**
     * Provides a mechanism for retrieving an object which contains resolved formatting options.
     * @param TOptions The type of the options container.
     * @param TValue The type of the value object.
     */
    export interface OptionsProvider<TOptions, TValue> {
        /**
         * Returns an object that provides formatting options for the specified type.
         * @param format A format string containing formatting specifications.
         * @param value The value object from which to infer additional options.
         */
        resolveOptions(format: string, value: TValue): TOptions;
    }
}
