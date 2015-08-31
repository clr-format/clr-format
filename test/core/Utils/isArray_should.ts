/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Types" />

namespace Format.Utils {

    describe("Utils isArray", () => {

        it("should return true if an object is an array instance", () => {

            expect(isArray([])).toBe(true);
            expect(isArray(new Array())).toBe(true);
            expect(isArray(new Object([]))).toBe(true);
        });

        it("should return false if the object is not an array instance", () => {

            expect(isArray({})).toBe(false);
            expect(isArray(null)).toBe(false);
            expect(isArray(undefined)).toBe(false);
            expect(isArray(Function.getEmpty())).toBe(false);

            expect(isArray(Number(0))).toBe(false);
            expect(isArray(String(""))).toBe(false);
            expect(isArray(Boolean(true))).toBe(false);

            expect(isArray(new Date())).toBe(false);
            expect(isArray(new Object())).toBe(false);
            expect(isArray(new RegExp(""))).toBe(false);
        });
    });
}
