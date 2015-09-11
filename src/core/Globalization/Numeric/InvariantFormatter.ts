/// <reference path="../../../use-strict" />

/// <reference path="Specifiers/Standard" />

/// <reference path="OptionsProvider" />
/// <reference path="DecorationFormatter" />
/// <reference path="ExponentialFormatter" />

/// <reference path="../CustomFormatter" />
/// <reference path="../NumberFormatInfo" />

/// <reference path="../../Utils/Numeric" />

/// <reference path="../../Errors/ArgumentError" />
/// <reference path="../../Errors/NotImplementedError" />
/// <reference path="../../Errors/InvalidOperationError" />

namespace Format.Globalization.Numeric {
    /**
     * Invariant formatter implementation that applies invariant culture format to a numeric value.
     * @param T The type of the options container.
     */
    export class InvariantFormatter<T> implements CustomFormatter {

        /** Gets the result of the [[baseOptions]] field extended with concrete options returned from the [[optionsProvider]] instance. */
        protected resolvedOptions: T;
        protected decorationFormatter: DecorationFormatter<T>;

        private value: number;
        private baseOptions: T;
        private optionsProvider: OptionsProvider<T>;
        private optionsProviderConstructor: { new (baseOptions: T): OptionsProvider<T> };

        /**
         * Creates an instance with base formatting options and initializes an options provider that resolves concrete format options.
         * @param optionsProviderConstructor A numeric options provider constructor which will be used to resolve options.
         * @param options A base options object that can be overridden by resolved options.
         */
        constructor(optionsProviderConstructor: { new (baseOptions: T): OptionsProvider<T> }, options?: T) {
            this.optionsProviderConstructor = optionsProviderConstructor;
            this.baseOptions = options || <T> {};
        }

        /**
         * Converts the number to an equivalent string representation using specified format and invariant culture formatting information.
         * @param format A format string containing formatting specifications.
         * @param value The number to format.
         */
        public format(format: string, value: number): string {
            try {
                return this.innerFormat(format, value);
            }
            finally {
                this.cleanup();
            }
        }

        /**
         * Applies all resolved format options to the number.
         * @param value The number to format.
         * @returns A resulting format value with applied format options.
         */
        protected applyOptions(value: number): string {

            let style = this.optionsProvider.getStyle();
            if (style) {

                if (this.formatters.hasOwnProperty(style)) {
                    return this.formatters[style]();
                }

                throw new Errors.ArgumentError(`Option 'style' with base or resolved value '${style}' is not supported`);
            }

            let result = Utils.Numeric.toFixedMinMax(
                this.value,
                this.optionsProvider.getMinimumFractionDigits(),
                this.optionsProvider.getMaximumFractionDigits());

            result = this.decorationFormatter.applyIntegerPadding(this.value, result, this.optionsProvider.getMinimumIntegerDigits());

            return this.decorationFormatter.applyGrouping(result);
        }

        /**
         * Returns the format info instance to use for culture-specific formatting.
         *
         * Must be overridden by subclasses that are not culture invariant.
         */
        protected getFormatInfo(): NumberFormatInfo {
            return NumberFormatInfo.InvariantInfo;
        }

        private innerFormat(format: string, value: number): string {

            this.optionsProvider = new this.optionsProviderConstructor(this.baseOptions);
            this.resolvedOptions = this.optionsProvider.resolveOptions(format, value);

            if (!Utils.isObject(this.resolvedOptions)) {
                throw new Errors.InvalidOperationError(
                    "Invocation of 'optionsProvider' member's method 'resolveOptions' did not initialize instance member 'resolvedOptions' properly");
            }

            this.setValue(value);
            this.decorationFormatter = new DecorationFormatter(this.optionsProvider, this.getFormatInfo());

            return this.decorationFormatter.applyOptions(this.value, this.applyOptions(this.value));
        }

        private setValue(value: number): void {

            this.value = value;

            let valueDivisor = this.optionsProvider.getValueDivisor();
            if (valueDivisor) {
                this.value /= valueDivisor;
            }
        }

        private cleanup(): void {
            delete this.value;
            delete this.resolvedOptions;
            delete this.optionsProvider;
            delete this.decorationFormatter;
        }

        private applyDecimalFormat(): string {

            let formatInfo = this.getFormatInfo();

            let minimumFractionDigits = this.optionsProvider.getMinimumFractionDigits();
            if (minimumFractionDigits === undefined) {
                minimumFractionDigits = formatInfo.NumberDecimalDigits;
            }

            let maximumFractionDigits = this.optionsProvider.getMaximumFractionDigits();
            if (maximumFractionDigits === undefined) {
                maximumFractionDigits = formatInfo.NumberDecimalDigits;
            }

            return this.decorationFormatter.applyGrouping(Utils.Numeric.toFixedMinMax(this.value, minimumFractionDigits, maximumFractionDigits));
        }

        /* tslint:disable:member-ordering */

        private formatters: Specifiers.StandardSpecifiersMap<() => string> = {

            /** The currency format is not supported by this culture invariant instance. */
            currency: (): string => {
                throw new Errors.NotImplementedError("currency");
            },

            /** The decimal format converts a number to a string of decimal digits (0-9), prefixed by a minus sign if the number is negative. */
            decimal: (): string => {

                let minimumIntegerDigits = this.optionsProvider.getMinimumSignificantDigits();
                if (minimumIntegerDigits === undefined) {
                    minimumIntegerDigits = this.optionsProvider.getMinimumIntegerDigits();
                }

                return this.decorationFormatter.applyIntegerPadding(this.value, this.value.toFixed(0), minimumIntegerDigits);
            },

            /** The exponential format converts a number to a string of the form "-d.ddd…E+ddd" or "-d.ddd…e+ddd". */
            exponential: (): string => {

                let exponentialFormatter = new ExponentialFormatter(this.optionsProvider),
                    result = exponentialFormatter.applyOptions(this.value);

                return this.decorationFormatter.applyUppercase(result);
            },

            /** The fixed-point format converts a number to a string of the form "-ddd.ddd…" where each "d" indicates a digit (0-9). */
            fixedPoint: (): string => {
                return this.applyDecimalFormat();
            },

            /**
             * The general format converts a number to the most compact of either fixed-point or scientific notation, depending on the type of the number and whether a precision specifier
             * is present. Fixed-point notation is used if the exponent that would result from expressing the number in scientific notation is greater than -5 and less than the precision specifier;
             * otherwise, scientific notation is used.
             */
            general: (): string => {

                let maximumSignificantDigits = this.optionsProvider.getMaximumSignificantDigits(),
                    exponentialFormatter = new ExponentialFormatter(this.optionsProvider),
                    result: string;

                if (Math.abs(this.value) < 0.0001) {
                    result = exponentialFormatter.applyOptions(this.value);
                }
                else {
                    result = Utils.Numeric.toPrecisionMinMax(this.value, undefined, maximumSignificantDigits);
                    result = exponentialFormatter.applyExponentPadding(result);
                }

                return this.decorationFormatter.applyUppercase(result);
            },

            /**
             * The numeric format converts a number to a string of the form "-d,ddd,ddd.ddd…", where "-" indicates a negative number symbol if required,
             * "d" indicates a digit (0-9), "," indicates a group separator, and "." indicates a decimal point symbol.
             */
            number: (): string => {
                return this.applyDecimalFormat();
            },

            /** The percent format multiplies a number by 100 and converts it to a string that represents a percentage. */
            percent: (): string => {
                this.value *= 100;
                return this.formatters.number() + " %";
            },

            /** The round-trip format is used to ensure that a numeric value that is converted to a string will be parsed back into the same numeric value. */
            roundTrip: (): string => {
                return JSON.stringify(this.value);
            },

            /** The hexadecimal format converts a number to a string of hexadecimal digits. */
            hex: (): string => {

                let minimumHexDigits = this.optionsProvider.getMinimumSignificantDigits();
                if (minimumHexDigits === undefined) {
                    minimumHexDigits = this.optionsProvider.getMinimumIntegerDigits();
                }

                let result = this.decorationFormatter.applyIntegerPadding(this.value, this.value.toString(16), minimumHexDigits);

                return this.decorationFormatter.applyUppercase(result);
            }
        };

        /* tslint:enable:member-ordering */
    }
}
