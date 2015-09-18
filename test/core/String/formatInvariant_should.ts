/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Format" />

namespace Format {

    describe("String format (invariant)", () => {

        beforeAll(() => Globalization.CultureInfo.CurrentCulture = Globalization.CultureInfo.InvariantCulture);

        it("should apply the optional format items' standard numeric format string component to values", () => {

            // Currency - https://msdn.microsoft.com/library/dwhawy9k.aspx#CFormatString
            expect(() => String.format("{0:c}", 1230)).toThrowError(Errors.FormatError);
            expect(() => String.format("{0:C0}", 123)).toThrowError(Errors.FormatError);
            expect(() => String.format("{0:c}", 1230.456)).toThrowError(Errors.FormatError);
            expect(() => String.format("{0:C3}", -123.456)).toThrowError(Errors.FormatError);

            // Decimal - https://msdn.microsoft.com/library/dwhawy9k.aspx#DFormatString
            expect(String.format("{0:d}", 1234.23)).toBe("1234");
            expect(String.format("{0:D6}", 1234.5)).toBe("001235");

            // Exponential (scientific) - https://msdn.microsoft.com/library/dwhawy9k.aspx#EFormatString
            expect(String.format("{0:e}", 123)).toBe("1.230000e+002");
            expect(String.format("{0:E0}", 1052.0329112756)).toBe("1E+003");
            expect(String.format("{0:e}", 1052.0329112756)).toBe("1.052033e+003");
            expect(String.format("{0:E2}", -1052.0329112756)).toBe("-1.05E+003");

            // Fixed-point - https://msdn.microsoft.com/library/dwhawy9k.aspx#FFormatString
            expect(String.format("{0:f}", 1234)).toBe("1234.00");
            expect(String.format("{0:F0}", 1234.567)).toBe("1235");
            expect(String.format("{0:f}", 1234.567)).toBe("1234.57");
            expect(String.format("{0:F4}", -1234.567)).toBe("-1234.5670");

            // General - https://msdn.microsoft.com/library/dwhawy9k.aspx#GFormatString
            expect(String.format("{0:g}", 0.000023)).toBe("2.3e-05");
            expect(String.format("{0:g1}", 0.00002351)).toBe("2e-05");
            expect(String.format("{0:G}", 0.0023)).toBe("0.0023");
            expect(String.format("{0:G0}", 0.0023)).toBe("0.0023");
            expect(String.format("{0:G1}", 0.0023)).toBe("0.002");
            expect(String.format("{0:G2}", 1234)).toBe("1.2E+03");
            expect(String.format("{0:G4}", -123.4546)).toBe("-123.5");
            expect(String.format("{0:G5}", Math.PI)).toBe("3.1416");
            expect(String.format("{0:G5}", 12.3)).toBe("12.3");
            expect(String.format("{0:G9}", 0.000023)).toBe("2.3E-05");
            expect(String.format("{0:G9}", 0.00001234567891)).toBe("1.23456789E-05");
            expect(String.format("{0:G0}", 0.00001234567891)).toBe("1.234567891E-05");

            // Number - https://msdn.microsoft.com/library/dwhawy9k.aspx#NFormatString
            expect(String.format("{0:n}", 1234)).toBe("1,234.00");
            expect(String.format("{0:n}", 1234.567)).toBe("1,234.57");
            expect(String.format("{0:N1}", 123456789)).toBe("123,456,789.0");
            expect(String.format("{0:N3}", -1234.56)).toBe("-1,234.560");

            // Percent - https://msdn.microsoft.com/library/dwhawy9k.aspx#PFormatString
            expect(String.format("{0:p}", 1)).toMatch(/100.00 ?%/);
            expect(String.format("{0:p0}", 10)).toMatch(/1,000 ?%/);
            expect(String.format("{0:P1}", -0.39678)).toMatch(/-39.7 ?%/);

            // Round-trip - https://msdn.microsoft.com/library/dwhawy9k.aspx#RFormatString
            expect(String.format("{0:r}", 123456789.12345678)).toBe(JSON.stringify(123456789.12345678));
            expect(String.format("{0:R}", -1234567890.12345678)).toBe(JSON.stringify(-1234567890.12345678));
            expect(String.format("{0:R}", Math.PI)).toBe("3.141592653589793");

            // Hexadecimal - https://msdn.microsoft.com/library/dwhawy9k.aspx#XFormatString
            expect(String.format("{0:x}", 255)).toBe("ff");
            expect(String.format("{0:X2}", 15)).toBe("0F");
            expect(String.format("{0:X8}", 0x2045e)).toBe("0002045E");

            // Unknown number specifier
            expect(() => String.format("{0:Z}", 0)).toThrowError(Errors.FormatError);
            expect(() => String.format("{0:Z0}", 0)).toThrowError(Errors.FormatError);
        });

        it("should apply the optional format items' custom numeric format string component to values", () => {

            // Zero placeholder - https://msdn.microsoft.com/library/0c899ak8.aspx#Specifier0
            expect(String.format("{0:00000}", 1234.5678)).toBe("01235");
            expect(String.format("{0:00-00}", 345.6)).toBe("03-46");

            // Digit placeholder - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierD
            expect(String.format("{0:#####}", 1234.5678)).toBe("1235");
            expect(String.format("{0:[##-##-###-#]}", 12345678)).toBe("[12-34-567-8]");
            expect(String.format("{0:(###) ###-####}", 1234567890)).toBe("(123) 456-7890");

            // Decimal point - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierPt
            expect(String.format("{0:0.00}", 0.45678)).toBe("0.46");
            expect(String.format("{0:00.00}", 1.2)).toBe("01.20");
            expect(String.format("{0:#.##}", 1.2)).toBe("1.2");
            expect(String.format("{0:#.##0}", 1.2)).toBe("1.200");
            expect(String.format("{0:#.##}", 0.45678)).toBe(".46");
            expect(String.format("{0:#.#}", 0.01)).toBe("");
            expect(String.format("{0:.}", 0.01)).toBe("");
            expect(String.format("{0:0==0.00<->00<->00}", 12.123456)).toBe("1==2.12<->34<->56");
            expect(String.format("{0:.[00-00-00]}", 0.123456)).toBe(".[12-34-56]");

            // Group separator and number scaling - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierTh
            expect(String.format("{0:##,#}", 2147483647)).toBe("2,147,483,647");
            expect(String.format("{0:,#}", 2147483647)).toBe("2147483647");
            expect(String.format("{0:#,}", 2147483647)).toBe("2147484");
            expect(String.format("{0:#,#,#,}", 2147483647)).toBe("2,147,484");
            expect(String.format("{0:#,#,,}", 2147483647)).toBe("2,147");
            expect(String.format("{0:#.#,,}", 2147483647)).toBe("2147.5");
            expect(String.format("{0:#,#,,.#}", 2147483647)).toBe("2,147,483,647");
            expect(String.format("{0:#0.0e0,}", 987654)).toBe("98.8e4");
            expect(String.format("{0:#0,e0}", 987654)).toBe("99e1");
            expect(String.format("{0:#0,E+00}", 987654)).toBe("99E+01");
            expect(String.format("{0:#0c,\\E+00#}", 987)).toBe("0,cE+987");
            expect(String.format("{0:#0c,\\E+00#}", 9876540)).toBe("9,876,cE+540");
            expect(String.format("{0:-0-0-0-0-0-,0}", 1234567)).toBe("-1,2-3-4,-5-6-7");
            expect(String.format("{0:-0#,##0-0.#-#-}", 1123.456)).toBe("-001,12-3.4-6-");

            // Percentage placeholder - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierPct
            expect(String.format("{0:%#0.00}", 0.3697)).toBe("%36.97");
            expect(String.format("{0:##.0 %}", 0.3697)).toBe("37.0 %");
            expect(String.format("{0:##.0 %%}", 0.3697)).toBe("3697.0 %%");
            expect(String.format("{0:#0.##%}", .086)).toBe("8.6%");
            expect(String.format("{0:##.0, %}", 0.3697)).toBe("37.0 %");
            expect(String.format("{0:#.00, %}", 0.003697)).toBe(".37 %");
            expect(String.format("{0:00%0}", 0.01)).toBe("00%1");
            expect(String.format("{0:00%0,}", 10)).toBe("100%0");

            // Per mille placeholder - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierPerMille
            expect(String.format("{0:‰#0.00}", 0.03697)).toBe("‰36.97");
            expect(String.format("{0:##.0 ‰}", 0.03697)).toBe("37.0 ‰");
            expect(String.format("{0:##.0 ‰‰}", 0.03697)).toBe("36970.0 ‰‰");
            expect(String.format("{0:" + "#0.##" + "\u2030" + "}", .00354)).toBe("3.54‰");
            expect(String.format("{0:##.0, ‰}", 0.03697)).toBe("37.0 ‰");
            expect(String.format("{0:##.0 ‰,}", 0.03697)).toBe("37.0 ‰");

            // Exponential notation - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierExponent
            expect(String.format("{0:#0.0e0}", 987654)).toBe("98.8e4");
            expect(String.format("{0:0.0##e+00}", 1503.92311)).toBe("1.504e+03");
            expect(String.format("{0:00.0##e+00}", 1503.92311)).toBe("15.039e+02");
            expect(String.format("{0:0.0e+00}", 1.8901385e-16)).toBe("1.9e-16");
            expect(String.format("{0:0.###E+0}", 86000)).toBe("8.6E+4");
            expect(String.format("{0:0.###E+000}", 86000)).toBe("8.6E+004");
            expect(String.format("{0:0.###E-000}", 86000)).toBe("8.6E004");
            expect(String.format("{0:#.#e+0}", 0.001)).toBe("1e-3");
            expect(String.format("{0:#.#e+0 exponent}", 0.001)).toBe("1e-3 exponent");
            expect(String.format("{0:exponent #.#e+0}", 0.001)).toBe("exponent 1e-3");
            expect(String.format("{0:#0.0E0e00}", 987654)).toBe("98.8E4e00");
            expect(String.format("{0:#0.0E0e00##}", 987654)).toBe("98.7e0065E4");
            expect(String.format("{0:0e0.0e+0###}", 0.12345)).toBe("1.2e+0345e-1"); // C# - "1e-1.2e+0345"
            expect(String.format("{0:E+000.0###}", 12.345)).toBe("1.2345E+001");    // C# - "E+002.1235"
            expect(String.format("{0:E+0#0.0###}", 12.345)).toBe("12.345E+0");      // C# - "E+012.345"

            // Escape character - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierEscape
            expect(String.format("{0:\\###00\\#}", 987654)).toBe("#987654#");
            expect(String.format("{0:\\;##00\\;}", 987654)).toBe(";987654;");
            expect(String.format("{0:';;;'##00';;;'}", 987654)).toBe(";;;987654;;;");
            expect(String.format("{0:\\#\\#\\# ##0 dollars and \\0\\0 cents \\#\\#\\#}", 12)).toBe("### 12 dollars and 00 cents ###");
            expect(String.format("{0:\\\\\\\\\\\\ ##0 dollars and \\0\\0 cents \\\\\\\\\\\\}", 12)).toBe("\\\\\\ 12 dollars and 00 cents \\\\\\");
            expect(String.format("{0:0.#\\e+\\0}", 0.001)).toBe("0e+0");
            expect(String.format("{0:#.#e+\\0}", 0.001)).toBe("e+0");
            expect(String.format("{0:#.#\\e+0}", 0.001)).toBe(".0e+0");
            expect(String.format("{0:#\\e+#}", 0.001)).toBe("e+");
            expect(String.format("{0:#.#\\e+#}", 0.001)).toBe("e+");
            expect(String.format("{0:00\\000}", 345.6)).toBe("03046");
            expect(String.format("{0:00\\;00}", 345.6)).toBe("03;46");

            // Literal string delimiter - Indicates that the enclosed characters should be copied to the result string unchanged.
            expect(String.format("{0:#' \"degrees\"'}", 32)).toBe("32 \"degrees\"");
            expect(String.format("{0:0\" '0degrees0'\"}", 32)).toBe("32 '0degrees0'");
            expect(String.format("{0:#.#'e0'}", 0.001)).toBe("e0");
            expect(String.format("{0:0.#'e0'}", 0.001)).toBe("0e0");
            expect(String.format("{0:00';'00}", 345.6)).toBe("03;46");
            expect(String.format("{0:00';'00}", -345.6)).toBe("-03;46");

            // Section separator - https://msdn.microsoft.com/library/0c899ak8.aspx#SectionSeparator
            expect(String.format("{0:#0.0#;}", -1)).toBe("-1.0");
            expect(String.format("{0:#0.0#;(#0.0#)}", 0)).toBe("0.0");
            expect(String.format("{0:#0.0#;(#0.0#);}", 0.005)).toBe("0.01");
            expect(String.format("{0:#0.0#;(#0.0#);0}", 0.0049)).toBe("0");
            expect(String.format("{0:#0.0#;(#0.0#);-0-}", 12.345)).toBe("12.35");
            expect(String.format("{0:#0.0#;(#0.0#);-0-}", 0)).toBe("-0-");
            expect(String.format("{0:#0.0#;(#0.0#)}", -12.345)).toBe("(12.35)");
            expect(String.format("{0:#0.0#;(#0.0#);}", -0.005)).toBe("(0.01)");
            expect(String.format("{0:#0.0#;(#0.0#);0}", -0.0049)).toBe("0");
            expect(String.format("{0:#0.0#;;-0-}", -12.345)).toBe("-12.35");
            expect(String.format("{0:#0.0#;(#0.0#,);-0-}", -1234.5)).toBe("(1.23)");
            expect(String.format("{0:#0.0#;';'#0.0#';';-0-}", -12.345)).toBe(";12.35;");
            expect(String.format("{0:#0.0#;#0.0#, %;-0-}", -0.12345)).toBe("12.35 %");
            expect(String.format("{0:#0.0#;% #0.0#,;-0-}", -0.12345)).toBe("% 12.35");

            // All other characters - The character is copied to the result string unchanged.
            expect(String.format("{0:# °C}", 32)).toBe("32 °C");
            expect(String.format("{0:-#-0.#-#-}", 3.456)).toBe("--3.4-6-");
            expect(String.format("{0:prefix X2 suffix}", -1.2)).toBe("-prefix X2 suffix");
            expect(String.format("{0:prefix .X2 suffix}", -1.2)).toBe("-prefix 1X2 suffix");
        });
    });
}
