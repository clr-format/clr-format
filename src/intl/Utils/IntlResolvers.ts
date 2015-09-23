/// <reference path="../../use-strict" />

/// <reference path="../../core/Globalization/DateTime/IntlFormatOptions" />

/**
 * An internal [[Format.Utils]] sub-module containing methods related to culture formatting information resolution.
 *
 * Because the module and its members cannot be truly internal, refrain from calling its methods directly.
 */
namespace Format.Utils.IntlResovlers {
    /** @private */
    export function setDateTimeFormatInfo_(formatInfo: Globalization.DateTimeFormatInfo, formatProvider: (resolvedOptions: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat): void {

        setDayNames(
            formatInfo,
            formatProvider({ weekday: short }),
            formatProvider({ weekday: long }));

        setAmPmDesignators(
            formatInfo,
            formatProvider({ hour: numeric, hour12: true }));

        setSeparators(
            formatInfo,
            formatProvider({ month: twoDigit, day: twoDigit }),
            formatProvider({ hour: twoDigit, minute: twoDigit, hour12: false }));
    }

    /** @private */
    export function getEra_(date: any, formatProvider: (resolvedOptions: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat): string {
        try {
            return removeFormatDigits(formatProvider({ year: numeric, era: short }).format(date));
        }
        catch (error) {
            return "";
        }
    }

    /** @private */
    export function getShortMonth_(date: any, formatProvider: (resolvedOptions: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat): string {
        return removeFormatDigits(formatProvider({ month: short }).format(date));
    }

    /** @private */
    export function getLongMonth_(date: any, formatProvider: (resolvedOptions: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat): string {
        return removeFormatDigits(formatProvider({ month: long }).format(date));
    }

    /** @private */
    var short = "short", long = "long", numeric = "numeric", twoDigit = "2-digit";

    /** @private */
    export function setNumberFormatInfo_(formatInfo: Globalization.NumberFormatInfo, decimalSampler: Intl.NumberFormat, currencySampler: Intl.NumberFormat): void {

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
    export function getCurrencyDecimalDigits_(formatInfo: Globalization.NumberFormatInfo, currencyCode: string): number {

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
    export function applyNumberCultureFormatting_(invariantlyFormattedString: string, replaceInvariantSymbolsCallback: (replaceChar: string) => string): string {
        return invariantlyFormattedString.replace(
            partialNumberFormatReplacementsRexExp,
            replaceInvariantSymbolsCallback);
    }
    /** @private */
    var partialNumberFormatReplacementsRexExp = /[-.]/g;

    /** @private */
    export function isBlank(value: string): boolean {
        return Utils.Text.isNullOrWhitespace(value) || !removeControlChars(value);
    }

    /** @private */
    var setDayNames = (formatInfo: Globalization.DateTimeFormatInfo, shortDayFormatter: Intl.DateTimeFormat, longDayFormatter: Intl.DateTimeFormat): void => {

        let weekday: any = new Date(70, 2, 1);

        formatInfo.AbbreviatedDayNames = [];
        formatInfo.DayNames = [];

        for (let i = 1; i <= 7; i += 1, weekday.setDate(i)) {
            formatInfo.AbbreviatedDayNames.push(shortDayFormatter.format(weekday));
            formatInfo.DayNames.push(longDayFormatter.format(weekday));
        }
    };

    /** @private */
    var setAmPmDesignators = (formatInfo: Globalization.DateTimeFormatInfo, amPmDesignatorFormatter: Intl.DateTimeFormat): void => {

        let amDate: any = new Date(0, 0, 1, 6), pmDate: any = new Date(0, 0, 1, 18),
            invariantInfo = Globalization.DateTimeFormatInfo.InvariantInfo;

        formatInfo.AMDesignator = removeFormatDigits(amPmDesignatorFormatter.format(amDate));
        formatInfo.PMDesignator = removeFormatDigits(amPmDesignatorFormatter.format(pmDate));

        if (isBlank(formatInfo.AMDesignator)) {
            formatInfo.AMDesignator = invariantInfo.AMDesignator;
        }

        if (isBlank(formatInfo.PMDesignator)) {
            formatInfo.PMDesignator = invariantInfo.PMDesignator;
        }
    };

    /** @private */
    var setSeparators = (formatInfo: Globalization.DateTimeFormatInfo, dateSeparatorFormatter: Intl.DateTimeFormat, timeSeparatorFormatter: Intl.DateTimeFormat): void => {

        let nowDate: any = new Date();

        formatInfo.DateSeparator = removeControlChars(dateSeparatorFormatter.format(nowDate))[2];
        formatInfo.TimeSeparator = removeControlChars(timeSeparatorFormatter.format(nowDate))[2];
    };

    /** @private */
    var removeFormatDigits = (formattedValue: string): string => formattedValue.replace(digitsWithWhitespaceRegExp, ""),
        digitsWithWhitespaceRegExp = /\s*\d+.?\s*/;


    /** @private */
    var removeControlChars = (formattedValue: string): string => formattedValue.replace(controlCharsRegExp, ""),
        controlCharsRegExp = /\u200E|\u200F/g;

    /** @private */
    var getFirstNonDigit = (sample: string, offset: number): string => sample.substring(offset).match(nonDigitSymbolRegExp)[0],
        nonDigitSymbolRegExp = /[^\d]/;

    /** @private */
    var nonStandardCurrencyDecimalDigits: Indexable<number> = {
        ADP: 0, AFA: 0, BEF: 0, BHD: 3, BIF: 0, BYB: 0, BYR: 0, CLP: 0, CLF: 4, COP: 0, DJF: 0, ECS: 0, ESP: 0, GNF: 0, GRD: 0, HUF: 0,
        IDR: 0, IQD: 3, ITL: 0, JOD: 3, JPY: 0, KMF: 0, KRW: 0, KWD: 3, LAK: 0, LUF: 0, LYD: 3, MGF: 0, MZM: 0, OMR: 3, PTE: 0, PYG: 0,
        ROL: 0, RWF: 0, TJR: 0, TMM: 0, TND: 3, TPE: 0, TRL: 0, TWD: 0, UGX: 0, VND: 0, VUV: 0, XAF: 0, XOF: 0, XPF: 0
    };
}
