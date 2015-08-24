/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Numeric" />

namespace Format.Utils {

    describe("Numeric isCounting", () => {

        it("should return true for counting number values", () => {
            expect(Numeric.isCounting(1)).toBe(true);
            expect(Numeric.isCounting(12)).toBe(true);
            expect(Numeric.isCounting(123)).toBe(true);
        });

        it("should return false for non-integer values", () => {

            expect(Numeric.isCounting(null)).toBe(false);
            expect(Numeric.isCounting(undefined)).toBe(false);

            expect(Numeric.isCounting(NaN)).toBe(false);
            expect(Numeric.isCounting(Infinity)).toBe(false);

            expect(Numeric.isCounting(0)).toBe(false);
            expect(Numeric.isCounting(-12)).toBe(false);
        });
    });
}
