/// <reference path="../../../typings/jasmine/jasmine" />

/// <reference path="../../../../src/core/Globalization/DateTimeFormatInfo" />

/// <reference path="../../../../src/core/Globalization/DateTime/InvariantFormatter" />
/// <reference path="../../../../src/core/Globalization/DateTime/IntlOptionsProvider" />

namespace Format.Globalization.DateTime {

    describe("InvariantFormatter", () => {

        let intlOptions: Intl.DateTimeFormatOptions;
        let invariantFormatter: InvariantFormatter<Intl.DateTimeFormatOptions>;
        let invariantFormatterAccessor: any;

        let expectCleanState = () => {
            expect(invariantFormatterAccessor.optionsProviderConstructor).toBe(IntlOptionsProvider);
            expect(invariantFormatterAccessor.baseOptions).toBe(intlOptions);
            expect(invariantFormatterAccessor.value).toBeUndefined();
            expect(invariantFormatterAccessor.resolvedOptions).toBeUndefined();
            expect(invariantFormatterAccessor.optionsProvider).toBeUndefined();
            expect(invariantFormatterAccessor.specifiersFormatter).toBeUndefined();
        };

        beforeAll(() => {
            intlOptions = {};
            invariantFormatter = invariantFormatterAccessor = new InvariantFormatter(IntlOptionsProvider, DateTimeFormatInfo.InvariantInfo, intlOptions);
        });

        it("constructor should initialize the options' object and options provider's constructor function", () => {
            expect(invariantFormatterAccessor.baseOptions).toBe(intlOptions);
            expect(invariantFormatterAccessor.optionsProviderConstructor).toBe(IntlOptionsProvider);
        });

        it("constructor should throw an ArgumentNullError for parameter(s) with null or undefined values", () => {
            expect(() => new InvariantFormatter(null, null)).toThrowError(TypeError);
            expect(() => new InvariantFormatter(undefined, undefined)).toThrowError(TypeError);
            expect(() => new InvariantFormatter(IntlOptionsProvider, null)).toThrowError(Errors.ArgumentNullError);
            expect(() => new InvariantFormatter(IntlOptionsProvider, undefined)).toThrowError(Errors.ArgumentNullError);
        });

        it("format should apply the format string's options and retain its original clean instance state regardless of output", () => {

            let date = new Date(2015, 8, 1);

            expect(invariantFormatter.format("", date)).toBeDefined();
            expectCleanState();
            expect(invariantFormatter.format("d", date)).toBe("09/01/2015");
            expectCleanState();
            expect(invariantFormatter.format("%d", date)).toBe("1");
            expectCleanState();
            expect(() => invariantFormatter.format("x", date)).toThrowError(Errors.FormatError);
            expectCleanState();
        });

        it("format should throw InvalidOperationError if the option's provider returns an unsupported style option", () => {

            invariantFormatter = new InvariantFormatter(IntlOptionsProvider, DateTimeFormatInfo.InvariantInfo, { style: "unsupported" });

            expect(() => invariantFormatter.format("%d", new Date())).toThrowError(Errors.ArgumentError);
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

            invariantFormatter = new InvariantFormatter(emptyOptionsProvider, DateTimeFormatInfo.InvariantInfo, intlOptions);

            expect(() => invariantFormatter.format("", new Date())).toThrowError(Errors.InvalidOperationError);
            expectCleanState();
        });
    });
}
