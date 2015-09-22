/// <reference path="../../../use-strict" />

/// <reference path="OptionsProvider" />
/// <reference path="InfoSpecifierFormatter" />

/// <reference path="../CustomFormatter" />

/// <reference path="../../Errors/ArgumentError" />
/// <reference path="../../Errors/ArgumentNullError" />
/// <reference path="../../Errors/InvalidOperationError" />

namespace Format.Globalization.DateTime {
    /**
     * Base formatter implementation that applies raw culture information formatting to a date and time value.
     * @param T The type of the options container.
     */
    export class InfoFormatter<T> implements CustomFormatter {

        protected resolvedOptions: T;
        protected formatInfo: DateTimeFormatInfo;

        private value_: Date;
        private baseOptions_: T;
        private specifiersFormatter_: CustomFormatter;
        private optionsProvider_: OptionsProvider<T>;
        private optionsProviderConstructor_: { new (baseOptions: T): OptionsProvider<T> };

        /**
         * Creates an instance with base formatting options and initializes an options provider that resolves concrete format options.
         * @param optionsProviderConstructor A date and time options provider constructor which will be used to resolve options.
         * @param formatInfo An instance that can provide custom date and time format information.
         * @param options A base options object that can be overridden by resolved options.
         */
        constructor(optionsProviderConstructor: { new (baseOptions: T): OptionsProvider<T> }, formatInfo: DateTimeFormatInfo, options?: T) {

            if (typeof optionsProviderConstructor !== "function") {
                throw new TypeError("Cannot create an instance without a concrete options provider's constructor");
            }

            if (formatInfo == null) {
                throw new Errors.ArgumentNullError("formatInfo");
            }

            this.optionsProviderConstructor_ = optionsProviderConstructor;
            this.formatInfo = formatInfo;
            this.baseOptions_ = options || <T> {};
        }

        /**
         * Converts the date to an equivalent string representation using specified format and culture formatting information.
         * @param format A format string containing formatting specifications.
         * @param value The date to format.
         * @returns The formatted date value.
         */
        public format(format: string, value: Date): string {
            try {
                return this.innerFormat_(format, value);
            }
            finally {
                this.cleanup_();
            }
        }

        /**
         * Applies all resolved format options to the date object.
         * @param value The date to format.
         * @returns A resulting format value with applied format options.
         */
        protected applyOptions(value: Date): string {

            let style = this.optionsProvider_.getStyle();
            if (style) {

                if (this.formatters_.hasOwnProperty(style)) {
                    return this.formatters_[style]();
                }

                throw new Errors.ArgumentError(`Option 'style' with base or resolved value '${style}' is not supported`);
            }
        }

        /** Returns the formatter instance that will be used to replace all custom date and time specifiers. */
        protected getSpecifiersFormatter(): CustomFormatter {
            return new InfoSpecifierFormatter(this.formatInfo);
        }

        private innerFormat_(format: string, value: Date): string {

            if (!format) {
                format = Specifiers.Standard.generalDateLongTime;
            }

            this.optionsProvider_ = new this.optionsProviderConstructor_(this.baseOptions_);
            this.resolvedOptions = this.optionsProvider_.resolveOptions(format, value);

            if (!Utils.isObject(this.resolvedOptions)) {
                throw new Errors.InvalidOperationError(
                    "Invocation of 'optionsProvider' member's method 'resolveOptions' did not initialize instance member 'resolvedOptions' properly");
            }

            this.setValue_(value);
            this.specifiersFormatter_ = this.getSpecifiersFormatter();

            return this.applyOptions(this.value_) || this.specifiersFormatter_.format(format, this.value_);
        }

        private setValue_(value: Date): void {

            this.value_ = value;

            if (this.optionsProvider_.useUTC()) {
                this.value_ = new Date(this.value_.getTime() + this.value_.getTimezoneOffset() * 60000);
            }
        }

        private cleanup_(): void {
            delete this.resolvedOptions;
            delete this.value_;
            delete this.optionsProvider_;
            delete this.specifiersFormatter_;
        }

        /* tslint:disable:member-ordering */

        private formatters_: Specifiers.StandardSpecifiersMap<() => string> = {
            shortDate: (): string => this.specifiersFormatter_.format("MM/dd/yyyy", this.value_),
            longDate: (): string => this.specifiersFormatter_.format("dddd, dd MMMM yyyy", this.value_),
            fullDateShortTime: (): string => this.formatters_.longDate() + " " + this.formatters_.shortTime(),
            fullDateLongTime: (): string => this.formatters_.longDate() + " " + this.formatters_.longTime(),
            generalDateShortTime: (): string => this.formatters_.shortDate() + " " + this.formatters_.shortTime(),
            generalDateLongTime: (): string => this.formatters_.shortDate() + " " + this.formatters_.longTime(),
            monthDate: (): string => this.specifiersFormatter_.format("MMMM dd", this.value_),
            roundTrip: (): string => {
                let result = JSON.stringify(this.value_);
                return result.substring(1, result.length - 1);
            },
            rfc1123: (): string => this.value_.toUTCString(),
            sortable: (): string => this.specifiersFormatter_.format("yyyy-MM-ddTHH':'mm':'ss", this.value_),
            shortTime: (): string => this.specifiersFormatter_.format("HH:mm", this.value_),
            longTime: (): string => this.specifiersFormatter_.format("HH:mm:ss", this.value_),
            universalSortable: (): string => this.specifiersFormatter_.format("yyyy-MM-dd HH':'mm':'ssZ", this.value_),
            universalFull: (): string => this.formatters_.fullDateLongTime(),
            yearMonth: (): string => this.specifiersFormatter_.format("yyyy MMMM", this.value_)
        };

        /* tslint:enable:member-ordering */
    }
}
