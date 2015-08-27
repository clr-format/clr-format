/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Numeric" />

namespace Format.Utils {

    describe("Numeric toExponentialMinMax", () => {

        let value = 123.456;

        it("should return/throw the best fitting value/error for its Number.toFixed handler", () => {

            expect(Numeric.toExponentialMinMax(value, 0, 7)).toBe("1.23456e+2");
            expect(Numeric.toExponentialMinMax(value, 0, 5)).toBe("1.23456e+2");
            expect(Numeric.toExponentialMinMax(value, undefined, 7)).toBe("1.23456e+2");
            expect(Numeric.toExponentialMinMax(value, null, 6)).toBe("1.23456e+2");
            expect(Numeric.toExponentialMinMax(value, undefined, 5)).toBe("1.23456e+2");
            expect(Numeric.toExponentialMinMax(value, null, 3)).toBe("1.235e+2");
            expect(Numeric.toExponentialMinMax(value, 4, undefined)).toBe("1.23456e+2");
            expect(Numeric.toExponentialMinMax(value, 2, null)).toBe("1.23456e+2");
            expect(Numeric.toExponentialMinMax(value, 6, null)).toBe("1.234560e+2");
            expect(Numeric.toExponentialMinMax(value, 7, undefined)).toBe("1.2345600e+2");
            expect(Numeric.toExponentialMinMax(value, 0, 0)).toBe("1e+2");
            expect(Numeric.toExponentialMinMax(value, undefined, null)).toBe("1.23456e+2");

            expect(() => Numeric.toExponentialMinMax(value, -1, undefined)).toThrowError(RangeError);
            expect(() => Numeric.toExponentialMinMax(value, null, -1)).toThrowError(RangeError);
        });

        it("should throw appropriate errors during parameters' validation", () => {

            expect(() => Numeric.toExponentialMinMax(null, 0, 0)).toThrowError(Errors.ArgumentNullError);
            expect(() => Numeric.toExponentialMinMax(undefined, 0, 0)).toThrowError(Errors.ArgumentNullError);

            expect(() => Numeric.toExponentialMinMax(NaN, 0, 0)).toThrowError(Errors.ArgumentError);
            expect(() => Numeric.toExponentialMinMax(Infinity, 0, 0)).toThrowError(Errors.ArgumentError);
            expect(() => Numeric.toExponentialMinMax(value, NaN, 0)).toThrowError(Errors.ArgumentError);
            expect(() => Numeric.toExponentialMinMax(value, 1, NaN)).toThrowError(Errors.ArgumentError);
            expect(() => Numeric.toExponentialMinMax(value, Infinity, undefined)).toThrowError(Errors.ArgumentError);
            expect(() => Numeric.toExponentialMinMax(value, null, Infinity)).toThrowError(Errors.ArgumentError);

            expect(() => Numeric.toExponentialMinMax(value, 1, 0)).toThrowError(RangeError);
            expect(() => Numeric.toExponentialMinMax(value, 0, 21)).toThrowError(RangeError);
        });
    });
}
