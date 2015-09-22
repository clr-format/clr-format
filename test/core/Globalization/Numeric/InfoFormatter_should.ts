/// <reference path="../../../typings/jasmine/jasmine" />

/// <reference path="../../../../src/core/Globalization/NumberFormatInfo" />

/// <reference path="../../../../src/core/Globalization/Numeric/InfoFormatter" />
/// <reference path="../../../../src/core/Globalization/Numeric/IntlOptionsProvider" />

namespace Format.Globalization.Numeric {

    describe("Numeric.InfoFormatter", () => {

        let intlOptions: Intl.NumberFormatOptions;
        let infoFormatter: InfoFormatter<Intl.NumberFormatOptions>;
        let infoFormatterAccessor: any;

        let expectCleanState = () => {
            expect(infoFormatterAccessor.resolvedOptions).toBeUndefined();
            expect(infoFormatterAccessor.value_).toBeUndefined();
            expect(infoFormatterAccessor.baseOptions_).toBe(intlOptions);
            expect(infoFormatterAccessor.optionsProvider_).toBeUndefined();
            expect(infoFormatterAccessor.decorationFormatter_).toBeUndefined();
            expect(infoFormatterAccessor.optionsProviderConstructor_).toBe(IntlOptionsProvider);
        };

        beforeAll(() => {
            intlOptions = {};
            infoFormatter = infoFormatterAccessor = new InfoFormatter(IntlOptionsProvider, NumberFormatInfo.InvariantInfo, intlOptions);
        });

        it("constructor should initialize the options' object, format info instance and options provider's constructor function", () => {
            expect(infoFormatter).toBeDefined();
            expect(infoFormatterAccessor.formatInfo).toBe(NumberFormatInfo.InvariantInfo);
            expect(infoFormatterAccessor.baseOptions_).toBe(intlOptions);
            expect(infoFormatterAccessor.optionsProviderConstructor_).toBe(IntlOptionsProvider);
        });

        it("constructor should throw an ArgumentNullError for parameter(s) with null or undefined values", () => {
            expect(() => new InfoFormatter(null, null)).toThrowError(TypeError);
            expect(() => new InfoFormatter(undefined, undefined)).toThrowError(TypeError);
            expect(() => new InfoFormatter(IntlOptionsProvider, null)).toThrowError(Errors.ArgumentNullError);
            expect(() => new InfoFormatter(IntlOptionsProvider, undefined)).toThrowError(Errors.ArgumentNullError);
        });

        it("format should apply the format string's options and retain its original clean instance state regardless of output", () => {

            expect(infoFormatter.format("", 0)).toBe("0");
            expectCleanState();
            expect(infoFormatter.format("e", 0)).toBe("0.000000e+000");
            expectCleanState();
            expect(infoFormatter.format("#", 0)).toBe("");
            expectCleanState();
            expect(() => infoFormatter.format("C", 0)).toThrowError(Errors.NotImplementedError);
            expectCleanState();
            expect(() => infoFormatter.format("Z0", 0)).toThrowError(Errors.FormatError);
            expectCleanState();
        });

        it("format should throw InvalidOperationError if the option's provider returns an unsupported style option", () => {

            infoFormatter = new InfoFormatter(IntlOptionsProvider, NumberFormatInfo.InvariantInfo, { style: "unsupported" });

            expect(() => infoFormatter.format("", 0)).toThrowError(Errors.ArgumentError);
            expectCleanState();
        });

        it("format should throw InvalidOperationError if the option's provider returns an undefined resolved options object", () => {

            let emptyOptionsProvider: any = () => {
                return {
                    resolveOptions: (): Intl.NumberFormatOptions => {
                        return undefined;
                    }
                };
            };

            infoFormatter = new InfoFormatter(emptyOptionsProvider, NumberFormatInfo.InvariantInfo, intlOptions);

            expect(() => infoFormatter.format("", 0)).toThrowError(Errors.InvalidOperationError);
            expectCleanState();
        });
    });
}
