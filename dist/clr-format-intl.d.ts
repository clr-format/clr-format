/// <reference path="clr-format.d.ts" />
/**
 * An internal [[Format.Utils]] sub-module containing methods related to culture formatting information resolution.
 *
 * Because the module and its members cannot be truly internal, refrain from calling its methods directly.
 */
declare namespace Format.Utils.IntlResovlers {
    /** @private */
    function setDateTimeFormatInfo_(formatInfo: Globalization.DateTimeFormatInfo, formatProvider: (resolvedOptions: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat): void;
    /** @private */
    function getEra_(date: any, formatProvider: (resolvedOptions: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat): string;
    /** @private */
    function getShortMonth_(date: any, formatProvider: (resolvedOptions: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat): string;
    /** @private */
    function getLongMonth_(date: any, formatProvider: (resolvedOptions: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat): string;
    /** @private */
    function setNumberFormatInfo_(formatInfo: Globalization.NumberFormatInfo, decimalSampler: Intl.NumberFormat, currencySampler: Intl.NumberFormat): void;
    /** @private */
    function getCurrencyDecimalDigits_(formatInfo: Globalization.NumberFormatInfo, currencyCode: string): number;
    /** @private */
    function applyNumberCultureFormatting_(invariantlyFormattedString: string, replaceInvariantSymbolsCallback: (replaceChar: string) => string): string;
    /** @private */
    function isBlank(value: string, customBlankChar?: string): boolean;
}
declare namespace Format.Globalization.Numeric {
    /**
     * Provides culture-specific formatting for numeric values by using the Intl namespace.
     *
     * Requires the *clr-format-intl.js* sub-module to be loaded.
     */
    class IntlFormatter extends InfoFormatter<Intl.NumberFormatOptions> {
        /** Possible values are:
         * - "decimal" for plain number formatting (acts as override for "fixed-point", "number" or "undefined");
         * - "currency" for currency formatting;
         * - "percent" for percent formatting;
         */
        private static supportedStyles;
        private locales;
        private getNativeFormatter;
        /**
         * Initializes a new object that enables language sensitive number formatting.
         * @param locales The locales argument must be either a string holding a BCP 47 language tag, or an array of such language tags.
         * See: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
         * @param formatInfo An instance that will provide culture-specific number format information.
         * @param numberOptions An object with some or all of the standardized properties.
         * See: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
         */
        constructor(locales: string | string[], formatInfo: NumberFormatInfo, numberOptions?: Intl.NumberFormatOptions);
        /**
         * Applies all resolved format options to the number.
         * @param value The number to format.
         * @returns A resulting format value with applied format and culture-specific options.
         */
        protected applyOptions(value: number): string;
        private overrideOptions(overrideStyle);
        private overrideCurrencyOptions();
        private overrideDecimalOptions();
        private overrideFractionDigits(overrideValue);
        private applyCultureSpecificFormatting(invariantlyFormattedString);
        private replaceInvariantSymbols;
    }
}
declare namespace Format.Globalization.DateTime {
    /** A [[CustomFormatter]] implementation that replaces [Custom Date and Time Format Specifiers](https://msdn.microsoft.com/library/8kb3ddd4.aspx) with their culture information values. */
    class IntlSpecifiersFormatter extends InfoSpecifierFormatter {
        private formatProvider;
        /**
         * Creates an instance that uses the resolved options from the specified options provider and applies culture-specific formatting based on the given format info.
         * @param formatInfo An instance that provides culture-specific date and time format information.
         * @param formatProvider A function that returns a localized instance of Intl.DateTimeFormat with the supplied options.
         */
        constructor(formatInfo: DateTimeFormatInfo, formatProvider: (resolvedOptions: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat);
        private overrideBaseFormatters();
    }
}
declare namespace Format.Globalization.DateTime {
    /**
     * Provides culture-specific formatting for date and time values by using the Intl namespace.
     *
     * Requires the *clr-format-intl.js* sub-module to be loaded.
     */
    class IntlFormatter extends InfoFormatter<Intl.DateTimeFormatOptions> {
        private locales;
        private getNativeFormatter;
        /**
         * Initializes a new object that enables language sensitive date and time formatting.
         * @param locales The locales argument must be either a string holding a BCP 47 language tag, or an array of such language tags.
         * See: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
         * @param formatInfo An instance that will provide culture-specific date and time format information.
         * @param dateOptions Optional object with some or all of the standardized properties.
         * See: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
         */
        constructor(locales: string | string[], formatInfo: DateTimeFormatInfo, dateOptions?: Intl.DateTimeFormatOptions);
        /**
         * Converts the date to an equivalent string representation using specified format and culture formatting information.
         * @param format A format string containing formatting specifications.
         * @param value The date to format.
         * @returns The formatted date value.
         */
        format(formatString: string, value: Date): string;
        /**
         * Applies all resolved format options to the date object.
         * @param value The date to format.
         * @returns A resulting format value with applied format and culture-specific options.
         */
        protected applyOptions(value: Date): string;
        /** Returns the formatter instance that will be used to replace all custom date and time specifiers. */
        protected getSpecifiersFormatter(): CustomFormatter;
    }
}
