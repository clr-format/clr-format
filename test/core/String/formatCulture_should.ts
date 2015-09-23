/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Format" />
/// <reference path="../../../src/core/Globalization/CultureInfo" />

namespace Format {

    describe("String format (culture-variant)", () => {

        try {
            setCulture("de-DE");
        }
        catch (error) {
            if (error instanceof Errors.InvalidOperationError) {
                return;
            }
        }
        finally {
            setCulture("");
        }

        let replaceDecimalSeparator = (value: string) => value.replace(
            Globalization.CultureInfo.InvariantCulture.NumberFormat.NumberDecimalSeparator,
            Globalization.CultureInfo.CurrentCulture.NumberFormat.NumberDecimalSeparator);

        let getIntlFormattedNumber = (value: number, numberOptions: Intl.NumberFormatOptions): string => {

            let formatter: Intl.NumberFormat = <any> new Intl.NumberFormat("en-US", numberOptions);

            return replaceDecimalSeparator(formatter.format(value));
        };

        beforeAll(() => setCulture("de-DE"));

        it("should apply the optional format items' standard numeric format string component to values", () => {

            // Currency - https://msdn.microsoft.com/library/dwhawy9k.aspx#CFormatString
            expect(() => String.format("{0:c}", 1230)).toThrowError(Errors.FormatError);

            Format.setCurrency("EUR");

            expect(String.format("{0:c}", 1230)).toMatch(/1.230,00\s€/);
            expect(String.format("{0:C0}", 123)).toMatch(/123\s€/);
            expect(String.format("{0:c}", 1230.456)).toMatch(/1.230,46\s€/);
            expect(String.format("{0:C3}", -123.456)).toMatch(/-123,456\s€/);

            Format.setCurrency("ADP");

            expect(String.format("{0:c}", 1230)).toMatch(/1.230\sADP/);
            expect(String.format("{0:C0}", 123)).toMatch(/123\sADP/);
            expect(String.format("{0:c}", 1230.456)).toMatch(/1.230\sADP/);
            expect(String.format("{0:C2}", -123.456)).toMatch(/-123,46\sADP/);

            Format.setCurrency("BHD");

            expect(String.format("{0:c}", 1230)).toMatch(/1.230,000\s(?:BHD|د.ب.)/);
            expect(String.format("{0:C0}", 123)).toMatch(/123\s(?:BHD|د.ب.)/);
            expect(String.format("{0:c}", 1230.456)).toMatch(/1.230,456\s(?:BHD|د.ب.)/);
            expect(String.format("{0:C2}", -123.456)).toMatch(/-123,46\s(?:BHD|د.ب.)/);

            Format.setCurrency("CLF");

            expect(String.format("{0:c}", 1230)).toMatch(/1.230,0000\sCLF/);
            expect(String.format("{0:C0}", 123)).toMatch(/123\sCLF/);
            expect(String.format("{0:c}", 1230.456)).toMatch(/1.230,4560\sCLF/);
            expect(String.format("{0:C3}", -123.456)).toMatch(/-123,456\sCLF/);

            // Decimal - https://msdn.microsoft.com/library/dwhawy9k.aspx#DFormatString
            expect(String.format("{0:d}", 1234.23)).toBe("1234");
            expect(String.format("{0:D6}", 1234.5)).toBe("001235");

            // Exponential (scientific) - https://msdn.microsoft.com/library/dwhawy9k.aspx#EFormatString
            expect(String.format("{0:e}", 123)).toBe("1,230000e+002");
            expect(String.format("{0:E0}", 1052.0329112756)).toBe("1E+003");
            expect(String.format("{0:e}", 1052.0329112756)).toBe("1,052033e+003");
            expect(String.format("{0:E2}", -1052.0329112756)).toBe("-1,05E+003");

            // Fixed-point - https://msdn.microsoft.com/library/dwhawy9k.aspx#FFormatString
            expect(String.format("{0:f}", 1234)).toBe("1234,000");
            expect(String.format("{0:F0}", 1234.567)).toBe("1235");
            expect(String.format("{0:f}", 1234.5678)).toBe("1234,568");
            expect(String.format("{0:F4}", -1234.567)).toBe("-1234,5670");

            // General - https://msdn.microsoft.com/library/dwhawy9k.aspx#GFormatString
            expect(String.format("{0:g}", 0.000023)).toBe("2,3e-05");
            expect(String.format("{0:g1}", 0.00002351)).toBe("2e-05");
            expect(String.format("{0:G}", 0.0023)).toBe("0,0023");
            expect(String.format("{0:G0}", 0.0023)).toBe("0,0023");
            expect(String.format("{0:G1}", 0.0023)).toBe("0,002");
            expect(String.format("{0:G2}", 1234)).toBe("1,2E+03");
            expect(String.format("{0:G4}", -123.4546)).toBe("-123,5");
            expect(String.format("{0:G5}", Math.PI)).toBe("3,1416");
            expect(String.format("{0:G5}", 12.3)).toBe("12,3");
            expect(String.format("{0:G9}", 0.000023)).toBe("2,3E-05");
            expect(String.format("{0:G9}", 0.00001234567891)).toBe("1,23456789E-05");
            expect(String.format("{0:G0}", 0.00001234567891)).toBe("1,234567891E-05");

            // Number - https://msdn.microsoft.com/library/dwhawy9k.aspx#NFormatString
            expect(String.format("{0:n}", 1234)).toBe("1.234,000");
            expect(String.format("{0:n}", 1234.5678)).toBe("1.234,568");
            expect(String.format("{0:N1}", 123456789)).toBe("123.456.789,0");
            expect(String.format("{0:N2}", -1234.56)).toBe("-1.234,56");

            // Percent - https://msdn.microsoft.com/library/dwhawy9k.aspx#PFormatString
            expect(String.format("{0:p}", 1)).toMatch(/100,000\s?%/);
            expect(String.format("{0:p0}", 10)).toMatch(/1.000\s?%/);
            expect(String.format("{0:P1}", -0.39678)).toMatch(/-39,7\s?%/);

            // Round-trip - https://msdn.microsoft.com/library/dwhawy9k.aspx#RFormatString
            expect(String.format("{0:r}", 123456789.12345678)).toBe(replaceDecimalSeparator(JSON.stringify(123456789.12345678)));
            expect(String.format("{0:R}", -1234567890.12345678)).toBe(replaceDecimalSeparator(JSON.stringify(-1234567890.12345678)));
            expect(String.format("{0:R}", Math.PI)).toBe("3,141592653589793");

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
            expect(String.format("{0:0.00}", 0.45678)).toBe("0,46");
            expect(String.format("{0:00.00}", 1.2)).toBe("01,20");
            expect(String.format("{0:#.##}", 1.2)).toBe("1,2");
            expect(String.format("{0:#.##0}", 1.2)).toBe("1,200");
            expect(String.format("{0:#.##}", 0.45678)).toBe(",46");
            expect(String.format("{0:#.#}", 0.01)).toBe("");
            expect(String.format("{0:.}", 0.01)).toBe("");
            expect(String.format("{0:0==0.00<->00<->00}", 12.123456)).toBe("1==2,12<->34<->56");
            expect(String.format("{0:.[00-00-00]}", 0.123456)).toBe(",[12-34-56]");

            // Group separator and number scaling - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierTh
            expect(String.format("{0:##,#}", 2147483647)).toBe("2.147.483.647");
            expect(String.format("{0:,#}", 2147483647)).toBe("2147483647");
            expect(String.format("{0:#,}", 2147483647)).toBe("2147484");
            expect(String.format("{0:#,#,#,}", 2147483647)).toBe("2.147.484");
            expect(String.format("{0:#,#,,}", 2147483647)).toBe("2.147");
            expect(String.format("{0:#.#,,}", 2147483647)).toBe("2147,5");
            expect(String.format("{0:#,#,,.#}", 2147483647)).toBe("2.147.483.647");
            expect(String.format("{0:#0.0e0,}", 987654)).toBe("98,8e4");
            expect(String.format("{0:#0,e0}", 987654)).toBe("99e1");
            expect(String.format("{0:#0,E+00}", 987654)).toBe("99E+01");
            expect(String.format("{0:#0c,\\E+00#}", 987)).toBe("0.cE+987");
            expect(String.format("{0:#0c,\\E+00#}", 9876540)).toBe("9.876.cE+540");
            expect(String.format("{0:-0-0-0-0-0-,0}", 1234567)).toBe("-1.2-3-4.-5-6-7");
            expect(String.format("{0:-0#,##0-0.#-#-}", 1123.456)).toBe("-001.12-3,4-6-");

            // Percentage placeholder - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierPct
            expect(String.format("{0:%#0.00}", 0.3697)).toBe("%36,97");
            expect(String.format("{0:##.0 %}", 0.3697)).toBe("37,0 %");
            expect(String.format("{0:##.0 %%}", 0.3697)).toBe("3697,0 %%");
            expect(String.format("{0:#0.##%}", .086)).toBe("8,6%");
            expect(String.format("{0:##.0, %}", 0.3697)).toBe("37,0 %");
            expect(String.format("{0:#.00, %}", 0.003697)).toBe(",37 %");
            expect(String.format("{0:00%0}", 0.01)).toBe("00%1");
            expect(String.format("{0:00%0,}", 10)).toBe("100%0");

            // Per mille placeholder - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierPerMille
            expect(String.format("{0:‰#0.00}", 0.03697)).toBe("‰36,97");
            expect(String.format("{0:##.0 ‰}", 0.03697)).toBe("37,0 ‰");
            expect(String.format("{0:##.0 ‰‰}", 0.03697)).toBe("36970,0 ‰‰");
            expect(String.format("{0:" + "#0.##" + "\u2030" + "}", .00354)).toBe("3,54‰");
            expect(String.format("{0:##.0, ‰}", 0.03697)).toBe("37,0 ‰");
            expect(String.format("{0:##.0 ‰,}", 0.03697)).toBe("37,0 ‰");

            // Exponential notation - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierExponent
            expect(String.format("{0:#0.0e0}", 987654)).toBe("98,8e4");
            expect(String.format("{0:0.0##e+00}", 1503.92311)).toBe("1,504e+03");
            expect(String.format("{0:00.0##e+00}", 1503.92311)).toBe("15,039e+02");
            expect(String.format("{0:0.0e+00}", 1.8901385e-16)).toBe("1,9e-16");
            expect(String.format("{0:0.###E+0}", 86000)).toBe("8,6E+4");
            expect(String.format("{0:0.###E+000}", 86000)).toBe("8,6E+004");
            expect(String.format("{0:0.###E-000}", 86000)).toBe("8,6E004");
            expect(String.format("{0:#.#e+0}", 0.001)).toBe("1e-3");
            expect(String.format("{0:#.#e+0 exponent}", 0.001)).toBe("1e-3 exponent");
            expect(String.format("{0:exponent #.#e+0}", 0.001)).toBe("exponent 1e-3");
            expect(String.format("{0:#0.0E0e00}", 987654)).toBe("98,8E4e00");
            expect(String.format("{0:#0.0E0e00##}", 987654)).toBe("98,7e0065E4");
            expect(String.format("{0:0e0.0e+0###}", 0.12345)).toBe("1,2e+0345e-1"); // C# - "1e-1.2e+0345"
            expect(String.format("{0:E+000.0###}", 12.345)).toBe("1,2345E+001");    // C# - "E+002.1235"
            expect(String.format("{0:E+0#0.0###}", 12.345)).toBe("12,345E+0");      // C# - "E+012.345"

            // Escape character - https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierEscape
            expect(String.format("{0:\\###00\\#}", 987654)).toBe("#987654#");
            expect(String.format("{0:\\;##00\\;}", 987654)).toBe(";987654;");
            expect(String.format("{0:';;;'##00';;;'}", 987654)).toBe(";;;987654;;;");
            expect(String.format("{0:\\#\\#\\# ##0 dollars and \\0\\0 cents \\#\\#\\#}", 12)).toBe("### 12 dollars and 00 cents ###");
            expect(String.format("{0:\\\\\\\\\\\\ ##0 dollars and \\0\\0 cents \\\\\\\\\\\\}", 12)).toBe("\\\\\\ 12 dollars and 00 cents \\\\\\");
            expect(String.format("{0:0.#\\e+\\0}", 0.001)).toBe("0e+0");
            expect(String.format("{0:#.#e+\\0}", 0.001)).toBe("e+0");
            expect(String.format("{0:#.#\\e+0}", 0.001)).toBe(",0e+0");
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
            expect(String.format("{0:#0.0#;}", -1)).toBe("-1,0");
            expect(String.format("{0:#0.0#;(#0.0#)}", 0)).toBe("0,0");
            expect(String.format("{0:#0.0#;(#0.0#);}", 0.005)).toBe("0,01");
            expect(String.format("{0:#0.0#;(#0.0#);0}", 0.0049)).toBe("0");
            expect(String.format("{0:#0.0#;(#0.0#);-0-}", 12.345)).toBe("12,35");
            expect(String.format("{0:#0.0#;(#0.0#);-0-}", 0)).toBe("-0-");
            expect(String.format("{0:#0.0#;(#0.0#)}", -12.345)).toBe("(12,35)");
            expect(String.format("{0:#0.0#;(#0.0#);}", -0.005)).toBe("(0,01)");
            expect(String.format("{0:#0.0#;(#0.0#);0}", -0.0049)).toBe("0");
            expect(String.format("{0:#0.0#;;-0-}", -12.345)).toBe(getIntlFormattedNumber(-12.345, {
                maximumFractionDigits: 2, minimumFractionDigits: 1, minimumIntegerDigits: 1, style: "decimal", useGrouping: false
            }));
            expect(String.format("{0:#0.0#;(#0.0#,);-0-}", -1234.5)).toBe("(1,23)");
            expect(String.format("{0:#0.0#;';'#0.0#';';-0-}", -12.345)).toBe(";12,35;");
            expect(String.format("{0:#0.0#;#0.0#, %;-0-}", -0.12345)).toBe("12,35 %");
            expect(String.format("{0:#0.0#;% #0.0#,;-0-}", -0.12345)).toBe("% 12,35");

            // All other characters - The character is copied to the result string unchanged.
            expect(String.format("{0:# °C}", 32)).toBe("32 °C");
            expect(String.format("{0:-#-0.#-#-}", 3.456)).toBe("--3,4-6-");
            expect(String.format("{0:prefix X2 suffix}", -1.2)).toBe("-prefix X2 suffix");
            expect(String.format("{0:prefix .X2 suffix}", -1.2)).toBe("-prefix 1X2 suffix");
        });

        let expectStripped = (value: string) => expect(value.replace(/\u200E|\u200F/g, ""));

        it("should apply the optional format items' standard date and time format string component to values", () => {

            let date = new Date(2015, 8, 21, 13, 4, 55);
            let utcDate = new Date("2015-09-21T10:04:55.000Z");

            /** Short Date - https://msdn.microsoft.com/library/az4se3k1.aspx#ShortDate */
            expectStripped(String.format("{0:d}", date)).toMatch(/21.0?9.2015/);

            /** Long Date - https://msdn.microsoft.com/library/az4se3k1.aspx#LongDate */
            expectStripped(String.format("{0:D}", date)).toBe("Montag, 21. September 2015");

            /** Full Date Short Time - https://msdn.microsoft.com/library/az4se3k1.aspx#FullDateShortTime */
            expectStripped(String.format("{0:f}", date)).toMatch(/Montag, 21. September 2015,? 13:04/);

            /** Full Date Long Time - https://msdn.microsoft.com/library/az4se3k1.aspx#FullDateLongTime */
            expectStripped(String.format("{0:F}", date)).toMatch(/Montag, 21. September 2015,? 13:04:55/);

            /** General Date Short Time - https://msdn.microsoft.com/library/az4se3k1.aspx#GeneralDateShortTime */
            expectStripped(String.format("{0:g}", date)).toMatch(/21.0?9.2015,? 13:04/);

            /** General Date Long Time - https://msdn.microsoft.com/library/az4se3k1.aspx#GeneralDateLongTime */
            expectStripped(String.format("{0}", date)).toMatch(/21.0?9.2015,? 13:04:55/);
            expectStripped(String.format("{0:G}", date)).toMatch(/21.0?9.2015,? 13:04:55/);

            /** Month Day - https://msdn.microsoft.com/library/az4se3k1.aspx#MonthDay */
            expectStripped(String.format("{0:m}", date)).toBe("21. September");
            expectStripped(String.format("{0:M}", date)).toBe("21. September");

            /** Round-trip - https://msdn.microsoft.com/library/az4se3k1.aspx#Roundtrip */
            expect(String.format("{0:o}", utcDate)).toBe("2015-09-21T10:04:55.000Z");
            expect(String.format("{0:O}", utcDate)).toBe("2015-09-21T10:04:55.000Z");

            /** RFC1123 - https://msdn.microsoft.com/library/az4se3k1.aspx#RFC1123 */
            expect(String.format("{0:r}", utcDate)).toBe("Mon, 21 Sep 2015 10:04:55 GMT");
            expect(String.format("{0:R}", utcDate)).toBe("Mon, 21 Sep 2015 10:04:55 GMT");

            /** Sortable - https://msdn.microsoft.com/library/az4se3k1.aspx#Sortable */
            expect(String.format("{0:s}", date)).toBe("2015-09-21T13:04:55");

            /** Short Time - https://msdn.microsoft.com/library/az4se3k1.aspx#ShortTime */
            expectStripped(String.format("{0:t}", date)).toBe("13:04");

            /** Long Time - https://msdn.microsoft.com/library/az4se3k1.aspx#LongTime */
            expectStripped(String.format("{0:T}", date)).toBe("13:04:55");

            /** Universal Sortable - https://msdn.microsoft.com/library/az4se3k1.aspx#UniversalSortable */
            expect(String.format("{0:u}", utcDate)).toBe("2015-09-21 10:04:55Z");

            /** Universal Full - https://msdn.microsoft.com/library/az4se3k1.aspx#UniversalFull */
            expectStripped(String.format("{0:U}", utcDate)).toMatch(/Montag, 21. September 2015,? 10:04:55/);

            /** YearMonth - https://msdn.microsoft.com/library/az4se3k1.aspx#YearMonth */
            expectStripped(String.format("{0:y}", date)).toBe("September 2015");
            expectStripped(String.format("{0:Y}", date)).toBe("September 2015");

            // Unknown date specifier
            expect(() => String.format("{0:Z}", date)).toThrowError(Errors.FormatError);
        });

        it("should apply the optional format items' custom numeric format string component to values", () => {

            let date = new Date(2015, 8, 1);

            // Date/Day placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#dSpecifier
            date.setDate(6); // 2015-09-06
            expect(String.format("{0:%d}", date)).toBe("6");
            expect(String.format("{0:dd}", date)).toBe("06");
            expect(String.format("{0:ddd}", date)).toMatch(/So\.?/);
            expectStripped(String.format("{0:dddd}", date)).toBe("Sonntag");

            date.setDate(16); // 2015-09-16
            expect(String.format("{0:%d}", date)).toBe("16");
            expect(String.format("{0:ddd}", date)).toMatch(/Mi\.?/);
            expectStripped(String.format("{0:ddddd}", date)).toBe("Mittwoch");

            // Digit Sub-Second placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#fSpecifier
            date.setMilliseconds(4); // 2015-09-16T00:00:00.003
            expect(String.format("{0:%f}", date)).toBe("0");
            expect(String.format("{0:ff}", date)).toBe("00");
            expect(String.format("{0:fff}", date)).toBe("004");

            date.setMilliseconds(45); // 2015-09-16T00:00:00.045
            expect(String.format("{0:%f}", date)).toBe("0");
            expect(String.format("{0:ff}", date)).toBe("04");
            expect(String.format("{0:fff}", date)).toBe("045");

            date.setMilliseconds(456); // 2015-09-16T00:00:00.456
            expect(String.format("{0:%f}", date)).toBe("4");
            expect(String.format("{0:ff}", date)).toBe("45");
            expect(String.format("{0:fff}", date)).toBe("456");

            date.setMilliseconds(0); // 2015-09-16T00:00:00.000
            expect(String.format("{0:fff}", date)).toBe("000");

            expect(() => String.format("{0:ffff}", date)).toThrowError(Errors.FormatError);

            // Zero Sub-Second placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#F_Specifier
            date.setMilliseconds(4); // 2015-09-16T00:00:00.003
            expect(String.format("{0:%F}", date)).toBe("");
            expect(String.format("{0:FF}", date)).toBe("");
            expect(String.format("{0:FFF}", date)).toBe("004");

            date.setMilliseconds(45); // 2015-09-16T00:00:00.045
            expect(String.format("{0:%F}", date)).toBe("");
            expect(String.format("{0:FF}", date)).toBe("04");
            expect(String.format("{0:FFF}", date)).toBe("045");

            date.setMilliseconds(456); // 2015-09-16T00:00:00.456
            expect(String.format("{0:%F}", date)).toBe("4");
            expect(String.format("{0:FF}", date)).toBe("45");
            expect(String.format("{0:FFF}", date)).toBe("456");

            date.setMilliseconds(0); // 2015-09-16T00:00:00.000
            expect(String.format("{0:FFF}", date)).toBe("");

            expect(() => String.format("{0:FFFF}", date)).toThrowError(Errors.FormatError);

            // Era placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#gSpecifier
            date.setFullYear(-1); // -0001-09-16 B.C.
            expect(String.format("{0:%g}", date)).toMatch(/(?:v\. Chr\.)|(?:B\.C\.)/);
            expect(String.format("{0:gg}", date)).toMatch(/(?:v\. Chr\.)|(?:B\.C\.)/);

            date.setFullYear(2015); // 2015-09-16
            expect(String.format("{0:gg}", date)).toMatch(/(?:n\. Chr\.)|(?:A\.D\.)/);
            expect(String.format("{0:ggg}", date)).toMatch(/(?:n\. Chr\.)|(?:A\.D\.)/);

            // Hour (12) placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#hSpecifier
            date.setHours(3); // 2015-09-16T03:00:00
            expect(String.format("{0:%H}", date)).toBe("3");
            expect(String.format("{0:HH}", date)).toBe("03");

            date.setHours(19); // 2015-09-16T19:00:00
            expect(String.format("{0:%h}", date)).toBe("7");
            expect(String.format("{0:hh}", date)).toBe("07");

            date.setHours(0); // 2015-09-16T00:00:00
            expect(String.format("{0:%h}", date)).toBe("12");
            expect(String.format("{0:hhh}", date)).toBe("12");

            // Hour (24) placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#H_Specifier
            date.setHours(5); // 2015-09-16T05:00:00
            expect(String.format("{0:%H}", date)).toBe("5");
            expect(String.format("{0:HH}", date)).toBe("05");

            date.setHours(17); // 2015-09-16T17:00:00
            expect(String.format("{0:%H}", date)).toBe("17");
            expect(String.format("{0:HH}", date)).toBe("17");

            date.setHours(0); // 2015-09-16T00:00:00
            expect(String.format("{0:%H}", date)).toBe("0");
            expect(String.format("{0:HHH}", date)).toBe("00");

            // Timezone placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#KSpecifier
            let timezoneFormatResult = String.format("{0:%K}", date);
            expect(timezoneFormatResult).toMatch(/[-\+][0-1][0-9]:[0-5][0-9]/);
            expect(String.format("{0:KK}", date)).toMatch(/(?:[-\+][0-1][0-9]:[0-5][0-9]){2,2}/);

            // Minute placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#mSpecifier
            date.setMinutes(7); // 2015-09-16T00:07:00
            expect(String.format("{0:%m}", date)).toBe("7");
            expect(String.format("{0:mm}", date)).toBe("07");

            date.setMinutes(57); // 2015-09-16T00:57:00
            expect(String.format("{0:%m}", date)).toBe("57");
            expect(String.format("{0:mm}", date)).toBe("57");

            date.setMinutes(0); // 2015-09-16T00:00:00
            expect(String.format("{0:%m}", date)).toBe("0");
            expect(String.format("{0:mmm}", date)).toBe("00");

            // Month placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#M_Specifier
            date.setMonth(11); // 2015-12-16
            expect(String.format("{0:%M}", date)).toBe("12");
            expect(String.format("{0:MMM}", date)).toBe("Dez");
            expectStripped(String.format("{0:MMMMM}", date)).toBe("Dezember");

            date.setMonth(8); // 2015-09-16
            expect(String.format("{0:%M}", date)).toBe("9");
            expect(String.format("{0:MM}", date)).toBe("09");
            expect(String.format("{0:MMM}", date)).toBe("Sep");
            expectStripped(String.format("{0:MMMM}", date)).toBe("September");

            // Second placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#sSpecifier
            date.setSeconds(8); // 2015-09-16T00:00:08
            expect(String.format("{0:%s}", date)).toBe("8");
            expect(String.format("{0:ss}", date)).toBe("08");

            date.setSeconds(48); // 2015-09-16T00:00:48
            expect(String.format("{0:%s}", date)).toBe("48");
            expect(String.format("{0:ss}", date)).toBe("48");

            date.setSeconds(0); // 2015-09-16T00:00:00
            expect(String.format("{0:%s}", date)).toBe("0");
            expect(String.format("{0:sss}", date)).toBe("00");

            // AM/PM placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#tSpecifier
            date.setHours(18); // 2015-09-16T18:00:00
            expect(String.format("{0:%t}", date)).toBe("n");
            expect(String.format("{0:tt}", date)).toBe("nachm.");

            date.setHours(0); // 2015-09-16T00:00:00
            expect(String.format("{0:%t}", date)).toBe("v");
            expect(String.format("{0:ttt}", date)).toBe("vorm.");

            // Year placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#ySpecifier
            date.setFullYear(209); // 209-09-16
            expect(String.format("{0:%y}", date)).toBe("9");
            expect(String.format("{0:yy}", date)).toBe("09");
            expect(String.format("{0:yyy}", date)).toBe("209");
            expect(String.format("{0:yyyy}", date)).toBe("0209");

            date.setFullYear(20016); // 20016-09-16
            expect(String.format("{0:%y}", date)).toBe("16");
            expect(String.format("{0:yy}", date)).toBe("16");
            expect(String.format("{0:yyy}", date)).toBe("20016");
            expect(String.format("{0:yyyyyy}", date)).toBe("020016");

            date.setFullYear(2015); // 2015-09-16
            expect(String.format("{0:%y}", date)).toBe("15");
            expect(String.format("{0:yy}", date)).toBe("15");
            expect(String.format("{0:yyy}", date)).toBe("2015");
            expect(String.format("{0:yyyyy}", date)).toBe("02015");

            // Hours offset placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#zSpecifier
            expect(String.format("{0:%z}", date)).toMatch(/[-\+][0-1]?[0-9]/);
            expect(String.format("{0:zz}", date)).toMatch(/[-\+][0-1][0-9]/);
            expect(String.format("{0:zzz}", date)).toBe(timezoneFormatResult);
            expect(String.format("{0:zzzz}", date)).toBe(timezoneFormatResult);

            // Time separator - https://msdn.microsoft.com/library/8kb3ddd4.aspx#timeSeparator
            expect(String.format("{0:HH:mm:ss}", date)).toBe("00:00:00");

            // Date separator - https://msdn.microsoft.com/library/8kb3ddd4.aspx#dateSeparator
            expect(String.format("{0:dd/MM/yyyy}", date)).toBe("16.09.2015");

            // Literal string delimiters - Indicates that the enclosed characters should be copied to the result string unchanged
            expect(String.format("{0:'The date is' dd 'of month'/'year' MM/yyyy}", date)).toBe("The date is 16 of month.year 09.2015");
            expect(String.format("{0:\"The date is\" dd \"of month\"/\"year\" MM/yyyy}", date)).toBe("The date is 16 of month.year 09.2015");

            expect(() => String.format("{0:'The date is\"}", date)).toThrowError(Errors.FormatError);
            expect(() => String.format("{0:\"The date is'}", date)).toThrowError(Errors.FormatError);

            // Single char format specifier - https://msdn.microsoft.com/library/8kb3ddd4.aspx#UsingSingleSpecifiers
            expect(String.format("{0:%d}", date)).toBe("16");
            expect(String.format("{0:%MM}", date)).toBe("99");
            expect(String.format("{0:%XM}", date)).toBe("X9");

            expect(() => String.format("{0:%%}", date)).toThrowError(Errors.FormatError);
            expect(() => String.format("{0:%'%'}", date)).toThrowError(Errors.FormatError);
            expect(() => String.format("{0:%\"%\"}", date)).toThrowError(Errors.FormatError);

            // Escape character - Indicates that the next character to be interpreted as a literal rather than as a custom format specifier
            expect(String.format("{0:\\d}", date)).toBe("d");
            expect(String.format("{0:\\MM}", date)).toBe("M9");
        });

        afterAll(() => setCulture(""));
    });
}
