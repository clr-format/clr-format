/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/intl/Utils/IntlResolvers" />

/// <reference path="../../../src/core/Globalization/NumberFormatInfo" />

namespace Format.Utils {

    describe("IntlResovlers getCurrencyDecimalDigits", () => {

        if (!Utils.IntlResovlers) {
            return;
        }

        let formatInfo = new Globalization.NumberFormatInfo();

        it("should return the proper currency decimal digits option", () => {

            expect(IntlResovlers.getCurrencyDecimalDigits(formatInfo, "AFA")).toBe(0);
            expect(IntlResovlers.getCurrencyDecimalDigits(formatInfo, "USD")).toBe(2);
            expect(IntlResovlers.getCurrencyDecimalDigits(formatInfo, "EUR")).toBe(2);
            expect(IntlResovlers.getCurrencyDecimalDigits(formatInfo, "JOD")).toBe(3);
            expect(IntlResovlers.getCurrencyDecimalDigits(formatInfo, "CLF")).toBe(4);

            formatInfo.CurrencyDecimalDigits = 1;

            expect(IntlResovlers.getCurrencyDecimalDigits(formatInfo, "AFA")).toBe(1);
            expect(IntlResovlers.getCurrencyDecimalDigits(formatInfo, "USD")).toBe(1);
            expect(IntlResovlers.getCurrencyDecimalDigits(formatInfo, "EUR")).toBe(1);
            expect(IntlResovlers.getCurrencyDecimalDigits(formatInfo, "JOD")).toBe(1);
            expect(IntlResovlers.getCurrencyDecimalDigits(formatInfo, "CLF")).toBe(1);
        });
    });
}
