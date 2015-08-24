/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Numeric" />

namespace Format.Utils {

    describe("Numeric isInteger", () => {

        it("should return true for integer values", () => {
            expect(Numeric.isInteger(0)).toBe(true);
            expect(Numeric.isInteger(123)).toBe(true);
            expect(Numeric.isInteger(-99)).toBe(true);
        });

        it("should return false for non-integer values", () => {

            expect(Numeric.isInteger(null)).toBe(false);
            expect(Numeric.isInteger(undefined)).toBe(false);

            expect(Numeric.isInteger(NaN)).toBe(false);
            expect(Numeric.isInteger(Infinity)).toBe(false);
        });
    });
}
