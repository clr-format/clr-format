/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Text" />

namespace Format.Utils {

    describe("Text insert", () => {

        it("should insert strings inside a value string given a start index and another string value to insert", () => {
            expect(Text.insert(" text here", 0, "insert")).toBe("insert text here");
            expect(Text.insert("insert  here", 7, "text")).toBe("insert text here");
            expect(Text.insert("insert text ", 12, "here")).toBe("insert text here");
        });

        it("should throw an ArgumentNullError when any of the parameters is null", () => {
            expect(() => Text.insert(undefined, 0, "text")).toThrowError(Errors.ArgumentNullError);
            expect(() => Text.insert("text", null, "")).toThrowError(Errors.ArgumentNullError);
            expect(() => Text.insert("text", NaN, undefined)).toThrowError(Errors.ArgumentNullError);
        });

        it("should throw a RangeError when the start index argument is invalid or not inside the value string", () => {
            expect(() => Text.insert("text", -1, "")).toThrowError(RangeError);
            expect(() => Text.insert("text", 10, "")).toThrowError(RangeError);
            expect(() => Text.insert("text", NaN, "")).toThrowError(RangeError);
            expect(() => Text.insert("text", Infinity, "")).toThrowError(RangeError);
        });
    });
}
