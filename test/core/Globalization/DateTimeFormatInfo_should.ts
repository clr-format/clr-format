/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Globalization/DateTimeFormatInfo" />

/// <reference path="../../../src/core/Globalization/DateTime/InvariantFormatter" />

namespace Format.Globalization {

    describe("DateTimeFormatInfo", () => {

        let dateTimeFormatInfoInfo: DateTimeFormatInfo;
        let dateTimeFormatInfoAccessor: any;
        let formatterConstructor = DateTimeFormatInfo.FormatterConstructor;

        it("should initialize static properties", () => {
            expect(DateTimeFormatInfo.InvariantInfo).toBeDefined();
        });

        it("constructor should initialize locale's and format specific properties", () => {

            dateTimeFormatInfoInfo = dateTimeFormatInfoAccessor = new DateTimeFormatInfo("");

            expect(dateTimeFormatInfoAccessor.locales).toBe("");
            expect(dateTimeFormatInfoAccessor.isWritable).toBe(false);
        });

        it("constructor should throw a InvalidOperationError for a locales argument without a loaded culture-variant sub-module", () => {
            delete DateTimeFormatInfo.FormatterConstructor;
            expect(() => new DateTimeFormatInfo("en-US")).toThrowError(Errors.InvalidOperationError);
        });

        it("getFormatter should only return a date and time formatter instance or throw an error", () => {

            dateTimeFormatInfoInfo = new DateTimeFormatInfo("");

            expect(dateTimeFormatInfoInfo.getFormatter(Utils.Types.Date) instanceof DateTime.InvariantFormatter).toBe(true);
            expect(() => dateTimeFormatInfoInfo.getFormatter(Utils.Types.Object)).toThrowError(Errors.InvalidOperationError);
        });

        afterAll(() => {
            DateTimeFormatInfo.FormatterConstructor = formatterConstructor;
        });
    });
}
