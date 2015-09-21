/// <reference path="../../../typings/jasmine/jasmine" />

/// <reference path="../../../../src/core/Globalization/NumberFormatInfo" />

/// <reference path="../../../../src/core/Globalization/Numeric/InvariantFormatter" />
/// <reference path="../../../../src/core/Globalization/Numeric/IntlOptionsProvider" />

namespace Format.Globalization.Numeric {

    describe("InvariantFormatter", () => {

        let intlOptions: Intl.NumberFormatOptions;
        let invariantFormatter: InvariantFormatter<Intl.NumberFormatOptions>;
        let invariantFormatterAccessor: any;

        let expectCleanState = () => {
            expect(invariantFormatterAccessor.optionsProviderConstructor).toBe(IntlOptionsProvider);
            expect(invariantFormatterAccessor.baseOptions).toBe(intlOptions);
            expect(invariantFormatterAccessor.value).toBeUndefined();
            expect(invariantFormatterAccessor.resolvedOptions).toBeUndefined();
            expect(invariantFormatterAccessor.optionsProvider).toBeUndefined();
            expect(invariantFormatterAccessor.decorationFormatter).toBeUndefined();
        };

        beforeAll(() => {
            intlOptions = {};
            invariantFormatter = invariantFormatterAccessor = new InvariantFormatter(IntlOptionsProvider, NumberFormatInfo.InvariantInfo, intlOptions);
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

            expect(invariantFormatter.format("", 0)).toBe("0");
            expectCleanState();
            expect(invariantFormatter.format("e", 0)).toBe("0.000000e+000");
            expectCleanState();
            expect(invariantFormatter.format("#", 0)).toBe("");
            expectCleanState();
            expect(() => invariantFormatter.format("C", 0)).toThrowError(Errors.NotImplementedError);
            expectCleanState();
            expect(() => invariantFormatter.format("Z0", 0)).toThrowError(Errors.FormatError);
            expectCleanState();
        });

        it("format should throw InvalidOperationError if the option's provider returns an unsupported style option", () => {

            invariantFormatter = new InvariantFormatter(IntlOptionsProvider, NumberFormatInfo.InvariantInfo, { style: "unsupported" });

            expect(() => invariantFormatter.format("", 0)).toThrowError(Errors.ArgumentError);
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

            invariantFormatter = new InvariantFormatter(emptyOptionsProvider, NumberFormatInfo.InvariantInfo, intlOptions);

            expect(() => invariantFormatter.format("", 0)).toThrowError(Errors.InvalidOperationError);
            expectCleanState();
        });
    });
}
