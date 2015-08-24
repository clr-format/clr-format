/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Text" />

namespace Format.Utils {

    describe("Text isNullOrWhitespace", () => {

        it("should return true for null, undefined, empty and whitespace-only strings", () => {
            expect(Text.isNullOrWhitespace(null)).toBe(true);
            expect(Text.isNullOrWhitespace(undefined)).toBe(true);
            expect(Text.isNullOrWhitespace("")).toBe(true);
            expect(Text.isNullOrWhitespace("   ")).toBe(true);
        });

        it("should return false for strings that contain text", () => {
            expect(Text.isNullOrWhitespace(" text ")).toBe(false);
        });
    });
}
