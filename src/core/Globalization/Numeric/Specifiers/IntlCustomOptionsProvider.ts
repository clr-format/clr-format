/// <reference path="../../../../use-strict" />

/// <reference path="CustomParser" />
/// <reference path="Standard" />

/// <reference path="../IntlFormatOptions" />
/// <reference path="../../OptionsProvider" />

/// <reference path="../../../Utils/Object" />
/// <reference path="../../../Utils/Remove" />

namespace Format.Globalization.Numeric.Specifiers {
    /**
     * An [[OptionsProvider]] implementation that handles [Custom Numeric Format String](https://msdn.microsoft.com/library/0c899ak8.aspx). The type of the returned options object is an
     * extended version of [Intl.NumberFormat's options](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat#Parameters) parameter.
     */
    export class IntlCustomOptionsProvider implements Globalization.OptionsProvider<Intl.NumberFormatOptions, number> {

        private options: Intl.NumberFormatOptions;

        private parser: CustomParser;

        // Arrow syntax used to preserve 'this' context inside the function at compile time
        private decoractingCharResolver: () => void = (): void => {

            let formatChar = this.parser.getCurrentChar();

            if (this.parser.isBeforeNumericSpecifiers()) {
                this.options.prefixDecorator += formatChar;
            }
            else if (this.parser.isAfterNumericSpecifiers()) {
                this.options.suffixDecorator += formatChar;
            }
            else {
                this.setInternalDecorator(formatChar);
            }
        };

        /**
         * Creates an instance with base formatting options which will be extended and/or overridden by resolved options.
         * @param numberOptions A base options object containing properties defined for the Intl.NumberFormat's options parameter.
         */
        constructor(numberOptions?: Intl.NumberFormatOptions) {
            this.options = Utils.extend(numberOptions, <Intl.NumberFormatOptions> {
                noDigits: true,
                noLeadingZeroIntegerDigit: true,
                valueDivisor: 1,
                prefixDecorator: "",
                internalDecorators: {},
                suffixDecorator: ""
            });
        }

        /**
         * Returns an object that provides numeric formatting options resolved from custom numeric specifiers.
         * @param format A format string representing a [Custom Numeric Format String](https://msdn.microsoft.com/library/0c899ak8.aspx).
         * @param value The numeric object from which to infer additional options.
         */
        public resolveOptions(format: string, value: number): Intl.NumberFormatOptions {

            format = this.getSectionFormat(format, value);

            this.parseOptions(format);

            return this.stripDefaultOptions(value);
        }

        private parseOptions(format: string): void {

            if (!format) {
                return;
            }

            this.parser = new CustomParser(format);
            this.parser.doParse(this.resolvers, this.decoractingCharResolver);

            this.options.minimumIntegerDigits = this.parser.getDigitsBeforeDecimal();
            this.options.minimumFractionDigits = this.parser.getZeroPlaceholderCountAfterDecimal();
            this.options.maximumFractionDigits = this.parser.getNumberPlaceholderCountAfterDecimal();
        }

        private stripDefaultOptions(value: number): Intl.NumberFormatOptions {

            if (this.options.valueDivisor === 1) {
                delete this.options.valueDivisor;
            }

            if (Utils.isEmpty(this.options.internalDecorators)) {
                delete this.options.internalDecorators;
            }

            return this.stripDigitOptions(value);
        }

        private stripDigitOptions(value: number): Intl.NumberFormatOptions {

            if (this.options.valueDivisor) {
                value /= this.options.valueDivisor;
            }

            if (this.options.style === StandardSpecifiers[StandardSpecifiers.exponential] ||
                !(this.options.noLeadingZeroIntegerDigit && Math.abs(value) < 1)) {
                delete this.options.noLeadingZeroIntegerDigit;
            }

            if (!this.options.noDigits) {
                delete this.options.noDigits;
            }

            return Utils.removeEmpty(this.options);
        }

        private getSectionFormat(format: string, value: number): string {

            if (format.indexOf(CustomSpecifiers.sectionSeparator) === -1) {
                return format;
            }

            let sections = CustomParser.getSections(format);
            if (this.tryNonZeroSectionFormat(sections, value)) {
                return "";
            }

            return sections[2] || sections[0];
        }

        private tryNonZeroSectionFormat(sections: string[], value: number): boolean {
            if (value > 0) {
                return this.tryRoundToZeroFormat(sections[0], value);
            }
            if (value < 0) {
                return this.tryNegativeZeroSectionFormat(sections, value);
            }
        }

        private tryNegativeZeroSectionFormat(sections: string[], value: number): boolean {

            let nonZeroSectionFormat = sections[1];
            if (nonZeroSectionFormat) {
                this.options.valueDivisor = -1;
            }
            else {
                nonZeroSectionFormat = sections[0];
            }

            return this.tryRoundToZeroFormat(nonZeroSectionFormat, value);
        }

        private tryRoundToZeroFormat(nonZeroSectionFormat: string, value: number): boolean {

            let nonZeroProvider = new IntlCustomOptionsProvider({});
            nonZeroProvider.parseOptions(nonZeroSectionFormat);

            if (+value.toFixed(nonZeroProvider.options.maximumFractionDigits) !== 0) {
                nonZeroProvider.options.valueDivisor *= this.options.valueDivisor;
                Utils.extend(this.options, nonZeroProvider.options);

                return true;
            }
        }

        private setInternalDecorator(formatChar: string): void {

            let indexFromDecimal = this.parser.getIndexFromDecimal(),
                currentDecorator = this.options.internalDecorators[indexFromDecimal] || "";

            this.options.internalDecorators[indexFromDecimal] = currentDecorator + formatChar;
        }

        private resetValueDivisor(): void {

            let absoluteDivisor = Math.abs(this.options.valueDivisor);
            if (absoluteDivisor >= 1) {
                this.options.valueDivisor /= absoluteDivisor;
            }
        }

        /* tslint:disable:member-ordering */

        private resolvers: Specifiers.CustomSpecifiersMap< () => void> = {

            /** See: https://msdn.microsoft.com/library/0c899ak8.aspx#Specifier0 */
            zeroPlaceholder: (): void => {
                this.resolvers.digitPlaceholder();
                if (!this.parser.isAfterDecimal()) {
                    this.options.noLeadingZeroIntegerDigit = false;
                }
            },

            /** See: https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierD */
            digitPlaceholder: (): void => {
                this.options.noDigits = false;
            },

            /** See: https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierPt */
            decimalPoint: (): void => {
                this.resolvers.digitPlaceholder();
            },

            /** See: https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierTh */
            groupSeparatorOrNumberScaling: (): void => {
                if (!this.parser.isBeforeNumericSpecifiers()) {
                    if (!this.parser.isAfterDecimal() && !this.parser.isAfterNumericSpecifiers()) {
                        this.options.useGrouping = true;
                    }
                    else if (Math.abs(this.options.valueDivisor) >= 1 && this.parser.isImmediateAfterNumericSpecifiers()) {
                        this.options.valueDivisor *= 1000;
                    }
                }
            },

            /** See: https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierPct */
            percentagePlaceholder: (): void => {
                this.decoractingCharResolver();
                this.resetValueDivisor();
                this.options.valueDivisor /= 100;
            },

            /** See: https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierPerMille */
            perMillePlaceholder: (): void => {
                this.decoractingCharResolver();
                this.resetValueDivisor();
                this.options.valueDivisor /= 1000;
            },

            /** See: https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierExponent */
            exponent: (): void => {
                if (this.parser.isExponentMatched()) {
                    this.options.style = StandardSpecifiers[StandardSpecifiers.exponential];
                    this.options.upperCase = this.parser.isExponentUppercase();
                    this.options.negativellySignedExponent = this.parser.getExponentSign() !== "+";
                    this.options.minimumExponentDigits = this.parser.getExponentPlaceholderCount();
                }
                else {
                    this.decoractingCharResolver();
                }
            },

            /** See: https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierEscape */
            escapeChar: undefined,

            /** See: https://msdn.microsoft.com/library/0c899ak8.aspx#SectionSeparator */
            sectionSeparator: undefined,

            /** Indicates that the enclosed characters should be copied to the result string unchanged. */
            literalStringDelimeterSingle: undefined,

            /** Indicates that the enclosed characters should be copied to the result string unchanged. */
            literalStringDelimeterDouble: undefined
        };

        /* tslint:enable:member-ordering */
    }
}
