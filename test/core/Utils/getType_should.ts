/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/General" />

namespace Format.Utils {

    describe("Utils getType", () => {

        let supportsDOM = () => typeof window !== "undefined";

        it("should return the appropriate type strings returned by Object.prototype.toString calls", () => {

            expect(getType(null)).toBe("[object Null]");
            expect(getType(undefined)).toBe("[object Undefined]");

            expect(getType({})).toBe("[object Object]");
            expect(getType([])).toBe("[object Array]");

            expect(getType(0)).toBe("[object Number]");
            expect(getType("")).toBe("[object String]");
            expect(getType(true)).toBe("[object Boolean]");

            expect(getType(Math)).toBe("[object Math]");
            expect(getType(JSON)).toBe("[object JSON]");
            expect(getType(new Date())).toBe("[object Date]");
            expect(getType(new RegExp(""))).toBe("[object RegExp]");

            expect(getType(Function.getEmpty())).toBe("[object Function]");

            if (supportsDOM()) {
                expect(getType(window)).toMatch(/[object (global)|(Window)]/);
                expect(getType(document)).toBe("[object HTMLDocument]");
                expect(getType(document.firstChild)).toBe("[object DocumentType]");
            }
        });
    });
}
