/// <reference path="CustomFormatter" />

module Format.Globalization {
    /**
     * Provides a mechanism for retrieving an object which contains resolved formatting options.
     * @param TOptions The type of the options container.
     * @param TValue The type of the value object.
     */
    export interface OptionsProvider<TOptions, TValue> {
        /**
         * Returns an object that provides formatting options of the specified type.
         * @param formatString A format string containing formatting specifications.
         * @param value An object from which to infer additional options.
         */
        resolveOptions(formatString: string, value: TValue): TOptions;
    }
}
