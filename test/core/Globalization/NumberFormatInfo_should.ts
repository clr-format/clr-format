/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Globalization/NumberFormatInfo" />

/// <reference path="../../../src/core/Globalization/Numeric/InvariantFormatter" />

namespace Format.Globalization {

    describe("NumberFormatInfo", () => {

        let numberFormatInfo: NumberFormatInfo;
        let numberFormatInfoAccessor: any;

        it("should initialize static properties", () => {
            expect(NumberFormatInfo.InvariantInfo).toBeDefined();
        });

        it("constructor should initialize locale's and format specific properties", () => {

            numberFormatInfo = numberFormatInfoAccessor = new NumberFormatInfo("");

            expect(numberFormatInfoAccessor.locales).toBe("");
            expect(numberFormatInfoAccessor.isWritable).toBe(false);

            expect(numberFormatInfo.CurrencyDecimalSeparator).toBe(".");
            expect(numberFormatInfo.CurrencyGroupSeparator).toBe(",");
            expect(numberFormatInfo.NumberDecimalSeparator).toBe(".");
            expect(numberFormatInfo.NumberGroupSeparator).toBe(",");
            expect(numberFormatInfo.NumberDecimalDigits).toBe(2);
            expect(numberFormatInfo.NegativeSign).toBe("-");
        });

        it("constructor should throw a NotImplementedError for a locales argument which is not supported", () => {
            expect(() => new NumberFormatInfo("en-US")).toThrowError(Errors.NotImplementedError);
        });

        it("getFormatter should only return a number formatter instance or throw an error", () => {

            numberFormatInfo = new NumberFormatInfo("");

            expect(numberFormatInfo.getFormatter(Utils.Types.Number) instanceof Numeric.InvariantFormatter).toBe(true);
            expect(() => numberFormatInfo.getFormatter(Utils.Types.Object)).toThrowError(Errors.InvalidOperationError);
        });
    });
}
