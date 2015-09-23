/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/intl/Utils/IntlResolvers" />

namespace Format.Utils {

    describe("IntlResovlers getEra", () => {

        let supportsIntl = typeof Intl !== "undefined" && typeof Intl.DateTimeFormat !== "undefined";

        if (!(Utils.IntlResovlers && IntlResovlers.getEra_ && supportsIntl)) {
            return;
        }

        let getNativeFormatter = (locale: string): (resolvedOptions?: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat =>
            (resolvedOptions?: Intl.DateTimeFormatOptions) => <any> new Intl.DateTimeFormat(locale, resolvedOptions);

        let supportsCultures = supportsIntl && getNativeFormatter("de-DE")().format(<any> new Date(0, 0, 1)) === "1.1.1900";

        it("should return the era string for the current culture", () => {

            var adDate = new Date(), bcDate = new Date();

            bcDate.setFullYear(-bcDate.getFullYear() - 1);

            expect(IntlResovlers.getEra_(adDate, getNativeFormatter("en-US"))).toMatch(/A\.?D\.?/);
            expect(IntlResovlers.getEra_(bcDate, getNativeFormatter("en-US"))).toMatch(/B\.?C.?/);

            if (!supportsCultures) {
                return;
            }

            expect(IntlResovlers.getEra_(adDate, getNativeFormatter("de-DE"))).toBe("n. Chr.");
            expect(IntlResovlers.getEra_(bcDate, getNativeFormatter("de-DE"))).toBe("v. Chr.");

            expect(IntlResovlers.getEra_(adDate, getNativeFormatter("fr-FR"))).toBe("ap. J.-C.");
            expect(IntlResovlers.getEra_(bcDate, getNativeFormatter("fr-FR"))).toBe("av. J.-C.");
        });
    });
}
