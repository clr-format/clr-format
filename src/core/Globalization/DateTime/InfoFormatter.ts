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

        /** Gets the result of the [[baseOptions]] field extended with concrete options returned from the [[optionsProvider]] instance. */
        protected resolvedOptions: T;
        protected formatInfo: DateTimeFormatInfo;

        private value: Date;
        private baseOptions: T;
        private optionsProvider: OptionsProvider<T>;
        private optionsProviderConstructor: { new (baseOptions: T): OptionsProvider<T> };
        private specifiersFormatter: CustomFormatter;

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

            this.optionsProviderConstructor = optionsProviderConstructor;
            this.formatInfo = formatInfo;
            this.baseOptions = options || <T> {};
        }

        /**
         * Converts the date to an equivalent string representation using specified format and culture formatting information.
         * @param format A format string containing formatting specifications.
         * @param value The date to format.
         * @returns The formatted date value.
         */
        public format(format: string, value: Date): string {
            try {
                return this.innerFormat(format, value);
            }
            finally {
                this.cleanup();
            }
        }

        /**
         * Applies all resolved format options to the date object.
         * @param value The date to format.
         * @returns A resulting format value with applied format options.
         */
        protected applyOptions(value: Date): string {

            let style = this.optionsProvider.getStyle();
            if (style) {

                if (this.formatters.hasOwnProperty(style)) {
                    return this.formatters[style]();
                }

                throw new Errors.ArgumentError(`Option 'style' with base or resolved value '${style}' is not supported`);
            }
        }

        /** Returns the formatter instance that will be used to replace all custom date and time specifiers. */
        protected getSpecifiersFormatter(): CustomFormatter {
            return new InfoSpecifierFormatter(this.formatInfo);
        }

        private innerFormat(format: string, value: Date): string {

            if (!format) {
                format = Specifiers.StandardSpecifiers.generalDateLongTime;
            }

            this.optionsProvider = new this.optionsProviderConstructor(this.baseOptions);
            this.resolvedOptions = this.optionsProvider.resolveOptions(format, value);

            if (!Utils.isObject(this.resolvedOptions)) {
                throw new Errors.InvalidOperationError(
                    "Invocation of 'optionsProvider' member's method 'resolveOptions' did not initialize instance member 'resolvedOptions' properly");
            }

            this.setValue(value);
            this.specifiersFormatter = this.getSpecifiersFormatter();

            return this.applyOptions(this.value) || this.specifiersFormatter.format(format, this.value);
        }

        private setValue(value: Date): void {

            this.value = value;

            if (this.optionsProvider.useUTC()) {
                this.value = new Date(this.value.getTime() + this.value.getTimezoneOffset() * 60000);
            }
        }

        private cleanup(): void {
            delete this.value;
            delete this.resolvedOptions;
            delete this.optionsProvider;
            delete this.specifiersFormatter;
        }

        /* tslint:disable:member-ordering */

        private formatters: Specifiers.StandardSpecifiersMap<() => string> = {
            shortDate: (): string => this.specifiersFormatter.format("MM/dd/yyyy", this.value),
            longDate: (): string => this.specifiersFormatter.format("dddd, dd MMMM yyyy", this.value),
            fullDateShortTime: (): string => this.formatters.longDate() + " " + this.formatters.shortTime(),
            fullDateLongTime: (): string => this.formatters.longDate() + " " + this.formatters.longTime(),
            generalDateShortTime: (): string => this.formatters.shortDate() + " " + this.formatters.shortTime(),
            generalDateLongTime: (): string => this.formatters.shortDate() + " " + this.formatters.longTime(),
            monthDate: (): string => this.specifiersFormatter.format("MMMM dd", this.value),
            roundTrip: (): string => {
                let result = JSON.stringify(this.value);
                return result.substring(1, result.length - 1);
            },
            rfc1123: (): string => this.value.toUTCString(),
            sortable: (): string => this.specifiersFormatter.format("yyyy-MM-ddTHH':'mm':'ss", this.value),
            shortTime: (): string => this.specifiersFormatter.format("HH:mm", this.value),
            longTime: (): string => this.specifiersFormatter.format("HH:mm:ss", this.value),
            universalSortable: (): string => this.specifiersFormatter.format("yyyy-MM-dd HH':'mm':'ssZ", this.value),
            universalFull: (): string => this.formatters.fullDateLongTime(),
            yearMonth: (): string => this.specifiersFormatter.format("yyyy MMMM", this.value)
        };

        /* tslint:enable:member-ordering */
    }
}
