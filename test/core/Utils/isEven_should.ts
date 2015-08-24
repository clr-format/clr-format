/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Numeric" />

namespace Format.Utils {

    describe("Numeric isEven", () => {

        it("should return true for even number values", () => {
            expect(Numeric.isEven(0)).toBe(true);
            expect(Numeric.isEven(12)).toBe(true);
            expect(Numeric.isEven(-2)).toBe(true);
        });

        it("should return false for odd number values", () => {
            expect(Numeric.isEven(11)).toBe(false);
            expect(Numeric.isEven(-1)).toBe(false);
        });

        it("should throw an ArgumentError for non-integer values", () => {

            expect(() => Numeric.isEven(null)).toThrowError(Errors.ArgumentError);
            expect(() => Numeric.isEven(undefined)).toThrowError(Errors.ArgumentError);

            expect(() => Numeric.isEven(NaN)).toThrowError(Errors.ArgumentError);
            expect(() => Numeric.isEven(Infinity)).toThrowError(Errors.ArgumentError);
        });
    });
}
