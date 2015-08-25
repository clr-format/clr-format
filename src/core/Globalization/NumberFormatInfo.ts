/// <reference path="../../use-strict" />

/// <reference path="FormatProvider" />

namespace Format.Globalization {
    /**
     * Provides culture-specific information for formatting and parsing numeric values.
     *
     * Information about the culture itself and the application of overrides will be made available through this class at a later point.
     *
     * See: https://msdn.microsoft.com/en-us/library/system.globalization.numberformatinfo.aspx
     */
    export class NumberFormatInfo implements FormatProvider {

        /** Gets or sets the string to use as the decimal separator in currency values. */
        public CurrencyDecimalSeparator: string;
        /** Gets or sets the string to use as the decimal separator in numeric values. */
        public NumberDecimalSeparator: string;
        /** Gets or sets the string that separates groups of digits to the left of the decimal in currency values. */
        public CurrencyGroupSeparator: string;
        /** Gets or sets the string that separates groups of digits to the left of the decimal in numeric values. */
        public NumberGroupSeparator: string;
        /** Gets or sets the string that denotes that the associated number is negative. */
        public NegativeSign: string;

        protected locales: string|string[];

        private isWritable: boolean;

        /** Initializes a new writable instance of the class that is culture-independent (invariant). */
        constructor();
        /**
         * Initializes a new instance of the class based on the culture specified by *locales*.
         * @param locales The locales argument must be either a string holding a [BCP 47 language tag](http://tools.ietf.org/html/rfc5646), or an array of such language tags.
         */
        constructor(locales: string|string[]);
        constructor(...args: Object[]) {
            this.isWritable = args[0] !== undefined;
            this.locales = <string|string[]> args[0] || "";

            this.resolveFormatInfo(this.locales);
        }

        /**
         * Returns an object that provides formatting services for the `Number` type.
         * @param type A string indicating the type of the custom formatter to return, see [[Utils.Types]].
         */
        public getFormatter(type: string): CustomFormatter {
            return undefined;
        }

        private resolveFormatInfo(locales: string|string[]): void {
            if (!locales) {
                this.setInvariantFormatInfo();
            }
            else {
                this.resolveCultureFormatInfo(locales);
            }
        }

        private setInvariantFormatInfo(): void {
            this.CurrencyDecimalSeparator = this.NumberDecimalSeparator = ".";
            this.CurrencyGroupSeparator = this.NumberGroupSeparator = ",";
            this.NegativeSign = "-";
        }

        private resolveCultureFormatInfo(locales: string|string[]): void {
            throw new Errors.NotImplementedError("resolveCultureFormatInfo");
        }
    }
}
