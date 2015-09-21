/// <reference path="../../../typings/jasmine/jasmine" />

/// <reference path="../../../../src/core/Globalization/DateTimeFormatInfo" />

/// <reference path="../../../../src/core/Globalization/DateTime/InfoSpecifierFormatter" />

namespace Format.Globalization.DateTime {

    describe("InfoSpecifierFormatter format", () => {

        let date = new Date(2015, 8, 1);

        let infoSpecifierFormatter: InfoSpecifierFormatter;
        let infoSpecifierFormatterAccessor: any;

        beforeAll(() => {
            infoSpecifierFormatter = infoSpecifierFormatterAccessor = new InfoSpecifierFormatter(DateTimeFormatInfo.InvariantInfo);
        });

        it("constructor should initialize the format info field", () => {
            expect(infoSpecifierFormatterAccessor.formatInfo).toBe(DateTimeFormatInfo.InvariantInfo);
        });

        it("constructor should throw an ArgumentNullError for parameter(s) with null or undefined values", () => {
            expect(() => new InfoSpecifierFormatter(null)).toThrowError(Errors.ArgumentNullError);
            expect(() => new InfoSpecifierFormatter(undefined)).toThrowError(Errors.ArgumentNullError);
        });

        it("format should initialize the value field", () => {

            infoSpecifierFormatter.format("", date);

            expect(infoSpecifierFormatterAccessor.value).toBe(date);
        });

        it("format should replace custom date and time format specifiers with values", () => {

            // Date/Day placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#dSpecifier
            date.setDate(6); // 2015-09-06
            expect(infoSpecifierFormatter.format("d", date)).toBe("6");
            expect(infoSpecifierFormatter.format("dd", date)).toBe("06");
            expect(infoSpecifierFormatter.format("ddd", date)).toBe("Sun");
            expect(infoSpecifierFormatter.format("dddd", date)).toBe("Sunday");

            date.setDate(16); // 2015-09-16
            expect(infoSpecifierFormatter.format("d", date)).toBe("16");
            expect(infoSpecifierFormatter.format("dd", date)).toBe("16");
            expect(infoSpecifierFormatter.format("ddd", date)).toBe("Wed");
            expect(infoSpecifierFormatter.format("dddd", date)).toBe("Wednesday");

            // Digit Sub-Second placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#fSpecifier
            date.setMilliseconds(4); // 2015-09-16T00:00:00.003
            expect(infoSpecifierFormatter.format("f", date)).toBe("");
            expect(infoSpecifierFormatter.format("ff", date)).toBe("");
            expect(infoSpecifierFormatter.format("fff", date)).toBe("004");

            date.setMilliseconds(45); // 2015-09-16T00:00:00.045
            expect(infoSpecifierFormatter.format("f", date)).toBe("");
            expect(infoSpecifierFormatter.format("ff", date)).toBe("04");
            expect(infoSpecifierFormatter.format("fff", date)).toBe("045");

            date.setMilliseconds(456); // 2015-09-16T00:00:00.456
            expect(infoSpecifierFormatter.format("f", date)).toBe("4");
            expect(infoSpecifierFormatter.format("ff", date)).toBe("45");
            expect(infoSpecifierFormatter.format("fff", date)).toBe("456");

            date.setMilliseconds(0); // 2015-09-16T00:00:00.000
            expect(infoSpecifierFormatter.format("fff", date)).toBe("");

            expect(() => infoSpecifierFormatter.format("ffff", date)).toThrowError(Errors.FormatError);

            // Zero Sub-Second placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#F_Specifier
            date.setMilliseconds(4); // 2015-09-16T00:00:00.003
            expect(infoSpecifierFormatter.format("F", date)).toBe("0");
            expect(infoSpecifierFormatter.format("FF", date)).toBe("00");
            expect(infoSpecifierFormatter.format("FFF", date)).toBe("004");

            date.setMilliseconds(45); // 2015-09-16T00:00:00.045
            expect(infoSpecifierFormatter.format("FF", date)).toBe("04");
            expect(infoSpecifierFormatter.format("FFF", date)).toBe("045");

            date.setMilliseconds(456); // 2015-09-16T00:00:00.456
            expect(infoSpecifierFormatter.format("F", date)).toBe("4");
            expect(infoSpecifierFormatter.format("FF", date)).toBe("45");
            expect(infoSpecifierFormatter.format("FFF", date)).toBe("456");

            date.setMilliseconds(0); // 2015-09-16T00:00:00.000
            expect(infoSpecifierFormatter.format("FFF", date)).toBe("000");

            expect(() => infoSpecifierFormatter.format("FFFF", date)).toThrowError(Errors.FormatError);

            // Era placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#gSpecifier
            date.setFullYear(-date.getFullYear() - 1); // 0001-09-16 B.C.
            expect(infoSpecifierFormatter.format("g", date)).toBe("B.C.");
            expect(infoSpecifierFormatter.format("gg", date)).toBe("B.C.");

            date.setFullYear(2015); // 2015-09-16
            expect(infoSpecifierFormatter.format("gg", date)).toBe("A.D.");
            expect(infoSpecifierFormatter.format("ggg", date)).toBe("A.D.");

            // Hour (12) placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#hSpecifier
            date.setHours(3); // 2015-09-16T03:00:00
            expect(infoSpecifierFormatter.format("H", date)).toBe("3");
            expect(infoSpecifierFormatter.format("HH", date)).toBe("03");

            date.setHours(19); // 2015-09-16T19:00:00
            expect(infoSpecifierFormatter.format("h", date)).toBe("7");
            expect(infoSpecifierFormatter.format("hh", date)).toBe("07");

            date.setHours(0); // 2015-09-16T00:00:00
            expect(infoSpecifierFormatter.format("h", date)).toBe("12");
            expect(infoSpecifierFormatter.format("hhh", date)).toBe("12");

            // Hour (24) placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#H_Specifier
            date.setHours(5); // 2015-09-16T05:00:00
            expect(infoSpecifierFormatter.format("H", date)).toBe("5");
            expect(infoSpecifierFormatter.format("HH", date)).toBe("05");

            date.setHours(17); // 2015-09-16T17:00:00
            expect(infoSpecifierFormatter.format("H", date)).toBe("17");
            expect(infoSpecifierFormatter.format("HH", date)).toBe("17");

            date.setHours(0); // 2015-09-16T00:00:00
            expect(infoSpecifierFormatter.format("H", date)).toBe("0");
            expect(infoSpecifierFormatter.format("HHH", date)).toBe("00");

            // Timezone placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#KSpecifier
            let timezoneFormatResult = infoSpecifierFormatter.format("K", date);
            expect(timezoneFormatResult).toMatch(/[-\+][0-1][0-9]:[0-5][0-9]/);
            expect(infoSpecifierFormatter.format("KK", date)).toMatch(/(?:[-\+][0-1][0-9]:[0-5][0-9]){2,2}/);

            // Minute placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#mSpecifier
            date.setMinutes(7); // 2015-09-16T00:07:00
            expect(infoSpecifierFormatter.format("m", date)).toBe("7");
            expect(infoSpecifierFormatter.format("mm", date)).toBe("07");

            date.setMinutes(57); // 2015-09-16T00:57:00
            expect(infoSpecifierFormatter.format("m", date)).toBe("57");
            expect(infoSpecifierFormatter.format("mm", date)).toBe("57");

            date.setMinutes(0); // 2015-09-16T00:00:00
            expect(infoSpecifierFormatter.format("m", date)).toBe("0");
            expect(infoSpecifierFormatter.format("mmm", date)).toBe("00");

            // Month placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#M_Specifier
            date.setMonth(11); // 2015-12-16
            expect(infoSpecifierFormatter.format("M", date)).toBe("12");
            expect(infoSpecifierFormatter.format("MMM", date)).toBe("Dec");
            expect(infoSpecifierFormatter.format("MMMMM", date)).toBe("December");

            date.setMonth(8); // 2015-09-16
            expect(infoSpecifierFormatter.format("M", date)).toBe("9");
            expect(infoSpecifierFormatter.format("MM", date)).toBe("09");
            expect(infoSpecifierFormatter.format("MMM", date)).toBe("Sep");
            expect(infoSpecifierFormatter.format("MMMM", date)).toBe("September");

            // Second placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#sSpecifier
            date.setSeconds(8); // 2015-09-16T00:00:08
            expect(infoSpecifierFormatter.format("s", date)).toBe("8");
            expect(infoSpecifierFormatter.format("ss", date)).toBe("08");

            date.setSeconds(48); // 2015-09-16T00:00:48
            expect(infoSpecifierFormatter.format("s", date)).toBe("48");
            expect(infoSpecifierFormatter.format("ss", date)).toBe("48");

            date.setSeconds(0); // 2015-09-16T00:00:00
            expect(infoSpecifierFormatter.format("s", date)).toBe("0");
            expect(infoSpecifierFormatter.format("sss", date)).toBe("00");

            // AM/PM placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#tSpecifier
            date.setHours(18); // 2015-09-16T18:00:00
            expect(infoSpecifierFormatter.format("t", date)).toBe("P");
            expect(infoSpecifierFormatter.format("tt", date)).toBe("PM");

            date.setHours(0); // 2015-09-16T00:00:00
            expect(infoSpecifierFormatter.format("t", date)).toBe("A");
            expect(infoSpecifierFormatter.format("ttt", date)).toBe("AM");

            // Year placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#ySpecifier
            date.setFullYear(209); // 209-09-16
            expect(infoSpecifierFormatter.format("y", date)).toBe("9");
            expect(infoSpecifierFormatter.format("yy", date)).toBe("09");
            expect(infoSpecifierFormatter.format("yyy", date)).toBe("209");
            expect(infoSpecifierFormatter.format("yyyy", date)).toBe("0209");

            date.setFullYear(20016); // 20016-09-16
            expect(infoSpecifierFormatter.format("y", date)).toBe("16");
            expect(infoSpecifierFormatter.format("yy", date)).toBe("16");
            expect(infoSpecifierFormatter.format("yyy", date)).toBe("20016");
            expect(infoSpecifierFormatter.format("yyyyyy", date)).toBe("020016");

            date.setFullYear(2015); // 2015-09-16
            expect(infoSpecifierFormatter.format("y", date)).toBe("15");
            expect(infoSpecifierFormatter.format("yy", date)).toBe("15");
            expect(infoSpecifierFormatter.format("yyy", date)).toBe("2015");
            expect(infoSpecifierFormatter.format("yyyyy", date)).toBe("02015");

            // Hours offset placeholder - https://msdn.microsoft.com/library/8kb3ddd4.aspx#zSpecifier
            expect(infoSpecifierFormatter.format("z", date)).toMatch(/[-\+][0-1]?[0-9]/);
            expect(infoSpecifierFormatter.format("zz", date)).toMatch(/[-\+][0-1][0-9]/);
            expect(infoSpecifierFormatter.format("zzz", date)).toBe(timezoneFormatResult);
            expect(infoSpecifierFormatter.format("zzzz", date)).toBe(timezoneFormatResult);

            // Time separator - https://msdn.microsoft.com/library/8kb3ddd4.aspx#timeSeparator
            expect(infoSpecifierFormatter.format("HH:mm:ss", date)).toBe("00:00:00");

            // Date separator - https://msdn.microsoft.com/library/8kb3ddd4.aspx#dateSeparator
            expect(infoSpecifierFormatter.format("dd/MM/yyyy", date)).toBe("16/09/2015");

            // Literal string delimiters - Indicates that the enclosed characters should be copied to the result string unchanged
            expect(infoSpecifierFormatter.format("'The date is' dd 'of month'/'year' MM/yyyy", date)).toBe("The date is 16 of month/year 09/2015");
            expect(infoSpecifierFormatter.format("\"The date is\" dd \"of month\"/\"year\" MM/yyyy", date)).toBe("The date is 16 of month/year 09/2015");

            expect(() => infoSpecifierFormatter.format("'The date is\"", date)).toThrowError(Errors.FormatError);
            expect(() => infoSpecifierFormatter.format("\"The date is'", date)).toThrowError(Errors.FormatError);

            // Single char format specifier - https://msdn.microsoft.com/library/8kb3ddd4.aspx#UsingSingleSpecifiers
            expect(infoSpecifierFormatter.format("%d", date)).toBe("16");
            expect(infoSpecifierFormatter.format("%MM", date)).toBe("99");
            expect(infoSpecifierFormatter.format("%XM", date)).toBe("X9");

            expect(() => infoSpecifierFormatter.format("%%", date)).toThrowError(Errors.FormatError);
            expect(() => infoSpecifierFormatter.format("%'%'", date)).toThrowError(Errors.FormatError);
            expect(() => infoSpecifierFormatter.format("%\"%\"", date)).toThrowError(Errors.FormatError);

            // Escape character - Indicates that the next character to be interpreted as a literal rather than as a custom format specifier
            expect(infoSpecifierFormatter.format("\\d", date)).toBe("d");
            expect(infoSpecifierFormatter.format("\\MM", date)).toBe("M9");
        });
    });
}
