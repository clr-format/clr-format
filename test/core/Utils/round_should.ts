/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Polyfill" />

namespace Format.Utils {

    describe("Polyfill round", () => {

        it("should behave like the original Math.round but more accurately and allow negative values like FireFox", () => {

            expect(Polyfill.round(55.55, -1)).toBe(55.6);
            expect(Polyfill.round(55.549, -1)).toBe(55.5);
            expect(Polyfill.round(55, 1)).toBe(60);
            expect(Polyfill.round(54.9, 1)).toBe(50);
            expect(Polyfill.round(-55.55, -1)).toBe(-55.6);
            expect(Polyfill.round(-55.549, -1)).toBe(-55.5);
            expect(Polyfill.round(-55, 1)).toBe(-60);
            expect(Polyfill.round(-54.999, 1)).toBe(-50);
            expect(Polyfill.round(1.005, -2)).toBe(1.01);
            expect(Polyfill.round(0.005, -2)).toBe(0.01);
            expect(Polyfill.round(-0.005, -2)).toBe(-0.01);

            expect(Polyfill.round(0.5, 0)).toBe(1);
            expect(Polyfill.round(1.5, NaN)).toBe(2);
            expect(Polyfill.round(2.5, null)).toBe(3);
            expect(Polyfill.round(-2.5, undefined)).toBe(-2);
            expect(Polyfill.round(-1.5, Infinity)).toBe(-1);

            expect(Polyfill.round(NaN, 2)).toBeNaN();
            expect(Polyfill.round(Infinity, -2)).toBe(Infinity);
        });

        it("should throw an ArgumentNullError for values with undefined value", () => {
            expect(() => Polyfill.round(null, null)).toThrowError(Errors.ArgumentNullError);
            expect(() => Polyfill.round(undefined, undefined)).toThrowError(Errors.ArgumentNullError);
        });
    });
}
