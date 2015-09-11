/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Globalization/DateTimeFormatInfo" />
/// <reference path="../../../src/core/Globalization/NumberFormatInfo" />
/// <reference path="../../../src/core/Globalization/CultureInfo" />

/// <reference path="../../../src/core/Globalization/Numeric/InvariantFormatter" />

/// <reference path="../../../src/core/Utils/Types" />

namespace Format.Globalization {

    describe("CultureInfo", () => {

        let cultureInfo: CultureInfo;
        let cultureInfoAccessor: any;
        let staticAccessor: any = CultureInfo;

        it("should initialize static properties", () => {
            expect(CultureInfo.InvariantCulture).toBeDefined();
            expect(CultureInfo.CurrentCulture).toBe(CultureInfo.InvariantCulture);
        });

        it("constructor should initialize the locale's and formatters' properties", () => {

            cultureInfoAccessor = new CultureInfo("");

            expect(cultureInfoAccessor.locales).toBe("");
            expect(cultureInfoAccessor.formatters).toBeDefined();
            expect(cultureInfoAccessor.DateTimeFormat).toBeDefined();
            expect(cultureInfoAccessor.NumberFormat).toBeDefined();
        });

        it("getFormatter should return an appropriate instance for a given type", () => {

            cultureInfo = new CultureInfo("");

            expect(cultureInfo.getFormatter(Utils.Types.Date) instanceof DateTime.InvariantFormatter).toBe(true);
            expect(cultureInfo.getFormatter(Utils.Types.Number) instanceof Numeric.InvariantFormatter).toBe(true);
            expect(cultureInfo.getFormatter(Utils.Types.Object)).toBe(staticAccessor.objectFormatter);
            expect(cultureInfo.getFormatter(Utils.Types.Array)).toBe(staticAccessor.objectFormatter);
            expect(cultureInfo.getFormatter(Utils.Types.RegExp)).toBe(staticAccessor.fallbackFormatter);
        });
    });
}
