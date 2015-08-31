/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Polyfill" />

namespace Format.Utils {

    describe("Polyfill indexOf", () => {

        let array = [2, 5, 9];

        it("should return the same results as the standard Array.prototype.indexOf function", () => {
            expect(Polyfill.indexOf(array, 2)).toBe(0);
            expect(Polyfill.indexOf(array, 7)).toBe(-1);
            expect(Polyfill.indexOf(array, 9, 2)).toBe(2);
            expect(Polyfill.indexOf(array, 2, -1)).toBe(-1);
            expect(Polyfill.indexOf(array, 2, -3)).toBe(0);
        });

        it("should throw an ArgumentNullError for an array with an undefined value", () => {
            expect(() => Polyfill.indexOf(undefined, null)).toThrowError(Errors.ArgumentNullError);
            expect(() => Polyfill.indexOf(null, null)).toThrowError(Errors.ArgumentNullError);
        });

        it("should throw an ArgumentError for a 'fromIndex' argument that is not an integer", () => {
            expect(() => Polyfill.indexOf(array, null, 1.2)).toThrowError(Errors.ArgumentError);
            expect(() => Polyfill.indexOf(array, null, Infinity)).toThrowError(Errors.ArgumentError);
        });
    });
}
