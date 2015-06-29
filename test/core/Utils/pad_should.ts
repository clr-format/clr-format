/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Padding" />

module Format.Utils {

    describe("Padding apply", () => {

        it("should pad a string using the default options when they are not defined or falsy", () => {

            expect(Padding.pad("1", { totalWidth: 2 })).toBe("1 ");
            expect(Padding.pad("1", {
                totalWidth: 2,
                paddingChar: "",
                direction: 0
            })).toBe("1 ");
        });

        it("should not pad a string exceeding the 'totalWidth' option in length", () => {

            expect(Padding.pad("123", { totalWidth: 2 })).toBe("123");
        });

        it("should pad a string using the defined 'totalWidth' and 'direction' options", () => {

            expect(Padding.pad("123", {
                totalWidth: 5,
                paddingChar: "0",
                direction: Padding.Direction.Left
            })).toBe("00123");
        });

        it("should pad a string using the 'direction' option Both", () => {

            expect(Padding.pad("123", {
                totalWidth: 6,
                direction: Padding.Direction.Both
            })).toBe(" 123  ");
        });

        it("should throw an ArgumentUndefinedError when argument 'value' is undefined or empty", () => {
            expect(() => Padding.pad(undefined, { totalWidth: 0 })).toThrowError(Errors.ArgumentError);
            expect(() => Padding.pad(null, { totalWidth: 0 })).toThrowError(Errors.ArgumentError);
        });

        it("should throw an ArgumentError when option 'totalWidth' is not a positive whole number", () => {

            expect(() => Padding.pad("NaN", { totalWidth: NaN })).toThrowError(Errors.ArgumentError);
            expect(() => Padding.pad("Zero", { totalWidth: 0 })).toThrowError(Errors.ArgumentError);
            expect(() => Padding.pad("Negative", { totalWidth: -1 })).toThrowError(Errors.ArgumentError);
            expect(() => Padding.pad("Infinity", { totalWidth: Infinity })).toThrowError(Errors.ArgumentError);
            expect(() => Padding.pad("Undefined", { totalWidth: undefined })).toThrowError(Errors.ArgumentError);
            expect(() => Padding.pad("Null", { totalWidth: null })).toThrowError(Errors.ArgumentError);
        });

        it("should throw an ArgumentError when option 'paddingChar' doesn't define a single character", () => {
            expect(() => Padding.pad("1", { totalWidth: 5, paddingChar: "  " })).toThrowError(Errors.ArgumentError);
        });

        it("should throw an ArgumentError when option 'direction' isn't a member of the Direction enum", () => {
            expect(() => Padding.pad("1", { totalWidth: 5, direction: -1 })).toThrowError(Errors.ArgumentError);
        });
    });
}
