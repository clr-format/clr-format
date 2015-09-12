/// <reference path="../../../use-strict" />

/// <reference path="IntlFormatOptions" />

/// <reference path="../../API" />

namespace Format.Globalization.Numeric {

    /** @private */
    let styles = Specifiers.StandardSpecifiers,
        decimal = styles[styles.decimal],
        currency = styles[styles.currency],
        nonDigitSymbolRegExp = /[^\d]/,
        invariantReplaceSymbolsRexExp = /[-.]/g;

    /**
     * Provides culture-specific formatting for numeric values by using the Intl namespace.
     *
     * Requires the *clr-format-intl.js* sub-module to be loaded.
     */
    export class IntlFormatter extends InvariantFormatter<Intl.NumberFormatOptions> {

        private locales: string|string[];
        private formatInfo: NumberFormatInfo;

        /** Possible values are:
         * - "decimal" for plain number formatting (acts as override for "fixed-point", "number" or "undefined");
         * - "currency" for currency formatting;
         * - "percent" for percent formatting;
         */
        private supportedStyles: Specifiers.StandardSpecifiersMap<boolean|string> = {

            currency: true,
            decimal: true,
            percent: true,

            fixedPoint: decimal,
            undefined: decimal,
            number: decimal,

            exponential: false,
            roundTrip: false,
            general: false,
            hex: false
        };

        // Arrow syntax used to preserve 'this' context inside the function at compile time
        private setResolvedFormatInfo: (formatInfo: NumberFormatInfo) => void = (): void => {

            let sampleValue = 1.2, groupValue = -1234,
                numberSampler = this.getNativeFormatter(),
                currencySampler = this.getNativeFormatter({ style: currency, currency: "USD" }),
                numberNegativeSample = numberSampler.format(-sampleValue),
                currencyNegativeSample = currencySampler.format(sampleValue);

            this.formatInfo.NegativeSign = numberNegativeSample[0];
            this.formatInfo.NumberGroupSeparator = numberSampler.format(groupValue)[2];
            this.formatInfo.NumberDecimalSeparator = numberNegativeSample.substring(1).match(nonDigitSymbolRegExp)[0];
            this.formatInfo.CurrencyGroupSeparator = currencySampler.format(groupValue)[2];
            this.formatInfo.CurrencyDecimalSeparator = currencyNegativeSample.substring(1).match(nonDigitSymbolRegExp)[0];
        };

        // Arrow syntax used to preserve 'this' context inside the function at compile time
        private replaceInvariantSymbols: (replaceChar: string) => string = (replaceChar: string): string => {

            let invariantFormatInfo = super.getFormatInfo();

            if (replaceChar === invariantFormatInfo.NegativeSign) {
                return this.getFormatInfo().NegativeSign;
            }

            if (replaceChar === this.decorationFormatter.getDecimalSeparator(invariantFormatInfo)) {
                return this.decorationFormatter.getDecimalSeparator();
            }

            return replaceChar;
        };

        /**
         * Initializes a new object that enables language sensitive number formatting.
         * @param locales The locales argument must be either a string holding a BCP 47 language tag, or an array of such language tags.
         * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
         * @param formatInfo An instance that will provide culture-specific number format information.
         * @param numberOptions An object with some or all of the standardized properties.
         * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
         */
        constructor(locales: string|string[], formatInfo: NumberFormatInfo, numberOptions?: Intl.NumberFormatOptions) {

            super(IntlOptionsProvider, numberOptions);

            this.locales = locales;
            this.formatInfo = formatInfo;
            this.setResolvedFormatInfo(formatInfo);
        }

        /**
         * Converts the number to an equivalent string representation using specified format and invariant culture formatting information.
         * @param format A format string containing formatting specifications.
         * @param value The number to format.
         */
        public format(formatString: string, value: number): string {
            return super.format(formatString, value);
        }

        /**
         * Applies all resolved format options to the number.
         * @param value The number to format.
         * @returns A resulting format value with applied format and culture-specific options.
         */
        protected applyOptions(value: number): string {

            let formattedValue: string,
                supportedStyle: boolean|string = this.supportedStyles[this.resolvedOptions.style];

            if (supportedStyle) {
                this.overrideOptions(supportedStyle);
                formattedValue = this.getNativeFormatter(this.resolvedOptions).format(value);
            }
            else {
                formattedValue = super.applyOptions(value);
                formattedValue = this.applyCultureSpecificFormatting(value, formattedValue);
            }

            return formattedValue;
        }

        /** Returns the format info instance used for culture-specific formatting. */
        protected getFormatInfo(): NumberFormatInfo {
            return this.formatInfo;
        }

        private overrideOptions(overrideStyle: boolean|string): void {

            this.overrideCurrencyOptions();
            this.overrideFractionOptions();

            if (typeof overrideStyle === "string") {
                this.resolvedOptions.style = overrideStyle;
            }

            if (this.resolvedOptions.useGrouping == null) {
                this.resolvedOptions.useGrouping = false;
            }
        }

        private overrideCurrencyOptions(): void {
            if (this.resolvedOptions.style === currency) {
                this.resolvedOptions.currency = NumberFormatInfo.CurrentCurrency;
                this.overrideFractionDigits(2);
            }
        }

        private overrideFractionOptions(): void {
            if (this.resolvedOptions.style === styles[styles.fixedPoint] ||
                this.resolvedOptions.style === styles[styles.percent] ||
                this.resolvedOptions.style === styles[styles.number]) {
                this.overrideFractionDigits(2);
            }
        }

        private overrideFractionDigits(overrideValue: number): void {
            if (this.resolvedOptions.minimumFractionDigits == null &&
                this.resolvedOptions.maximumFractionDigits == null) {
                this.resolvedOptions.minimumFractionDigits = overrideValue;
                this.resolvedOptions.maximumFractionDigits = overrideValue;
            }
        }

        private getNativeFormatter(resolvedOptions?: Intl.NumberFormatOptions): Intl.NumberFormat {
            return <any> new Intl.NumberFormat(<string> this.locales, resolvedOptions);
        }

        private applyCultureSpecificFormatting(value: number, invariantlyFormattedString: string): string {

            if (this.resolvedOptions.style === styles[styles.hex]) {
                return invariantlyFormattedString;
            }

            return invariantlyFormattedString.replace(
                invariantReplaceSymbolsRexExp,
                this.replaceInvariantSymbols);
        }
    }

    NumberFormatInfo.FormatterConstructor = IntlFormatter;
}
