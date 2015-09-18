/// <reference path="../../../use-strict" />

/// <reference path="IntlFormatOptions" />

/// <reference path="../../API" />
/// <reference path="../../Utils/IntlResolvers" />

namespace Format.Globalization.Numeric {

    /** @private */
    let styles = Specifiers.StandardSpecifiers;

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

            fixedPoint: styles[styles.decimal],
            undefined: styles[styles.decimal],
            number: styles[styles.decimal],

            exponential: false,
            roundTrip: false,
            general: false,
            hex: false
        };

        /**
         * Initializes a new object that enables language sensitive number formatting.
         * @param locales The locales argument must be either a string holding a BCP 47 language tag, or an array of such language tags.
         * See: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
         * @param formatInfo An instance that will provide culture-specific number format information.
         * @param numberOptions An object with some or all of the standardized properties.
         * See: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
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
         * @returns The formatted numeric value.
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
                formattedValue = this.applyCultureSpecificFormatting(formattedValue);
            }

            return formattedValue;
        }

        /** Returns the format info instance used for culture-specific formatting. */
        protected getFormatInfo(): NumberFormatInfo {
            return this.formatInfo;
        }

        private setResolvedFormatInfo(formatInfo: NumberFormatInfo): void {
            Utils.IntlResovlers.setNumberFormatInfo(
                this.formatInfo,
                this.getNativeFormatter({ style: styles[styles.decimal] }),
                this.getNativeFormatter({ style: styles[styles.currency], currency: "USD", useGrouping: true }));
        }

        private overrideOptions(overrideStyle: boolean|string): void {

            this.overrideCurrencyOptions();
            this.overrideDecimalOptions();

            if (typeof overrideStyle === "string") {
                this.resolvedOptions.style = overrideStyle;
            }

            if (this.resolvedOptions.useGrouping == null) {
                this.resolvedOptions.useGrouping = false;
            }
        }

        private overrideCurrencyOptions(): void {
            if (this.resolvedOptions.style === styles[styles.currency]) {
                let currencyCode = NumberFormatInfo.CurrentCurrency;
                if (currencyCode) {
                    this.resolvedOptions.currency = currencyCode;
                    this.overrideFractionDigits(Utils.IntlResovlers.getCurrencyDecimalDigits(this.formatInfo, currencyCode));
                }
                else {
                    throw new Errors.InvalidOperationError("No currency was set (use the Format.setCurrency method to do so)");
                }
            }
        }

        private overrideDecimalOptions(): void {
            if (this.resolvedOptions.style === styles[styles.fixedPoint] ||
                this.resolvedOptions.style === styles[styles.percent] ||
                this.resolvedOptions.style === styles[styles.number]) {
                this.overrideFractionDigits(this.formatInfo.NumberDecimalDigits);
            }
        }

        private overrideFractionDigits(overrideValue: number): void {
            if (this.resolvedOptions.minimumFractionDigits == null &&
                this.resolvedOptions.maximumFractionDigits == null) {
                this.resolvedOptions.minimumFractionDigits = overrideValue;
                this.resolvedOptions.maximumFractionDigits = overrideValue;
            }
        }

        private getNativeFormatter(resolvedOptions: Intl.NumberFormatOptions): Intl.NumberFormat {
            return <any> new Intl.NumberFormat(<string> this.locales, resolvedOptions);
        }

        private applyCultureSpecificFormatting(invariantlyFormattedString: string): string {

            if (this.resolvedOptions.style === styles[styles.hex]) {
                return invariantlyFormattedString;
            }

            return Utils.IntlResovlers.applyNumberCultureFormatting(
                invariantlyFormattedString,
                this.replaceInvariantSymbols);
        }

        /* tslint:disable:member-ordering */

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

        /* tslint:enable:member-ordering */
    }

    NumberFormatInfo.FormatterConstructor = IntlFormatter;
}