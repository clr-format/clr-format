/// <reference path="../../../typings/jasmine/jasmine" />

/// <reference path="../../../../src/core/Globalization/Numeric/DecorationFormatter" />
/// <reference path="../../../../src/core/Globalization/Numeric/IntlOptionsProvider" />

module Format.Globalization.Numeric {

    describe("DecorationFormatter", () => {

        let alternativeFormatInfo: NumberFormatInfo = new NumberFormatInfo();
        let decorationFormatter: DecorationFormatter<Intl.NumberFormatOptions>;
        let decorationFormatterAccessor: any;

        let resolveOptions = (intlOptions: Intl.NumberFormatOptions, formatInfo?: NumberFormatInfo) => {
            decorationFormatter = decorationFormatterAccessor = new DecorationFormatter(
                new IntlOptionsProvider(intlOptions), formatInfo || new NumberFormatInfo());
        };

        beforeAll(() => {
            alternativeFormatInfo.NegativeSign = "!";
            alternativeFormatInfo.NumberGroupSeparator = " ";
            alternativeFormatInfo.NumberDecimalSeparator = ",";
        });

        it("constructor should initialize options' fields and format info's object", () => {

            let intlOptions: Intl.NumberFormatOptions = {
                style: "decimal",
                noDigits: true,
                upperCase: true,
                useGrouping: true,
                noLeadingZeroIntegerDigit: true,
                prefixDecorator: "prefix",
                suffixDecorator: "suffix",
                internalDecorators: { 1: "a" }
            };

            resolveOptions(intlOptions, alternativeFormatInfo);

            expect(decorationFormatterAccessor.style).toBe(intlOptions.style);
            expect(decorationFormatterAccessor.noDigits).toBe(intlOptions.noDigits);
            expect(decorationFormatterAccessor.upperCase).toBe(intlOptions.upperCase);
            expect(decorationFormatterAccessor.useGrouping).toBe(intlOptions.useGrouping);
            expect(decorationFormatterAccessor.noLeadingZeroIntegerDigit).toBe(intlOptions.noLeadingZeroIntegerDigit);
            expect(decorationFormatterAccessor.prefixDecorator).toBe(intlOptions.prefixDecorator);
            expect(decorationFormatterAccessor.suffixDecorator).toBe(intlOptions.suffixDecorator);
            expect(decorationFormatterAccessor.internalDecorators).toBe(intlOptions.internalDecorators);

            expect(decorationFormatterAccessor.formatInfo).toBe(alternativeFormatInfo);
        });

        it("applyOptions should apply the provided format decoration options", () => {

            resolveOptions({
                noLeadingZeroIntegerDigit: true,
                prefixDecorator: "prefix ",
                suffixDecorator: " suffix",
                internalDecorators: { 1: "-", 2: "<->" }
            });
            expect(decorationFormatter.applyOptions(-0.12345, "-0.1235")).toBe("-prefix .1-2<->35 suffix");

            resolveOptions({
                noLeadingZeroIntegerDigit: false,
                prefixDecorator: "prefix ",
                suffixDecorator: " suffix",
                internalDecorators: {
                    1: "-", 2: "<->",
                    "-4": "-", "-3": "<->"
                }
            });
            expect(decorationFormatter.applyOptions(12345.12345, "12345.1235")).toBe("prefix 12-3<->45.1-2<->35 suffix");

            /* tslint:disable:align */
            resolveOptions({
                style: Specifiers.StandardSpecifiers[Specifiers.StandardSpecifiers.general],
                noLeadingZeroIntegerDigit: true,
                prefixDecorator: "prefix ",
                suffixDecorator: " suffix",
                internalDecorators: { 1: "-", 2: "<->" }
            }, alternativeFormatInfo);
            /* tslint:enable:align */
            expect(decorationFormatter.applyOptions(-0.12345, "!0,1235")).toBe("!prefix 0,1-2<->35 suffix");
        });

        it("applyUppercase should apply the provided upper case option", () => {

            resolveOptions({ upperCase: true });

            expect(decorationFormatter.applyUppercase("1.235e-1")).toBe("1.235E-1");
            expect(decorationFormatter.applyUppercase("bc614e")).toBe("BC614E");
        });

        it("applyGrouping should apply the provided group separator option", () => {

            resolveOptions({ useGrouping: true });
            expect(decorationFormatter.applyGrouping("-12345.6789")).toBe("-12,345.6789");

            resolveOptions({ useGrouping: true }, alternativeFormatInfo);
            expect(decorationFormatter.applyGrouping("!123456,789")).toBe("!123 456,789");
        });

        it("applyIntegerPadding should apply the provided integral part padding and optionally omit the negative sign", () => {

            resolveOptions({});
            expect(decorationFormatter.applyIntegerPadding(123, "123", 2)).toBe("123");

            resolveOptions({});
            expect(decorationFormatter.applyIntegerPadding(123, "123", 5)).toBe("00123");

            resolveOptions({});
            expect(decorationFormatter.applyIntegerPadding(1.23, "1.23", 2)).toBe("01.23");

            let value: string;

            resolveOptions({});
            expect(value = decorationFormatter.applyIntegerPadding(-1.23, "-1.23", 3)).toBe("001.23");
            expect(decorationFormatter.applyOptions(-1.23, value)).toBe("-001.23");

            resolveOptions({}, alternativeFormatInfo);
            expect(value = decorationFormatter.applyIntegerPadding(-1.23, "!1,23", 4)).toBe("0001,23");
            expect(decorationFormatter.applyOptions(-1.23, value)).toBe("!0001,23");
        });
    });
}
