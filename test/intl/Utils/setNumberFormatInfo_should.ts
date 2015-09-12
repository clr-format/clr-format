/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/intl/Utils/IntlResolvers" />

/// <reference path="../../../src/core/Globalization/NumberFormatInfo" />

namespace Format.Utils {

    describe("IntlResovlers setNumberFormatInfo", () => {

        let formatInfo = new Globalization.NumberFormatInfo();
        let supportsIntl = typeof Intl !== "undefined" && typeof Intl.NumberFormat !== "undefined";

        let getNativeFormatter = (locale: string, resolvedOptions?: Intl.NumberFormatOptions): Intl.NumberFormat => {
            return <any> new Intl.NumberFormat(locale, resolvedOptions);
        };

        let supportsCultures = getNativeFormatter("de-DE").format(1.2) === "1,2";

        it("should set the proper values for different locales", () => {

            if (!supportsIntl) {
                return;
            }

            let locale = "en-US",
                styles = Globalization.Numeric.Specifiers.StandardSpecifiers,
                decimalOptions = { style: styles[styles.decimal] },
                currencyOptions = { style: styles[styles.currency], currency: "USD", useGrouping: true };

            IntlResovlers.setNumberFormatInfo(
                formatInfo,
                getNativeFormatter(locale, decimalOptions),
                getNativeFormatter(locale, currencyOptions));

            expect(formatInfo.NegativeSign).toBe("-");
            expect(formatInfo.NumberDecimalDigits).toBe(3);
            expect(formatInfo.NumberDecimalSeparator).toBe(".");
            expect(formatInfo.CurrencyGroupSeparator).toBe(",");
            expect(formatInfo.CurrencyDecimalDigits).toBeUndefined();
            expect(formatInfo.CurrencyDecimalSeparator).toBe(".");
            expect(formatInfo.CurrencyGroupSeparator).toBe(",");

            if (!supportsCultures) {
                return;
            }

            locale = "de-DE";

            IntlResovlers.setNumberFormatInfo(
                formatInfo,
                getNativeFormatter(locale, decimalOptions),
                getNativeFormatter(locale, currencyOptions));

            expect(formatInfo.NegativeSign).toBe("-");
            expect(formatInfo.NumberDecimalDigits).toBe(3);
            expect(formatInfo.CurrencyDecimalDigits).toBeUndefined();
            expect(formatInfo.NumberDecimalSeparator).toBe(",");
            expect(formatInfo.CurrencyGroupSeparator).toBe(".");
            expect(formatInfo.CurrencyDecimalSeparator).toBe(",");
            expect(formatInfo.CurrencyGroupSeparator).toBe(".");

            locale = "fr-FR";

            IntlResovlers.setNumberFormatInfo(
                formatInfo,
                getNativeFormatter(locale, decimalOptions),
                getNativeFormatter(locale, currencyOptions));

            expect(formatInfo.NegativeSign).toBe("-");
            expect(formatInfo.NumberDecimalDigits).toBe(3);
            expect(formatInfo.CurrencyDecimalDigits).toBeUndefined();
            expect(formatInfo.NumberDecimalSeparator).toBe(",");
            expect(formatInfo.CurrencyGroupSeparator).toMatch(/\s/);
            expect(formatInfo.CurrencyDecimalSeparator).toBe(",");
            expect(formatInfo.CurrencyGroupSeparator).toMatch(/\s/);
        });
    });
}
