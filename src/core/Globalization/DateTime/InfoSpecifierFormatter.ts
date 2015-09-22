/// <reference path="../../../use-strict" />

/// <reference path="Specifiers/Custom" />

/// <reference path="../CustomFormatter" />
/// <reference path="../DateTimeFormatInfo" />

/// <reference path="../../Utils/Padding" />

/// <reference path="../../Errors/FormatError" />
/// <reference path="../../Errors/ArgumentNullError" />

namespace Format.Globalization.DateTime {

    /** A [[CustomFormatter]] implementation that replaces [Custom Date and Time Format Specifiers](https://msdn.microsoft.com/library/8kb3ddd4.aspx) with their culture information values. */
    export class InfoSpecifierFormatter implements CustomFormatter {

        private value_: Date;
        private formatInfo_: DateTimeFormatInfo;

        /**
         * Creates an instance that uses the resolved options from the specified options provider and applies culture-specific formatting based on the given format info.
         * @param formatInfo An instance that provides culture-specific date and time format information.
         */
        constructor(formatInfo: DateTimeFormatInfo) {

            if (formatInfo == null) {
                throw new Errors.ArgumentNullError("formatInfo");
            }

            this.formatInfo_ = formatInfo;
        }

        /**
         * Converts the date to an equivalent string representation by replacing the custom date and time specifiers.
         * @param format A format string represented by [Custom Date and Time Format Specifiers](https://msdn.microsoft.com/library/8kb3ddd4.aspx).
         * @param value The date to format.
         * @returns The formatted date value.
         */
        public format(format: string, value: Date): string {

            this.value_ = value;

            return format.replace(Specifiers.CustomSpecifiersRegExp, this.formatSpecifier_);
        }

        /* tslint:disable:member-ordering */

        // Arrow syntax used to preserve 'this' context inside the function at compile time
        private formatSpecifier_: (specifierMatch: string) => string = (specifierMatch: string): string =>
            this.formatters[customSpecifiers[specifierMatch[0]]](specifierMatch.length, specifierMatch) + "";

        protected formatters: Specifiers.CustomSpecifiersMap<(matchLength?: number, specifierMatch?: string) => Object> = {

            /** See: https://msdn.microsoft.com/library/8kb3ddd4.aspx#dSpecifier */
            dayPlaceholder: (specifierCount: number): Object => {
                switch (specifierCount) {
                    case 1: case 2: return pad(this.value_.getDate(), specifierCount);
                    case 3: return this.formatInfo_.AbbreviatedDayNames[this.value_.getDay()];
                    default: return this.formatInfo_.DayNames[this.value_.getDay()];
                }
            },

            /** See: https://msdn.microsoft.com/library/8kb3ddd4.aspx#fSpecifier */
            digitSubSecondPlaceholder: (specifierCount: number): Object => {
                let subSecond = this.getSubSecond_(specifierCount, customSpecifiers.digitSubSecondPlaceholder);
                return subSecond ? pad(subSecond, specifierCount) : "";
            },

            /** See: https://msdn.microsoft.com/library/8kb3ddd4.aspx#F_Specifier */
            zeroSubSecondPlaceholder: (specifierCount: number): Object => {
                return pad(
                    this.getSubSecond_(specifierCount, customSpecifiers.zeroSubSecondPlaceholder),
                    specifierCount);
            },

            /** See: https://msdn.microsoft.com/library/8kb3ddd4.aspx#gSpecifier */
            eraPlaceholder: (specifierCount: number): Object =>
                this.value_.getFullYear() < 0 ? "B.C." : "A.D.",

            /** See: https://msdn.microsoft.com/library/8kb3ddd4.aspx#hSpecifier */
            hour12Placeholder: (specifierCount: number): Object =>
                pad2(this.value_.getHours() % 12 || 12, specifierCount),

            /** See: https://msdn.microsoft.com/library/8kb3ddd4.aspx#H_Specifier */
            hour24Placeholdr: (specifierCount: number): Object =>
                pad2(this.value_.getHours(), specifierCount),

            /** See: https://msdn.microsoft.com/library/8kb3ddd4.aspx#KSpecifier */
            timeZonePlaceholder: (): Object =>
                `${ this.getHoursOffset_() }:${ pad2(Math.abs(this.value_.getTimezoneOffset() % 60)) }`,

            /** See: https://msdn.microsoft.com/library/8kb3ddd4.aspx#mSpecifier */
            minutePlaceholder: (specifierCount: number): Object =>
                pad2(this.value_.getMinutes(), specifierCount),

            /** See: https://msdn.microsoft.com/library/8kb3ddd4.aspx#M_Specifier */
            monthPlaceholder: (specifierCount: number): Object => {
                switch (specifierCount) {
                    case 1: case 2: return pad(this.value_.getMonth() + 1, specifierCount);
                    case 3: return this.formatInfo_.AbbreviatedMonthNames[this.value_.getMonth()];
                    default: return this.formatInfo_.MonthNames[this.value_.getMonth()];
                }
            },

            /** See: https://msdn.microsoft.com/library/8kb3ddd4.aspx#sSpecifier */
            secondPlaceholder: (specifierCount: number): Object =>
                pad2(this.value_.getSeconds(), specifierCount),

            /** See: https://msdn.microsoft.com/library/8kb3ddd4.aspx#tSpecifier */
            amPmPlaceholder: (specifierCount: number): Object => (
                this.value_.getHours() < 12 ?
                    this.formatInfo_.AMDesignator :
                    this.formatInfo_.PMDesignator
                ).substring(0, specifierCount),

            /** See: https://msdn.microsoft.com/library/8kb3ddd4.aspx#ySpecifier */
            yearPlaceholder: (specifierCount: number): Object => {
                let year = this.value_.getFullYear();
                if (specifierCount <= 2) {
                    year %= 100;
                }
                return pad(year, specifierCount);
            },

            /** See: https://msdn.microsoft.com/library/8kb3ddd4.aspx#zSpecifier */
            hoursOffsetPlaceholder: (specifierCount: number): Object => {
                switch (specifierCount) {
                    case 1: case 2: return this.getHoursOffset_(specifierCount);
                    default: return this.formatters.timeZonePlaceholder();
                }
            },

            /** See: https://msdn.microsoft.com/library/8kb3ddd4.aspx#timeSeparator */
            timeSeparator: (): Object => this.formatInfo_.TimeSeparator,

            /** See: https://msdn.microsoft.com/library/8kb3ddd4.aspx#dateSeparator */
            dateSeparator: (): Object => this.formatInfo_.DateSeparator,

            /** Indicates that the enclosed characters should be copied to the result string unchanged. */
            literalStringDelimeterSingle: (matchLength: number, specifierMatch: string): Object => {
                if (matchLength === 1) {
                    throw new Errors.FormatError(`Cannot find a matching quote character for the character '${specifierMatch}'`);
                }
                return specifierMatch.substring(1, matchLength - 1);
            },

            /** Indicates that the enclosed characters should be copied to the result string unchanged. */
            literalStringDelimeterDouble: (matchLength: number, specifierMatch: string): Object =>
                this.formatters.literalStringDelimeterSingle(matchLength, specifierMatch),

            /** See: https://msdn.microsoft.com/library/8kb3ddd4.aspx#UsingSingleSpecifiers */
            singleCharFormatSpecifier: (matchLength: number, specifierMatch: string): Object => {
                let specifier = specifierMatch[1];
                if (specifier === customSpecifiers.singleCharFormatSpecifier) {
                    throw new Errors.FormatError(`Specifier combination '${specifier}${specifier}' is not valid`);
                }
                return customSpecifiers[specifier] ? this.formatSpecifier_(specifier) : specifier;
            },

            /** Indicates that the next character to be interpreted as a literal rather than as a custom format specifier. */
            escapeChar: (matchLength: number, specifierMatch: string): Object => specifierMatch[1]
        };

        /* tslint:enable:member-ordering */

        private getSubSecond_(precision: number, subSecondPlaceholder: string): number {

            let maxPrecision = Specifiers.MaxSubSecondPrecision;

            if (precision > maxPrecision) {
                throw new Errors.FormatError(
                    `Date and time format specifier '${subSecondPlaceholder}' cannot be used more than ${maxPrecision} times`);
            }

            return Math.floor(
                this.value_.getMilliseconds() /
                Math.pow(10, maxPrecision - precision));
        }

        private getHoursOffset_(totalWidth: number = 2): string {
            return innerComponentFormat(
                `+${ pad(0, totalWidth) };-${ pad(0, totalWidth) }`,
                Math.floor(-this.value_.getTimezoneOffset() / 60));
        }
    }

    /** @private */
    var padding = Utils.Padding,
        pad = (value: number, totalWidth: number) => padding.pad(value + "", { totalWidth, paddingChar: "0", direction: padding.Direction.Left }),
        pad2 = (value: number, totalWidth: number = 2) => pad(value, Math.min(totalWidth, 2)),
        customSpecifiers = Specifiers.Custom;
}
