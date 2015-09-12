/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/intl/Utils/IntlResolvers" />

/// <reference path="../../../src/core/Globalization/NumberFormatInfo" />

namespace Format.Utils {

    describe("IntlResovlers applyNumberCultureFormatting", () => {

        let replaceInvariantSymbols = (replaceChar: string): string => {

            if (replaceChar === Globalization.NumberFormatInfo.InvariantInfo.NegativeSign) {
                return "#";
            }

            if (replaceChar === Globalization.NumberFormatInfo.InvariantInfo.NumberDecimalSeparator) {
                return ",";
            }

            return replaceChar;
        };

        it("should replace the culture invariant symbols with culture-specific ones", () => {

            if (!Utils.IntlResovlers) {
                return;
            }

            expect(IntlResovlers.applyNumberCultureFormatting("1.2", replaceInvariantSymbols)).toBe("1,2");
            expect(IntlResovlers.applyNumberCultureFormatting("-123", replaceInvariantSymbols)).toBe("#123");
            expect(IntlResovlers.applyNumberCultureFormatting("-123.4", replaceInvariantSymbols)).toBe("#123,4");
        });
    });
}
