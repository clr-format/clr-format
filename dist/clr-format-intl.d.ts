/// <reference path="clr-format.d.ts" />
declare module Format.Utils.IntlResovlers {
    /**
     * Sets resolved number format info options to the formatInfo instance.
     * @param formatInfo An instance that will provide culture-specific number format information.
     * @param numberSampler An Intl.NumberFormat instance that is set to sample decimal styled numbers.
     * @param currencySampler An Intl.NumberFormat instance that is set to sample currency styled numbers.
     */
    function setNumberFormatInfo(formatInfo: Globalization.NumberFormatInfo, decimalSampler: Intl.NumberFormat, currencySampler: Intl.NumberFormat): void;
    /**
     * Returns the currency decimal digits defined in the currenty format info instance or the one that matches the curreny currency.
     * @param formatInfo An instance that provides culture-specific number format information.
     * @param currencyCode The currency code.
     */
    function getCurrencyDecimalDigits(formatInfo: Globalization.NumberFormatInfo, currencyCode: string): number;
    /**
     * Returns a culture-variant version of the given invariantly formatted string. Matches decimal separators and negative signs for the callback.
     * @param invariantlyFormattedString An invariantly formatted string to replace with culture-specific symbols.
     * @param replaceInvariantSymbolsCallback A function that handles the symbol replacement.
     */
    function applyNumberCultureFormatting(invariantlyFormattedString: string, replaceInvariantSymbolsCallback: (replaceChar: string) => string): string;
}
declare module Format.Globalization.Numeric {
    /**
     * Provides culture-specific formatting for numeric values by using the Intl namespace.
     *
     * Requires the *clr-format-intl.js* sub-module to be loaded.
     */
    class IntlFormatter extends InvariantFormatter<Intl.NumberFormatOptions> {
        private locales;
        private formatInfo;
        /** Possible values are:
         * - "decimal" for plain number formatting (acts as override for "fixed-point", "number" or "undefined");
         * - "currency" for currency formatting;
         * - "percent" for percent formatting;
         */
        private supportedStyles;
        /**
         * Initializes a new object that enables language sensitive number formatting.
         * @param locales The locales argument must be either a string holding a BCP 47 language tag, or an array of such language tags.
         * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
         * @param formatInfo An instance that will provide culture-specific number format information.
         * @param numberOptions An object with some or all of the standardized properties.
         * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
         */
        constructor(locales: string | string[], formatInfo: NumberFormatInfo, numberOptions?: Intl.NumberFormatOptions);
        /**
         * Converts the number to an equivalent string representation using specified format and invariant culture formatting information.
         * @param format A format string containing formatting specifications.
         * @param value The number to format.
         */
        format(formatString: string, value: number): string;
        /**
         * Applies all resolved format options to the number.
         * @param value The number to format.
         * @returns A resulting format value with applied format and culture-specific options.
         */
        protected applyOptions(value: number): string;
        /** Returns the format info instance used for culture-specific formatting. */
        protected getFormatInfo(): NumberFormatInfo;
        private setResolvedFormatInfo(formatInfo);
        private overrideOptions(overrideStyle);
        private overrideCurrencyOptions();
        private overrideDecimalOptions();
        private overrideFractionDigits(overrideValue);
        private getNativeFormatter(resolvedOptions);
        private applyCultureSpecificFormatting(invariantlyFormattedString);
        private replaceInvariantSymbols;
    }
}
declare module Format.Globalization.DateTime {
    /**
     * Provides culture-specific formatting for date and time values by using the Intl namespace.
     *
     * Requires the *clr-format-intl.js* sub-module to be loaded.
     */
    class IntlFormatter extends InvariantFormatter<Intl.DateTimeFormatOptions> {
        private locales;
        private formatInfo;
        /**
         * Initializes a new object that enables language sensitive date and time formatting.
         * @param locales The locales argument must be either a string holding a BCP 47 language tag, or an array of such language tags.
         * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
         * @param formatInfo An instance that will provide culture-specific date and time format information.
         * @param dateOptions Optional object with some or all of the standardized properties.
         * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
         */
        constructor(locales: string | string[], formatInfo: DateTimeFormatInfo, dateOptions?: Intl.DateTimeFormatOptions);
        /**
         * Converts the date to an equivalent string representation using specified format and invariant culture formatting information.
         * @param format A format string containing formatting specifications.
         * @param value The date to format.
         */
        format(formatString: string, value: Date): string;
        /**
         * Applies all resolved format options to the date object.
         * @param value The date to format.
         * @returns A resulting format value with applied format and culture-specific options.
         */
        protected applyOptions(value: Date): string;
        /** Returns the format info instance used for culture-specific formatting. */
        protected getFormatInfo(): DateTimeFormatInfo;
        private getNativeFormatter(resolvedOptions?);
    }
}
