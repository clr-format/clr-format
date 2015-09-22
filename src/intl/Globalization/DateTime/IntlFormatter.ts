/// <reference path="../../../use-strict" />

/// <reference path="IntlSpecifiersFormatter" />

/// <reference path="../../API" />

/// <reference path="../../../core/Globalization/DateTime/IntlFormatOptions" />

namespace Format.Globalization.DateTime {

    /** @private */
    let styles = Specifiers.Standard;

    /**
     * Provides culture-specific formatting for date and time values by using the Intl namespace.
     *
     * Requires the *clr-format-intl.js* sub-module to be loaded.
     */
    export class IntlFormatter extends InfoFormatter<Intl.DateTimeFormatOptions> {

        private locales: string|string[];

        /**
         * Initializes a new object that enables language sensitive date and time formatting.
         * @param locales The locales argument must be either a string holding a BCP 47 language tag, or an array of such language tags.
         * See: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
         * @param formatInfo An instance that will provide culture-specific date and time format information.
         * @param dateOptions Optional object with some or all of the standardized properties.
         * See: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
         */
        constructor(locales: string|string[], formatInfo: DateTimeFormatInfo, dateOptions?: Intl.DateTimeFormatOptions) {

            super(IntlOptionsProvider, formatInfo, dateOptions);

            if (locales == null) {
                throw new Errors.ArgumentNullError("locales");
            }

            this.locales = locales;
        }

        /**
         * Converts the date to an equivalent string representation using specified format and culture formatting information.
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

            let resolvedOptions = this.resolvedOptions;

            if (resolvedOptions.style === styles[styles.roundTrip] ||
                resolvedOptions.style === styles[styles.rfc1123] ||
                resolvedOptions.style === styles[styles.sortable] ||
                resolvedOptions.style === styles[styles.universalSortable]) {

                return super.applyOptions(value);
            }

            return this.getNativeFormatter(resolvedOptions).format(<any> value);
        }

        /** Returns the formatter instance that will be used to replace all custom date and time specifiers. */
        protected getSpecifiersFormatter(): CustomFormatter {
            return new IntlSpecifiersFormatter(
                this.formatInfo,
                (resolvedOptions: Intl.DateTimeFormatOptions) =>
                    this.getNativeFormatter(resolvedOptions));
        }

        private getNativeFormatter(resolvedOptions?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
            return <any> new Intl.DateTimeFormat(<string> this.locales, resolvedOptions);
        }
    }

    DateTimeFormatInfo.FormatterConstructor = IntlFormatter;
}
