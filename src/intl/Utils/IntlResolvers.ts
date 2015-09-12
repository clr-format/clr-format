/// <reference path="../../use-strict" />

namespace Format.Utils.IntlResovlers {
    /**
     * Sets resolved number format info options to the formatInfo instance.
     * @param formatInfo An instance that will provide culture-specific number format information.
     * @param numberSampler An Intl.NumberFormat instance that is set to sample decimal styled numbers.
     * @param currencySampler An Intl.NumberFormat instance that is set to sample currency styled numbers.
     */
    export function setNumberFormatInfo(formatInfo: Globalization.NumberFormatInfo, decimalSampler: Intl.NumberFormat, currencySampler: Intl.NumberFormat): void {

        let sampleValue = 1.2, groupValue = -123456,
            decimalOptions = decimalSampler.resolvedOptions(),
            decimalNegativeSample = decimalSampler.format(-sampleValue),
            currencySample = currencySampler.format(sampleValue);

        formatInfo.NegativeSign = decimalNegativeSample[0];

        formatInfo.NumberGroupSeparator = decimalSampler.format(groupValue)[4];
        formatInfo.NumberDecimalSeparator = getFirstNonDigit(decimalNegativeSample, 1);
        formatInfo.NumberDecimalDigits = decimalOptions.minimumFractionDigits || decimalOptions.maximumFractionDigits;

        formatInfo.CurrencyGroupSeparator = getFirstNonDigit(currencySampler.format(groupValue), 4);
        formatInfo.CurrencyDecimalSeparator = getFirstNonDigit(currencySample, 1);
    }
    /** @private */
    var nonDigitSymbolRegExp = /[^\d]/;

    /** @private */
    var getFirstNonDigit = (sample: string, offset: number): string => {
        return sample.substring(offset).match(nonDigitSymbolRegExp)[0];
    };

    /**
     * Returns the currency decimal digits defined in the currenty format info instance or the one that matches the curreny currency.
     * @param formatInfo An instance that provides culture-specific number format information.
     * @param currencyCode The currency code.
     */
    export function getCurrencyDecimalDigits(formatInfo: Globalization.NumberFormatInfo, currencyCode: string): number {

        if (formatInfo.CurrencyDecimalDigits != null) {
            return formatInfo.CurrencyDecimalDigits;
        }

        let currencyDecimalDigits = nonStandardCurrencyDecimalDigits[currencyCode];
        if (currencyDecimalDigits !== undefined) {
            return currencyDecimalDigits;
        }

        return 2;
    }

    /** @private */
    var nonStandardCurrencyDecimalDigits: Indexable<number> = {
        ADP: 0, AFA: 0, BEF: 0, BHD: 3, BIF: 0, BYB: 0, BYR: 0, CLP: 0, CLF: 4, COP: 0, DJF: 0, ECS: 0, ESP: 0, GNF: 0, GRD: 0, HUF: 0,
        IDR: 0, IQD: 3, ITL: 0, JOD: 3, JPY: 0, KMF: 0, KRW: 0, KWD: 3, LAK: 0, LUF: 0, LYD: 3, MGF: 0, MZM: 0, OMR: 3, PTE: 0, PYG: 0,
        ROL: 0, RWF: 0, TJR: 0, TMM: 0, TND: 3, TPE: 0, TRL: 0, TWD: 0, UGX: 0, VND: 0, VUV: 0, XAF: 0, XOF: 0, XPF: 0
    };

    /**
     * Returns a culture-variant version of the given invariantly formatted string. Matches decimal separators and negative signs for the callback.
     * @param invariantlyFormattedString An invariantly formatted string to replace with culture-specific symbols.
     * @param replaceInvariantSymbolsCallback A function that handles the symbol replacement.
     */
    export function applyNumberCultureFormatting(invariantlyFormattedString: string, replaceInvariantSymbolsCallback: (replaceChar: string) => string): string {
        return invariantlyFormattedString.replace(
            partialNumberFormatReplacementsRexExp,
            replaceInvariantSymbolsCallback);
    }

    /** @private */
    var partialNumberFormatReplacementsRexExp = /[-.]/g;
}
