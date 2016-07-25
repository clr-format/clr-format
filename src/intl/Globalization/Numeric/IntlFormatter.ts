/// <reference path="../../../use-strict" />
/// <reference path="../../API" />

/// <reference path="../../Utils/IntlResolvers" />

namespace Format.Globalization.Numeric {

    /** @private */
    let styles = Specifiers.Standard;

    /**
     * Provides culture-specific formatting for numeric values by using the Intl namespace.
     *
     * Requires the *clr-format-intl.js* sub-module to be loaded.
     */
    export class IntlFormatter extends InfoFormatter<Intl.NumberFormatOptions> {
        /** Possible values are:
         * - "decimal" for plain number formatting (acts as override for "fixed-point", "number" or "undefined");
         * - "currency" for currency formatting;
         * - "percent" for percent formatting;
         */
        private static supportedStyles: Specifiers.StandardSpecifiersMap<boolean|string> = {

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

        private locales: string|string[];

        /**
         * Initializes a new object that enables language sensitive number formatting.
         * @param locales The locales argument must be either a string holding a BCP 47 language tag, or an array of such language tags.
         * See: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
         * @param formatInfo An instance that will provide culture-specific number format information.
         * @param numberOptions An object with some or all of the standardized properties.
         * See: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
         */
        constructor(locales: string|string[], formatInfo: NumberFormatInfo, numberOptions?: Intl.NumberFormatOptions) {

            super(IntlOptionsProvider, formatInfo, numberOptions);

            if (locales == null) {
                throw new Errors.ArgumentNullError("locales");
            }

            if (typeof Intl === "undefined" || typeof Intl.NumberFormat === "undefined") {
                throw new Format.Errors.InvalidOperationError("Intl.NumberFormat is not supported by the executing context");
            }

            this.locales = locales;

            Utils.IntlResovlers.setNumberFormatInfo_(
                this.formatInfo,
                this.getNativeFormatter({ style: styles[styles.decimal] }),
                this.getNativeFormatter({ style: styles[styles.currency], currency: "USD", useGrouping: true }));
        }

        /**
         * Applies all resolved format options to the number.
         * @param value The number to format.
         * @returns A resulting format value with applied format and culture-specific options.
         */
        protected applyOptions(value: number): string {

            let formattedValue: string,
                resolvedOptions = this.resolvedOptions,
                supportedStyle: boolean|string = IntlFormatter.supportedStyles[resolvedOptions.style];

            if (supportedStyle) {
                this.overrideOptions(supportedStyle);
                formattedValue = this.getNativeFormatter(resolvedOptions).format(value);
            }
            else {
                formattedValue = super.applyOptions(value);
                formattedValue = this.applyCultureSpecificFormatting(formattedValue);
            }

            return formattedValue;
        }

        private getNativeFormatter = (resolvedOptions: Intl.NumberFormatOptions): Intl.NumberFormat =>
            <any> new Intl.NumberFormat(<string> this.locales, resolvedOptions);

        private overrideOptions(overrideStyle: boolean|string): void {

            this.overrideCurrencyOptions();
            this.overrideDecimalOptions();

            let resolvedOptions = this.resolvedOptions;

            if (typeof overrideStyle === "string") {
                resolvedOptions.style = overrideStyle;
            }

            if (resolvedOptions.useGrouping == null) {
                resolvedOptions.useGrouping = false;
            }
        }

        private overrideCurrencyOptions(): void {

            let resolvedOptions = this.resolvedOptions;

            if (resolvedOptions.style === styles[styles.currency]) {
                let currencyCode = NumberFormatInfo.CurrentCurrency;
                if (currencyCode) {
                    resolvedOptions.currency = currencyCode;
                    this.overrideFractionDigits(Utils.IntlResovlers.getCurrencyDecimalDigits_(this.formatInfo, currencyCode));
                }
                else {
                    throw new Errors.InvalidOperationError("No currency was set (use the Format.setCurrency method to do so)");
                }
            }
        }

        private overrideDecimalOptions(): void {

            let resolvedOptions = this.resolvedOptions;

            if (resolvedOptions.style === styles[styles.fixedPoint] ||
                resolvedOptions.style === styles[styles.percent] ||
                resolvedOptions.style === styles[styles.number]) {

                this.overrideFractionDigits(this.formatInfo.NumberDecimalDigits);
            }
        }

        private overrideFractionDigits(overrideValue: number): void {

            let resolvedOptions = this.resolvedOptions;

            if (resolvedOptions.minimumFractionDigits == null &&
                resolvedOptions.maximumFractionDigits == null) {

                resolvedOptions.minimumFractionDigits = overrideValue;
                resolvedOptions.maximumFractionDigits = overrideValue;
            }
        }

        private applyCultureSpecificFormatting(invariantlyFormattedString: string): string {

            if (this.resolvedOptions.style === styles[styles.hex]) {
                return invariantlyFormattedString;
            }

            return Utils.IntlResovlers.applyNumberCultureFormatting_(
                invariantlyFormattedString,
                this.replaceInvariantSymbols);
        }

        /* tslint:disable:member-ordering */

        // Arrow syntax used to preserve 'this' context inside the function at compile time
        private replaceInvariantSymbols: (replaceChar: string) => string = (replaceChar: string): string => {

            let invariantInfo = NumberFormatInfo.InvariantInfo;

            if (replaceChar === invariantInfo.NegativeSign) {
                return this.formatInfo.NegativeSign;
            }

            if (replaceChar === this.decorationFormatter.getDecimalSeparator(invariantInfo)) {
                return this.decorationFormatter.getDecimalSeparator();
            }

            return replaceChar;
        };

        /* tslint:enable:member-ordering */
    }

    NumberFormatInfo.FormatterConstructor = IntlFormatter;
}
