/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Enumerable" />

namespace Format.Utils {

    describe("Enumerable compact", () => {

        let getArray = () => [undefined, 1, undefined, undefined, 2, 3, undefined, 4, undefined];

        it("should remove all undefined elements and reindex the array", () => {

            let array = getArray();

            expect(Enumerable.compact(array)).toBe(array);
            expect(Enumerable.compact(array)).toEqual([1, 2, 3, 4]);
        });

        it("should throw an ArgumentNullError for an array with an undefined value", () => {
            expect(() => Enumerable.compact(undefined)).toThrowError(Errors.ArgumentNullError);
            expect(() => Enumerable.compact(null)).toThrowError(Errors.ArgumentNullError);
        });
    });
}
