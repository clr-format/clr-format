/// <reference path="../../../../use-strict" />

/// <reference path="CustomParser" />
/// <reference path="Standard" />

/// <reference path="../IntlFormatOptions" />
/// <reference path="../../OptionsProvider" />

/// <reference path="../../../Utils/Object" />
/// <reference path="../../../Utils/Remove" />

/// <reference path="../../../Errors/ArgumentNullError" />

namespace Format.Globalization.Numeric.Specifiers {
    /**
     * An [[OptionsProvider]] implementation that handles [Custom Numeric Format String](https://msdn.microsoft.com/library/0c899ak8.aspx). The type of the returned options object is an
     * extended version of [Intl.NumberFormat's options](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat#Parameters) parameter.
     */
    export class IntlCustomOptionsProvider implements Globalization.OptionsProvider<Intl.NumberFormatOptions, number> {

        private options_: Intl.NumberFormatOptions;

        private parser_: CustomParser;

        /**
         * Creates an instance with base formatting options which will be extended and/or overridden by resolved options.
         * @param numberOptions A base options object containing properties defined for the Intl.NumberFormat's options parameter.
         */
        constructor(numberOptions: Intl.NumberFormatOptions) {

            if (numberOptions == null) {
                throw new Errors.ArgumentNullError("numberOptions");
            }

            this.options_ = Utils.extend(numberOptions, <Intl.NumberFormatOptions> {
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

            format = this.getSectionFormat_(format, value);

            this.parseOptions_(format);

            return this.stripDefaultOptions_(value);
        }

        private parseOptions_(format: string): void {

            if (!format) {
                return;
            }

            this.parser_ = new CustomParser(format);
            this.parser_.doParse(this.resolvers_, this.resolveDecoractingChar_);

            this.options_.minimumIntegerDigits = this.parser_.getDigitsBeforeDecimal();
            this.options_.minimumFractionDigits = this.parser_.getZeroPlaceholderCountAfterDecimal();
            this.options_.maximumFractionDigits = this.parser_.getNumberPlaceholderCountAfterDecimal();
        }

        private stripDefaultOptions_(value: number): Intl.NumberFormatOptions {

            if (this.options_.valueDivisor === 1) {
                delete this.options_.valueDivisor;
            }

            if (Utils.isEmpty(this.options_.internalDecorators)) {
                delete this.options_.internalDecorators;
            }

            return this.stripDigitOptions_(value);
        }

        private stripDigitOptions_(value: number): Intl.NumberFormatOptions {

            if (this.options_.valueDivisor) {
                value /= this.options_.valueDivisor;
            }

            let styles = Specifiers.Standard;

            if (this.options_.style === styles[styles.exponential] ||
                !(this.options_.noLeadingZeroIntegerDigit && Math.abs(value) < 1)) {
                delete this.options_.noLeadingZeroIntegerDigit;
            }

            if (!this.options_.noDigits) {
                delete this.options_.noDigits;
            }

            return Utils.removeEmpty(this.options_);
        }

        private getSectionFormat_(format: string, value: number): string {

            if (format.indexOf(Specifiers.Custom.sectionSeparator) === -1) {
                return format;
            }

            let sections = CustomParser.getSections(format);
            if (this.tryNonZeroSectionFormat_(sections, value)) {
                return "";
            }

            return sections[2] || sections[0];
        }

        private tryNonZeroSectionFormat_(sections: string[], value: number): boolean {
            if (value > 0) {
                return this.tryRoundToZeroFormat_(sections[0], value);
            }
            if (value < 0) {
                return this.tryNegativeZeroSectionFormat_(sections, value);
            }
        }

        private tryNegativeZeroSectionFormat_(sections: string[], value: number): boolean {

            let nonZeroSectionFormat = sections[1];
            if (nonZeroSectionFormat) {
                this.options_.valueDivisor = -1;
            }
            else {
                nonZeroSectionFormat = sections[0];
            }

            return this.tryRoundToZeroFormat_(nonZeroSectionFormat, value);
        }

        private tryRoundToZeroFormat_(nonZeroSectionFormat: string, value: number): boolean {

            let nonZeroProvider = new IntlCustomOptionsProvider({});
            nonZeroProvider.parseOptions_(nonZeroSectionFormat);

            if (+value.toFixed(nonZeroProvider.options_.maximumFractionDigits) !== 0) {
                nonZeroProvider.options_.valueDivisor *= this.options_.valueDivisor;
                Utils.extend(this.options_, nonZeroProvider.options_);

                return true;
            }
        }

        private resetValueDivisor_(): void {

            let absoluteDivisor = Math.abs(this.options_.valueDivisor);
            if (absoluteDivisor >= 1) {
                this.options_.valueDivisor /= absoluteDivisor;
            }
        }

        /* tslint:disable:member-ordering */

        // Arrow syntax used to preserve 'this' context inside the function at compile time
        private resolveDecoractingChar_: () => void = (): void => {

            let formatChar = this.parser_.getCurrentChar();

            if (this.parser_.isBeforeNumericSpecifiers()) {
                this.options_.prefixDecorator += formatChar;
            }
            else if (this.parser_.isAfterNumericSpecifiers()) {
                this.options_.suffixDecorator += formatChar;
            }
            else {
                this.setInternalDecorator_(formatChar);
            }
        };

        private setInternalDecorator_(formatChar: string): void {

            let indexFromDecimal = this.parser_.getIndexFromDecimal(),
                currentDecorator = this.options_.internalDecorators[indexFromDecimal] || "";

            this.options_.internalDecorators[indexFromDecimal] = currentDecorator + formatChar;
        }

        private resolvers_: Specifiers.CustomSpecifiersMap< () => void> = {

            /** See: https://msdn.microsoft.com/library/0c899ak8.aspx#Specifier0 */
            zeroPlaceholder: (): void => {
                this.resolvers_.digitPlaceholder();
                if (!this.parser_.isAfterDecimal()) {
                    this.options_.noLeadingZeroIntegerDigit = false;
                }
            },

            /** See: https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierD */
            digitPlaceholder: (): void => {
                this.options_.noDigits = false;
            },

            /** See: https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierPt */
            decimalPoint: (): void => {
                this.resolvers_.digitPlaceholder();
            },

            /** See: https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierTh */
            groupSeparatorOrNumberScaling: (): void => {
                if (!this.parser_.isBeforeNumericSpecifiers()) {
                    if (!this.parser_.isAfterDecimal() && !this.parser_.isAfterNumericSpecifiers()) {
                        this.options_.useGrouping = true;
                    }
                    else if (Math.abs(this.options_.valueDivisor) >= 1 && this.parser_.isImmediateAfterNumericSpecifiers()) {
                        this.options_.valueDivisor *= 1000;
                    }
                }
            },

            /** See: https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierPct */
            percentagePlaceholder: (): void => {
                this.resolveDecoractingChar_();
                this.resetValueDivisor_();
                this.options_.valueDivisor /= 100;
            },

            /** See: https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierPerMille */
            perMillePlaceholder: (): void => {
                this.resolveDecoractingChar_();
                this.resetValueDivisor_();
                this.options_.valueDivisor /= 1000;
            },

            /** See: https://msdn.microsoft.com/library/0c899ak8.aspx#SpecifierExponent */
            exponent: (): void => {
                if (this.parser_.isExponentMatched()) {
                    let styles = Specifiers.Standard;
                    this.options_.style = styles[styles.exponential];
                    this.options_.upperCase = this.parser_.isExponentUppercase();
                    this.options_.negativellySignedExponent = this.parser_.getExponentSign() !== "+";
                    this.options_.minimumExponentDigits = this.parser_.getExponentPlaceholderCount();
                }
                else {
                    this.resolveDecoractingChar_();
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
