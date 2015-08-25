/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Numeric" />

namespace Format.Utils {

    describe("Numeric toFixedMinMax", () => {

        let value = 123.456;
        let supportsToFixedWithNegativeDigitsParameter = () => {
            try { (0).toFixed(-1); }
            catch (e) {
                return false;
            }
            return true;
        };

        it("should return/throw the best fitting value/error for its Number.toFixed handler", () => {

            expect(Numeric.toFixedMinMax(value, 0, 3)).toBe("123.456");
            expect(Numeric.toFixedMinMax(value, 0, 5)).toBe("123.456");
            expect(Numeric.toFixedMinMax(value, undefined, 5)).toBe("123.456");
            expect(Numeric.toFixedMinMax(value, null, 4)).toBe("123.456");
            expect(Numeric.toFixedMinMax(value, undefined, 2)).toBe("123.46");
            expect(Numeric.toFixedMinMax(value, 1, undefined)).toBe("123.456");
            expect(Numeric.toFixedMinMax(value, 4, null)).toBe("123.4560");
            expect(Numeric.toFixedMinMax(value, 5, undefined)).toBe("123.45600");
            expect(Numeric.toFixedMinMax(value, 0, 0)).toBe("123");
            expect(Numeric.toFixedMinMax(value, undefined, null)).toBe("123.456");

            if (supportsToFixedWithNegativeDigitsParameter()) {
                expect(Numeric.toFixedMinMax(value, -1, undefined)).toBe("123.456");
                expect(Numeric.toFixedMinMax(value, -1, -1)).toBe("120");
                expect(Numeric.toFixedMinMax(value, -3, null)).toBe("123");
                expect(Numeric.toFixedMinMax(value, -3, -3)).toBe("0");
            }
            else {
                expect(() => Numeric.toFixedMinMax(value, -1, undefined)).toThrowError(RangeError);
                expect(() => Numeric.toFixedMinMax(value, null, -1)).toThrowError(RangeError);
            }
        });

        it("should throw appropriate errors during parameters' validation", () => {

            expect(() => Numeric.toFixedMinMax(value, NaN, 0)).toThrowError(Errors.ArgumentError);
            expect(() => Numeric.toFixedMinMax(value, 1, NaN)).toThrowError(Errors.ArgumentError);
            expect(() => Numeric.toFixedMinMax(value, Infinity, undefined)).toThrowError(Errors.ArgumentError);
            expect(() => Numeric.toFixedMinMax(value, null, Infinity)).toThrowError(Errors.ArgumentError);

            expect(() => Numeric.toFixedMinMax(value, 1, 0)).toThrowError(RangeError);
            expect(() => Numeric.toFixedMinMax(value, 0, 21)).toThrowError(RangeError);
        });
    });
}
