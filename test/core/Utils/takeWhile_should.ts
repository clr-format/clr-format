/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Enumerable" />

module Format.Utils {

    describe("Enumerable takeWhile", () => {

        let array: any[];

        beforeEach(() => {
            array = [];
        });

        it("should return a new array instance", () => {

            expect(Enumerable.takeWhile(array, () => true)).not.toBe(array);
        });

        it("should take elements while the predicate function is true", () => {

            array.push(1, "2", 3);

            expect(Enumerable.takeWhile(array, (x, i) => x <= 3 && i < 2)).toEqual([1, "2"]);
        });

        it("should throw a ArgumentNullError for an array with an undefined value", () => {
            expect(() => Enumerable.takeWhile(undefined, undefined)).toThrowError(Errors.ArgumentNullError);
            expect(() => Enumerable.takeWhile(null, null)).toThrowError(Errors.ArgumentNullError);
        });

        it("should throw a TypeError when a non-functional argument is passed", () => {
            expect(() => Enumerable.takeWhile(array, undefined)).toThrowError(TypeError);
            expect(() => Enumerable.takeWhile(array, null)).toThrowError(TypeError);
        });
    });
}
