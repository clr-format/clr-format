/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Polyfill" />

namespace Format.Utils {

    describe("Polyfill trim", () => {

        it("should trim leading and trailing whitespace", () => {
            expect(Polyfill.trim("")).toBe("");
            expect(Polyfill.trim("\n      \n")).toBe("");
            expect(Polyfill.trim("\n      leading")).toBe("leading");
            expect(Polyfill.trim("trailing      \n")).toBe("trailing");
            expect(Polyfill.trim("\n      leading and trailing      \n")).toBe("leading and trailing");
            expect(Polyfill.trim("no   leading \n or trailing")).toBe("no   leading \n or trailing");
        });

        it("should throw an ArgumentNullError for strings that are undefined or null", () => {
            expect(() => Polyfill.trim(null)).toThrowError(Errors.ArgumentNullError);
            expect(() => Polyfill.trim(undefined)).toThrowError(Errors.ArgumentNullError);
        });
    });
}
