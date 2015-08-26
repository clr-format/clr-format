/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Lazy" />
/// <reference path="../../../src/core/Utils/Object" />
/// <reference path="../../../src/core/Utils/Function" />

namespace Format.Utils {

    describe("Utils isEmpty", () => {

        it("should return true if an object contains no enumerable properties", () => {

            expect(isEmpty({})).toBe(true);
            expect(isEmpty([])).toBe(true);
            expect(isEmpty(() => "")).toBe(true);

            expect(isEmpty(new Date())).toBe(true);
            expect(isEmpty(new Array())).toBe(true);
            expect(isEmpty(new Object())).toBe(true);
            expect(isEmpty(new Object(null))).toBe(true);
        });

        it("should return false if an object contains enumerable properties", () => {
            expect(isEmpty({ a: 1 })).toBe(false);
            expect(isEmpty([1])).toBe(false);
            expect(isEmpty(new Lazy(Function.getEmpty()))).toBe(false);
        });

        it("should throw a TypeError when the argument is not an object", () => {
            expect(() => isEmpty(0)).toThrowError(TypeError);
            expect(() => isEmpty("")).toThrowError(TypeError);
            expect(() => isEmpty(true)).toThrowError(TypeError);
            expect(() => isEmpty(null)).toThrowError(TypeError);
            expect(() => isEmpty(undefined)).toThrowError(TypeError);
        });
    });
}
