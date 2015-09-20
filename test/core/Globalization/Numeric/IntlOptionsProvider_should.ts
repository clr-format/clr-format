/// <reference path="../../../typings/jasmine/jasmine" />

/// <reference path="../../../../src/core/Globalization/Numeric/IntlOptionsProvider" />

namespace Format.Globalization.Numeric {

    describe("IntlOptionsProvider", () => {

        let intlOptions: Intl.NumberFormatOptions;
        let intlOptionsProvider: IntlOptionsProvider;
        let intlOptionsProviderAccessor: any;

        let createInstance = (options: Intl.NumberFormatOptions) => {
            intlOptions = options;
            intlOptionsProvider = intlOptionsProviderAccessor = new IntlOptionsProvider(options);
        };

        let resolveOptions = (formatString: string, options?: Intl.NumberFormatOptions): Intl.NumberFormatOptions => {
            createInstance(options || {});
            return intlOptionsProvider.resolveOptions(formatString, 0);
        };

        it("constructor should initialize the resolved options' object with a cloned copy", () => {

            createInstance({ minimumFractionDigits: 1 });

            expect(intlOptionsProviderAccessor.options).toEqual(intlOptions);
            expect(intlOptionsProviderAccessor.options).not.toBe(intlOptions);
        });

        it("resolveOptions should resolve the format string into accessible options", () => {

            resolveOptions("");
            expect(intlOptionsProvider.getStyle()).toBeUndefined();
            expect(intlOptionsProvider.useGrouping()).toBeFalsy();
            expect(intlOptionsProvider.getMinimumIntegerDigits()).toBeUndefined();
            expect(intlOptionsProvider.getMinimumFractionDigits()).toBeUndefined();
            expect(intlOptionsProvider.getMaximumFractionDigits()).toBeUndefined();
            expect(intlOptionsProvider.getMinimumSignificantDigits()).toBeUndefined();
            expect(intlOptionsProvider.getMaximumSignificantDigits()).toBeUndefined();
            expect(intlOptionsProvider.hasNoLeadingZeroIntegerDigit()).toBeFalsy();
            expect(intlOptionsProvider.isUpperCase()).toBeFalsy();
            expect(intlOptionsProvider.isNegativellySignedExponent()).toBeFalsy();
            expect(intlOptionsProvider.getMinimumExponentDigits()).toBeUndefined();
            expect(intlOptionsProvider.getValueDivisor()).toBeUndefined();
            expect(intlOptionsProvider.getPrefixDecorator()).toBeUndefined();
            expect(intlOptionsProvider.getInternalDecorators()).toBeUndefined();
            expect(intlOptionsProvider.getSuffixDecorator()).toBeUndefined();

            resolveOptions("c");
            expect(intlOptionsProvider.getStyle()).toEqual("currency");

            resolveOptions("0,0.0#");
            expect(intlOptionsProvider.useGrouping()).toBe(true);
            expect(intlOptionsProvider.getMinimumIntegerDigits()).toBe(2);
            expect(intlOptionsProvider.getMinimumFractionDigits()).toBe(1);
            expect(intlOptionsProvider.getMaximumFractionDigits()).toBe(2);

            resolveOptions("X2");
            expect(intlOptionsProvider.getMinimumSignificantDigits()).toBe(2);
            expect(intlOptionsProvider.isUpperCase()).toBe(true);

            resolveOptions("g2");
            expect(intlOptionsProvider.getMaximumSignificantDigits()).toBe(2);
            expect(intlOptionsProvider.isUpperCase()).toBe(false);

            resolveOptions("#.0");
            expect(intlOptionsProvider.hasNoLeadingZeroIntegerDigit()).toBe(true);

            resolveOptions("0e00");
            expect(intlOptionsProvider.isNegativellySignedExponent()).toBe(true);
            expect(intlOptionsProvider.getMinimumExponentDigits()).toBe(2);

            resolveOptions("0 %");
            expect(intlOptionsProvider.getValueDivisor()).toBe(0.01);

            resolveOptions("prefix 0mid0, suffix");
            expect(intlOptionsProvider.getValueDivisor()).toBe(1000);
            expect(intlOptionsProvider.getPrefixDecorator()).toBe("prefix ");
            expect(intlOptionsProvider.getInternalDecorators()).toEqual({ "-2": "mid" });
            expect(intlOptionsProvider.getSuffixDecorator()).toBe(" suffix");
        });
    });
}
