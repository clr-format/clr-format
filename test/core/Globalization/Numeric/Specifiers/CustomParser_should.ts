/// <reference path="../../../../typings/jasmine/jasmine" />

/// <reference path="../../../../../src/core/Globalization/Numeric/Specifiers/CustomParser" />

namespace Format.Globalization.Numeric.Specifiers {

    describe("CustomParser", () => {

        let numericFormat: string;
        let customParser: CustomParser;
        let customParserAccessor: any;

        let createInstance = (format: string) => {
            numericFormat = format;
            customParser = customParserAccessor = new CustomParser(format);
        };

        it("constructor should initialize parser's fields", () => {

            createInstance("#.000");

            expect(customParserAccessor.index).toBe(0);
            expect(customParserAccessor.format).toBe(numericFormat);
            expect(customParserAccessor.lookahead).toBeDefined();
        });

        it("constructor should throw an ArgumentNullError for parameter(s) with null or undefined values", () => {
            expect(() => new CustomParser(null)).toThrowError(Errors.ArgumentNullError);
            expect(() => new CustomParser(undefined)).toThrowError(Errors.ArgumentNullError);
        });
    });
}
