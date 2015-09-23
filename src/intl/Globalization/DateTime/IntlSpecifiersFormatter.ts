/// <reference path="../../../use-strict" />
/// <reference path="../../API" />

/// <reference path="../../Utils/IntlResolvers" />

namespace Format.Globalization.DateTime {

    /** A [[CustomFormatter]] implementation that replaces [Custom Date and Time Format Specifiers](https://msdn.microsoft.com/library/8kb3ddd4.aspx) with their culture information values. */
    export class IntlSpecifiersFormatter extends InfoSpecifierFormatter {

        private formatProvider: (resolvedOptions: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat;

        /**
         * Creates an instance that uses the resolved options from the specified options provider and applies culture-specific formatting based on the given format info.
         * @param formatInfo An instance that provides culture-specific date and time format information.
         * @param formatProvider A function that returns a localized instance of Intl.DateTimeFormat with the supplied options.
         */
        constructor(formatInfo: DateTimeFormatInfo, formatProvider: (resolvedOptions: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat) {
            super(formatInfo);

            this.formatProvider = formatProvider;
            this.overrideBaseFormatters();
        }

        private overrideBaseFormatters(): void {

            this.formatters.eraPlaceholder = () => resolvers.getEra_(this.value, this.formatProvider);

            let baseMonthFormatter = this.formatters.monthPlaceholder;

            this.formatters.monthPlaceholder = (specifierCount: number) => {
                switch (specifierCount) {
                    case 1: case 2: return baseMonthFormatter(specifierCount);
                    case 3: return resolvers.getShortMonth_(this.value, this.formatProvider);
                    default: return resolvers.getLongMonth_(this.value, this.formatProvider);
                }
            };
        }
    }

    /** @private */
    var resolvers = Utils.IntlResovlers;
}
