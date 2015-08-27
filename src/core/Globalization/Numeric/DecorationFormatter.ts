/// <reference path="../../../use-strict" />

/// <reference path="OptionsProvider" />
/// <reference path="Specifiers/Standard" />

/// <reference path="../NumberFormatInfo" />

/// <reference path="../../Utils/Text" />
/// <reference path="../../Utils/Indexable" />

module Format.Globalization.Numeric {
    /**
     * Partial formatter implementation that applies decoration options to the resulting value.
     * @param T The type of the options container.
     */
    export class DecorationFormatter<T> {

        private static groupSeparatorRegExp: RegExp = /\B(?=(\d{3})+(?!\d))/g;

        private style: string;
        private noDigits: boolean;
        private upperCase: boolean;
        private useGrouping: boolean;
        private noLeadingZeroIntegerDigit: boolean;
        private prefixDecorator: string;
        private suffixDecorator: string;
        private internalDecorators: Indexable<string>;

        private formatInfo: NumberFormatInfo;

        private decimalOffset: number;
        private restoreNegativeSign: boolean;

        /**
         * Creates an instance that uses the resolved options from the specified options provider and applies culture-specific formatting based on the given format info.
         * @param optionsProvider A numeric options provider whose resolved options will be used.
         * @param formatInfo An instance that provides culture-specific number format information.
         */
        constructor(optionsProvider: OptionsProvider<T>, formatInfo: NumberFormatInfo) {
            this.style = optionsProvider.getStyle();
            this.noDigits = optionsProvider.hasNoDigits();
            this.upperCase = optionsProvider.isUpperCase();
            this.useGrouping = optionsProvider.useGrouping();
            this.noLeadingZeroIntegerDigit = optionsProvider.hasNoLeadingZeroIntegerDigit();
            this.prefixDecorator = optionsProvider.getPrefixDecorator();
            this.suffixDecorator = optionsProvider.getSuffixDecorator();
            this.internalDecorators = optionsProvider.getInternalDecorators();
            this.formatInfo = formatInfo;
        }

        /**
         * Applies negative sign position and symbol, removal of the leading zero, internal and external decorators to the formatted value.
         * @param value The number which is currently being formatted.
         * @param formattedValue The partial resulting format value.
         * @returns A resulting format value with applied decoration options.
         */
        public applyOptions(value: number, formattedValue: string): string {

            formattedValue = this.removeNegativeSign(value, formattedValue);
            formattedValue = this.applyDigitOptions(value, formattedValue);
            formattedValue = this.applyInternalDecorators(formattedValue);
            formattedValue = this.applyExternalDecorators(formattedValue);

            return this.applyNegativeSign(value, formattedValue);
        }

        /**
         * Applies the uppercase option for some standard specifiers that require it.
         * @param formattedValue The partial resulting format value.
         * @returns A resulting format value with the applied uppercase option.
         */
        public applyUppercase(formattedValue: string): string {
            return this.upperCase ?
                formattedValue.toUpperCase() :
                formattedValue;
        }

        /**
         * Applies the grouping option using the appropriate group separator.
         * @param formattedValue The partial resulting format value.
         * @returns A resulting format value with the applied grouping option.
         */
        public applyGrouping(formattedValue: string): string {

            if (!this.useGrouping) {
                return formattedValue;
            }

            let decimalSeparator: string = this.getDecimalSeparator(),
                numericParts = formattedValue.split(decimalSeparator);

            numericParts[0] = numericParts[0].replace(
                DecorationFormatter.groupSeparatorRegExp,
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

            numericParts[0] = this.removeNegativeSign(value, numericParts[0]);

            if (numericParts[0].length < paddingWidth) {
                numericParts[0] = Utils.Padding.pad(numericParts[0], {
                    totalWidth: paddingWidth,
                    paddingChar: "0",
                    direction: Utils.Padding.Direction.Left
                });
            }

            return numericParts.join(decimalSeparator);
        }

        private isCurrency(): boolean {

            let styles = Specifiers.StandardSpecifiers;

            return this.style === styles[styles.decimal];
        }

        private getDecimalSeparator(): string {
            return this.isCurrency() ?
                this.formatInfo.CurrencyDecimalSeparator :
                this.formatInfo.NumberDecimalSeparator;
        }

        private getGroupSeparator(): string {
            return this.isCurrency() ?
                this.formatInfo.CurrencyGroupSeparator :
                this.formatInfo.NumberGroupSeparator;
        }

        private removeNegativeSign(value: number, formattedValue: string): string {

            if (this.restoreNegativeSign) {
                return formattedValue;
            }

            this.restoreNegativeSign = value < 0 && formattedValue[0] === this.formatInfo.NegativeSign;

            return this.restoreNegativeSign ?
                formattedValue.substring(1) :
                formattedValue;
        }

        private applyDigitOptions(value: number, formattedValue: string): string {

            if (this.noDigits) {
                return "";
            }

            return this.shouldRemoveLeadingZero(value) ?
                formattedValue = formattedValue.substring(1) :
                formattedValue;
        }

        private shouldRemoveLeadingZero(value: number): boolean {

            let styles = Specifiers.StandardSpecifiers;

            return this.noLeadingZeroIntegerDigit
                && this.style !== styles[styles.exponential]
                && this.style !== styles[styles.roundTrip]
                && this.style !== styles[styles.general]
                && this.style !== styles[styles.hex]
                && Math.abs(value) < 1;
        }

        private applyInternalDecorators(formattedValue: string): string {

            if (!this.internalDecorators) {
                return formattedValue;
            }

            let decimalSeparator: string = this.getDecimalSeparator(),
                numericParts = formattedValue.split(decimalSeparator);

            this.decimalOffset = 0;

            for (let key in this.internalDecorators) {
                if (this.internalDecorators.hasOwnProperty(key)) {
                    this.applyInternalDecorator(numericParts, +key, this.internalDecorators[key]);
                }
            }

            return numericParts.join(decimalSeparator);
        }

        private applyInternalDecorator(numericParts: string[], index: number, decorator: string): void {

            let integralPart = numericParts[0];

            if (index < 0) {
                index += integralPart.length + 1;
                numericParts[0] = Utils.Text.insert(integralPart, Math.max(0, index), decorator);
            }
            else {
                index += this.decimalOffset;
                this.decimalOffset += decorator.length;

                let decimalPart = numericParts[1];
                if (decimalPart) {
                    numericParts[1] = Utils.Text.insert(decimalPart, index, decorator);
                }
                else {
                    numericParts[0] = Utils.Text.insert(integralPart, Math.min(index, integralPart.length), decorator);
                }
            }
        }

        private applyExternalDecorators(formattedValue: string): string {

            if (this.prefixDecorator) {
                formattedValue = this.prefixDecorator + formattedValue;
            }

            if (this.suffixDecorator) {
                formattedValue += this.suffixDecorator;
            }

            return formattedValue;
        }

        private applyNegativeSign(value: number, formattedValue: string): string {
            return this.restoreNegativeSign ?
                this.formatInfo.NegativeSign + formattedValue :
                formattedValue;
        }
    }
}
