/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Globalization/DateTimeFormatInfo" />

namespace Format.Globalization {

    describe("DateTimeFormatInfo", () => {

        let dateTimeFormatInfoInfo: DateTimeFormatInfo;
        let dateTimeFormatInfoAccessor: any;

        it("should initialize static properties", () => {
            expect(DateTimeFormatInfo.InvariantInfo).toBeDefined();
        });

        it("constructor should initialize locale's and format specific properties", () => {

            dateTimeFormatInfoInfo = dateTimeFormatInfoAccessor = new DateTimeFormatInfo("");

            expect(dateTimeFormatInfoAccessor.locales).toBe("");
            expect(dateTimeFormatInfoAccessor.isWritable).toBe(false);
        });

        it("constructor should throw a NotImplementedError for a locales argument which is not supported", () => {
            expect(() => new DateTimeFormatInfo("en-US")).toThrowError(Errors.NotImplementedError);
        });

        it("getFormatter should only return a number formatter instance or throw an error", () => {

            dateTimeFormatInfoInfo = new DateTimeFormatInfo("");

            expect(dateTimeFormatInfoInfo.getFormatter(Utils.Types.Date)).toBeUndefined();
            expect(() => dateTimeFormatInfoInfo.getFormatter(Utils.Types.Object)).toThrowError(Errors.InvalidOperationError);
        });
    });
}
