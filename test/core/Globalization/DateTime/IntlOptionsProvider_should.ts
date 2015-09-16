/// <reference path="../../../typings/jasmine/jasmine" />

/// <reference path="../../../../src/core/Globalization/DateTime/IntlOptionsProvider" />

namespace Format.Globalization.DateTime {

    describe("IntlOptionsProvider", () => {

        let intlOptions: Intl.DateTimeFormatOptions;
        let intlOptionsProvider: IntlOptionsProvider;
        let intlOptionsProviderAccessor: any;

        let createInstance = (options: Intl.DateTimeFormatOptions) => {
            intlOptions = options;
            intlOptionsProvider = intlOptionsProviderAccessor = new IntlOptionsProvider(options);
        };

        it("constructor should initialize the resolved options' object with a cloned copy", () => {

            createInstance({});

            expect(intlOptionsProviderAccessor.resolvedOptions).toEqual(intlOptions);
            expect(intlOptionsProviderAccessor.resolvedOptions).not.toBe(intlOptions);
        });
    });
}
