/// <reference path="../../../use-strict" />

/// <reference path="OptionsProvider" />
/// <reference path="Specifiers/Standard" />

/// <reference path="../NumberFormatInfo" />

/// <reference path="../../Utils/Text" />
/// <reference path="../../Utils/Indexable" />

/// <reference path="../../Errors/ArgumentNullError" />

namespace Format.Globalization.Numeric {
    /**
     * Partial formatter implementation that applies decoration options to the resulting value.
     * @param T The type of the options container.
     */
    export class DecorationFormatter<T> {

        private static groupSeparatorRegExp_: RegExp = /\B(?=(\d{3})+(?!\d))/g;

        private style_: string;
        private noDigits_: boolean;
        private upperCase_: boolean;
        private useGrouping_: boolean;
        private noLeadingZeroIntegerDigit_: boolean;
        private prefixDecorator_: string;
        private suffixDecorator_: string;
        private internalDecorators_: Indexable<string>;

        private formatInfo_: NumberFormatInfo;

        private decimalOffset_: number;
        private restoreNegativeSign_: boolean;

        /**
         * Creates an instance that uses the resolved options from the specified options provider and applies culture-specific formatting based on the given format info.
         * @param optionsProvider A numeric options provider whose resolved options will be used.
         * @param formatInfo An instance that provides culture-specific number format information.
         */
        constructor(optionsProvider: OptionsProvider<T>, formatInfo: NumberFormatInfo) {

            if (optionsProvider == null) {
                throw new Errors.ArgumentNullError("optionsProvider");
            }

            if (formatInfo == null) {
                throw new Errors.ArgumentNullError("formatInfo");
            }

            this.style_ = optionsProvider.getStyle();
            this.noDigits_ = optionsProvider.hasNoDigits();
            this.upperCase_ = optionsProvider.isUpperCase();
            this.useGrouping_ = optionsProvider.useGrouping();
            this.noLeadingZeroIntegerDigit_ = optionsProvider.hasNoLeadingZeroIntegerDigit();
            this.prefixDecorator_ = optionsProvider.getPrefixDecorator();
            this.suffixDecorator_ = optionsProvider.getSuffixDecorator();
            this.internalDecorators_ = optionsProvider.getInternalDecorators();
            this.formatInfo_ = formatInfo;
        }

        /**
         * Applies negative sign position and symbol, removal of the leading zero, internal and external decorators to the formatted value.
         * @param value The number which is currently being formatted.
         * @param formattedValue The partial resulting format value.
         * @returns The fully formatted value.
         */
        public applyOptions(value: number, formattedValue: string): string {

            formattedValue = this.removeNegativeSign_(value, formattedValue);
            formattedValue = this.applyDigitOptions_(value, formattedValue);
            formattedValue = this.applyInternalDecorators_(formattedValue);
            formattedValue = this.applyExternalDecorators_(formattedValue);

            return this.applyNegativeSign_(value, formattedValue);
        }

        /**
         * Applies the uppercase option for some standard specifiers that require it.
         * @param formattedValue The partial resulting format value.
         * @returns A resulting format value with the applied uppercase option.
         */
        public applyUppercase(formattedValue: string): string {
            return this.upperCase_ ?
                formattedValue.toUpperCase() :
                formattedValue;
        }

        /**
         * Applies the grouping option using the appropriate group separator.
         * @param formattedValue The partial resulting format value.
         * @returns A resulting format value with the applied grouping option.
         */
        public applyGrouping(formattedValue: string): string {

            if (!this.useGrouping_) {
                return formattedValue;
            }

            let decimalSeparator: string = this.getDecimalSeparator(),
                numericParts = formattedValue.split(decimalSeparator);

            numericParts[0] = numericParts[0].replace(
                DecorationFormatter.groupSeparatorRegExp_,
                this.getGroupSeparator());

            return numericParts.join(decimalSeparator);
        }

        /**
         * Applies the minimum integer digits option by padding the numeric part before the decimal separator.
         * Also temporarily removes the current [[NumberFormatInfo.NegativeSign]]. It is restored when [[applyOptions]] finishes all decoration formatting.
         * @param value The number which is currently being formatted.
         * @param formattedValue The partial resulting format value.
         * @param paddingWidth The number of characters in the resulting numeric string's integral part.
         * @returns A resulting format value with the applied minimum integer digits option and without a negative sign.
         */
        public applyIntegerPadding(value: number, formattedValue: string, paddingWidth: number): string {

            let decimalSeparator: string = this.getDecimalSeparator(),
                numericParts = formattedValue.split(decimalSeparator);

            numericParts[0] = this.removeNegativeSign_(value, numericParts[0]);

            if (numericParts[0].length < paddingWidth) {

                let padding = Utils.Padding;

                numericParts[0] = padding.pad(numericParts[0], {
                    totalWidth: paddingWidth,
                    paddingChar: "0",
                    direction: padding.Direction.Left
                });
            }

            return numericParts.join(decimalSeparator);
        }

        /**
         * Returns the appropriate decimal separator symbol depending on the available format info and style option.
         * @param formatInfo An overriding format info instance to be used.
         */
        public getDecimalSeparator(formatInfo?: NumberFormatInfo): string {

            formatInfo = formatInfo || this.formatInfo_;

            return this.isCurrency_() ?
                formatInfo.CurrencyDecimalSeparator :
                formatInfo.NumberDecimalSeparator;
        }

        /**
         * Returns the appropriate group separator symbol depending on the available format info and style option.
         * @param formatInfo An overriding format info instance to be used.
         */
        public getGroupSeparator(formatInfo?: NumberFormatInfo): string {

            formatInfo = formatInfo || this.formatInfo_;

            return this.isCurrency_() ?
                formatInfo.CurrencyGroupSeparator :
                formatInfo.NumberGroupSeparator;
        }

        private isCurrency_(): boolean {

            let styles = Specifiers.Standard;

            return this.style_ === styles[styles.decimal];
        }

        private removeNegativeSign_(value: number, formattedValue: string): string {

            if (this.restoreNegativeSign_) {
                return formattedValue;
            }

            this.restoreNegativeSign_ = value < 0 && formattedValue[0] === this.formatInfo_.NegativeSign;

            return this.restoreNegativeSign_ ?
                formattedValue.substring(1) :
                formattedValue;
        }

        private applyDigitOptions_(value: number, formattedValue: string): string {

            if (this.noDigits_) {
                return "";
            }

            return this.shouldRemoveLeadingZero_(value) ?
                formattedValue = formattedValue.substring(1) :
                formattedValue;
        }

        private shouldRemoveLeadingZero_(value: number): boolean {

            let styles = Specifiers.Standard;

            return this.noLeadingZeroIntegerDigit_
                && this.style_ !== styles[styles.exponential]
                && this.style_ !== styles[styles.roundTrip]
                && this.style_ !== styles[styles.general]
                && this.style_ !== styles[styles.hex]
                && Math.abs(value) < 1;
        }

        private applyInternalDecorators_(formattedValue: string): string {

            if (!this.internalDecorators_) {
                return formattedValue;
            }

            let decimalSeparator: string = this.getDecimalSeparator(),
                numericParts = formattedValue.split(decimalSeparator);

            this.decimalOffset_ = 0;

            for (let key in this.internalDecorators_) {
                if (this.internalDecorators_.hasOwnProperty(key)) {
                    this.applyInternalDecorator_(numericParts, +key, this.internalDecorators_[key]);
                }
            }

            return numericParts.join(decimalSeparator);
        }

        private applyInternalDecorator_(numericParts: string[], index: number, decorator: string): void {

            let integralPart = numericParts[0],
                insert = Utils.Text.insert;

            if (index < 0) {
                index += integralPart.length + 1;
                numericParts[0] = insert(integralPart, Math.max(0, index), decorator);
            }
            else {
                index += this.decimalOffset_;
                this.decimalOffset_ += decorator.length;

                let decimalPart = numericParts[1];
                if (decimalPart) {
                    numericParts[1] = insert(decimalPart, index, decorator);
                }
                else {
                    numericParts[0] = insert(integralPart, Math.min(index, integralPart.length), decorator);
                }
            }
        }

        private applyExternalDecorators_(formattedValue: string): string {

            if (this.prefixDecorator_) {
                formattedValue = this.prefixDecorator_ + formattedValue;
            }

            if (this.suffixDecorator_) {
                formattedValue += this.suffixDecorator_;
            }

            return formattedValue;
        }

        private applyNegativeSign_(value: number, formattedValue: string): string {
            return this.restoreNegativeSign_ ?
                this.formatInfo_.NegativeSign + formattedValue :
                formattedValue;
        }
    }
}
