/// <reference path="../../../typings/jasmine/jasmine" />

/// <reference path="../../../../src/core/Globalization/DateTime/IntlOptionsProvider" />

namespace Format.Globalization.DateTime {

    describe("IntlOptionsProvider", () => {

        let intlOptions: Intl.DateTimeFormatOptions;
        let intlOptionsProvider: IntlOptionsProvider;
        let intlOptionsProviderAccessor: any;
        let numeric = "numeric", long = "long";

        let createInstance = (options: Intl.DateTimeFormatOptions) => {
            intlOptions = options;
            intlOptionsProvider = intlOptionsProviderAccessor = new IntlOptionsProvider(options);
        };

        let resolveOptions = (formatString: string, options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormatOptions => {
            createInstance(options || {});
            return intlOptionsProvider.resolveOptions(formatString, undefined);
        };


        it("constructor should initialize the resolved options' object with a cloned copy", () => {

            createInstance({ day: numeric });

            expect(intlOptionsProviderAccessor.options).toEqual(intlOptions);
            expect(intlOptionsProviderAccessor.options).not.toBe(intlOptions);
        });

        it("constructor should throw an ArgumentNullError for parameter(s) with null or undefined values", () => {
            expect(() => new IntlOptionsProvider(null)).toThrowError(Errors.ArgumentNullError);
            expect(() => new IntlOptionsProvider(undefined)).toThrowError(Errors.ArgumentNullError);
        });

        it("resolveOptions should resolve the standard date and time format string into Intl-based options", () => {

            resolveOptions("");
            expect(intlOptionsProvider.getStyle()).toBeUndefined();
            expect(intlOptionsProvider.useUTC()).toBeUndefined();

            expect(resolveOptions("d")).toEqual({ month: numeric, year: numeric, day: numeric, style: "shortDate" });
            expect(resolveOptions("D")).toEqual({ month: long, year: numeric, day: numeric, weekday: long, style: "longDate" });
            expect(resolveOptions("f")).toEqual({ month: long, year: numeric, day: numeric, weekday: long, minute: numeric, hour: numeric, style: "fullDateShortTime" });
            expect(resolveOptions("F")).toEqual({ month: long, year: numeric, day: numeric, weekday: long, minute: numeric, hour: numeric, second: numeric, style: "fullDateLongTime" });
            expect(resolveOptions("g")).toEqual({ month: numeric, year: numeric, day: numeric, minute: numeric, hour: numeric, style: "generalDateShortTime" });
            expect(resolveOptions("G")).toEqual({ month: numeric, year: numeric, day: numeric, minute: numeric, hour: numeric, second: numeric, style: "generalDateLongTime" });
            expect(resolveOptions("M")).toEqual({ month: long, day: numeric, style: "monthDate" });
            expect(resolveOptions("O")).toEqual({ style: "roundTrip" });
            expect(resolveOptions("R")).toEqual({ style: "rfc1123" });
            expect(resolveOptions("s")).toEqual({ style: "sortable" });
            expect(resolveOptions("t")).toEqual({ minute: numeric, hour: numeric, style: "shortTime" });
            expect(resolveOptions("T")).toEqual({ minute: numeric, hour: numeric, second: numeric, style: "longTime" });
            expect(resolveOptions("u")).toEqual({ toUTC: true, style: "universalSortable" });
            expect(intlOptionsProvider.useUTC()).toBe(true);
            expect(resolveOptions("U")).toEqual({
                month: long, year: numeric, day: numeric, weekday: long, minute: numeric, hour: numeric, second: numeric, toUTC: true, style: "universalFull"
            });
            expect(resolveOptions("Y")).toEqual({ month: long, year: numeric, style: "yearMonth" });
            expect(intlOptionsProvider.getStyle()).toBe("yearMonth");

            expect(() => resolveOptions("Z", 0)).toThrowError(Errors.FormatError);
        });
    });
}
