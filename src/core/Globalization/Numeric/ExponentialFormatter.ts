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

        private minimumIntegerDigits: number;
        private minimumFractionDigits: number;
        private maximumFractionDigits: number;
        private minimumExponentDigits: number;
        private negativellySignedExponent: boolean;

        /**
         * Creates an instance that uses the resolved options from the specified options provider.
         * @param optionsProvider A numeric options provider whose resolved options will be used.
         */
        constructor(optionsProvider: OptionsProvider<T>) {

            if (optionsProvider == null) {
                throw new Errors.ArgumentNullError("optionsProvider");
            }

            this.minimumIntegerDigits = this.floorOption(optionsProvider.getMinimumIntegerDigits());
            this.minimumFractionDigits = this.floorOption(optionsProvider.getMinimumFractionDigits());
            this.maximumFractionDigits = this.floorOption(optionsProvider.getMaximumFractionDigits());
            this.minimumExponentDigits = this.floorOption(optionsProvider.getMinimumExponentDigits());
            this.negativellySignedExponent = optionsProvider.isNegativellySignedExponent();
        }

        /**
         * Applies exponent precision, padding and signing options to the number.
         * @param value The number which is currently being formatted.
         * @returns A formatted exponential notation string.
         */
        public applyOptions(value: number): string {

            this.validateOption(() => this.minimumIntegerDigits, 1);

            if (this.minimumIntegerDigits > 1) {
                this.validateCustomOptions();

                return this.toCustomExponential(value);
            }

            return this.toExponential(value);
        }

        /**
         * Applies exponent padding options for some standard specifiers that require it.
         * @param formattedExponentialValue The partial formatted exponential notation string.
         */
        public applyExponentPadding(formattedExponentialValue: string): string {

            this.validateOption(() => this.minimumExponentDigits, 1);

            if (this.minimumExponentDigits > 1) {

                let exponentIndex = formattedExponentialValue.lastIndexOf("e") + 2,
                    paddedExponent = this.getPaddedExponent(formattedExponentialValue.substring(exponentIndex));

                formattedExponentialValue = formattedExponentialValue.substring(0, exponentIndex) + paddedExponent;
            }

            return formattedExponentialValue;
        }

        private floorOption(optionValue: number): number {
            return optionValue != null ?
                Math.floor(optionValue) :
                undefined;
        }

        private validateOption(optionSelector: () => number, minValue: number): void {
            let optionValue = optionSelector();
            if (optionValue !== undefined &&
                (!isFinite(optionValue) || optionValue < minValue)) {
                throw new Errors.ArgumentError(
                    `Option '${ Utils.Function.getReturnName(optionSelector) }' with value '${optionValue}' must be finite and greater than or equal to ${minValue}`);
            }
        }

        private validateCustomOptions(): void {

            this.validateOption(() => this.minimumFractionDigits, 0);
            this.validateOption(() => this.maximumFractionDigits, 0);
            this.validateOption(() => this.minimumExponentDigits, 1);

            if (this.minimumFractionDigits > this.maximumFractionDigits) {
                throw new RangeError(
                    `Argument 'minimumFractionDigits=${this.minimumFractionDigits}' cannot be greater than argument 'maximumFractionDigits=${this.maximumFractionDigits}'`);
            }
        }

        private toExponential(value: number): string {

            let exponentialValue = Utils.Numeric.toExponentialMinMax(value, this.minimumFractionDigits, this.maximumFractionDigits);

            exponentialValue = this.applyExponentPadding(exponentialValue);
            exponentialValue = this.applyExponentSigning(exponentialValue);

            return exponentialValue;
        }

        private getPaddedExponent(exponent: string): string {
            return Utils.Padding.pad(exponent, {
                totalWidth: this.minimumExponentDigits,
                direction: Utils.Padding.Direction.Left,
                paddingChar: "0"
            });
        }

        private applyExponentSigning(exponentialValue: string): string {

            if (this.negativellySignedExponent) {

                let positiveExponentSignIndex = exponentialValue.lastIndexOf("+");
                if (positiveExponentSignIndex > 0) {
                    exponentialValue = exponentialValue.substring(0, positiveExponentSignIndex) + exponentialValue.substring(positiveExponentSignIndex + 1);
                }
            }

            return exponentialValue;
        }

        private toCustomExponential(value: number): string {
            return this.resolveFromState({
                index: 0,
                digits: value.toString(),
                power: -this.minimumIntegerDigits,
                offset: this.minimumIntegerDigits,
                nonZeroEncountered: false,
                afterDecimal: false
            });
        }

        private resolveFromState(customState: CustomExponentialState): string {

            let exponentialValue = "";

            for (let len = customState.digits.length; customState.index < len; customState.index += 1) {
                exponentialValue += this.resolveFromDigit(customState);
            }

            return this.resolveOffset(exponentialValue, customState) + this.resolveExponent(customState);
        }

        private resolveFromDigit(customState: CustomExponentialState): string {

            let digit = customState.digits[customState.index],
                resolver = this.resolvers[digit];

            digit = resolver ? resolver(digit, customState) :
                this.resolveNonZeroDigit(digit, customState);

            return !digit ? "" :
                digit + this.resolveDecimalPoint(customState);
        }

        /* tslint:disable:member-ordering */

        private resolvers: Indexable<(digitChar: string, customState?: CustomExponentialState) => string> = {
            "0": (digitChar: string, customState: CustomExponentialState): string => {
                return customState.nonZeroEncountered ?
                    this.resolveDigit(digitChar, customState) :
                    "";
            },
            ".": (digitChar: string, customState: CustomExponentialState): string => {
                customState.afterDecimal = true;
                return "";
            },
            "-": (digitChar: string): string => digitChar
        };

        /* tslint:enable:member-ordering */

        private resolveNonZeroDigit(digitChar: string, customState: CustomExponentialState): string {

            if (!customState.nonZeroEncountered) {
                customState.nonZeroEncountered = true;
            }

            return this.resolveDigit(digitChar, customState);
        }

        private resolveDigit(digitChar: string, customState: CustomExponentialState): string {

            this.resolvePowerState(customState);
            this.resolveDigitState(customState);

            if (this.maximumFractionDigits !== undefined) {
                if (customState.decimalDigits > this.maximumFractionDigits) {
                    return "";
                }
                else if (customState.decimalDigits === this.maximumFractionDigits) {
                    return this.resolveDigitRounding(digitChar, customState);
                }
            }

            return digitChar;
        }

        private resolvePowerState(customState: CustomExponentialState): void {
            if (customState.nonZeroEncountered) {
                customState.offset -= 1;
                if (!customState.afterDecimal) {
                    customState.power += 1;
                }
            }
            else if (customState.afterDecimal) {
                customState.power -= 1;
            }
        }

        private resolveDigitState(customState: CustomExponentialState): void {

            if (customState.decimalDigits >= 0) {
                customState.decimalDigits += 1;
            }

            if (customState.offset === 0) {
                customState.decimalDigits = 0;
            }
        }

        private resolveDigitRounding(digitChar: string, customState: CustomExponentialState): string {
            let nextDigit = +customState.digits[customState.index + 1];
            if (isNaN(nextDigit)) {
                nextDigit = +customState.digits[customState.index + 2];
            }

            return nextDigit >= 5 ?
                +digitChar + 1 + "" :
                digitChar;
        }

        private resolveDecimalPoint(customState: CustomExponentialState): string {
            return customState.offset === 0 && this.maximumFractionDigits !== 0 ? "." : "";
        }

        private resolveOffset(exponentialValue: string, customState: CustomExponentialState): string {

            if (customState.offset > 0) {
                exponentialValue = Utils.Padding.pad(exponentialValue, {
                    totalWidth: exponentialValue.length + customState.offset,
                    paddingChar: "0"
                });

                if (this.minimumFractionDigits > 0) {
                    exponentialValue += ".";
                }
            }

            let decimalOffset = this.minimumFractionDigits - (customState.decimalDigits || 0);
            if (decimalOffset > 0) {
                exponentialValue = Utils.Padding.pad(exponentialValue, {
                    totalWidth: exponentialValue.length + decimalOffset,
                    paddingChar: "0"
                });
            }

            return exponentialValue;
        }

        private resolveExponent(customState: CustomExponentialState): string {

            let paddedExponent = Math.abs(customState.power).toString(),
                sign = customState.power < 0 ? "-" :
                    this.negativellySignedExponent ? "" : "+";

            if (this.minimumExponentDigits > 1) {
                paddedExponent = this.getPaddedExponent(paddedExponent);
            }

            return "e" + sign + paddedExponent;
        }
    }

    interface CustomExponentialState {
        index: number;
        power: number;
        offset: number;
        digits: string;
        afterDecimal: boolean;
        decimalDigits?: number;
        nonZeroEncountered: boolean;
    }
}
