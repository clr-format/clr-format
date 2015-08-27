/// <reference path="../../../../use-strict" />

/// <reference path="Custom" />

/// <reference path="../../../Utils/Lazy" />
/// <reference path="../../../Utils/Clone" />
/// <reference path="../../../Utils/Function" />

module Format.Globalization.Numeric.Specifiers {
    /**
     * A [Custom Numeric Format String](https://msdn.microsoft.com/en-us/library/0c899ak8.aspx) parser implementation.
     * It does not produce concrete formatting options but does lend its intermediate and final state to visiting instances.
     */
    export class CustomParser {

        private index: number;
        private sections: string[];
        private sectionIndex: number;
        private decimalPointIndex: number;
        private format: string;
        private escapeOne: boolean;
        private escapeMany: boolean;
        private exponentGroups: RegExpExecArray;
        private exponentMatchIndex: number;
        private secondaryExponent: string;
        private firstNumericSpecifierIndex: number;
        private innerNumericSpecifiersIndex: number;
        private lastNumericSpecifierIndex: number;
        private firstZeroSpecifierIndex: number;
        private lastZeroSpecifierIndex: number;
        private lastGroupSeparatorIndex: number;

        private lookahead: Utils.Lazy<CustomParser>;

        // Arrow syntax used to preserve 'this' context inside the function at compile time
        private getLookahead: () => CustomParser = (): CustomParser => {

            let lookahead = this;

            if (this.index < this.format.length - 1) {
                lookahead = Utils.clone(this);
                lookahead.index += 1;
                lookahead.escapeOne = false;
                lookahead.doDetachedParse();
            }

            return lookahead;
        };

        /**
         * Creates an instance that parses the format string when [[doParse]] is called.
         * @param format A format string containing formatting specifications.
         */
        constructor(format: string) {
            this.index = 0;
            this.format = format;
            this.lookahead = new Utils.Lazy(this.getLookahead);
        }

        /**
         * Creates and executes a special detached parser instance that returns only the matched format sections that are separated by [[CustomSpecifiersMap.sectionSeparator]].
         * @param format A format string containing formatting specifications.
         * @returns An array containing separate format sections.
         */
        public static getSections(format: string): string[] {

            let parser = new CustomParser(format);

            parser.sections = ["", "", ""];
            parser.sectionIndex = 0;
            parser.doDetachedParse();

            return parser.sections;
        }

        /** Returns the current character visited by the parser. */
        public getCurrentChar(): string {
            return this.secondaryExponent || this.format[this.index];
        }

        /**
         * Returns the number of [[CustomSpecifiersMap.zeroPlaceholder]] specifiers preceding the [[CustomSpecifiersMap.decimalPoint]].
         * If the [[format]] string contains a [[CustomSpecifiersMap.exponent]] specifier then [[CustomSpecifiersMap.digitPlaceholder]] are counted as well.
         */
        public getDigitsBeforeDecimal(): number {
            return this.exponentMatchIndex >= 0 ?
                this.getNumberPlaceholderCountBeforeDecimal() :
                this.getZeroPlaceholderCountBeforeDecimal();
        }

        /** Returns the number of both [[CustomSpecifiersMap.zeroPlaceholder]] and [[CustomSpecifiersMap.digitPlaceholder]] specifiers after the [[CustomSpecifiersMap.decimalPoint]]. */
        public getNumberPlaceholderCountAfterDecimal(): number {

            if (this.isAfterDecimal()) {
                return this.innerNumericSpecifiersIndex - this.decimalPointIndex;
            }

            return 0;
        }

        /** Returns the number of [[CustomSpecifiersMap.zeroPlaceholder]] specifiers after the [[CustomSpecifiersMap.decimalPoint]]. */
        public getZeroPlaceholderCountAfterDecimal(): number {

            if (this.lastZeroSpecifierIndex >= this.decimalPointIndex) {
                return this.lastZeroSpecifierIndex - this.decimalPointIndex;
            }

            return 0;
        }

        /** Returns the sign character following the [[CustomSpecifiersMap.exponent]] specifier. */
        public getExponentSign(): string {
            return this.exponentGroups[1];
        }

        /** Returns the number of `0` characters following the [[CustomSpecifiersMap.exponent]] specifier. */
        public getExponentPlaceholderCount(): number {
            return Math.min(this.exponentGroups[2].length, 10);
        }

        /**
         * Returns the current index offset from the [[CustomSpecifiersMap.decimalPoint]] specifier, which is considered as the starting index.
         *
         * May require a [[lookahead]] evaluation.
         */
        public getIndexFromDecimal(): number {

            let offset = this.decimalPointIndex;

            if (!this.isAfterDecimal()) {
                let lookahead = this.lookahead.getValue();

                offset = lookahead.decimalPointIndex || (lookahead.innerNumericSpecifiersIndex + 1);

                if (lookahead.lastGroupSeparatorIndex > this.firstNumericSpecifierIndex) {
                    offset += Math.floor((offset - this.innerNumericSpecifiersIndex - 2) / 3);
                }
            }

            return this.innerNumericSpecifiersIndex - offset;
        }

        /** Returns `true` if the parser has already encountered a [[CustomSpecifiersMap.decimalPoint]] specifier; otherwise, `false`. */
        public isAfterDecimal(): boolean {
            return this.decimalPointIndex >= 0;
        }

        /**
         * Returns `true` if the parser is yet to encounter a [[CustomSpecifiersMap.zeroPlaceholder]], [[CustomSpecifiersMap.digitPlaceholder]] or [[CustomSpecifiersMap.decimalPoint]] specifier;
         * otherwise, `false`.
         */
        public isBeforeNumericSpecifiers(): boolean {
            return this.firstNumericSpecifierIndex === undefined;
        }

        /**
         * Returns `true` if the parser can no longer encounter a [[CustomSpecifiersMap.zeroPlaceholder]], [[CustomSpecifiersMap.digitPlaceholder]] or [[CustomSpecifiersMap.decimalPoint]] specifier;
         * otherwise, `false`.
         *
         * Always requires a [[lookahead]] evaluation.
         */
        public isAfterNumericSpecifiers(): boolean {
            return this.index > this.lookahead.getValue().lastNumericSpecifierIndex;
        }

        /**
         * Returns `true` if the current parser position is exactly after the last [[CustomSpecifiersMap.zeroPlaceholder]], [[CustomSpecifiersMap.digitPlaceholder]] or
         * [[CustomSpecifiersMap.decimalPoint]] specifier; otherwise, `false`.
         *
         * Always requires a [[lookahead]] evaluation and internally shifts its state so that the next call to this method can also return `true` if this one did.
         */
        public isImmediateAfterNumericSpecifiers(): boolean {

            let lookahead = this.lookahead.getValue();
            if (lookahead.lastNumericSpecifierIndex + 1 === this.index) {
                lookahead.lastNumericSpecifierIndex += 1;
                return true;
            }

            return false;
        }

        /** Returns `true` if the current parser position is exactly at the first [[CustomSpecifiersMap.exponent]] occurrence; otherwise, `false`. */
        public isExponentMatched(): boolean {
            return this.index === this.exponentMatchIndex;
        }

        /**
         * Returns `true` if the matched [[CustomSpecifiersMap.exponent]] is an uppercase character; otherwise, `false`.
         *
         * Call only when [[isExponentMatched]] returned a `true` value to guarantee correct behavior.
         */
        public isExponentUppercase(): boolean {
            let exponentSpecifier = this.exponentGroups[0][0];
            return exponentSpecifier === exponentSpecifier.toUpperCase();
        }

        /**
         * Parses the [[format]] string this instance was initialized with.
         * The method uses the supplied resolvers map as a means for an outside class to access the intermediate state of the parser each time a specifier is visited.
         * @param resolvers A map between a specifier type and a resolver function that is called after the parser evaluates its intermediate state.
         * @param charResolver A standalone resolver function that is called for every visited character that is not considered a specifier.
         */
        public doParse(resolvers: Specifiers.CustomSpecifiersMap<() => void>, charResolver: () => void): void {

            let handlers = this.getHandlers();

            for (let len = this.format.length; this.index < len; this.index += 1) {
                this.addToSection();
                this.handleSpecifier(handlers, resolvers, charResolver);
                this.addExponentOffset();
            }
        }

        private doDetachedParse(): void {
            this.doParse(undefined, undefined);
        }

        private addToSection(): void {
            if (this.sections && this.sectionIndex < 3 &&
                (this.escapeOne || this.escapeMany ||
                    this.getCurrentChar() !== CustomSpecifiers.sectionSeparator)) {

                this.sections[this.sectionIndex] += this.getCurrentChar();
            }
        }

        private handleSpecifier(handlers: Specifiers.CustomSpecifiersMap<() => void>, resolvers?: Specifiers.CustomSpecifiersMap<() => void>, charResolver?: () => void): void {

            let customSpecifier = CustomSpecifiers[this.getCurrentChar().toUpperCase()],
                resolver = resolvers && resolvers[customSpecifier],
                handler = handlers[customSpecifier];

            if (this.canHandleSpecifier(handler)) {
                handler();

                if (resolver) {
                    resolver();
                }
            }
            else {
                if (charResolver) {
                    charResolver();
                }

                this.escapeOne = false;
            }
        }

        private canHandleSpecifier(handler: () => void): boolean {
            return !this.escapeOne
                && (handler &&
                    !(this.escapeMany &&
                        this.getCurrentChar() !== CustomSpecifiers.literalStringDelimeterSingle &&
                        this.getCurrentChar() !== CustomSpecifiers.literalStringDelimeterDouble));
        }

        private addExponentOffset(): void {
            if (this.isExponentMatched()) {
                this.index += this.exponentGroups[0].length - 1;
            }
            else if (this.secondaryExponent) {
                this.index += this.secondaryExponent.length - 1;
                delete this.secondaryExponent;
            }
        }

        private handleNumericSpecifier(): void {

            this.lastNumericSpecifierIndex = this.index;

            if (this.firstNumericSpecifierIndex === undefined) {
                this.firstNumericSpecifierIndex = this.index;
                this.innerNumericSpecifiersIndex = 0;
            }
            else {
                this.innerNumericSpecifiersIndex += 1;
            }
        }

        private handleLiteralStringDelimeter(): void {
            this.escapeMany = !this.escapeMany;
        }

        private getExponentGroups(): RegExpExecArray {

            if (!this.lookahead.isValueCreated()) {
                return this.matchExponent();
            }

            let lookahead = this.lookahead.getValue();
            if (lookahead.exponentMatchIndex === this.index) {
                return lookahead.exponentGroups;
            }
        }

        private matchExponent(): RegExpExecArray {
            return CustomExponentRexExp.exec(this.format.substring(this.index));
        }

        private getNumberPlaceholderCountBeforeDecimal(): number {

            if (!this.isAfterDecimal()) {
                return this.innerNumericSpecifiersIndex + 1;
            }

            if (this.decimalPointIndex > 0) {
                return this.decimalPointIndex;
            }
        }

        private getZeroPlaceholderCountBeforeDecimal(): number {
            let numberPlaceholderCountBeforeDecimal = this.getNumberPlaceholderCountBeforeDecimal();
            if (numberPlaceholderCountBeforeDecimal > this.firstZeroSpecifierIndex) {
                return numberPlaceholderCountBeforeDecimal - this.firstZeroSpecifierIndex;
            }
        }

        private getHandlers(): Specifiers.CustomSpecifiersMap<() => void> {
            return {
                zeroPlaceholder: (): void => {
                    this.handleNumericSpecifier();
                    this.lastZeroSpecifierIndex = this.innerNumericSpecifiersIndex;
                    if (this.firstZeroSpecifierIndex === undefined) {
                        this.firstZeroSpecifierIndex = this.innerNumericSpecifiersIndex;
                    }
                },

                digitPlaceholder: (): void => {
                    this.handleNumericSpecifier();
                },

                decimalPoint: (): void => {
                    this.handleNumericSpecifier();
                    if (this.decimalPointIndex === undefined) {
                        this.decimalPointIndex = this.innerNumericSpecifiersIndex;
                    }
                },

                groupSeparatorOrNumberScaling: (): void => {
                    if (!this.isAfterDecimal()) {
                        this.lastGroupSeparatorIndex = this.index;
                    }
                },

                exponent: (): void => {
                    if (!this.exponentGroups) {
                        let exponentGroups = this.getExponentGroups();
                        if (exponentGroups) {
                            this.exponentGroups = exponentGroups;
                            this.exponentMatchIndex = this.index;
                        }
                    }
                    else {
                        let secondaryExponent = this.matchExponent();
                        if (secondaryExponent) {
                            this.secondaryExponent = secondaryExponent[0];
                        }
                    }
                },

                escapeChar: (): void => {
                    this.escapeOne = true;
                },

                literalStringDelimeterSingle: (): void => {
                    this.handleLiteralStringDelimeter();
                },

                literalStringDelimeterDouble: (): void => {
                    this.handleLiteralStringDelimeter();
                },

                sectionSeparator: (): void => {
                    this.sectionIndex += 1;
                },

                percentagePlaceholder: Utils.Function.getEmpty(),
                perMillePlaceholder: Utils.Function.getEmpty()
            };
        }
    }
}
