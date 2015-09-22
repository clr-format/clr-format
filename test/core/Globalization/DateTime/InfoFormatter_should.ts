/// <reference path="../../../typings/jasmine/jasmine" />

/// <reference path="../../../../src/core/Globalization/DateTimeFormatInfo" />

/// <reference path="../../../../src/core/Globalization/DateTime/InfoFormatter" />
/// <reference path="../../../../src/core/Globalization/DateTime/IntlOptionsProvider" />

namespace Format.Globalization.DateTime {

    describe("DateTime.InfoFormatter", () => {

        let intlOptions: Intl.DateTimeFormatOptions;
        let infoFormatter: InfoFormatter<Intl.DateTimeFormatOptions>;
        let infoFormatterAccessor: any;

        let expectCleanState = () => {
            expect(infoFormatterAccessor.resolvedOptions).toBeUndefined();
            expect(infoFormatterAccessor.value_).toBeUndefined();
            expect(infoFormatterAccessor.baseOptions_).toBe(intlOptions);
            expect(infoFormatterAccessor.specifiersFormatter_).toBeUndefined();
            expect(infoFormatterAccessor.optionsProvider_).toBeUndefined();
            expect(infoFormatterAccessor.optionsProviderConstructor_).toBe(IntlOptionsProvider);
        };

        beforeAll(() => {
            intlOptions = {};
            infoFormatter = infoFormatterAccessor = new InfoFormatter(IntlOptionsProvider, DateTimeFormatInfo.InvariantInfo, intlOptions);
        });

        it("constructor should initialize the options' object, format info instance and options provider's constructor function", () => {
            expect(infoFormatter).toBeDefined();
            expect(infoFormatterAccessor.formatInfo).toBe(DateTimeFormatInfo.InvariantInfo);
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

            let date = new Date(2015, 8, 1);

            expect(infoFormatter.format("", date)).toBeDefined();
            expectCleanState();
            expect(infoFormatter.format("d", date)).toBe("09/01/2015");
            expectCleanState();
            expect(infoFormatter.format("%d", date)).toBe("1");
            expectCleanState();
            expect(() => infoFormatter.format("x", date)).toThrowError(Errors.FormatError);
            expectCleanState();
        });

        it("format should throw InvalidOperationError if the option's provider returns an unsupported style option", () => {

            infoFormatter = new InfoFormatter(IntlOptionsProvider, DateTimeFormatInfo.InvariantInfo, { style: "unsupported" });

            expect(() => infoFormatter.format("%d", new Date())).toThrowError(Errors.ArgumentError);
            expectCleanState();
        });

        it("format should throw InvalidOperationError if the option's provider returns an undefined resolved options object", () => {

            let emptyOptionsProvider: any = () => {
                return {
                    resolveOptions: (): Intl.DateTimeFormatOptions => {
                        return undefined;
                    }
                };
            };

            infoFormatter = new InfoFormatter(emptyOptionsProvider, DateTimeFormatInfo.InvariantInfo, intlOptions);

            expect(() => infoFormatter.format("", new Date())).toThrowError(Errors.InvalidOperationError);
            expectCleanState();
        });
    });
}
