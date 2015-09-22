/// <reference path="../../../use-strict" />

/// <reference path="OptionsProvider" />

/// <reference path="../../Utils/Numeric" />
/// <reference path="../../Utils/Padding" />
/// <reference path="../../Utils/Function" />
/// <reference path="../../Utils/Indexable" />

/// <reference path="../../Errors/ArgumentError" />
/// <reference path="../../Errors/ArgumentNullError" />

namespace Format.Globalization.Numeric {
    /**
     * Partial formatter implementation that applies exponential notation options to the resulting value.
     * @param T The type of the options container.
     */
    export class ExponentialFormatter<T> {

        private minimumIntegerDigits_: number;
        private minimumFractionDigits_: number;
        private maximumFractionDigits_: number;
        private minimumExponentDigits_: number;
        private negativellySignedExponent_: boolean;

        /**
         * Creates an instance that uses the resolved options from the specified options provider.
         * @param optionsProvider A numeric options provider whose resolved options will be used.
         */
        constructor(optionsProvider: OptionsProvider<T>) {

            if (optionsProvider == null) {
                throw new Errors.ArgumentNullError("optionsProvider");
            }

            this.minimumIntegerDigits_ = this.floorOption_(optionsProvider.getMinimumIntegerDigits());
            this.minimumFractionDigits_ = this.floorOption_(optionsProvider.getMinimumFractionDigits());
            this.maximumFractionDigits_ = this.floorOption_(optionsProvider.getMaximumFractionDigits());
            this.minimumExponentDigits_ = this.floorOption_(optionsProvider.getMinimumExponentDigits());
            this.negativellySignedExponent_ = optionsProvider.isNegativellySignedExponent();
        }

        /**
         * Applies exponent precision, padding and signing options to the number.
         * @param value The number which is currently being formatted.
         * @returns A formatted exponential notation string.
         */
        public applyOptions(value: number): string {

            this.validateOption_(() => this.minimumIntegerDigits_, 1);

            if (this.minimumIntegerDigits_ > 1) {
                this.validateCustomOptions_();

                return this.toCustomExponential_(value);
            }

            return this.toExponential_(value);
        }

        /**
         * Applies exponent padding options for some standard specifiers that require it.
         * @param formattedExponentialValue The partial formatted exponential notation string.
         */
        public applyExponentPadding(formattedExponentialValue: string): string {

            this.validateOption_(() => this.minimumExponentDigits_, 1);

            if (this.minimumExponentDigits_ > 1) {

                let exponentIndex = formattedExponentialValue.lastIndexOf("e") + 2,
                    paddedExponent = this.getPaddedExponent_(formattedExponentialValue.substring(exponentIndex));

                formattedExponentialValue = formattedExponentialValue.substring(0, exponentIndex) + paddedExponent;
            }

            return formattedExponentialValue;
        }

        private floorOption_(optionValue: number): number {
            return optionValue != null ?
                Math.floor(optionValue) :
                undefined;
        }

        private validateOption_(optionSelector: () => number, minValue: number): void {
            let optionValue = optionSelector();
            if (optionValue !== undefined &&
                (!isFinite(optionValue) || optionValue < minValue)) {
                throw new Errors.ArgumentError(
                    `Option '${ Utils.Function.getReturnName(optionSelector) }' with value '${optionValue}' must be finite and greater than or equal to ${minValue}`);
            }
        }

        private validateCustomOptions_(): void {

            this.validateOption_(() => this.minimumFractionDigits_, 0);
            this.validateOption_(() => this.maximumFractionDigits_, 0);
            this.validateOption_(() => this.minimumExponentDigits_, 1);

            if (this.minimumFractionDigits_ > this.maximumFractionDigits_) {
                throw new RangeError(
                    `Argument 'minimumFractionDigits=${this.minimumFractionDigits_}' cannot be greater than argument 'maximumFractionDigits=${this.maximumFractionDigits_}'`);
            }
        }

        private toExponential_(value: number): string {

            let exponentialValue = Utils.Numeric.toExponentialMinMax(value, this.minimumFractionDigits_, this.maximumFractionDigits_);

            exponentialValue = this.applyExponentPadding(exponentialValue);
            exponentialValue = this.applyExponentSigning_(exponentialValue);

            return exponentialValue;
        }

        private getPaddedExponent_(exponent: string): string {

            let padding = Utils.Padding;

            return padding.pad(exponent, {
                totalWidth: this.minimumExponentDigits_,
                direction: padding.Direction.Left,
                paddingChar: "0"
            });
        }

        private applyExponentSigning_(exponentialValue: string): string {

            if (this.negativellySignedExponent_) {

                let positiveExponentSignIndex = exponentialValue.lastIndexOf("+");
                if (positiveExponentSignIndex > 0) {
                    exponentialValue = exponentialValue.substring(0, positiveExponentSignIndex) + exponentialValue.substring(positiveExponentSignIndex + 1);
                }
            }

            return exponentialValue;
        }

        private toCustomExponential_(value: number): string {
            return this.resolveFromState_({
                index_: 0,
                digits_: value.toString(),
                power_: -this.minimumIntegerDigits_,
                offset_: this.minimumIntegerDigits_,
                nonZeroEncountered_: false,
                afterDecimal_: false
            });
        }

        private resolveFromState_(customState: CustomExponentialState): string {

            let exponentialValue = "";

            for (let len = customState.digits_.length; customState.index_ < len; customState.index_ += 1) {
                exponentialValue += this.resolveFromDigit_(customState);
            }

            return this.resolveOffset_(exponentialValue, customState) + this.resolveExponent_(customState);
        }

        private resolveFromDigit_(customState: CustomExponentialState): string {

            let digit = customState.digits_[customState.index_],
                resolver = this.resolvers_[digit];

            digit = resolver ? resolver(digit, customState) :
                this.resolveNonZeroDigit_(digit, customState);

            return !digit ? "" :
                digit + this.resolveDecimalPoint_(customState);
        }

        /* tslint:disable:member-ordering */

        private resolvers_: Indexable<(digitChar: string, customState?: CustomExponentialState) => string> = {
            "0": (digitChar: string, customState: CustomExponentialState): string => {
                return customState.nonZeroEncountered_ ?
                    this.resolveDigit_(digitChar, customState) :
                    "";
            },
            ".": (digitChar: string, customState: CustomExponentialState): string => {
                customState.afterDecimal_ = true;
                return "";
            },
            "-": (digitChar: string): string => digitChar
        };

        /* tslint:enable:member-ordering */

        private resolveNonZeroDigit_(digitChar: string, customState: CustomExponentialState): string {

            if (!customState.nonZeroEncountered_) {
                customState.nonZeroEncountered_ = true;
            }

            return this.resolveDigit_(digitChar, customState);
        }

        private resolveDigit_(digitChar: string, customState: CustomExponentialState): string {

            this.resolvePowerState_(customState);
            this.resolveDigitState_(customState);

            if (this.maximumFractionDigits_ !== undefined) {
                if (customState.decimalDigits_ > this.maximumFractionDigits_) {
                    return "";
                }
                else if (customState.decimalDigits_ === this.maximumFractionDigits_) {
                    return this.resolveDigitRounding_(digitChar, customState);
                }
            }

            return digitChar;
        }

        private resolvePowerState_(customState: CustomExponentialState): void {
            if (customState.nonZeroEncountered_) {
                customState.offset_ -= 1;
                if (!customState.afterDecimal_) {
                    customState.power_ += 1;
                }
            }
            else if (customState.afterDecimal_) {
                customState.power_ -= 1;
            }
        }

        private resolveDigitState_(customState: CustomExponentialState): void {

            if (customState.decimalDigits_ >= 0) {
                customState.decimalDigits_ += 1;
            }

            if (customState.offset_ === 0) {
                customState.decimalDigits_ = 0;
            }
        }

        private resolveDigitRounding_(digitChar: string, customState: CustomExponentialState): string {
            let nextDigit = +customState.digits_[customState.index_ + 1];
            if (isNaN(nextDigit)) {
                nextDigit = +customState.digits_[customState.index_ + 2];
            }

            return nextDigit >= 5 ?
                +digitChar + 1 + "" :
                digitChar;
        }

        private resolveDecimalPoint_(customState: CustomExponentialState): string {
            return customState.offset_ === 0 && this.maximumFractionDigits_ !== 0 ? "." : "";
        }

        private resolveOffset_(exponentialValue: string, customState: CustomExponentialState): string {

            let padding = Utils.Padding;

            if (customState.offset_ > 0) {
                exponentialValue = padding.pad(exponentialValue, {
                    totalWidth: exponentialValue.length + customState.offset_,
                    paddingChar: "0"
                });

                if (this.minimumFractionDigits_ > 0) {
                    exponentialValue += ".";
                }
            }

            let decimalOffset = this.minimumFractionDigits_ - (customState.decimalDigits_ || 0);
            if (decimalOffset > 0) {
                exponentialValue = padding.pad(exponentialValue, {
                    totalWidth: exponentialValue.length + decimalOffset,
                    paddingChar: "0"
                });
            }

            return exponentialValue;
        }

        private resolveExponent_(customState: CustomExponentialState): string {

            let paddedExponent = Math.abs(customState.power_).toString(),
                sign = customState.power_ < 0 ? "-" :
                    this.negativellySignedExponent_ ? "" : "+";

            if (this.minimumExponentDigits_ > 1) {
                paddedExponent = this.getPaddedExponent_(paddedExponent);
            }

            return "e" + sign + paddedExponent;
        }
    }

    interface CustomExponentialState {
        index_: number;
        power_: number;
        offset_: number;
        digits_: string;
        afterDecimal_: boolean;
        decimalDigits_?: number;
        nonZeroEncountered_: boolean;
    }
}
