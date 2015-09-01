/// <reference path="../../use-strict" />

/// <reference path="FormatProvider" />
/// <reference path="CustomFormatter" />

/// <reference path="../Utils/Types" />

/// <reference path="../Errors/NotImplementedError" />
/// <reference path="../Errors/InvalidOperationError" />

namespace Format.Globalization {
    /**
     * Provides culture-specific information about the format of date and time values.
     *
     * Information about the culture itself and the application of overrides will be made available through this class at a later point.
     *
     * See: https://msdn.microsoft.com/en-us/library/system.globalization.datetimeformatinfo.aspx
     */
    export class DateTimeFormatInfo implements FormatProvider {

        /** Gets a read-only instance that is culture-independent (invariant). */
        public static InvariantInfo: DateTimeFormatInfo;

        protected locales: string|string[];

        private isWritable: boolean;
        private formatter: CustomFormatter;

        /** Initializes a new writable instance of the class that is culture-independent (invariant). */
        constructor();
        /**
         * Initializes a new instance of the class based on the culture specified by *locales*.
         * @param locales The locales argument must be either a string holding a [BCP 47 language tag](http://tools.ietf.org/html/rfc5646), or an array of such language tags.
         */
        constructor(locales: string|string[]);
        constructor(...args: Object[]) {
            this.isWritable = args[0] === undefined;
            this.locales = <string|string[]> args[0] || "";

            this.resolveFormatInfo(this.locales);
        }

        /**
         * Returns an object that provides formatting services for the `Date` type.
         * @param type A string indicating the type of the custom formatter to return, see [[Utils.Types]].
         */
        public getFormatter(type: string): CustomFormatter {

            if (type !== Utils.Types.Date) {
                throw new Errors.InvalidOperationError("The NumberFormatInfo object supports formatting numeric values only");
            }

            return this.formatter;
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
            this.formatter = undefined;
        }

        private resolveCultureFormatInfo(locales: string|string[]): void {
            throw new Errors.NotImplementedError("resolveCultureFormatInfo");
        }
    }

    DateTimeFormatInfo.InvariantInfo = new DateTimeFormatInfo("");
}
