/// <reference path="../../../../use-strict" />

/// <reference path="Standard" />

/// <reference path="../IntlFormatOptions" />
/// <reference path="../../OptionsProvider" />

/// <reference path="../../../Utils/Remove" />
/// <reference path="../../../Utils/Function" />

/// <reference path="../../../Errors/FormatError" />
/// <reference path="../../../Errors/ArgumentNullError" />

namespace Format.Globalization.Numeric.Specifiers {
    /**
     * An [[OptionsProvider]] implementation that handles [Standard Numeric Format Specifiers](https://msdn.microsoft.com/library/dwhawy9k.aspx). The type of the returned options object is an
     * extended version of [Intl.NumberFormat's options](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat#Parameters) parameter.
     */
    export class IntlStandardOptionsProvider implements Globalization.OptionsProvider<Intl.NumberFormatOptions, number> {

        private options_: Intl.NumberFormatOptions;

        private specifier_: string;
        private precision_: number;
        private style_: string;

        /**
         * Creates an instance with base formatting options which will be extended and/or overridden by resolved options.
         * @param numberOptions A base options object containing properties defined for the Intl.NumberFormat's options parameter.
         */
        constructor(numberOptions: Intl.NumberFormatOptions) {

            if (numberOptions == null) {
                throw new Errors.ArgumentNullError("numberOptions");
            }

            this.options_ = numberOptions;
        }

        /**
         * Returns an object that provides numeric formatting options resolved from standard numeric specifiers.
         * @param format A format string representing a [Standard Numeric Format Specifiers](https://msdn.microsoft.com/library/dwhawy9k.aspx).
         * @param value The numeric object from which to infer additional options.
         */
        public resolveOptions(format: string, value: number): Intl.NumberFormatOptions {

            if (this.tryInitializeSpecifierOptions_(format)) {

                this.resolvers_[this.style_]();
                this.options_.style = this.style_;

                return Utils.removeUndefined(this.options_);
            }
        }

        private tryInitializeSpecifierOptions_(format: string): boolean {

            let standardSpecifierGroups = StandardSpecifierRexExp.exec(format);

            if (!standardSpecifierGroups) {
                return false;
            }

            this.specifier_ = standardSpecifierGroups[1];
            this.style_ = Standard[this.specifier_.toUpperCase()];

            if (!this.style_) {
                throw new Errors.FormatError(`Numeric format specifier '${format}' is invalid`);
            }

            this.precision_ = standardSpecifierGroups[2] !== "" ?
                +standardSpecifierGroups[2] :
                undefined;

            return true;
        }

        /* tslint:disable:member-ordering */

        private resolvers_: StandardSpecifiersMap<() => void> = {

            /** See: https://msdn.microsoft.com/library/dwhawy9k.aspx#CFormatString */
            currency: (): void => {
                this.options_.useGrouping = true;
                this.options_.minimumFractionDigits = this.precision_;
                this.options_.maximumFractionDigits = this.precision_;
            },

            /** See: https://msdn.microsoft.com/library/dwhawy9k.aspx#DFormatString */
            decimal: (): void => {
                this.options_.minimumIntegerDigits = this.precision_;
                this.options_.maximumFractionDigits = 0;
            },

            /** See: https://msdn.microsoft.com/library/dwhawy9k.aspx#EFormatString */
            exponential: (): void => {

                let precision = this.precision_ >= 0 ? this.precision_ :
                    DefaultStandardExponentialPrecision;

                this.options_.upperCase = this.specifier_ === this.specifier_.toUpperCase();
                this.options_.minimumFractionDigits = precision;
                this.options_.maximumFractionDigits = precision;
                this.options_.minimumExponentDigits = 3;
            },

            /** See: https://msdn.microsoft.com/library/dwhawy9k.aspx#FFormatString */
            fixedPoint: (): void => {
                this.options_.minimumFractionDigits = this.precision_;
                this.options_.maximumFractionDigits = this.precision_;
            },

            /** See: https://msdn.microsoft.com/library/dwhawy9k.aspx#GFormatString */
            general: (): void => {
                this.options_.minimumExponentDigits = 2;
                this.options_.upperCase = this.specifier_ === this.specifier_.toUpperCase();
                if (this.precision_ >= 1) {
                    this.options_.maximumSignificantDigits = this.precision_;
                    this.options_.maximumFractionDigits = this.precision_ >= 1 ? this.precision_ - 1 : undefined;
                }
            },

            /** See: https://msdn.microsoft.com/library/dwhawy9k.aspx#NFormatString */
            number: (): void => {
                this.resolvers_.fixedPoint();
                this.options_.useGrouping = true;
            },

            /** See: https://msdn.microsoft.com/library/dwhawy9k.aspx#PFormatString */
            percent: (): void => {
                this.resolvers_.number();
            },

            /** See: https://msdn.microsoft.com/library/dwhawy9k.aspx#RFormatString */
            roundTrip: Utils.Function.getEmpty(),

            /** See: https://msdn.microsoft.com/library/dwhawy9k.aspx#XFormatString */
            hex: (): void => {
                this.options_.minimumSignificantDigits = this.precision_;
                this.options_.upperCase = this.specifier_ === this.specifier_.toUpperCase();
            }
        };

        /* tslint:enable:member-ordering */
    }
}
