/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Globalization/DateTimeFormatInfo" />

/// <reference path="../../../src/core/Globalization/DateTime/InfoFormatter" />

namespace Format.Globalization {

    describe("DateTimeFormatInfo", () => {

        let dateTimeFormatInfo: DateTimeFormatInfo;
        let dateTimeFormatInfoAccessor: any;
        let formatterConstructor = DateTimeFormatInfo.FormatterConstructor;

        it("should initialize static properties", () => {
            expect(DateTimeFormatInfo.InvariantInfo).toBeDefined();
        });

        it("constructor should initialize locale's and format specific properties", () => {

            dateTimeFormatInfo = dateTimeFormatInfoAccessor = new DateTimeFormatInfo("");

            expect(dateTimeFormatInfo).toBeDefined();
            expect(dateTimeFormatInfoAccessor.locales_).toBe("");
            expect(dateTimeFormatInfoAccessor.isWritable_).toBe(false);

            expect(dateTimeFormatInfo.AbbreviatedDayNames).toEqual(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
            expect(dateTimeFormatInfo.AbbreviatedMonthNames).toEqual(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
            expect(dateTimeFormatInfo.DayNames).toEqual(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
            expect(dateTimeFormatInfo.MonthNames).toEqual(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
            expect(dateTimeFormatInfo.AMDesignator).toBe("AM");
            expect(dateTimeFormatInfo.PMDesignator).toBe("PM");
            expect(dateTimeFormatInfo.DateSeparator).toBe("/");
            expect(dateTimeFormatInfo.TimeSeparator).toBe(":");
        });

        it("constructor should throw a InvalidOperationError for a locales argument without a loaded culture-variant sub-module", () => {

            delete DateTimeFormatInfo.FormatterConstructor;

            expect(() => new DateTimeFormatInfo("en-US")).toThrowError(Errors.InvalidOperationError);

            DateTimeFormatInfo.FormatterConstructor = formatterConstructor;
        });

        it("getFormatter should only return a date and time formatter instance or throw an error", () => {

            dateTimeFormatInfo = new DateTimeFormatInfo("");

            expect(dateTimeFormatInfo.getFormatter(Utils.Types.Date) instanceof DateTime.InfoFormatter).toBe(true);
            expect(() => dateTimeFormatInfo.getFormatter(Utils.Types.Object)).toThrowError(Errors.InvalidOperationError);
        });
    });
}
