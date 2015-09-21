/// <reference path="../../../../typings/jasmine/jasmine" />

/// <reference path="../../../../../src/core/Globalization/Numeric/Specifiers/IntlCustomOptionsProvider" />

namespace Format.Globalization.Numeric.Specifiers {

    describe("IntlCustomOptionsProvider", () => {

        let intlOptions: Intl.NumberFormatOptions;
        let intlCustomOptionsProvider: IntlCustomOptionsProvider;
        let intlCustomOptionsProviderAccessor: any;

        let createInstance = (options: Intl.NumberFormatOptions) => {
            intlOptions = options;
            intlCustomOptionsProvider = intlCustomOptionsProviderAccessor = new IntlCustomOptionsProvider(options);
        };

        let resolveOptions = (format: string, value?: number, options?: Intl.NumberFormatOptions): Intl.NumberFormatOptions => {
            createInstance(options || {});
            return intlCustomOptionsProvider.resolveOptions(format, value || 0);
        };

        it("constructor should initialize the options' field with extended default properties", () => {

            createInstance({ minimumFractionDigits: 1 });

            expect(intlCustomOptionsProviderAccessor.options).toBe(intlOptions);
            expect(intlCustomOptionsProviderAccessor.options.minimumFractionDigits).toBe(intlOptions.minimumFractionDigits);

            expect(intlCustomOptionsProviderAccessor.options.noDigits).toBe(true);
            expect(intlCustomOptionsProviderAccessor.options.noLeadingZeroIntegerDigit).toBe(true);
            expect(intlCustomOptionsProviderAccessor.options.valueDivisor).toBe(1);
            expect(intlCustomOptionsProviderAccessor.options.prefixDecorator).toBe("");
            expect(intlCustomOptionsProviderAccessor.options.internalDecorators).toEqual({});
            expect(intlCustomOptionsProviderAccessor.options.suffixDecorator).toBe("");
        });

        it("constructor should throw an ArgumentNullError for parameter(s) with null or undefined values", () => {
            expect(() => new IntlCustomOptionsProvider(null)).toThrowError(Errors.ArgumentNullError);
            expect(() => new IntlCustomOptionsProvider(undefined)).toThrowError(Errors.ArgumentNullError);
        });

        it("resolveOptions should resolve the custom numeric format string into Intl-based options", () => {

            // Zero placeholder - https://msdn.microsoft.com/library/0c899ak8.aspx#Specifier0
            expect(resolveOptions("00000")).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, minimumIntegerDigits: 5 });
            expect(resolveOptions("00-00")).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, minimumIntegerDigits: 4, internalDecorators: { "-3": "-" } });

            // Digit placeholder - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierD
            expect(resolveOptions("#####")).toEqual({ noLeadingZeroIntegerDigit: true, minimumFractionDigits: 0, maximumFractionDigits: 0 });
            expect(resolveOptions("[##-##-###-#]", 1)).toEqual({
                minimumFractionDigits: 0, maximumFractionDigits: 0, prefixDecorator: "[", internalDecorators: { "-7": "-", "-5": "-", "-2": "-" }, suffixDecorator: "]"
            });
            expect(resolveOptions("(###) ###-####", -1)).toEqual({
                minimumFractionDigits: 0, maximumFractionDigits: 0, prefixDecorator: "(", internalDecorators: { "-8": ") ", "-5": "-" }
            });

            // Decimal point - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierPt
            expect(resolveOptions("0.00")).toEqual({ minimumFractionDigits: 2, maximumFractionDigits: 2, minimumIntegerDigits: 1 });
            expect(resolveOptions("00.00")).toEqual({ minimumFractionDigits: 2, maximumFractionDigits: 2, minimumIntegerDigits: 2 });
            expect(resolveOptions("#.##", 1)).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 2 });
            expect(resolveOptions("#.##0", 1)).toEqual({ minimumFractionDigits: 3, maximumFractionDigits: 3 });
            expect(resolveOptions("#.##", -0.5)).toEqual({ noLeadingZeroIntegerDigit: true, minimumFractionDigits: 0, maximumFractionDigits: 2 });
            expect(resolveOptions("#.#")).toEqual({ noLeadingZeroIntegerDigit: true, minimumFractionDigits: 0, maximumFractionDigits: 1 });
            expect(resolveOptions(".")).toEqual({ noLeadingZeroIntegerDigit: true, minimumFractionDigits: 0, maximumFractionDigits: 0 });
            expect(resolveOptions("0==0.00<->00<->00", 12.123456)).toEqual({
                minimumFractionDigits: 6, maximumFractionDigits: 6, internalDecorators: { 2: "<->", 4: "<->", "-2": "==" }, minimumIntegerDigits: 2
            });
            expect(resolveOptions(".[00-00-00]")).toEqual({
                noLeadingZeroIntegerDigit: true, minimumFractionDigits: 6, maximumFractionDigits: 6, internalDecorators: Object({ 0: "[", 2: "-", 4: "-" }), suffixDecorator: "]"
            });

            // Group separator and number scaling - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierTh
            expect(resolveOptions("##,#", 1)).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: true });
            expect(resolveOptions(",#", 1)).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0 });
            expect(resolveOptions("#,", 1000)).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, valueDivisor: 1000 });
            expect(resolveOptions("#,#,#,", 100)).toEqual({ noLeadingZeroIntegerDigit: true, minimumFractionDigits: 0, maximumFractionDigits: 0, valueDivisor: 1000, useGrouping: true });
            expect(resolveOptions("#,#,,", 1000000)).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, valueDivisor: 1000000, useGrouping: true });
            expect(resolveOptions("#.#,,", 100000)).toEqual({ noLeadingZeroIntegerDigit: true, minimumFractionDigits: 0, maximumFractionDigits: 1, valueDivisor: 1000000 });
            expect(resolveOptions("#,#,,.#", 1)).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 1, useGrouping: true });
            expect(resolveOptions("#0.0e0,")).toEqual({
                minimumFractionDigits: 1, maximumFractionDigits: 1, minimumIntegerDigits: 2, style: "exponential", upperCase: false, negativellySignedExponent: true, minimumExponentDigits: 1
            });
            expect(resolveOptions("#0,e0")).toEqual({
                minimumFractionDigits: 0, maximumFractionDigits: 0, valueDivisor: 1000, minimumIntegerDigits: 2, style: "exponential",
                upperCase: false, negativellySignedExponent: true, minimumExponentDigits: 1
            });
            expect(resolveOptions("#0,E+00")).toEqual({
                minimumFractionDigits: 0, maximumFractionDigits: 0, valueDivisor: 1000, minimumIntegerDigits: 2, style: "exponential",
                upperCase: true, negativellySignedExponent: false, minimumExponentDigits: 2
            });
            expect(resolveOptions("#0c,\\E+00#")).toEqual({
                minimumFractionDigits: 0, maximumFractionDigits: 0, internalDecorators: { "-4": "cE+" }, minimumIntegerDigits: 4, useGrouping: true
            });
            expect(resolveOptions("-0-0-0-0-0-,0")).toEqual({
                minimumFractionDigits: 0, maximumFractionDigits: 0, prefixDecorator: "-", internalDecorators: { "-7": "-", "-6": "-", "-4": "-", "-3": "-", "-2": "-" },
                minimumIntegerDigits: 6, useGrouping: true
            });
            expect(resolveOptions("-0#,##0-0.#-#-")).toEqual({
                minimumFractionDigits: 0, maximumFractionDigits: 2, prefixDecorator: "-", internalDecorators: { 1: "-", "-2": "-" }, suffixDecorator: "-", minimumIntegerDigits: 6, useGrouping: true
            });

            // Percentage placeholder - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierPct
            expect(resolveOptions("%#0.00")).toEqual({ minimumFractionDigits: 2, maximumFractionDigits: 2, valueDivisor: 0.01, prefixDecorator: "%", minimumIntegerDigits: 1 });
            expect(resolveOptions("##.0 %", 0.01)).toEqual({ minimumFractionDigits: 1, maximumFractionDigits: 1, valueDivisor: 0.01, suffixDecorator: " %" });
            expect(resolveOptions("##.0 %%", -0.0001)).toEqual({ minimumFractionDigits: 1, maximumFractionDigits: 1, valueDivisor: 0.0001, suffixDecorator: " %%" });
            expect(resolveOptions("#0.##%")).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 2, valueDivisor: 0.01, suffixDecorator: "%", minimumIntegerDigits: 1 });
            expect(resolveOptions("##.0, %", 0.001)).toEqual({ noLeadingZeroIntegerDigit: true, minimumFractionDigits: 1, maximumFractionDigits: 1, valueDivisor: 0.01, suffixDecorator: " %" });
            expect(resolveOptions("#.00, %", -0.001)).toEqual({ noLeadingZeroIntegerDigit: true, minimumFractionDigits: 2, maximumFractionDigits: 2, valueDivisor: 0.01, suffixDecorator: " %" });
            expect(resolveOptions("00%0,")).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, valueDivisor: 0.01, internalDecorators: { "-2": "%" }, minimumIntegerDigits: 3 });

            // Per mille placeholder - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierPerMille
            expect(resolveOptions("‰#0.00")).toEqual({ minimumFractionDigits: 2, maximumFractionDigits: 2, valueDivisor: 0.001, prefixDecorator: "‰", minimumIntegerDigits: 1 });
            expect(resolveOptions("##.0 ‰", 0.0001)).toEqual({ noLeadingZeroIntegerDigit: true, minimumFractionDigits: 1, maximumFractionDigits: 1, valueDivisor: 0.001, suffixDecorator: " ‰" });
            expect(resolveOptions("##.0 ‰‰", 0.000001)).toEqual({ minimumFractionDigits: 1, maximumFractionDigits: 1, valueDivisor: 0.000001, suffixDecorator: " ‰‰" });
            expect(resolveOptions("#0.##\u2030")).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 2, valueDivisor: 0.001, suffixDecorator: "‰", minimumIntegerDigits: 1 });
            expect(resolveOptions("##.0, ‰")).toEqual({ noLeadingZeroIntegerDigit: true, minimumFractionDigits: 1, maximumFractionDigits: 1, valueDivisor: 0.001, suffixDecorator: " ‰" });

            // Exponential notation - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierExponent
            expect(resolveOptions("#0.0e0")).toEqual({
                minimumFractionDigits: 1, maximumFractionDigits: 1, minimumIntegerDigits: 2, style: "exponential", upperCase: false, negativellySignedExponent: true, minimumExponentDigits: 1
            });
            expect(resolveOptions("0.0##e+00")).toEqual({
                minimumFractionDigits: 1, maximumFractionDigits: 3, minimumIntegerDigits: 1, style: "exponential", upperCase: false, negativellySignedExponent: false, minimumExponentDigits: 2
            });
            expect(resolveOptions("00.0##e+00")).toEqual({
                minimumFractionDigits: 1, maximumFractionDigits: 3, minimumIntegerDigits: 2, style: "exponential", upperCase: false, negativellySignedExponent: false, minimumExponentDigits: 2
            });
            expect(resolveOptions("0.0e+00")).toEqual({
                minimumFractionDigits: 1, maximumFractionDigits: 1, minimumIntegerDigits: 1, style: "exponential", upperCase: false, negativellySignedExponent: false, minimumExponentDigits: 2
            });
            expect(resolveOptions("0.###E+0")).toEqual({
                minimumFractionDigits: 0, maximumFractionDigits: 3, minimumIntegerDigits: 1, style: "exponential", upperCase: true, negativellySignedExponent: false, minimumExponentDigits: 1
            });
            expect(resolveOptions("0.###E+000")).toEqual({
                minimumFractionDigits: 0, maximumFractionDigits: 3, minimumIntegerDigits: 1, style: "exponential", upperCase: true, negativellySignedExponent: false, minimumExponentDigits: 3
            });
            expect(resolveOptions("0.###E-000")).toEqual({
                minimumFractionDigits: 0, maximumFractionDigits: 3, minimumIntegerDigits: 1, style: "exponential", upperCase: true, negativellySignedExponent: true, minimumExponentDigits: 3
            });
            expect(resolveOptions("#.#e+0")).toEqual({
                minimumFractionDigits: 0, maximumFractionDigits: 1, minimumIntegerDigits: 1, style: "exponential", upperCase: false, negativellySignedExponent: false, minimumExponentDigits: 1
            });
            expect(resolveOptions("#.#e+0 exponent")).toEqual({
                minimumFractionDigits: 0, maximumFractionDigits: 1, suffixDecorator: " exponent", minimumIntegerDigits: 1, style: "exponential",
                upperCase: false, negativellySignedExponent: false, minimumExponentDigits: 1
            });
            expect(resolveOptions("exponent #.#e+0")).toEqual({
                minimumFractionDigits: 0, maximumFractionDigits: 1, prefixDecorator: "exponent ", minimumIntegerDigits: 1, style: "exponential",
                upperCase: false, negativellySignedExponent: false, minimumExponentDigits: 1
            });
            expect(resolveOptions("#0.0E0e00")).toEqual({
                minimumFractionDigits: 1, maximumFractionDigits: 1, suffixDecorator: "e00", minimumIntegerDigits: 2, style: "exponential",
                upperCase: true, negativellySignedExponent: true, minimumExponentDigits: 1
            });
            expect(resolveOptions("#0.0E0e00##")).toEqual({
                minimumFractionDigits: 1, maximumFractionDigits: 3, internalDecorators: { 1: "e00" }, minimumIntegerDigits: 2, style: "exponential",
                upperCase: true, negativellySignedExponent: true, minimumExponentDigits: 1
            });
            expect(resolveOptions("0e0.0e+0###")).toEqual({
                minimumFractionDigits: 1, maximumFractionDigits: 4, internalDecorators: { 1: "e+0" }, minimumIntegerDigits: 1, style: "exponential",
                upperCase: false, negativellySignedExponent: true, minimumExponentDigits: 1
            });
            expect(resolveOptions("E+000.0###")).toEqual({
                minimumFractionDigits: 1, maximumFractionDigits: 4, style: "exponential", upperCase: true, negativellySignedExponent: false, minimumExponentDigits: 3
            });
            expect(resolveOptions("E+0#0.0###")).toEqual({
                minimumFractionDigits: 1, maximumFractionDigits: 4, minimumIntegerDigits: 2, style: "exponential", upperCase: true, negativellySignedExponent: false, minimumExponentDigits: 1
            });

            // Escape character - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierEscape
            expect(resolveOptions("\\###00\\#")).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, prefixDecorator: "#", suffixDecorator: "#", minimumIntegerDigits: 2 });
            expect(resolveOptions("\\;##00\\;")).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, prefixDecorator: ";", suffixDecorator: ";", minimumIntegerDigits: 2 });
            expect(resolveOptions("';;;'##00';;;'")).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, prefixDecorator: ";;;", suffixDecorator: ";;;", minimumIntegerDigits: 2 });
            expect(resolveOptions("\\#\\#\\# ##0 dollars and \\0\\0 cents \\#\\#\\#", 12)).toEqual({
                minimumFractionDigits: 0, maximumFractionDigits: 0, prefixDecorator: "### ", suffixDecorator: " dollars and 00 cents ###", minimumIntegerDigits: 1
            });
            expect(resolveOptions("\\\\\\\\\\\\ ##0 dollars and \\0\\0 cents \\\\\\\\\\\\", 12)).toEqual({
                minimumFractionDigits: 0, maximumFractionDigits: 0, prefixDecorator: "\\\\\\ ", suffixDecorator: " dollars and 00 cents \\\\\\", minimumIntegerDigits: 1
            });
            expect(resolveOptions("0.#\\e+\\0")).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 1, suffixDecorator: "e+0", minimumIntegerDigits: 1 });
            expect(resolveOptions("#.#e+\\0", 1)).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 1, suffixDecorator: "e+0" });
            expect(resolveOptions("#.#\\e+0", 1)).toEqual({ minimumFractionDigits: 2, maximumFractionDigits: 2, internalDecorators: { 1: "e+" } });
            expect(resolveOptions("#\\e+#", 1)).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, internalDecorators: { "-2": "e+" } });
            expect(resolveOptions("#.#\\e+#", 1)).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 2, internalDecorators: { 1: "e+" } });
            expect(resolveOptions("00\\000")).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, internalDecorators: { "-3": "0" }, minimumIntegerDigits: 4 });
            expect(resolveOptions("00\\;00")).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, internalDecorators: { "-3": ";" }, minimumIntegerDigits: 4 });

            // Literal string delimiter - Indicates that the enclosed characters should be copied to the result string unchanged.
            expect(resolveOptions("#' \"degrees\"'", 1)).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, suffixDecorator: " \"degrees\"" });
            expect(resolveOptions("0\" '0degrees0'\"")).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, suffixDecorator: " '0degrees0'", minimumIntegerDigits: 1 });
            expect(resolveOptions("#.#'e0'", 1)).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 1, suffixDecorator: "e0" });
            expect(resolveOptions("0.#'e0'")).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 1, suffixDecorator: "e0", minimumIntegerDigits: 1 });
            expect(resolveOptions("00';'00")).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, internalDecorators: { "-3": ";" }, minimumIntegerDigits: 4 });

            // Section separator - https://msdn.microsoft.com/library/0c899ak8.aspx#SectionSeparator
            expect(resolveOptions("#0.0#;", -1)).toEqual({ minimumFractionDigits: 1, maximumFractionDigits: 2, minimumIntegerDigits: 1 });
            expect(resolveOptions("#0.0#;(#0.0#)", 0)).toEqual({ minimumFractionDigits: 1, maximumFractionDigits: 2, minimumIntegerDigits: 1 });
            expect(resolveOptions("#0.0#;(#0.0#);", 0.005)).toEqual({ minimumFractionDigits: 1, maximumFractionDigits: 2, minimumIntegerDigits: 1 });
            expect(resolveOptions("#0.0#;(#0.0#);0", 0.0049)).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, minimumIntegerDigits: 1 });
            expect(resolveOptions("#0.0#;(#0.0#);-0-", 12.345)).toEqual({ minimumFractionDigits: 1, maximumFractionDigits: 2, minimumIntegerDigits: 1 });
            expect(resolveOptions("#0.0#;(#0.0#);-0-", 0)).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, prefixDecorator: "-", suffixDecorator: "-", minimumIntegerDigits: 1 });
            expect(resolveOptions("#0.0#;(#0.0#)", -12.345)).toEqual({
                minimumFractionDigits: 1, maximumFractionDigits: 2, valueDivisor: -1, prefixDecorator: "(", suffixDecorator: ")", minimumIntegerDigits: 1
            });
            expect(resolveOptions("#0.0#;(#0.0#);", -0.005)).toEqual({
                minimumFractionDigits: 1, maximumFractionDigits: 2, valueDivisor: -1, prefixDecorator: "(", suffixDecorator: ")", minimumIntegerDigits: 1
            });
            expect(resolveOptions("#0.0#;(#0.0#);0", -0.0049)).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, valueDivisor: -1, minimumIntegerDigits: 1 });
            expect(resolveOptions("#0.0#;;-0-", -12.345)).toEqual({ minimumFractionDigits: 1, maximumFractionDigits: 2, minimumIntegerDigits: 1 });
            expect(resolveOptions("#0.0#;(#0.0#,);-0-", -1234.5)).toEqual({
                minimumFractionDigits: 1, maximumFractionDigits: 2, valueDivisor: -1000, prefixDecorator: "(", suffixDecorator: ")", minimumIntegerDigits: 1
            });
            expect(resolveOptions("#0.0#;';'#0.0#';';-0-", -12.345)).toEqual({
                minimumFractionDigits: 1, maximumFractionDigits: 2, valueDivisor: -1, prefixDecorator: ";", suffixDecorator: ";", minimumIntegerDigits: 1
            });
            expect(resolveOptions("#0.0#;#0.0#, %;-0-", -0.12345)).toEqual({
                minimumFractionDigits: 1, maximumFractionDigits: 2, valueDivisor: -0.01, suffixDecorator: " %", minimumIntegerDigits: 1
            });
            expect(resolveOptions("#0.0#;% #0.0#,;-0-", -0.12345)).toEqual({
                minimumFractionDigits: 1, maximumFractionDigits: 2, valueDivisor: -0.01, prefixDecorator: "% ", minimumIntegerDigits: 1
            });

            // All other characters - The character is copied to the result string unchanged.
            expect(resolveOptions("# °C", 32)).toEqual({ minimumFractionDigits: 0, maximumFractionDigits: 0, suffixDecorator: " °C" });
            expect(resolveOptions("-#-0.#-#-", 3.456)).toEqual({
                minimumFractionDigits: 0, maximumFractionDigits: 2, prefixDecorator: "-", internalDecorators: Object({ 1: "-", "-2": "-" }), suffixDecorator: "-", minimumIntegerDigits: 1
            });
            expect(resolveOptions("prefix X2 suffix", -1.2)).toEqual({
                noDigits: true, minimumFractionDigits: 0, maximumFractionDigits: 0, prefixDecorator: "prefix X2 suffix"
            });
            expect(resolveOptions("prefix .X2 suffix", -1.2)).toEqual({
                minimumFractionDigits: 0, maximumFractionDigits: 0, prefixDecorator: "prefix ", suffixDecorator: "X2 suffix"
            });
        });
    });
}
