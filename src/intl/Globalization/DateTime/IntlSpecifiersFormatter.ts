/// <reference path="../../../use-strict" />

/// <reference path="../../API" />

namespace Format.Globalization.DateTime {

    /** A [[CustomFormatter]] implementation that replaces [Custom Date and Time Format Specifiers](https://msdn.microsoft.com/library/8kb3ddd4.aspx) with their culture information values. */
    export class IntlSpecifiersFormatter extends InfoSpecifierFormatter {

        private formatProvider: (resolvedOptions: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat;

        /**
         * Creates an instance that uses the resolved options from the specified options provider and applies culture-specific formatting based on the given format info.
         * @param formatInfo An instance that provides culture-specific date and time format information.
         */
        constructor(formatInfo: DateTimeFormatInfo, formatProvider: (resolvedOptions: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat) {
            super(formatInfo);

            this.formatProvider = formatProvider;
            this.overrideBaseFormatters();
        }

        private overrideBaseFormatters(): void {

            let baseFormatters = Utils.clone(this.formatters);

            this.formatters.dayPlaceholder = (specifierCount: number): Object => {
                switch (specifierCount) {
                    case 1: case 2: return baseFormatters.dayPlaceholder(specifierCount);
                    case 3: return this.applyOptions({ weekday: "short" });
                    default: return this.applyOptions({ weekday: "long" });
                }
            };

            this.formatters.eraPlaceholder = () =>
                this.applyOptions({ year: "numeric", era: "narrow" }).replace(/ *\d+ */, "");

            this.formatters.monthPlaceholder = (specifierCount: number) => {
                switch (specifierCount) {
                    case 1: case 2: return baseFormatters.monthPlaceholder(specifierCount);
                    case 3: return this.applyOptions({ month: "short" });
                    default: return this.applyOptions({ month: "long" });
                }
            };

            this.formatters.amPmPlaceholder = (specifierCount: number) =>
                this.applyOptions({ hour: "numeric", hour12: true }).replace(/ *\d+ */, "").substring(0, specifierCount === 1 ? 1 : undefined);

            this.formatters.timeSeparator = () =>
                this.applyOptions({ hour: "2-digit", minute: "2-digit", hour12: false })[2];

            this.formatters.dateSeparator = () =>
                this.applyOptions({ month: "2-digit", day: "2-digit" })[2];
        }

        private applyOptions(options: Intl.DateTimeFormatOptions): string {
            return this.formatProvider(options).format(<any> this.value);
        }
    }
}
