/// <reference path="../../../typings/jasmine/jasmine" />

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
        };

        beforeAll(() => {
            intlOptions = {};
            invariantFormatter = invariantFormatterAccessor = new InvariantFormatter(IntlOptionsProvider, intlOptions);
        });

        it("constructor should initialize the options' object and options provider's constructor function", () => {
            expect(invariantFormatterAccessor.baseOptions).toBe(intlOptions);
            expect(invariantFormatterAccessor.optionsProviderConstructor).toBe(IntlOptionsProvider);
        });

        it("format should apply the format string's options and retain its original clean instance state regardless of output", () => {

            expect(invariantFormatter.format("", new Date())).toBeDefined();
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

            invariantFormatter = new InvariantFormatter(emptyOptionsProvider, intlOptions);

            expect(() => invariantFormatter.format("", new Date())).toThrowError(Errors.InvalidOperationError);
            expectCleanState();
        });
    });
}
