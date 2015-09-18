/// <reference path="../../../use-strict" />

/// <reference path="IntlFormatOptions" />
/// <reference path="OptionsProvider" />

/// <reference path="../../Utils/Clone" />

namespace Format.Globalization.DateTime {
    /**
     * An [[OptionsProvider]] implementation that handles both [Standard Date and Time Format Strings](https://msdn.microsoft.com/library/az4se3k1.aspx) and
     * [Custom Date and Time Format Strings](https://msdn.microsoft.com/library/8kb3ddd4.aspx). The type of the returned options object is an
     * extended version of [Intl.DateTimeFormat's options](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat#Parameters) parameter.
     */
    export class IntlOptionsProvider implements OptionsProvider<Intl.DateTimeFormatOptions> {

        private resolvedOptions: Intl.DateTimeFormatOptions;

        /**
         * Creates an instance with base formatting options which will be extended and/or overridden by resolved options.
         * @param dateTimeOptions A base options object containing properties defined for the Intl.DateTimeFormat's options parameter.
         */
        constructor(dateTimeOptions: Intl.DateTimeFormatOptions) {
            this.resolvedOptions = Utils.clone(dateTimeOptions);
        }

        /**
         * Returns an object that provides date and time formatting options resolved from date and time format specifiers.
         * @param format A format string containing formatting specifications.
         * @param value The value object from which to infer additional options.
         */
        public resolveOptions(format: string, value: Date): Intl.DateTimeFormatOptions {
            return this.resolvedOptions;
        }
    }
}
