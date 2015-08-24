/// <reference path="../../use-strict" />

/// <reference path="FormatProvider" />
/// <reference path="CustomFormatter" />

/// <reference path="../Errors/ArgumentNullError" />

namespace Format.Globalization {
    /**
     * Provides a mechanism for setting a specific culture (also called a *locale*) that will be used during formatting.
     *
     * Information about the culture itself and the application of overrides will be made available through this class at a later point.
     */
    export class CultureInfo implements FormatProvider {

        /** Gets the [[CultureInfo]] object that is culture-independent (invariant). */
        public static InvariantCulture: CultureInfo;

        /** Core implementation of a [[CustomFormatter]] for `Object` and `Array` instances. */
        private static objectFormatter: CustomFormatter = {
            format: (format: string, value: Object): string => value ? JSON.stringify(value) : ""
        };

        /** Fallback implementation of a [[CustomFormatter]] for any objects. */
        private static fallbackFormatter: CustomFormatter = {
            format: (format: string, value: Object): string => value != null ? value + "" : ""
        };

        protected locales: string|string[];
        protected formatters: Indexable<CustomFormatter>;

        /**
         * Initializes a new instance of the [[CultureInfo]] class based on the culture specified by *locales*.
         * @param locales The locales argument must be either a string holding a BCP 47 language tag, or an array of such language tags.
         */
        constructor(locales: string|string[]) {

            if (locales == null) {
                throw new Errors.ArgumentNullError("locales");
            }

            this.locales = locales;
            this.formatters = this.getFormatters(locales);
        }

        public getFormatter(type: string): CustomFormatter {
            return this.formatters[type] || this.getFallbackFormatter();
        }

        protected getFormatters(locales: string|string[]): Indexable<CustomFormatter> {

            var formatters: Indexable<CustomFormatter> = {};

            formatters["[object Date]"] = undefined;
            formatters["[object Number]"] = undefined;
            formatters["[object Object]"] = formatters["[object Array]"] = CultureInfo.objectFormatter;

            return formatters;
        }

        protected getFallbackFormatter(): CustomFormatter {
            return CultureInfo.fallbackFormatter;
        }
    }

    CultureInfo.InvariantCulture = new CultureInfo("");
}
