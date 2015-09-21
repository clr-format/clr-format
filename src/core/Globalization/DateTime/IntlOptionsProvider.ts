/// <reference path="../../../use-strict" />

/// <reference path="Specifiers/Standard" />

/// <reference path="IntlFormatOptions" />
/// <reference path="OptionsProvider" />

/// <reference path="../../Utils/Clone" />
/// <reference path="../../Utils/Remove" />
/// <reference path="../../Utils/Function" />

/// <reference path="../../Errors/FormatError" />

namespace Format.Globalization.DateTime {
    /**
     * An [[OptionsProvider]] implementation that handles [Standard Date and Time Format Specifiers](https://msdn.microsoft.com/library/az4se3k1.aspx). The type of the returned options object
     * is an extended version of [Intl.DateTimeFormat's options](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat#Parameters) parameter.
     */
    export class IntlOptionsProvider implements OptionsProvider<Intl.DateTimeFormatOptions> {

        private options: Intl.DateTimeFormatOptions;

        private style: string;

        /**
         * Creates an instance with base formatting options which will be extended and/or overridden by resolved options.
         * @param dateTimeOptions A base options object containing properties defined for the Intl.DateTimeFormat's options parameter.
         */
        constructor(dateTimeOptions: Intl.DateTimeFormatOptions) {
            this.options = Utils.clone(dateTimeOptions);
        }

        /**
         * Returns an object that provides date and time formatting options resolved from standard date and time specifiers.
         * @param format A format string representing a [Standard Date and Time Format Specifiers](https://msdn.microsoft.com/library/az4se3k1.aspx).
         * @param value The date object from which to infer additional options.
         */
        public resolveOptions(format: string, value: Date): Intl.DateTimeFormatOptions {

            if (this.tryInitializeSpecifierOptions(format)) {
                this.resolvers[this.style]();
                this.options.style = this.style;
            }

            return Utils.removeUndefined(this.options);
        }

        /** Returns the formatting style to use. Values should match the property names defined in [[Specifiers.StandardSpecifiersMap]]. */
        public getStyle(): string {
            return this.options.style;
        }

        /** Returns whether to use UTC time or not. */
        public useUTC(): boolean {
            return this.options.toUTC;
        }

        private tryInitializeSpecifierOptions(format: string): boolean {

            if (format.length !== 1) {
                return false;
            }

            let specifiers = Specifiers.StandardSpecifiers;
            this.style = specifiers[format] || specifiers[format.toUpperCase()];

            if (!this.style) {
                throw new Errors.FormatError(`Date and time format specifier '${format}' is invalid`);
            }

            return true;
        }

        /* tslint:disable:member-ordering */

        private resolvers: Specifiers.StandardSpecifiersMap<() => void> = {

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#ShortDate */
            shortDate: (): void => {
                this.options.day =
                this.options.year =
                this.options.month = numeric;
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#LongDate */
            longDate: (): void => {
                this.resolvers.shortDate();
                this.resolvers.monthDate();
                this.options.weekday = long;
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#FullDateShortTime */
            fullDateShortTime: (): void => {
                this.resolvers.longDate();
                this.resolvers.shortTime();
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#FullDateLongTime */
            fullDateLongTime: (): void => {
                this.resolvers.longDate();
                this.resolvers.longTime();
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#GeneralDateShortTime */
            generalDateShortTime: (): void => {
                this.resolvers.shortDate();
                this.resolvers.shortTime();
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#GeneralDateLongTime */
            generalDateLongTime: (): void => {
                this.resolvers.shortDate();
                this.resolvers.longTime();
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#MonthDay */
            monthDate: (): void => {
                this.options.day = numeric;
                this.options.month = long;
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#Roundtrip */
            roundTrip: Utils.Function.getEmpty(),

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#RFC1123 */
            rfc1123: Utils.Function.getEmpty(),

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#Sortable */
            sortable: Utils.Function.getEmpty(),

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#ShortTime */
            shortTime: (): void => {
                this.options.hour =
                this.options.minute = numeric;
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#LongTime */
            longTime: (): void => {
                this.resolvers.shortTime();
                this.options.second = numeric;
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#UniversalSortable */
            universalSortable: (): void => {
                this.options.toUTC = true;
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#UniversalFull */
            universalFull: (): void => {
                this.resolvers.fullDateLongTime();
                this.options.toUTC = true;
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#YearMonth */
            yearMonth: (): void => {
                this.options.year = numeric;
                this.options.month = long;
            }
        };

        /* tslint:enable:member-ordering */
    }

    /** @private */
    var numeric = "numeric", long = "long";
}
