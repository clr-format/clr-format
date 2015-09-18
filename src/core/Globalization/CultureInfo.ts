/// <reference path="../../use-strict" />

/// <reference path="FormatProvider" />
/// <reference path="CustomFormatter" />
/// <reference path="DateTimeFormatInfo" />
/// <reference path="NumberFormatInfo" />

/// <reference path="../Utils/Types" />
/// <reference path="../Errors/ArgumentNullError" />

namespace Format.Globalization {
    /**
     * Provides a mechanism for setting a specific culture (also called a *locale*) that will be used during formatting.
     *
     * Information about the culture itself and the application of overrides will be made available through this class at a later point.
     *
     * See: https://msdn.microsoft.com/library/system.globalization.cultureinfo.aspx
     */
    export class CultureInfo implements FormatProvider {

        /** Gets or sets the [[CultureInfo]] object that represents the culture used by the current context. */
        public static CurrentCulture: CultureInfo;

        /** Gets the [[CultureInfo]] object that is culture-independent (invariant). */
        public static InvariantCulture: CultureInfo;

        /** Core implementation of a [[CustomFormatter]] for `Object` and `Array` instances. */
        private static objectFormatter: CustomFormatter = {
            /**
             * Converts the value of the given object using `JSON.stringify`.
             * @param value An object to format.
             */
            format: (format: string, value: Object): string => value ? JSON.stringify(value) : ""
        };

        /** Fallback implementation of a [[CustomFormatter]] for any objects. */
        private static fallbackFormatter: CustomFormatter = {
            /**
             * Converts the value of the given object using the `+ ""` operator.
             * @param value An object to format.
             */
            format: (format: string, value: Object): string => value != null ? value + "" : ""
        };

        /** Gets or sets a [[DateTimeFormatInfo]] that defines the culturally appropriate format of displaying dates and times. */
        public DateTimeFormat: DateTimeFormatInfo;

        /** Gets or sets a [[NumberFormatInfo]] that defines the culturally appropriate format of displaying numbers, currency, and percentage. */
        public NumberFormat: NumberFormatInfo;

        protected locales: string|string[];
        protected formatters: Indexable<CustomFormatter>;

        /**
         * Initializes a new instance of the [[CultureInfo]] class based on the culture specified by *locales*.
         * @param locales The locales argument must be either a string holding a [BCP 47 language tag](http://tools.ietf.org/html/rfc5646), or an array of such language tags.
         */
        constructor(locales: string|string[]) {

            if (locales == null) {
                throw new Errors.ArgumentNullError("locales");
            }

            this.locales = locales;

            this.DateTimeFormat = new DateTimeFormatInfo(locales);
            this.NumberFormat = new NumberFormatInfo(locales);

            this.formatters = this.getFormatters(locales);
        }

        public getFormatter(type: string): CustomFormatter {
            return this.formatters[type] || this.getFallbackFormatter();
        }

        protected getFormatters(locales: string|string[]): Indexable<CustomFormatter> {

            let formatters: Indexable<CustomFormatter> = {};

            formatters[Utils.Types.Date] = this.DateTimeFormat.getFormatter(Utils.Types.Date);
            formatters[Utils.Types.Number] = this.NumberFormat.getFormatter(Utils.Types.Number);
            formatters[Utils.Types.Object] = formatters[Utils.Types.Array] = CultureInfo.objectFormatter;

            return formatters;
        }

        protected getFallbackFormatter(): CustomFormatter {
            return CultureInfo.fallbackFormatter;
        }
    }

    CultureInfo.CurrentCulture = CultureInfo.InvariantCulture = new CultureInfo("");
}
