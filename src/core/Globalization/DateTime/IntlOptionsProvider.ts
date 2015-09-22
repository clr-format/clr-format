/// <reference path="../../../use-strict" />

/// <reference path="Specifiers/Standard" />

/// <reference path="IntlFormatOptions" />
/// <reference path="OptionsProvider" />

/// <reference path="../../Utils/Clone" />
/// <reference path="../../Utils/Remove" />
/// <reference path="../../Utils/Function" />

/// <reference path="../../Errors/FormatError" />
/// <reference path="../../Errors/ArgumentNullError" />

namespace Format.Globalization.DateTime {
    /**
     * An [[OptionsProvider]] implementation that handles [Standard Date and Time Format Specifiers](https://msdn.microsoft.com/library/az4se3k1.aspx). The type of the returned options object
     * is an extended version of [Intl.DateTimeFormat's options](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat#Parameters) parameter.
     */
    export class IntlOptionsProvider implements OptionsProvider<Intl.DateTimeFormatOptions> {

        private style_: string;
        private options_: Intl.DateTimeFormatOptions;

        /**
         * Creates an instance with base formatting options which will be extended and/or overridden by resolved options.
         * @param dateTimeOptions A base options object containing properties defined for the Intl.DateTimeFormat's options parameter.
         */
        constructor(dateTimeOptions: Intl.DateTimeFormatOptions) {

            if (dateTimeOptions == null) {
                throw new Errors.ArgumentNullError("dateTimeOptions");
            }

            this.options_ = Utils.clone(dateTimeOptions);
        }

        /**
         * Returns an object that provides date and time formatting options resolved from standard date and time specifiers.
         * @param format A format string representing a [Standard Date and Time Format Specifiers](https://msdn.microsoft.com/library/az4se3k1.aspx).
         * @param value The date object from which to infer additional options.
         */
        public resolveOptions(format: string, value: Date): Intl.DateTimeFormatOptions {

            if (this.tryInitializeSpecifierOptions_(format)) {
                this.resolvers_[this.style_]();
                this.options_.style = this.style_;
            }

            return Utils.removeUndefined(this.options_);
        }

        /** Returns the formatting style to use. Values should match the property names defined in [[Specifiers.StandardSpecifiersMap]]. */
        public getStyle(): string {
            return this.options_.style;
        }

        /** Returns whether to use UTC time or not. */
        public useUTC(): boolean {
            return this.options_.toUTC;
        }

        private tryInitializeSpecifierOptions_(format: string): boolean {

            if (format.length !== 1) {
                return false;
            }

            let standardSpecifiers = Specifiers.Standard;

            this.style_ = standardSpecifiers[format] || standardSpecifiers[format.toUpperCase()];

            if (!this.style_) {
                throw new Errors.FormatError(`Date and time format specifier '${format}' is invalid`);
            }

            return true;
        }

        /* tslint:disable:member-ordering */

        private resolvers_: Specifiers.StandardSpecifiersMap<() => void> = {

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#ShortDate */
            shortDate: (): void => {
                this.options_.day =
                this.options_.year =
                this.options_.month = numeric;
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#LongDate */
            longDate: (): void => {
                this.resolvers_.shortDate();
                this.resolvers_.monthDate();
                this.options_.weekday = long;
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#FullDateShortTime */
            fullDateShortTime: (): void => {
                this.resolvers_.longDate();
                this.resolvers_.shortTime();
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#FullDateLongTime */
            fullDateLongTime: (): void => {
                this.resolvers_.longDate();
                this.resolvers_.longTime();
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#GeneralDateShortTime */
            generalDateShortTime: (): void => {
                this.resolvers_.shortDate();
                this.resolvers_.shortTime();
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#GeneralDateLongTime */
            generalDateLongTime: (): void => {
                this.resolvers_.shortDate();
                this.resolvers_.longTime();
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#MonthDay */
            monthDate: (): void => {
                this.options_.day = numeric;
                this.options_.month = long;
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#Roundtrip */
            roundTrip: empty,

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#RFC1123 */
            rfc1123: empty,

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#Sortable */
            sortable: empty,

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#ShortTime */
            shortTime: (): void => {
                this.options_.hour =
                this.options_.minute = numeric;
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#LongTime */
            longTime: (): void => {
                this.resolvers_.shortTime();
                this.options_.second = numeric;
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#UniversalSortable */
            universalSortable: (): void => {
                this.options_.toUTC = true;
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#UniversalFull */
            universalFull: (): void => {
                this.resolvers_.fullDateLongTime();
                this.options_.toUTC = true;
            },

            /** See: https://msdn.microsoft.com/library/az4se3k1.aspx#YearMonth */
            yearMonth: (): void => {
                this.options_.year = numeric;
                this.options_.month = long;
            }
        };

        /* tslint:enable:member-ordering */
    }

    /** @private */
    var numeric = "numeric", long = "long", empty = Utils.Function.getEmpty();
}
