/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/intl/Utils/IntlResolvers" />

/// <reference path="../../../src/core/Globalization/DateTimeFormatInfo" />

namespace Format.Utils {

    describe("IntlResovlers setDateTimeFormatInfo", () => {

        let formatInfo = new Globalization.DateTimeFormatInfo();
        let supportsIntl = typeof Intl !== "undefined" && typeof Intl.DateTimeFormat !== "undefined";

        if (!(Utils.IntlResovlers && IntlResovlers.setDateTimeFormatInfo_ && supportsIntl)) {
            return;
        }

        let getNativeFormatter = (locale: string): (resolvedOptions?: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat =>
            (resolvedOptions?: Intl.DateTimeFormatOptions) => <any> new Intl.DateTimeFormat(locale, resolvedOptions);

        let supportsCultures = supportsIntl && getNativeFormatter("de-DE")().format(<any> new Date(0, 0, 1)) === "1.1.1900";

        it("should set the proper values for different locales", () => {

            expect(formatInfo.AbbreviatedMonthNames).toEqual(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
            expect(formatInfo.MonthNames).toEqual(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);

            IntlResovlers.setDateTimeFormatInfo_(formatInfo, getNativeFormatter("en-US"));

            expect(formatInfo.AbbreviatedDayNames).toEqual(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
            expect(formatInfo.DayNames).toEqual(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
            expect(formatInfo.AMDesignator).toBe("AM");
            expect(formatInfo.PMDesignator).toBe("PM");
            expect(formatInfo.DateSeparator).toBe("/");
            expect(formatInfo.TimeSeparator).toBe(":");

            if (!supportsCultures) {
                return;
            }

            IntlResovlers.setDateTimeFormatInfo_(formatInfo, getNativeFormatter("de-DE"));

            expect(formatInfo.AbbreviatedDayNames).toEqual(["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."]);
            expect(formatInfo.DayNames).toEqual(["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"]);
            expect(formatInfo.AMDesignator).toBe("vorm.");
            expect(formatInfo.PMDesignator).toBe("nachm.");
            expect(formatInfo.DateSeparator).toBe(".");
            expect(formatInfo.TimeSeparator).toBe(":");

            IntlResovlers.setDateTimeFormatInfo_(formatInfo, getNativeFormatter("fr-FR"));

            expect(formatInfo.AbbreviatedDayNames).toEqual(["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."]);
            expect(formatInfo.DayNames).toEqual(["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]);
            expect(formatInfo.AMDesignator).toBe("AM");
            expect(formatInfo.PMDesignator).toBe("PM");
            expect(formatInfo.DateSeparator).toBe("/");
            expect(formatInfo.TimeSeparator).toBe(":");
        });
    });
}
