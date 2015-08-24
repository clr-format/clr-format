/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Numeric" />

namespace Format.Utils {

    describe("Numeric isWhole", () => {

        it("should return true for counting number values", () => {
            expect(Numeric.isWhole(0)).toBe(true);
            expect(Numeric.isWhole(1)).toBe(true);
            expect(Numeric.isWhole(123)).toBe(true);
        });

        it("should return false for non-integer values", () => {

            expect(Numeric.isWhole(null)).toBe(false);
            expect(Numeric.isWhole(undefined)).toBe(false);

            expect(Numeric.isWhole(NaN)).toBe(false);
            expect(Numeric.isWhole(Infinity)).toBe(false);

            expect(Numeric.isWhole(-1)).toBe(false);
        });
    });
}
