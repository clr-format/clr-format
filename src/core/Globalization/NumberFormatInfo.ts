/// <reference path="../../use-strict" />

/// <reference path="Numeric/InfoFormatter" />
/// <reference path="Numeric/IntlOptionsProvider" />

/// <reference path="FormatProvider" />
/// <reference path="CustomFormatter" />

/// <reference path="../Utils/Types" />

/// <reference path="../Errors/NotImplementedError" />
/// <reference path="../Errors/InvalidOperationError" />

namespace Format.Globalization {
    /**
     * Provides culture-specific information for formatting and parsing numeric values.
     *
     * Full information about the culture and the application of overrides will be made available through this class at a later point.
     *
     * See: https://msdn.microsoft.com/library/system.globalization.numberformatinfo.aspx
     */
    export class NumberFormatInfo implements FormatProvider {

        /** Gets a read-only instance that is culture-independent (invariant). */
        public static InvariantInfo: NumberFormatInfo;

        /** Gets or sets the currency string. */
        public static CurrentCurrency: string;

        /** Gets or sets a constructor function to be used for creating culture-variant formatting instances. */
        public static FormatterConstructor: { new (locales: string|string[], formatInfo: NumberFormatInfo): CustomFormatter };

        /** Gets or sets the string to use as the decimal separator in currency values. */
        public CurrencyDecimalSeparator: string;

        /** Gets or sets the string that separates groups of digits to the left of the decimal in currency values. */
        public CurrencyGroupSeparator: string;

        /** Gets or sets the number of decimal places to use in currency values. */
        public CurrencyDecimalDigits: number;

        /** Gets or sets the string to use as the decimal separator in numeric values. */
        public NumberDecimalSeparator: string;

        /** Gets or sets the string that separates groups of digits to the left of the decimal in numeric values. */
        public NumberGroupSeparator: string;

        /** Gets or sets the number of decimal places to use in numeric values. */
        public NumberDecimalDigits: number;

        /** Gets or sets the string that denotes that the associated number is negative. */
        public NegativeSign: string;

        private isWritable_: boolean;
        private locales_: string|string[];
        private formatter_: CustomFormatter;

        /** Initializes a new writable instance of the class that is culture-independent (invariant). */
        constructor();
        /**
         * Initializes a new instance of the class based on the culture specified by *locales*.
         * @param locales The locales argument must be either a string holding a [BCP 47 language tag](http://tools.ietf.org/html/rfc5646), or an array of such language tags.
         */
        constructor(locales: string|string[]);
        constructor(...args: Object[]) {
            this.isWritable_ = args[0] === undefined;
            this.locales_ = <string|string[]> args[0] || "";

            this.resolveFormatInfo_(this.locales_);
        }

        /**
         * Returns an object that provides formatting services for the `Number` type.
         * @param type A string indicating the type of the custom formatter to return, see [[Utils.Types]].
         */
        public getFormatter(type: string): CustomFormatter {

            if (type !== Utils.Types.Number) {
                throw new Errors.InvalidOperationError("The NumberFormatInfo object supports formatting numeric values only");
            }

            return this.formatter_;
        }

        private resolveFormatInfo_(locales: string|string[]): void {
            if (!locales) {
                this.setInvariantFormatInfo_();
                this.formatter_ = new Numeric.InfoFormatter(Numeric.IntlOptionsProvider, this);
            }
            else if (typeof NumberFormatInfo.FormatterConstructor === "function") {
                this.formatter_ = new NumberFormatInfo.FormatterConstructor(this.locales_, this);
            }
            else {
                throw new Errors.InvalidOperationError("No culture-variant formatter was found (load a sub-module implementation or set the FormatterConstructor property)");
            }
        }

        private setInvariantFormatInfo_(): void {

            this.CurrencyDecimalSeparator =
            this.NumberDecimalSeparator = ".";

            this.CurrencyGroupSeparator =
            this.NumberGroupSeparator = ",";

            this.NumberDecimalDigits = 2;
            this.NegativeSign = "-";
        }
    }

    NumberFormatInfo.InvariantInfo = new NumberFormatInfo("");
}
