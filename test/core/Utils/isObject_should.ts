/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/General" />

module Format.Utils {

    describe("Object isObject", () => {

        it("should return true if an object is a pure object instance", () => {

            expect(isObject({})).toBe(true);
            expect(isObject(new Object())).toBe(true);
            expect(isObject(new Object(null))).toBe(true);
        });

        it("should return false if an object is an object derivative", () => {

            expect(isObject([])).toBe(false);
            expect(isObject(null)).toBe(false);
            expect(isObject(undefined)).toBe(false);
            expect(isObject(Function.getEmpty())).toBe(false);

            expect(isObject(Number(0))).toBe(false);
            expect(isObject(String(""))).toBe(false);
            expect(isObject(Boolean(true))).toBe(false);
            expect(isObject(new RegExp(""))).toBe(false);
            expect(isObject(new Date())).toBe(false);
        });
    });
}
