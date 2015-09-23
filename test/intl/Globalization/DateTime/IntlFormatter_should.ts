/// <reference path="../../../typings/jasmine/jasmine" />

/// <reference path="../../../../src/intl/Globalization/DateTime/IntlFormatter" />

namespace Format.Globalization.DateTime {

    describe("IntlFormatter", () => {

        if (!IntlFormatter) {
            return;
        }

        let formatInfo: DateTimeFormatInfo;
        let intlFormatter: IntlFormatter;
        let intlFormatterAccessor: any;

        let createInstance = (locales: string|string[], customInfo?: DateTimeFormatInfo, options?: Intl.DateTimeFormatOptions) => {
            formatInfo = customInfo || new DateTimeFormatInfo();
            intlFormatter = intlFormatterAccessor = new IntlFormatter(locales, formatInfo, options);
        };

        it("constructor should initialize the locales and format info fields", () => {

            createInstance("en-US");

            expect(intlFormatterAccessor.locales).toBe("en-US");
            expect(intlFormatterAccessor.formatInfo).toBe(formatInfo);
        });

        it("constructor should throw an ArgumentNullError for parameter(s) with null or undefined values", () => {
            expect(() => new IntlFormatter(null, null)).toThrowError(Errors.ArgumentNullError);
            expect(() => new IntlFormatter(undefined, undefined)).toThrowError(Errors.ArgumentNullError);
            expect(() => new IntlFormatter("en-US", null)).toThrowError(Errors.ArgumentNullError);
            expect(() => new IntlFormatter("en-US", undefined)).toThrowError(Errors.ArgumentNullError);
        });

        it("constructor should throw a RangeError for invalid locales values", () => {
            expect(() => createInstance("")).toThrowError(RangeError);
        });
    });
}
