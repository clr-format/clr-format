/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/intl/Utils/IntlResolvers" />

namespace Format.Utils {

    describe("IntlResovlers getShortMonth", () => {

        let supportsIntl = typeof Intl !== "undefined" && typeof Intl.DateTimeFormat !== "undefined";

        if (!(Utils.IntlResovlers && IntlResovlers.getShortMonth_ && supportsIntl)) {
            return;
        }

        let getNativeFormatter = (locale: string): (resolvedOptions?: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat =>
            (resolvedOptions?: Intl.DateTimeFormatOptions) => <any> new Intl.DateTimeFormat(locale, resolvedOptions);

        let supportsCultures = supportsIntl && getNativeFormatter("de-DE")().format(<any> new Date(0, 0, 1)) === "1.1.1900";

        it("should return the short month string for the current culture", () => {

            var januaryDate = new Date(0, 0, 1);

            expect(IntlResovlers.getShortMonth_(januaryDate, getNativeFormatter("en-US"))).toBe("Jan");

            if (!supportsCultures) {
                return;
            }

            expect(IntlResovlers.getShortMonth_(januaryDate, getNativeFormatter("de-DE"))).toBe("Jan");
            expect(IntlResovlers.getShortMonth_(januaryDate, getNativeFormatter("fr-FR"))).toBe("janv.");
        });
    });
}
