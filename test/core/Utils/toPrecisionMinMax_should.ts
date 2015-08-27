/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Numeric" />

namespace Format.Utils {

    describe("Numeric toPrecisionMinMax", () => {

        let value = 123.456;

        it("should return/throw the best fitting value/error for its Number.toFixed handler", () => {

            expect(Numeric.toPrecisionMinMax(value, 1, 8)).toBe("123.456");
            expect(Numeric.toPrecisionMinMax(value, 1, 6)).toBe("123.456");
            expect(Numeric.toPrecisionMinMax(value, null, 8)).toBe("123.456");
            expect(Numeric.toPrecisionMinMax(value, undefined, 7)).toBe("123.456");
            expect(Numeric.toPrecisionMinMax(value, null, 5)).toBe("123.46");
            expect(Numeric.toPrecisionMinMax(value, undefined, 3)).toBe("123");
            expect(Numeric.toPrecisionMinMax(value, 4, null)).toBe("123.456");
            expect(Numeric.toPrecisionMinMax(value, 2, undefined)).toBe("123.456");
            expect(Numeric.toPrecisionMinMax(value, 8, null)).toBe("123.45600");
            expect(Numeric.toPrecisionMinMax(value, 7, undefined)).toBe("123.4560");
            expect(Numeric.toPrecisionMinMax(value, 1, 1)).toBe("1e+2");
            expect(Numeric.toPrecisionMinMax(value, null, undefined)).toBe("123.456");

            expect(() => Numeric.toPrecisionMinMax(value, 0, null)).toThrowError(RangeError);
            expect(() => Numeric.toPrecisionMinMax(value, undefined, 0)).toThrowError(RangeError);
        });

        it("should throw appropriate errors during parameters' validation", () => {

            expect(() => Numeric.toPrecisionMinMax(null, 0, 0)).toThrowError(Errors.ArgumentNullError);
            expect(() => Numeric.toPrecisionMinMax(undefined, 0, 0)).toThrowError(Errors.ArgumentNullError);

            expect(() => Numeric.toPrecisionMinMax(NaN, 0, 0)).toThrowError(Errors.ArgumentError);
            expect(() => Numeric.toPrecisionMinMax(Infinity, 0, 0)).toThrowError(Errors.ArgumentError);
            expect(() => Numeric.toPrecisionMinMax(value, NaN, 0)).toThrowError(Errors.ArgumentError);
            expect(() => Numeric.toPrecisionMinMax(value, 1, NaN)).toThrowError(Errors.ArgumentError);
            expect(() => Numeric.toPrecisionMinMax(value, Infinity, undefined)).toThrowError(Errors.ArgumentError);
            expect(() => Numeric.toPrecisionMinMax(value, null, Infinity)).toThrowError(Errors.ArgumentError);

            expect(() => Numeric.toPrecisionMinMax(value, 1, 0)).toThrowError(RangeError);
            expect(() => Numeric.toPrecisionMinMax(value, 0, 21)).toThrowError(RangeError);
        });
    });
}
