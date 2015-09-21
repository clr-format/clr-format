/// <reference path="../../../../use-strict" />

/// <reference path="Standard" />

/// <reference path="../IntlFormatOptions" />
/// <reference path="../../OptionsProvider" />

/// <reference path="../../../Utils/Remove" />
/// <reference path="../../../Utils/Function" />

/// <reference path="../../../Errors/FormatError" />

namespace Format.Globalization.Numeric.Specifiers {
    /**
     * An [[OptionsProvider]] implementation that handles [Standard Numeric Format Specifiers](https://msdn.microsoft.com/library/dwhawy9k.aspx). The type of the returned options object is an
     * extended version of [Intl.NumberFormat's options](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat#Parameters) parameter.
     */
    export class IntlStandardOptionsProvider implements Globalization.OptionsProvider<Intl.NumberFormatOptions, number> {

        private options: Intl.NumberFormatOptions;

        private specifier: string;
        private precision: number;
        private style: string;

        /**
         * Creates an instance with base formatting options which will be extended and/or overridden by resolved options.
         * @param numberOptions A base options object containing properties defined for the Intl.NumberFormat's options parameter.
         */
        constructor(numberOptions: Intl.NumberFormatOptions) {
            this.options = numberOptions;
        }

        /**
         * Returns an object that provides numeric formatting options resolved from standard numeric specifiers.
         * @param format A format string representing a [Standard Numeric Format Specifiers](https://msdn.microsoft.com/library/dwhawy9k.aspx).
         * @param value The numeric object from which to infer additional options.
         */
        public resolveOptions(format: string, value: number): Intl.NumberFormatOptions {

            if (this.tryInitializeSpecifierOptions(format)) {

                this.resolvers[this.style]();
                this.options.style = this.style;

                return Utils.removeUndefined(this.options);
            }
        }

        private tryInitializeSpecifierOptions(format: string): boolean {

            let standardSpecifierGroups = StandardSpecifierRexExp.exec(format);

            if (!standardSpecifierGroups) {
                return false;
            }

            this.specifier = standardSpecifierGroups[1];
            this.style = StandardSpecifiers[this.specifier.toUpperCase()];

            if (!this.style) {
                throw new Errors.FormatError(`Numeric format specifier '${format}' is invalid`);
            }

            this.precision = standardSpecifierGroups[2] !== "" ?
                +standardSpecifierGroups[2] :
                undefined;

            return true;
        }

        /* tslint:disable:member-ordering */

        private resolvers: StandardSpecifiersMap<() => void> = {

            /** See: https://msdn.microsoft.com/library/dwhawy9k.aspx#CFormatString */
            currency: (): void => {
                this.options.useGrouping = true;
                this.options.minimumFractionDigits = this.precision;
                this.options.maximumFractionDigits = this.precision;
            },

            /** See: https://msdn.microsoft.com/library/dwhawy9k.aspx#DFormatString */
            decimal: (): void => {
                this.options.minimumIntegerDigits = this.precision;
                this.options.maximumFractionDigits = 0;
            },

            /** See: https://msdn.microsoft.com/library/dwhawy9k.aspx#EFormatString */
            exponential: (): void => {

                let precision = this.precision >= 0 ? this.precision :
                    Specifiers.DefaultStandardExponentialPrecision;

                this.options.upperCase = this.specifier === this.specifier.toUpperCase();
                this.options.minimumFractionDigits = precision;
                this.options.maximumFractionDigits = precision;
                this.options.minimumExponentDigits = 3;
            },

            /** See: https://msdn.microsoft.com/library/dwhawy9k.aspx#FFormatString */
            fixedPoint: (): void => {
                this.options.minimumFractionDigits = this.precision;
                this.options.maximumFractionDigits = this.precision;
            },

            /** See: https://msdn.microsoft.com/library/dwhawy9k.aspx#GFormatString */
            general: (): void => {
                this.options.minimumExponentDigits = 2;
                this.options.upperCase = this.specifier === this.specifier.toUpperCase();
                if (this.precision >= 1) {
                    this.options.maximumSignificantDigits = this.precision;
                    this.options.maximumFractionDigits = this.precision >= 1 ? this.precision - 1 : undefined;
                }
            },

            /** See: https://msdn.microsoft.com/library/dwhawy9k.aspx#NFormatString */
            number: (): void => {
                this.resolvers.fixedPoint();
                this.options.useGrouping = true;
            },

            /** See: https://msdn.microsoft.com/library/dwhawy9k.aspx#PFormatString */
            percent: (): void => {
                this.resolvers.number();
            },

            /** See: https://msdn.microsoft.com/library/dwhawy9k.aspx#RFormatString */
            roundTrip: Utils.Function.getEmpty(),

            /** See: https://msdn.microsoft.com/library/dwhawy9k.aspx#XFormatString */
            hex: (): void => {
                this.options.minimumSignificantDigits = this.precision;
                this.options.upperCase = this.specifier === this.specifier.toUpperCase();
            }
        };

        /* tslint:enable:member-ordering */
    }
}
