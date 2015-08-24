/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/General" />

namespace Format.Utils {

    describe("Utils getType / getTypeString / Types", () => {

        let supportsDOM = () => typeof window !== "undefined";

        it("should return the appropriate type strings returned by Object.prototype.toString calls", () => {

            expect(getType(null)).toBe(Types.Null);
            expect(getType(undefined)).toBe(Types.Undefined);

            expect(getType({})).toBe(Types.Object);
            expect(getType([])).toBe(Types.Array);

            expect(getType(0)).toBe(Types.Number);
            expect(getType("")).toBe(Types.String);
            expect(getType(true)).toBe(Types.Boolean);

            expect(getType(Math)).toBe(getTypeString("Math"));
            expect(getType(JSON)).toBe(getTypeString("JSON"));
            expect(getType(new Date())).toBe(Types.Date);
            expect(getType(new RegExp(""))).toBe(Types.RegExp);

            expect(getType(Function.getEmpty())).toBe(Types.Function);

            if (supportsDOM()) {
                expect(getType(window)).toMatch(/[object (global)|(Window)]/);
                expect(getType(document)).toBe(getTypeString("HTMLDocument"));
                expect(getType(document.firstChild)).toBe(getTypeString("DocumentType"));
            }
        });
    });
}
