/// <reference path="../../../../typings/jasmine/jasmine" />

/// <reference path="../../../../../src/core/Globalization/Numeric/Specifiers/IntlStandardOptionsProvider" />

namespace Format.Globalization.Numeric.Specifiers {

    describe("IntlStandardOptionsProvider", () => {

        let intlOptions: Intl.NumberFormatOptions;
        let intlStandardOptionsProvider: IntlStandardOptionsProvider;
        let intlStandardOptionsProviderAccessor: any;

        let createInstance = (options: Intl.NumberFormatOptions) => {
            intlOptions = options;
            intlStandardOptionsProvider = intlStandardOptionsProviderAccessor = new IntlStandardOptionsProvider(options);
        };

        let resolveOptions = (formatString: string, options?: Intl.NumberFormatOptions): Intl.NumberFormatOptions => {
            createInstance(options || {});
            return intlStandardOptionsProvider.resolveOptions(formatString, undefined);
        };

        it("constructor should initialize the options' field", () => {

            createInstance({ minimumFractionDigits: 1 });

            expect(intlStandardOptionsProviderAccessor.options).toBe(intlOptions);
        });

        it("resolveOptions should resolve the standard numeric format string into Intl-based options", () => {

            // Currency - https://msdn.microsoft.com/library/dwhawy9k.aspx#CFormatString
            expect(resolveOptions("c")).toEqual({ useGrouping: true, style: "currency" });
            expect(resolveOptions("C0")).toEqual({ useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0, style: "currency" });
            expect(resolveOptions("C3")).toEqual({ useGrouping: true, minimumFractionDigits: 3, maximumFractionDigits: 3, style: "currency" });

            // Decimal - https://msdn.microsoft.com/library/dwhawy9k.aspx#DFormatString
            expect(resolveOptions("d")).toEqual({ maximumFractionDigits: 0, style: "decimal" });
            expect(resolveOptions("D6")).toEqual({ minimumIntegerDigits: 6, maximumFractionDigits: 0, style: "decimal" });

            // Exponential (scientific) - https://msdn.microsoft.com/library/dwhawy9k.aspx#EFormatString
            expect(resolveOptions("e")).toEqual({ upperCase: false, minimumFractionDigits: 6, maximumFractionDigits: 6, minimumExponentDigits: 3, style: "exponential" });
            expect(resolveOptions("E0")).toEqual({ upperCase: true, minimumFractionDigits: 0, maximumFractionDigits: 0, minimumExponentDigits: 3, style: "exponential" });
            expect(resolveOptions("E2")).toEqual({ upperCase: true, minimumFractionDigits: 2, maximumFractionDigits: 2, minimumExponentDigits: 3, style: "exponential" });

            // Fixed-point - https://msdn.microsoft.com/library/dwhawy9k.aspx#FFormatString
            expect(resolveOptions("f")).toEqual({ style: "fixedPoint" });
            expect(resolveOptions("F0")).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, style: "fixedPoint" });
            expect(resolveOptions("F4")).toEqual({ minimumFractionDigits: 4, maximumFractionDigits: 4, style: "fixedPoint" });

            // General - https://msdn.microsoft.com/library/dwhawy9k.aspx#GFormatString
            expect(resolveOptions("g")).toEqual({ minimumExponentDigits: 2, upperCase: false, style: "general" });
            expect(resolveOptions("G0")).toEqual({ minimumExponentDigits: 2, upperCase: true, style: "general" });
            expect(resolveOptions("G1")).toEqual({ minimumExponentDigits: 2, upperCase: true, maximumSignificantDigits: 1, maximumFractionDigits: 0, style: "general" });

            // Number - https://msdn.microsoft.com/library/dwhawy9k.aspx#NFormatString
            expect(resolveOptions("n")).toEqual({ useGrouping: true, style: "number" });
            expect(resolveOptions("N1")).toEqual({ minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: true, style: "number" });
            expect(resolveOptions("N3")).toEqual({ minimumFractionDigits: 3, maximumFractionDigits: 3, useGrouping: true, style: "number" });

            // Percent - https://msdn.microsoft.com/library/dwhawy9k.aspx#PFormatString
            expect(resolveOptions("p")).toEqual({ useGrouping: true, style: "percent" });
            expect(resolveOptions("p0")).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: true, style: "percent" });
            expect(resolveOptions("P1")).toEqual({ minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: true, style: "percent" });

            // Round-trip - https://msdn.microsoft.com/library/dwhawy9k.aspx#RFormatString
            expect(resolveOptions("r")).toEqual({ style: "roundTrip" });
            expect(resolveOptions("R")).toEqual({ style: "roundTrip" });

            // Hexadecimal - https://msdn.microsoft.com/library/dwhawy9k.aspx#XFormatString
            expect(resolveOptions("x")).toEqual({ upperCase: false, style: "hex" });
            expect(resolveOptions("X2")).toEqual({ minimumSignificantDigits: 2, upperCase: true, style: "hex" });
            expect(resolveOptions("X8")).toEqual({ minimumSignificantDigits: 8, upperCase: true, style: "hex" });

            // Unknown number specifier
            expect(() => resolveOptions("Z", 0)).toThrowError(Errors.FormatError);
            expect(() => resolveOptions("Z0", 0)).toThrowError(Errors.FormatError);
        });
    });
}
