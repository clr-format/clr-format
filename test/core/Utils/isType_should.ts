/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Types" />

namespace Format.Utils {

    describe("Utils isType", () => {

        let supportsDOM = () => typeof window !== "undefined";

        it("should return the appropriate boolean value respective to the object's Object.prototype.toString call and the type argument", () => {

            expect(isType("Object", {})).toBe(true);
            expect(isType("Object", [])).toBe(false);

            expect(isType("Array", [])).toBe(true);
            expect(isType("Array", {})).toBe(false);

            expect(isType("Number", 0)).toBe(true);
            expect(isType("Number", "")).toBe(false);

            expect(isType("String", "")).toBe(true);
            expect(isType("String", 0)).toBe(false);

            expect(isType("Boolean", true)).toBe(true);
            expect(isType("Boolean", NaN)).toBe(false);

            expect(isType("Math", Math)).toBe(true);
            expect(isType("Math", JSON)).toBe(false);

            expect(isType("JSON", JSON)).toBe(true);
            expect(isType("JSON", Math)).toBe(false);

            expect(isType("Date", new Date())).toBe(true);
            expect(isType("Date", new RegExp(""))).toBe(false);

            expect(isType("RegExp", new RegExp(""))).toBe(true);
            expect(isType("RegExp", new Date())).toBe(false);

            expect(isType("Function", Function.getEmpty())).toBe(true);
            expect(isType("Function", undefined)).toBe(false);

            if (supportsDOM()) {
                expect(isType("DocumentType", document.firstChild)).toBe(true);
                expect(isType("DocumentType", document)).toBe(false);
            }
        });
    });
}
