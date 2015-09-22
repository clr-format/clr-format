/// <reference path="../../../../use-strict" />

/// <reference path="Custom" />

/// <reference path="../../../Utils/Lazy" />
/// <reference path="../../../Utils/Clone" />
/// <reference path="../../../Utils/Function" />

/// <reference path="../../../Errors/ArgumentNullError" />

namespace Format.Globalization.Numeric.Specifiers {
    /**
     * A [Custom Numeric Format String](https://msdn.microsoft.com/library/0c899ak8.aspx) parser implementation.
     * It does not produce concrete formatting options but does lend its intermediate and final state to visiting instances.
     */
    export class CustomParser {

        private index_: number;
        private format_: string;
        private sections_: string[];
        private escapeOne_: boolean;
        private sectionIndex_: number;
        private escapeManyChar_: string;
        private secondaryExponent_: string;
        private decimalPointIndex_: number;
        private exponentMatchIndex_: number;
        private exponentGroups_: RegExpExecArray;
        private firstNumericSpecifierIndex_: number;
        private innerNumericSpecifiersIndex_: number;
        private lastNumericSpecifierIndex_: number;
        private firstZeroSpecifierIndex_: number;
        private lastZeroSpecifierIndex_: number;
        private lastGroupSeparatorIndex_: number;

        private lookahead_: Utils.Lazy<CustomParser>;

        // Arrow syntax used to preserve 'this' context inside the function at compile time
        private getLookahead_: () => CustomParser = (): CustomParser => {

            let lookahead = this;

            if (this.index_ < this.format_.length - 1) {
                lookahead = Utils.clone(this);
                lookahead.index_ += 1;
                lookahead.escapeOne_ = false;
                lookahead.doDetachedParse_();
            }

            return lookahead;
        };

        /**
         * Creates an instance that parses the format string when [[doParse]] is called.
         * @param format A format string containing formatting specifications.
         */
        constructor(format: string) {

            if (format == null) {
                throw new Errors.ArgumentNullError("format");
            }

            this.index_ = 0;
            this.format_ = format;
            this.lookahead_ = new Utils.Lazy(this.getLookahead_);
        }

        /**
         * Creates and executes a special detached parser instance that returns only the matched format sections that are separated by [[CustomSpecifiersMap.sectionSeparator]].
         * @param format A format string containing formatting specifications.
         * @returns An array containing separate format sections.
         */
        public static getSections(format: string): string[] {

            let parser = new CustomParser(format);

            parser.sections_ = ["", "", ""];
            parser.sectionIndex_ = 0;
            parser.doDetachedParse_();

            return parser.sections_;
        }

        /** Returns the current character visited by the parser. */
        public getCurrentChar(): string {
            return this.secondaryExponent_ || this.format_[this.index_];
        }

        /**
         * Returns the number of [[CustomSpecifiersMap.zeroPlaceholder]] specifiers preceding the [[CustomSpecifiersMap.decimalPoint]].
         * If the [[format]] string contains a [[CustomSpecifiersMap.exponent]] specifier then [[CustomSpecifiersMap.digitPlaceholder]] are counted as well.
         */
        public getDigitsBeforeDecimal(): number {
            return this.exponentMatchIndex_ >= 0 ?
                this.getNumberPlaceholderCountBeforeDecimal_() :
                this.getZeroPlaceholderCountBeforeDecimal_();
        }

        /** Returns the number of both [[CustomSpecifiersMap.zeroPlaceholder]] and [[CustomSpecifiersMap.digitPlaceholder]] specifiers after the [[CustomSpecifiersMap.decimalPoint]]. */
        public getNumberPlaceholderCountAfterDecimal(): number {

            if (this.isAfterDecimal()) {
                return this.innerNumericSpecifiersIndex_ - this.decimalPointIndex_;
            }

            return 0;
        }

        /** Returns the number of [[CustomSpecifiersMap.zeroPlaceholder]] specifiers after the [[CustomSpecifiersMap.decimalPoint]]. */
        public getZeroPlaceholderCountAfterDecimal(): number {

            if (this.lastZeroSpecifierIndex_ >= this.decimalPointIndex_) {
                return this.lastZeroSpecifierIndex_ - this.decimalPointIndex_;
            }

            return 0;
        }

        /** Returns the sign character following the [[CustomSpecifiersMap.exponent]] specifier. */
        public getExponentSign(): string {
            return this.exponentGroups_[1];
        }

        /** Returns the number of `0` characters following the [[CustomSpecifiersMap.exponent]] specifier. */
        public getExponentPlaceholderCount(): number {
            return Math.min(this.exponentGroups_[2].length, 10);
        }

        /**
         * Returns the current index offset from the [[CustomSpecifiersMap.decimalPoint]] specifier, which is considered as the starting index.
         *
         * May require a [[lookahead]] evaluation.
         */
        public getIndexFromDecimal(): number {

            let offset = this.decimalPointIndex_;

            if (!this.isAfterDecimal()) {
                let lookahead = this.lookahead_.getValue();

                offset = lookahead.decimalPointIndex_ || (lookahead.innerNumericSpecifiersIndex_ + 1);

                if (lookahead.lastGroupSeparatorIndex_ > this.firstNumericSpecifierIndex_) {
                    offset += Math.floor((offset - this.innerNumericSpecifiersIndex_ - 2) / 3);
                }
            }

            return this.innerNumericSpecifiersIndex_ - offset;
        }

        /** Returns `true` if the parser has already encountered a [[CustomSpecifiersMap.decimalPoint]] specifier; otherwise, `false`. */
        public isAfterDecimal(): boolean {
            return this.decimalPointIndex_ >= 0;
        }

        /**
         * Returns `true` if the parser is yet to encounter a [[CustomSpecifiersMap.zeroPlaceholder]], [[CustomSpecifiersMap.digitPlaceholder]] or [[CustomSpecifiersMap.decimalPoint]] specifier;
         * otherwise, `false`.
         */
        public isBeforeNumericSpecifiers(): boolean {
            return this.firstNumericSpecifierIndex_ === undefined;
        }

        /**
         * Returns `true` if the parser can no longer encounter a [[CustomSpecifiersMap.zeroPlaceholder]], [[CustomSpecifiersMap.digitPlaceholder]] or [[CustomSpecifiersMap.decimalPoint]] specifier;
         * otherwise, `false`.
         *
         * Always requires a [[lookahead]] evaluation.
         */
        public isAfterNumericSpecifiers(): boolean {
            return this.index_ > this.lookahead_.getValue().lastNumericSpecifierIndex_;
        }

        /**
         * Returns `true` if the current parser position is exactly after the last [[CustomSpecifiersMap.zeroPlaceholder]], [[CustomSpecifiersMap.digitPlaceholder]] or
         * [[CustomSpecifiersMap.decimalPoint]] specifier; otherwise, `false`.
         *
         * Always requires a [[lookahead]] evaluation and internally shifts its state so that the next call to this method can also return `true` if this one did.
         */
        public isImmediateAfterNumericSpecifiers(): boolean {

            let lookahead = this.lookahead_.getValue();
            if (lookahead.lastNumericSpecifierIndex_ + 1 === this.index_) {
                lookahead.lastNumericSpecifierIndex_ += 1;
                return true;
            }

            return false;
        }

        /** Returns `true` if the current parser position is exactly at the first [[CustomSpecifiersMap.exponent]] occurrence; otherwise, `false`. */
        public isExponentMatched(): boolean {
            return this.index_ === this.exponentMatchIndex_;
        }

        /**
         * Returns `true` if the matched [[CustomSpecifiersMap.exponent]] is an uppercase character; otherwise, `false`.
         *
         * Call only when [[isExponentMatched]] returned a `true` value to guarantee correct behavior.
         */
        public isExponentUppercase(): boolean {
            let exponentSpecifier = this.exponentGroups_[0][0];
            return exponentSpecifier === exponentSpecifier.toUpperCase();
        }

        /**
         * Parses the [[format]] string this instance was initialized with.
         * The method uses the supplied resolvers map as a means for an outside class to access the intermediate state of the parser each time a specifier is visited.
         * @param resolvers A map between a specifier type and a resolver function that is called after the parser evaluates its intermediate state.
         * @param charResolver A standalone resolver function that is called for every visited character that is not considered a specifier.
         */
        public doParse(resolvers: Specifiers.CustomSpecifiersMap<() => void>, charResolver: () => void): void {

            let handlers = this.getHandlers_();

            for (let len = this.format_.length; this.index_ < len; this.index_ += 1) {
                this.addToSection_();
                this.handleSpecifier_(handlers, resolvers, charResolver);
                this.addExponentOffset_();
            }
        }

        private doDetachedParse_(): void {
            this.doParse(undefined, undefined);
        }

        private addToSection_(): void {
            if (this.sections_ && this.sectionIndex_ < 3 &&
                (this.escapeOne_ || this.escapeManyChar_ ||
                    this.getCurrentChar() !== Specifiers.Custom.sectionSeparator)) {

                this.sections_[this.sectionIndex_] += this.getCurrentChar();
            }
        }

        private handleSpecifier_(handlers: Specifiers.CustomSpecifiersMap<() => void>, resolvers?: Specifiers.CustomSpecifiersMap<() => void>, charResolver?: () => void): void {

            let customSpecifier = Specifiers.Custom[this.getCurrentChar().toUpperCase()],
                resolver = resolvers && resolvers[customSpecifier],
                handler = handlers[customSpecifier];

            if (this.canHandleSpecifier_(handler)) {
                handler();

                if (resolver) {
                    resolver();
                }
            }
            else {
                if (charResolver) {
                    charResolver();
                }

                this.escapeOne_ = false;
            }
        }

        private canHandleSpecifier_(handler: () => void): boolean {
            return !this.escapeOne_
                && (handler &&
                    !(this.escapeManyChar_ && this.getCurrentChar() !== this.escapeManyChar_));
        }

        private addExponentOffset_(): void {
            if (this.isExponentMatched()) {
                this.index_ += this.exponentGroups_[0].length - 1;
            }
            else if (this.secondaryExponent_) {
                this.index_ += this.secondaryExponent_.length - 1;
                delete this.secondaryExponent_;
            }
        }

        private handleNumericSpecifier_(): void {

            this.lastNumericSpecifierIndex_ = this.index_;

            if (this.firstNumericSpecifierIndex_ === undefined) {
                this.firstNumericSpecifierIndex_ = this.index_;
                this.innerNumericSpecifiersIndex_ = 0;
            }
            else {
                this.innerNumericSpecifiersIndex_ += 1;
            }
        }

        private handleLiteralStringDelimeter_(): void {
            let currentChar = this.getCurrentChar();
            this.escapeManyChar_ = this.escapeManyChar_ !== currentChar ? currentChar : undefined;
        }

        private getExponentGroups_(): RegExpExecArray {

            if (!this.lookahead_.isValueCreated()) {
                return this.matchExponent_();
            }

            let lookahead = this.lookahead_.getValue();
            if (lookahead.exponentMatchIndex_ === this.index_) {
                return lookahead.exponentGroups_;
            }
        }

        private matchExponent_(): RegExpExecArray {
            return CustomExponentRexExp.exec(this.format_.substring(this.index_));
        }

        private getNumberPlaceholderCountBeforeDecimal_(): number {

            if (!this.isAfterDecimal()) {
                return this.innerNumericSpecifiersIndex_ + 1;
            }

            if (this.decimalPointIndex_ > 0) {
                return this.decimalPointIndex_;
            }
        }

        private getZeroPlaceholderCountBeforeDecimal_(): number {
            let numberPlaceholderCountBeforeDecimal = this.getNumberPlaceholderCountBeforeDecimal_();
            if (numberPlaceholderCountBeforeDecimal > this.firstZeroSpecifierIndex_) {
                return numberPlaceholderCountBeforeDecimal - this.firstZeroSpecifierIndex_;
            }
        }

        private getHandlers_(): Specifiers.CustomSpecifiersMap<() => void> {
            return {
                zeroPlaceholder: (): void => {
                    this.handleNumericSpecifier_();
                    this.lastZeroSpecifierIndex_ = this.innerNumericSpecifiersIndex_;
                    if (this.firstZeroSpecifierIndex_ === undefined) {
                        this.firstZeroSpecifierIndex_ = this.innerNumericSpecifiersIndex_;
                    }
                },

                digitPlaceholder: (): void => {
                    this.handleNumericSpecifier_();
                },

                decimalPoint: (): void => {
                    this.handleNumericSpecifier_();
                    if (this.decimalPointIndex_ === undefined) {
                        this.decimalPointIndex_ = this.innerNumericSpecifiersIndex_;
                    }
                },

                groupSeparatorOrNumberScaling: (): void => {
                    if (!this.isAfterDecimal()) {
                        this.lastGroupSeparatorIndex_ = this.index_;
                    }
                },

                exponent: (): void => {
                    if (!this.exponentGroups_) {
                        let exponentGroups = this.getExponentGroups_();
                        if (exponentGroups) {
                            this.exponentGroups_ = exponentGroups;
                            this.exponentMatchIndex_ = this.index_;
                        }
                    }
                    else {
                        let secondaryExponent = this.matchExponent_();
                        if (secondaryExponent) {
                            this.secondaryExponent_ = secondaryExponent[0];
                        }
                    }
                },

                escapeChar: (): void => {
                    this.escapeOne_ = true;
                },

                literalStringDelimeterSingle: (): void => {
                    this.handleLiteralStringDelimeter_();
                },

                literalStringDelimeterDouble: (): void => {
                    this.handleLiteralStringDelimeter_();
                },

                sectionSeparator: (): void => {
                    this.sectionIndex_ += 1;
                },

                percentagePlaceholder: empty,
                perMillePlaceholder: empty
            };
        }
    }

    /** @private */
    var empty = Utils.Function.getEmpty();
}
