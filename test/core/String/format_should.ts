/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Format" />

namespace Format {

    describe("String format", () => {

        it("should replace the mandatory format items' index component with their corresponding formatted values", () => {

            expect(
                String.format(
                    "Format primitives: {0}{5}, {4}, {3}, {1}, {2}",
                    0, { "a": 1 }, [2], "3", true, undefined))
                .toBe("Format primitives: 0, true, 3, {\"a\":1}, [2]");

            expect(() => {
                String.format("{1}", 0);
            }).toThrowError(Errors.FormatError);
        });

        it("should apply the optional format items' alignment component by padding the formatted values", () => {

            let formatString = "{0,-10} {1,11}";

            expect(String.format(undefined, formatString, "LeftAlign", "RightAlign"))
                .toBe("LeftAlign   RightAlign");

            expect(String.format(undefined, formatString, "LeftOverflow", "RightOverflow"))
                .toBe("LeftOverflow RightOverflow");

            expect(() => {
                String.format("{0,a}", 0);
            }).toThrowError(Errors.FormatError);

            expect(() => {
                String.format("{0,1.2}", 0);
            }).toThrowError(Errors.FormatError);

            expect(() => {
                String.format("{0,NaN}", 0);
            }).toThrowError(Errors.FormatError);

            expect(() => {
                String.format("{0,Infinity}", 0);
            }).toThrowError(Errors.FormatError);
        });

        it("should apply curly braces escaping behaviour but only to matches of the format item pattern", () => {

            expect(String.format("{{0}}", 1)).toBe("{0}");
            expect(String.format("{{{0}}}", 1)).toBe("{1}");
            expect(String.format("{{{{0}}}}", 1)).toBe("{{0}}");
            expect(String.format("{{{{{0}}}}}", 1)).toBe("{{1}}");

            expect(String.format("{text}", 1)).toBe("{text}");
            expect(String.format("{0text}", 1)).toBe("{0text}");
            expect(String.format("{1 text}", 1)).toBe("{1 text}");

            expect(() => {
                String.format("{{0}", 1);
            }).toThrowError(Errors.FormatError);

            expect(() => {
                String.format("{0}}", 1);
            }).toThrowError(Errors.FormatError);
        });

        it("should throw a FormatError for a format provider which does not return a CustomFormatter instance", () => {
            expect(() => String.format({ getFormatter: Utils.Function.getEmpty<Globalization.CustomFormatter>() }, "{0}", undefined)).toThrowError(Errors.FormatError);
        });

        it("should throw an ArgumentError for a format provider which does not implement the FormatProvider interface", () => {
            expect(() => String.format({ getFormatter: undefined }, undefined)).toThrowError(Errors.ArgumentError);
            expect(() => String.format({ getFormatter: null }, null)).toThrowError(Errors.ArgumentError);
        });

        it("should throw an ArgumentNullError for a format with an undefined value", () => {
            expect(() => String.format(undefined)).toThrowError(Errors.ArgumentNullError);
            expect(() => String.format(null)).toThrowError(Errors.ArgumentNullError);
        });
    });
}
