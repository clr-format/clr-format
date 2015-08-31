/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Polyfill" />

namespace Format.Utils {

    describe("Polyfill isArray", () => {

        it("should return true if an object is an array instance", () => {

            expect(Polyfill.isArray([])).toBe(true);
            expect(Polyfill.isArray(new Array())).toBe(true);
            expect(Polyfill.isArray(new Object([]))).toBe(true);
        });

        it("should return false if the object is not an array instance", () => {

            expect(Polyfill.isArray({})).toBe(false);
            expect(Polyfill.isArray(null)).toBe(false);
            expect(Polyfill.isArray(undefined)).toBe(false);
            expect(Polyfill.isArray(Function.getEmpty())).toBe(false);

            expect(Polyfill.isArray(Number(0))).toBe(false);
            expect(Polyfill.isArray(String(""))).toBe(false);
            expect(Polyfill.isArray(Boolean(true))).toBe(false);

            expect(Polyfill.isArray(new Date())).toBe(false);
            expect(Polyfill.isArray(new Object())).toBe(false);
            expect(Polyfill.isArray(new RegExp(""))).toBe(false);
        });
    });
}
