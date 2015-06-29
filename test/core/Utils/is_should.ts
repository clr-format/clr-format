/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/General" />

module Format.Utils {

    describe("Object is", () => {

        let supportsDOM = () => typeof window !== "undefined";

        it("should return the appropriate boolean value respective to the object's Object.prototype.toString call and the type argument", () => {

            expect(is("Null", null)).toBe(true);
            expect(is("Null", undefined)).toBe(false);

            expect(is("Undefined", undefined)).toBe(true);
            expect(is("Undefined", null)).toBe(false);

            expect(is("Object", {})).toBe(true);
            expect(is("Object", [])).toBe(false);

            expect(is("Array", [])).toBe(true);
            expect(is("Array", {})).toBe(false);

            expect(is("Number", 0)).toBe(true);
            expect(is("Number", "")).toBe(false);

            expect(is("String", "")).toBe(true);
            expect(is("String", 0)).toBe(false);

            expect(is("Boolean", true)).toBe(true);
            expect(is("Boolean", NaN)).toBe(false);

            expect(is("Math", Math)).toBe(true);
            expect(is("Math", JSON)).toBe(false);

            expect(is("JSON", JSON)).toBe(true);
            expect(is("JSON", Math)).toBe(false);

            expect(is("Date", new Date())).toBe(true);
            expect(is("Date", new RegExp(""))).toBe(false);

            expect(is("RegExp", new RegExp(""))).toBe(true);
            expect(is("RegExp", new Date())).toBe(false);

            expect(is("Function", Function.getEmpty())).toBe(true);
            expect(is("Function", undefined)).toBe(false);

            if (supportsDOM()) {
                expect(is("global", window) || is("Window", window)).toBe(true);

                expect(is("HTMLDocument", document)).toBe(true);
                expect(is("HTMLDocument", document.firstChild)).toBe(false);

                expect(is("DocumentType", document.firstChild)).toBe(true);
                expect(is("DocumentType", document)).toBe(false);
            }
        });
    });
}
