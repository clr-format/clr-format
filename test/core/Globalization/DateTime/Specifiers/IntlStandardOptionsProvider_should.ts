/// <reference path="../../../../typings/jasmine/jasmine" />

/// <reference path="../../../../../src/core/Globalization/DateTime/Specifiers/IntlStandardOptionsProvider" />

namespace Format.Globalization.DateTime.Specifiers {

    describe("IntlStandardOptionsProvider", () => {

        let intlOptions: Intl.DateTimeFormatOptions;
        let intlStandardOptionsProvider: IntlStandardOptionsProvider;
        let intlStandardOptionsProviderAccessor: any;

        let createInstance = (options: Intl.DateTimeFormatOptions) => {
            intlOptions = options;
            intlStandardOptionsProvider = intlStandardOptionsProviderAccessor = new IntlStandardOptionsProvider(options);
        };

        let resolveOptions = (formatString: string, options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormatOptions => {
            createInstance(options || {});
            return intlStandardOptionsProvider.resolveOptions(formatString, undefined);
        };

        it("constructor should initialize the options' field", () => {

            createInstance({ day: "numeric" });

            expect(intlStandardOptionsProviderAccessor.options).toBe(intlOptions);
        });

        it("resolveOptions should resolve the standard date and time format string into Intl-based options", () => {

            expect(resolveOptions("d")).toEqual({ month: "numeric", year: "numeric", day: "numeric" });
            expect(resolveOptions("D")).toEqual({ month: "long", year: "numeric", day: "numeric", weekday: "long" });
            expect(resolveOptions("f")).toEqual({ month: "long", year: "numeric", day: "numeric", weekday: "long", minute: "numeric", hour: "numeric" });
            expect(resolveOptions("F")).toEqual({ month: "long", year: "numeric", day: "numeric", weekday: "long", minute: "numeric", hour: "numeric", second: "numeric" });
            expect(resolveOptions("g")).toEqual({ month: "numeric", year: "numeric", day: "numeric", minute: "numeric", hour: "numeric" });
            expect(resolveOptions("G")).toEqual({ month: "numeric", year: "numeric", day: "numeric", minute: "numeric", hour: "numeric", second: "numeric" });
            expect(resolveOptions("M")).toEqual({ month: "long", day: "numeric" });
            expect(resolveOptions("O")).toEqual({});
            expect(resolveOptions("R")).toEqual({});
            expect(resolveOptions("s")).toEqual({});
            expect(resolveOptions("t")).toEqual({ minute: "numeric", hour: "numeric" });
            expect(resolveOptions("T")).toEqual({ minute: "numeric", hour: "numeric", second: "numeric" });
            expect(resolveOptions("u")).toEqual({ toUTC: true });
            expect(resolveOptions("U")).toEqual({ month: "long", year: "numeric", day: "numeric", weekday: "long", minute: "numeric", hour: "numeric", second: "numeric", toUTC: true });
            expect(resolveOptions("Y")).toEqual({ month: "long", year: "numeric" });

            expect(() => resolveOptions("Z", 0)).toThrowError(Errors.FormatError);
        });
    });
}
