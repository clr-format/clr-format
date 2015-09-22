/// <reference path="../../../use-strict" />

/// <reference path="Specifiers/Standard" />

/// <reference path="OptionsProvider" />
/// <reference path="DecorationFormatter" />
/// <reference path="ExponentialFormatter" />

/// <reference path="../CustomFormatter" />
/// <reference path="../NumberFormatInfo" />

/// <reference path="../../Utils/Object" />
/// <reference path="../../Utils/Numeric" />

/// <reference path="../../Errors/ArgumentError" />
/// <reference path="../../Errors/ArgumentNullError" />
/// <reference path="../../Errors/NotImplementedError" />
/// <reference path="../../Errors/InvalidOperationError" />

namespace Format.Globalization.Numeric {
    /**
     * Base formatter implementation that applies raw culture information formatting to a numeric value.
     * @param T The type of the options container.
     */
    export class InfoFormatter<T> implements CustomFormatter {

        protected resolvedOptions: T;
        protected formatInfo: NumberFormatInfo;
        protected decorationFormatter: DecorationFormatter<T>;

        private value_: number;
        private baseOptions_: T;
        private optionsProvider_: OptionsProvider<T>;
        private optionsProviderConstructor_: { new (baseOptions: T): OptionsProvider<T> };

        /**
         * Creates an instance with base formatting options and initializes an options provider that resolves concrete format options.
         * @param optionsProviderConstructor A numeric options provider constructor which will be used to resolve options.
         * @param formatInfo An instance that can provide custom numeric format information.
         * @param options A base options object that can be overridden by resolved options.
         */
        constructor(optionsProviderConstructor: { new (baseOptions: T): OptionsProvider<T> }, formatInfo: NumberFormatInfo, options?: T) {

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
         * Converts the number to an equivalent string representation using specified format and culture formatting information.
         * @param format A format string containing formatting specifications.
         * @param value The number to format.
         * @returns The formatted numeric value.
         */
        public format(format: string, value: number): string {
            try {
                return this.innerFormat_(format, value);
            }
            finally {
                this.cleanup_();
            }
        }

        /**
         * Applies all resolved format options to the number.
         * @param value The number to format.
         * @returns A resulting format value with applied format options.
         */
        protected applyOptions(value: number): string {

            let style = this.optionsProvider_.getStyle();
            if (style) {

                if (this.formatters_.hasOwnProperty(style)) {
                    return this.formatters_[style]();
                }

                throw new Errors.ArgumentError(`Option 'style' with base or resolved value '${style}' is not supported`);
            }

            let decorationFormatter = this.decorationFormatter,
                result = Utils.Numeric.toFixedMinMax(
                    this.value_,
                    this.optionsProvider_.getMinimumFractionDigits(),
                    this.optionsProvider_.getMaximumFractionDigits());

            result = decorationFormatter.applyIntegerPadding(this.value_, result, this.optionsProvider_.getMinimumIntegerDigits());

            return decorationFormatter.applyGrouping(result);
        }

        private innerFormat_(format: string, value: number): string {

            this.optionsProvider_ = new this.optionsProviderConstructor_(this.baseOptions_);
            this.resolvedOptions = this.optionsProvider_.resolveOptions(format, value);

            if (!Utils.isObject(this.resolvedOptions)) {
                throw new Errors.InvalidOperationError(
                    "Invocation of 'optionsProvider' member's method 'resolveOptions' did not initialize instance member 'resolvedOptions' properly");
            }

            this.setValue_(value);
            this.decorationFormatter = new DecorationFormatter(this.optionsProvider_, this.formatInfo);

            return this.decorationFormatter.applyOptions(this.value_, this.applyOptions(this.value_));
        }

        private setValue_(value: number): void {

            this.value_ = value;

            let valueDivisor = this.optionsProvider_.getValueDivisor();
            if (valueDivisor) {
                this.value_ /= valueDivisor;
            }
        }

        private cleanup_(): void {
            delete this.resolvedOptions;
            delete this.decorationFormatter;
            delete this.value_;
            delete this.optionsProvider_;
        }

        private applyDecimalFormat_(): string {

            let formatInfo = this.formatInfo;

            let minimumFractionDigits = this.optionsProvider_.getMinimumFractionDigits();
            if (minimumFractionDigits === undefined) {
                minimumFractionDigits = formatInfo.NumberDecimalDigits;
            }

            let maximumFractionDigits = this.optionsProvider_.getMaximumFractionDigits();
            if (maximumFractionDigits === undefined) {
                maximumFractionDigits = formatInfo.NumberDecimalDigits;
            }

            return this.decorationFormatter.applyGrouping(Utils.Numeric.toFixedMinMax(this.value_, minimumFractionDigits, maximumFractionDigits));
        }

        /* tslint:disable:member-ordering */

        private formatters_: Specifiers.StandardSpecifiersMap<() => string> = {

            /** The currency format is not supported by this basic instance. */
            currency: (): string => {
                throw new Errors.NotImplementedError("currency");
            },

            /** The decimal format converts a number to a string of decimal digits (0-9), prefixed by a minus sign if the number is negative. */
            decimal: (): string => {

                let minimumIntegerDigits = this.optionsProvider_.getMinimumSignificantDigits();
                if (minimumIntegerDigits === undefined) {
                    minimumIntegerDigits = this.optionsProvider_.getMinimumIntegerDigits();
                }

                return this.decorationFormatter.applyIntegerPadding(this.value_, this.value_.toFixed(0), minimumIntegerDigits);
            },

            /** The exponential format converts a number to a string of the form "-d.ddd…E+ddd" or "-d.ddd…e+ddd". */
            exponential: (): string => {

                let exponentialFormatter = new ExponentialFormatter(this.optionsProvider_),
                    result = exponentialFormatter.applyOptions(this.value_);

                return this.decorationFormatter.applyUppercase(result);
            },

            /** The fixed-point format converts a number to a string of the form "-ddd.ddd…" where each "d" indicates a digit (0-9). */
            fixedPoint: (): string => {
                return this.applyDecimalFormat_();
            },

            /**
             * The general format converts a number to the most compact of either fixed-point or scientific notation, depending on the type of the number and whether a precision specifier
             * is present. Fixed-point notation is used if the exponent that would result from expressing the number in scientific notation is greater than -5 and less than the precision specifier;
             * otherwise, scientific notation is used.
             */
            general: (): string => {

                let maximumSignificantDigits = this.optionsProvider_.getMaximumSignificantDigits(),
                    exponentialFormatter = new ExponentialFormatter(this.optionsProvider_),
                    result: string;

                if (Math.abs(this.value_) < 0.0001) {
                    result = exponentialFormatter.applyOptions(this.value_);
                }
                else {
                    result = Utils.Numeric.toPrecisionMinMax(this.value_, undefined, maximumSignificantDigits);
                    result = exponentialFormatter.applyExponentPadding(result);
                }

                return this.decorationFormatter.applyUppercase(result);
            },

            /**
             * The numeric format converts a number to a string of the form "-d,ddd,ddd.ddd…", where "-" indicates a negative number symbol if required,
             * "d" indicates a digit (0-9), "," indicates a group separator, and "." indicates a decimal point symbol.
             */
            number: (): string => {
                return this.applyDecimalFormat_();
            },

            /** The percent format multiplies a number by 100 and converts it to a string that represents a percentage. */
            percent: (): string => {
                this.value_ *= 100;
                return this.formatters_.number() + " %";
            },

            /** The round-trip format is used to ensure that a numeric value that is converted to a string will be parsed back into the same numeric value. */
            roundTrip: (): string => {
                return JSON.stringify(this.value_);
            },

            /** The hexadecimal format converts a number to a string of hexadecimal digits. */
            hex: (): string => {

                let minimumHexDigits = this.optionsProvider_.getMinimumSignificantDigits();
                if (minimumHexDigits === undefined) {
                    minimumHexDigits = this.optionsProvider_.getMinimumIntegerDigits();
                }

                let decorationFormatter = this.decorationFormatter,
                    result = decorationFormatter.applyIntegerPadding(this.value_, this.value_.toString(16), minimumHexDigits);

                return decorationFormatter.applyUppercase(result);
            }
        };

        /* tslint:enable:member-ordering */
    }
}
