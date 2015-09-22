/// <reference path="../../../typings/jasmine/jasmine" />

/// <reference path="../../../../src/core/Globalization/Numeric/ExponentialFormatter" />
/// <reference path="../../../../src/core/Globalization/Numeric/IntlOptionsProvider" />

namespace Format.Globalization.Numeric {

    describe("ExponentialFormatter", () => {

        let exponentialFormatter: ExponentialFormatter<Intl.NumberFormatOptions>;
        let exponentialFormatterAccessor: any;

        let setOptions = (intlOptions: Intl.NumberFormatOptions) => {
            exponentialFormatter = exponentialFormatterAccessor = new ExponentialFormatter(
                new IntlOptionsProvider(intlOptions));
        };

        it("constructor should initialize options' fields and format info's object", () => {

            let intlOptions: Intl.NumberFormatOptions = {
                minimumIntegerDigits: 2,
                minimumFractionDigits: 4,
                maximumFractionDigits: 8,
                minimumExponentDigits: 3,
                negativellySignedExponent: true
            };

            setOptions(intlOptions);

            expect(exponentialFormatter).toBeDefined();
            expect(exponentialFormatterAccessor.minimumIntegerDigits_).toBe(intlOptions.minimumIntegerDigits);
            expect(exponentialFormatterAccessor.minimumFractionDigits_).toBe(intlOptions.minimumFractionDigits);
            expect(exponentialFormatterAccessor.maximumFractionDigits_).toBe(intlOptions.maximumFractionDigits);
            expect(exponentialFormatterAccessor.minimumExponentDigits_).toBe(intlOptions.minimumExponentDigits);
            expect(exponentialFormatterAccessor.negativellySignedExponent_).toBe(intlOptions.negativellySignedExponent);
        });

        it("constructor should throw an ArgumentNullError for parameter(s) with null or undefined values", () => {
            expect(() => new ExponentialFormatter(null)).toThrowError(Errors.ArgumentNullError);
            expect(() => new ExponentialFormatter(undefined)).toThrowError(Errors.ArgumentNullError);
        });

        it("applyOptions should apply the provided exponential format options", () => {

            setOptions({ minimumIntegerDigits: 4.2, minimumFractionDigits: null });
            expect(exponentialFormatter.applyOptions(-0.123005)).toBe("-1230.05e-4");

            setOptions({ minimumIntegerDigits: 3, minimumExponentDigits: 2 });
            expect(exponentialFormatter.applyOptions(-0.12305)).toBe("-123.05e-03");

            setOptions({ minimumIntegerDigits: 4, minimumExponentDigits: null });
            expect(exponentialFormatter.applyOptions(-12)).toBe("-1200e-2");

            setOptions({ minimumIntegerDigits: 4, minimumFractionDigits: 1 });
            expect(exponentialFormatter.applyOptions(-12)).toBe("-1200.0e-2");

            setOptions({ minimumIntegerDigits: 5, maximumFractionDigits: null });
            expect(exponentialFormatter.applyOptions(12345678)).toBe("12345.678e+3");

            setOptions({ minimumIntegerDigits: 5, minimumExponentDigits: 3 });
            expect(exponentialFormatter.applyOptions(12345678)).toBe("12345.678e+003");

            setOptions({ minimumIntegerDigits: 5, maximumFractionDigits: 0.1 });
            expect(exponentialFormatter.applyOptions(12345678)).toBe("12346e+3");

            setOptions({ minimumIntegerDigits: 5, minimumFractionDigits: 5.9 });
            expect(exponentialFormatter.applyOptions(12345678)).toBe("12345.67800e+3");

            setOptions({ minimumIntegerDigits: 1, minimumFractionDigits: 3.3 });
            expect(exponentialFormatter.applyOptions(-1.23)).toBe("-1.230e+0");

            setOptions({ minimumIntegerDigits: 1.9, minimumFractionDigits: 3 });
            expect(exponentialFormatter.applyOptions(-0.123456789)).toBe("-1.23456789e-1");

            setOptions({ minimumIntegerDigits: null, maximumFractionDigits: 3.9 });
            expect(exponentialFormatter.applyOptions(-0.12305)).toBe("-1.231e-1");

            setOptions({
                minimumExponentDigits: 3,
                minimumFractionDigits: 1,
                maximumFractionDigits: 10,
                negativellySignedExponent: true
            });
            expect(exponentialFormatter.applyOptions(-0.12305)).toBe("-1.2305e-001");

            setOptions({ negativellySignedExponent: true });
            expect(exponentialFormatter.applyOptions(-12305)).toBe("-1.2305e4");
        });

        it("applyExponentPadding should apply the provided minimum exponent digits option", () => {

            setOptions({ minimumExponentDigits: 2 });
            expect(exponentialFormatter.applyExponentPadding("-123.05e-5")).toBe("-123.05e-05");
        });

        it("applyOptions should throw RangeError or ArgumentError when the resolved options are not applicable to the native exponential notation", () => {

            setOptions({ minimumFractionDigits: -1 });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(RangeError);

            setOptions({ minimumFractionDigits: NaN });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(Errors.ArgumentError);

            setOptions({ minimumFractionDigits: Infinity });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(Errors.ArgumentError);

            setOptions({ maximumFractionDigits: -1 });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(RangeError);

            setOptions({ maximumFractionDigits: NaN });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(Errors.ArgumentError);

            setOptions({ maximumFractionDigits: Infinity });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(Errors.ArgumentError);

            setOptions({ minimumFractionDigits: 2, maximumFractionDigits: 1 });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(RangeError);
        });

        it("applyOptions should throw RangeError or ArgumentError when the resolved options are not applicable to the custom exponential notation", () => {

            setOptions({ minimumIntegerDigits: 0.9 });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(Errors.ArgumentError);

            setOptions({ minimumIntegerDigits: -1 });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(Errors.ArgumentError);

            setOptions({ minimumIntegerDigits: NaN });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(Errors.ArgumentError);

            setOptions({ minimumIntegerDigits: Infinity });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(Errors.ArgumentError);

            setOptions({ minimumIntegerDigits: 2, minimumExponentDigits: 0 });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(Errors.ArgumentError);

            setOptions({ minimumIntegerDigits: 2, minimumExponentDigits: NaN });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(Errors.ArgumentError);

            setOptions({ minimumIntegerDigits: 2, minimumExponentDigits: Infinity });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(Errors.ArgumentError);

            setOptions({ minimumIntegerDigits: 2, minimumFractionDigits: -1 });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(Errors.ArgumentError);

            setOptions({ minimumIntegerDigits: 2, minimumFractionDigits: NaN });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(Errors.ArgumentError);

            setOptions({ minimumIntegerDigits: 2, minimumFractionDigits: Infinity });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(Errors.ArgumentError);

            setOptions({ minimumIntegerDigits: 2, maximumFractionDigits: -1 });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(Errors.ArgumentError);

            setOptions({ minimumIntegerDigits: 2, maximumFractionDigits: NaN });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(Errors.ArgumentError);

            setOptions({ minimumIntegerDigits: 2, maximumFractionDigits: Infinity });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(Errors.ArgumentError);

            setOptions({ minimumIntegerDigits: 2, minimumFractionDigits: 1, maximumFractionDigits: 0 });
            expect(() => exponentialFormatter.applyOptions(1)).toThrowError(RangeError);
        });

        it("applyExponentPadding should throw ArgumentError when the 'minimumExponentDigits' option is not applicable", () => {

            setOptions({ minimumExponentDigits: 0 });
            expect(() => exponentialFormatter.applyExponentPadding("0e+0")).toThrowError(Errors.ArgumentError);

            setOptions({ minimumExponentDigits: NaN });
            expect(() => exponentialFormatter.applyExponentPadding("0e+0")).toThrowError(Errors.ArgumentError);

            setOptions({ minimumExponentDigits: Infinity });
            expect(() => exponentialFormatter.applyExponentPadding("0e+0")).toThrowError(Errors.ArgumentError);
        });
    });
}
