/// <reference path="../../../use-strict" />

/// <reference path="../OptionsProvider" />

/** A [[Format.Globalization]] sub-module containing classes related to date and time format operations. */
namespace Format.Globalization.DateTime {
    /**
     * Provides a mechanism for retrieving concrete date and time formatting options.
     * @param TOptions The type of the options container.
     */
    export interface OptionsProvider<TOptions> extends Globalization.OptionsProvider<TOptions, Date> {
        /** Returns the formatting style to use. */
        getStyle(): string;
        useUTC(): boolean;
    }
}
