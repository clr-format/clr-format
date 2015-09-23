/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/intl/Utils/IntlResolvers" />

namespace Format.Utils {

    describe("IntlResovlers getLongMonth", () => {

        let supportsIntl = typeof Intl !== "undefined" && typeof Intl.DateTimeFormat !== "undefined";

        if (!(Utils.IntlResovlers && IntlResovlers.getLongMonth_ && supportsIntl)) {
            return;
        }

        let getNativeFormatter = (locale: string): (resolvedOptions?: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat =>
            (resolvedOptions?: Intl.DateTimeFormatOptions) => <any> new Intl.DateTimeFormat(locale, resolvedOptions);

        let supportsCultures = supportsIntl && getNativeFormatter("de-DE")().format(<any> new Date(0, 0, 1)) === "1.1.1900";

        it("should return the short month string for the current culture", () => {

            var januaryDate = new Date(0, 0, 1);

            expect(IntlResovlers.getLongMonth_(januaryDate, getNativeFormatter("en-US"))).toBe("January");

            if (!supportsCultures) {
                return;
            }

            expect(IntlResovlers.getLongMonth_(januaryDate, getNativeFormatter("de-DE"))).toBe("Januar");
            expect(IntlResovlers.getLongMonth_(januaryDate, getNativeFormatter("fr-FR"))).toBe("janvier");
        });
    });
}
