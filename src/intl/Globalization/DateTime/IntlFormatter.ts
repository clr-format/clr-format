/// <reference path="../../../use-strict" />

/// <reference path="../../API" />

namespace Format.Globalization.DateTime {
    /**
     * Provides culture-specific formatting for date and time values by using the Intl namespace.
     *
     * Requires the *clr-format-intl.js* sub-module to be loaded.
     */
    export class IntlFormatter extends InvariantFormatter<Intl.DateTimeFormatOptions> {

        private locales: string|string[];
        private formatInfo: DateTimeFormatInfo;

        /**
         * Initializes a new object that enables language sensitive date and time formatting.
         * @param locales The locales argument must be either a string holding a BCP 47 language tag, or an array of such language tags.
         * See: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
         * @param formatInfo An instance that will provide culture-specific date and time format information.
         * @param dateOptions Optional object with some or all of the standardized properties.
         * See: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
         */
        constructor(locales: string|string[], formatInfo: DateTimeFormatInfo, dateOptions?: Intl.DateTimeFormatOptions) {

            super(IntlOptionsProvider, dateOptions);

            if (locales == null) {
                throw new Errors.ArgumentNullError("locales");
            }

            if (formatInfo == null) {
                throw new Errors.ArgumentNullError("formatInfo");
            }

            this.locales = locales;
            this.formatInfo = formatInfo;
        }

        /**
         * Converts the date to an equivalent string representation using specified format and invariant culture formatting information.
         * @param format A format string containing formatting specifications.
         * @param value The date to format.
         * @returns The formatted date value.
         */
        public format(formatString: string, value: Date): string {
            return super.format(formatString, value);
        }

        /**
         * Applies all resolved format options to the date object.
         * @param value The date to format.
         * @returns A resulting format value with applied format and culture-specific options.
         */
        protected applyOptions(value: Date): string {
            return this.getNativeFormatter(this.resolvedOptions).format(<any> value);
        }

        /** Returns the format info instance used for culture-specific formatting. */
        protected getFormatInfo(): DateTimeFormatInfo {
            return this.formatInfo;
        }

        private getNativeFormatter(resolvedOptions?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
            return <any> new Intl.DateTimeFormat(<string> this.locales, resolvedOptions);
        }
    }

    DateTimeFormatInfo.FormatterConstructor = IntlFormatter;
}
