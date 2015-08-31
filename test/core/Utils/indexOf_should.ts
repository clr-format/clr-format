/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Enumerable" />

namespace Format.Utils {

    describe("Enumerable indexOf", () => {

        let array = [2, 5, 9];

        it("should return the same results as the standard Array.prototype.indexOf function", () => {
            expect(Enumerable.indexOf(array, 2)).toBe(0);
            expect(Enumerable.indexOf(array, 7)).toBe(-1);
            expect(Enumerable.indexOf(array, 9, 2)).toBe(2);
            expect(Enumerable.indexOf(array, 2, -1)).toBe(-1);
            expect(Enumerable.indexOf(array, 2, -3)).toBe(0);
        });

        it("should throw an ArgumentNullError for an array with an undefined value", () => {
            expect(() => Enumerable.indexOf(undefined, null)).toThrowError(Errors.ArgumentNullError);
            expect(() => Enumerable.indexOf(null, null)).toThrowError(Errors.ArgumentNullError);
        });

        it("should throw an ArgumentError for a 'fromIndex' argument that is not an integer", () => {
            expect(() => Enumerable.indexOf(array, null, 1.2)).toThrowError(Errors.ArgumentError);
            expect(() => Enumerable.indexOf(array, null, Infinity)).toThrowError(Errors.ArgumentError);
        });
    });
}
