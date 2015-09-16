!function(Format) {
    "use strict";
    var __extends;
    if ("undefined" === typeof Format || "undefined" === typeof Format.innerFormat) {
        throw new Error("Intl module loaded before main module");
    }
    if ("undefined" === typeof Intl || "undefined" === typeof Intl.NumberFormat) {
        throw new Format.Errors.InvalidOperationError("Intl.NumberFormat is not supported by the executing context");
    }
    (function(Format) {
        var Utils;
        (function(Utils) {
            var IntlResovlers;
            (function(IntlResovlers) {
                /**
                 * Sets resolved number format info options to the formatInfo instance.
                 * @param formatInfo An instance that will provide culture-specific number format information.
                 * @param numberSampler An Intl.NumberFormat instance that is set to sample decimal styled numbers.
                 * @param currencySampler An Intl.NumberFormat instance that is set to sample currency styled numbers.
                 */
                function setNumberFormatInfo(formatInfo, decimalSampler, currencySampler) {
                    var sampleValue = 1.2, groupValue = -123456, decimalOptions = decimalSampler.resolvedOptions(), decimalNegativeSample = decimalSampler.format(-sampleValue), currencySample = currencySampler.format(sampleValue);
                    formatInfo.NegativeSign = decimalNegativeSample[0];
                    formatInfo.NumberGroupSeparator = decimalSampler.format(groupValue)[4];
                    formatInfo.NumberDecimalSeparator = getFirstNonDigit(decimalNegativeSample, 1);
                    formatInfo.NumberDecimalDigits = decimalOptions.minimumFractionDigits || decimalOptions.maximumFractionDigits;
                    formatInfo.CurrencyGroupSeparator = getFirstNonDigit(currencySampler.format(groupValue), 4);
                    formatInfo.CurrencyDecimalSeparator = getFirstNonDigit(currencySample, 1);
                }
                /**
                 * Returns the currency decimal digits defined in the currenty format info instance or the one that matches the curreny currency.
                 * @param formatInfo An instance that provides culture-specific number format information.
                 * @param currencyCode The currency code.
                 */
                function getCurrencyDecimalDigits(formatInfo, currencyCode) {
                    if (null != formatInfo.CurrencyDecimalDigits) {
                        return formatInfo.CurrencyDecimalDigits;
                    }
                    var currencyDecimalDigits = nonStandardCurrencyDecimalDigits[currencyCode];
                    if (void 0 !== currencyDecimalDigits) {
                        return currencyDecimalDigits;
                    } else {
                        return 2;
                    }
                }
                /**
                 * Returns a culture-variant version of the given invariantly formatted string. Matches decimal separators and negative signs for the callback.
                 * @param invariantlyFormattedString An invariantly formatted string to replace with culture-specific symbols.
                 * @param replaceInvariantSymbolsCallback A function that handles the symbol replacement.
                 */
                function applyNumberCultureFormatting(invariantlyFormattedString, replaceInvariantSymbolsCallback) {
                    return invariantlyFormattedString.replace(partialNumberFormatReplacementsRexExp, replaceInvariantSymbolsCallback);
                }
                var nonDigitSymbolRegExp, getFirstNonDigit, nonStandardCurrencyDecimalDigits, partialNumberFormatReplacementsRexExp;
                IntlResovlers.setNumberFormatInfo = setNumberFormatInfo;
                /** @private */
                nonDigitSymbolRegExp = /[^\d]/;
                /** @private */
                getFirstNonDigit = function(sample, offset) {
                    return sample.substring(offset).match(nonDigitSymbolRegExp)[0];
                };
                IntlResovlers.getCurrencyDecimalDigits = getCurrencyDecimalDigits;
                /** @private */
                nonStandardCurrencyDecimalDigits = {
                    ADP: 0,
                    AFA: 0,
                    BEF: 0,
                    BHD: 3,
                    BIF: 0,
                    BYB: 0,
                    BYR: 0,
                    CLP: 0,
                    CLF: 4,
                    COP: 0,
                    DJF: 0,
                    ECS: 0,
                    ESP: 0,
                    GNF: 0,
                    GRD: 0,
                    HUF: 0,
                    IDR: 0,
                    IQD: 3,
                    ITL: 0,
                    JOD: 3,
                    JPY: 0,
                    KMF: 0,
                    KRW: 0,
                    KWD: 3,
                    LAK: 0,
                    LUF: 0,
                    LYD: 3,
                    MGF: 0,
                    MZM: 0,
                    OMR: 3,
                    PTE: 0,
                    PYG: 0,
                    ROL: 0,
                    RWF: 0,
                    TJR: 0,
                    TMM: 0,
                    TND: 3,
                    TPE: 0,
                    TRL: 0,
                    TWD: 0,
                    UGX: 0,
                    VND: 0,
                    VUV: 0,
                    XAF: 0,
                    XOF: 0,
                    XPF: 0
                };
                IntlResovlers.applyNumberCultureFormatting = applyNumberCultureFormatting;
                /** @private */
                partialNumberFormatReplacementsRexExp = /[-.]/g;
            })(IntlResovlers = Utils.IntlResovlers || (Utils.IntlResovlers = {}));
        })(Utils = Format.Utils || (Format.Utils = {}));
    })(Format || (Format = {}));
    __extends = this && this.__extends || function(d, b) {
        function __() {
            this.constructor = d;
        }
        for (var p in b) {
            if (b.hasOwnProperty(p)) {
                d[p] = b[p];
            }
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var Numeric;
            (function(Numeric) {
                var styles = Numeric.Specifiers.StandardSpecifiers, IntlFormatter = function(_super) {
                    /**
                     * Initializes a new object that enables language sensitive number formatting.
                     * @param locales The locales argument must be either a string holding a BCP 47 language tag, or an array of such language tags.
                     * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
                     * @param formatInfo An instance that will provide culture-specific number format information.
                     * @param numberOptions An object with some or all of the standardized properties.
                     * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
                     */
                    function IntlFormatter(locales, formatInfo, numberOptions) {
                        var _this = this;
                        _super.call(this, Numeric.IntlOptionsProvider, numberOptions);
                        /** Possible values are:
                         * - "decimal" for plain number formatting (acts as override for "fixed-point", "number" or "undefined");
                         * - "currency" for currency formatting;
                         * - "percent" for percent formatting;
                         */
                        this.supportedStyles = {
                            currency: true,
                            decimal: true,
                            percent: true,
                            fixedPoint: styles[styles.decimal],
                            undefined: styles[styles.decimal],
                            number: styles[styles.decimal],
                            exponential: false,
                            roundTrip: false,
                            general: false,
                            hex: false
                        };
                        // Arrow syntax used to preserve 'this' context inside the function at compile time
                        this.replaceInvariantSymbols = function(replaceChar) {
                            var invariantFormatInfo = _super.prototype.getFormatInfo.call(_this);
                            if (replaceChar === invariantFormatInfo.NegativeSign) {
                                return _this.getFormatInfo().NegativeSign;
                            }
                            if (replaceChar === _this.decorationFormatter.getDecimalSeparator(invariantFormatInfo)) {
                                return _this.decorationFormatter.getDecimalSeparator();
                            } else {
                                return replaceChar;
                            }
                        };
                        this.locales = locales;
                        this.formatInfo = formatInfo;
                        this.setResolvedFormatInfo(formatInfo);
                    }
                    __extends(IntlFormatter, _super);
                    /**
                     * Converts the number to an equivalent string representation using specified format and invariant culture formatting information.
                     * @param format A format string containing formatting specifications.
                     * @param value The number to format.
                     * @returns The formatted numeric value.
                     */
                    IntlFormatter.prototype.format = function(formatString, value) {
                        return _super.prototype.format.call(this, formatString, value);
                    };
                    /**
                     * Applies all resolved format options to the number.
                     * @param value The number to format.
                     * @returns A resulting format value with applied format and culture-specific options.
                     */
                    IntlFormatter.prototype.applyOptions = function(value) {
                        var formattedValue, supportedStyle = this.supportedStyles[this.resolvedOptions.style];
                        if (supportedStyle) {
                            this.overrideOptions(supportedStyle);
                            formattedValue = this.getNativeFormatter(this.resolvedOptions).format(value);
                        } else {
                            formattedValue = _super.prototype.applyOptions.call(this, value);
                            formattedValue = this.applyCultureSpecificFormatting(formattedValue);
                        }
                        return formattedValue;
                    };
                    /** Returns the format info instance used for culture-specific formatting. */
                    IntlFormatter.prototype.getFormatInfo = function() {
                        return this.formatInfo;
                    };
                    IntlFormatter.prototype.setResolvedFormatInfo = function(formatInfo) {
                        Format.Utils.IntlResovlers.setNumberFormatInfo(this.formatInfo, this.getNativeFormatter({
                            style: styles[styles.decimal]
                        }), this.getNativeFormatter({
                            style: styles[styles.currency],
                            currency: "USD",
                            useGrouping: true
                        }));
                    };
                    IntlFormatter.prototype.overrideOptions = function(overrideStyle) {
                        this.overrideCurrencyOptions();
                        this.overrideDecimalOptions();
                        if ("string" === typeof overrideStyle) {
                            this.resolvedOptions.style = overrideStyle;
                        }
                        if (null == this.resolvedOptions.useGrouping) {
                            this.resolvedOptions.useGrouping = false;
                        }
                    };
                    IntlFormatter.prototype.overrideCurrencyOptions = function() {
                        if (this.resolvedOptions.style === styles[styles.currency]) {
                            var currencyCode = Globalization.NumberFormatInfo.CurrentCurrency;
                            if (currencyCode) {
                                this.resolvedOptions.currency = currencyCode;
                                this.overrideFractionDigits(Format.Utils.IntlResovlers.getCurrencyDecimalDigits(this.formatInfo, currencyCode));
                            } else {
                                throw new Format.Errors.InvalidOperationError("No currency was set (use the Format.setCurrency method to do so)");
                            }
                        }
                    };
                    IntlFormatter.prototype.overrideDecimalOptions = function() {
                        if (this.resolvedOptions.style === styles[styles.fixedPoint] || this.resolvedOptions.style === styles[styles.percent] || this.resolvedOptions.style === styles[styles.number]) {
                            this.overrideFractionDigits(this.formatInfo.NumberDecimalDigits);
                        }
                    };
                    IntlFormatter.prototype.overrideFractionDigits = function(overrideValue) {
                        if (null == this.resolvedOptions.minimumFractionDigits && null == this.resolvedOptions.maximumFractionDigits) {
                            this.resolvedOptions.minimumFractionDigits = overrideValue;
                            this.resolvedOptions.maximumFractionDigits = overrideValue;
                        }
                    };
                    IntlFormatter.prototype.getNativeFormatter = function(resolvedOptions) {
                        return new Intl.NumberFormat(this.locales, resolvedOptions);
                    };
                    IntlFormatter.prototype.applyCultureSpecificFormatting = function(invariantlyFormattedString) {
                        if (this.resolvedOptions.style === styles[styles.hex]) {
                            return invariantlyFormattedString;
                        } else {
                            return Format.Utils.IntlResovlers.applyNumberCultureFormatting(invariantlyFormattedString, this.replaceInvariantSymbols);
                        }
                    };
                    return IntlFormatter;
                }(Numeric.InvariantFormatter);
                Numeric.IntlFormatter = IntlFormatter;
                Globalization.NumberFormatInfo.FormatterConstructor = IntlFormatter;
            })(Numeric = Globalization.Numeric || (Globalization.Numeric = {}));
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var DateTime;
            (function(DateTime) {
                /**
                 * Provides culture-specific formatting for date and time values by using the Intl namespace.
                 *
                 * Requires the *clr-format-intl.js* sub-module to be loaded.
                 */
                var IntlFormatter = function(_super) {
                    /**
                     * Initializes a new object that enables language sensitive date and time formatting.
                     * @param locales The locales argument must be either a string holding a BCP 47 language tag, or an array of such language tags.
                     * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
                     * @param formatInfo An instance that will provide culture-specific date and time format information.
                     * @param dateOptions Optional object with some or all of the standardized properties.
                     * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
                     */
                    function IntlFormatter(locales, formatInfo, dateOptions) {
                        _super.call(this, DateTime.IntlOptionsProvider, dateOptions);
                        this.locales = locales;
                        this.formatInfo = formatInfo;
                    }
                    __extends(IntlFormatter, _super);
                    /**
                     * Converts the date to an equivalent string representation using specified format and invariant culture formatting information.
                     * @param format A format string containing formatting specifications.
                     * @param value The date to format.
                     * @returns The formatted date value.
                     */
                    IntlFormatter.prototype.format = function(formatString, value) {
                        return _super.prototype.format.call(this, formatString, value);
                    };
                    /**
                     * Applies all resolved format options to the date object.
                     * @param value The date to format.
                     * @returns A resulting format value with applied format and culture-specific options.
                     */
                    IntlFormatter.prototype.applyOptions = function(value) {
                        return this.getNativeFormatter(this.resolvedOptions).format(value);
                    };
                    /** Returns the format info instance used for culture-specific formatting. */
                    IntlFormatter.prototype.getFormatInfo = function() {
                        return this.formatInfo;
                    };
                    IntlFormatter.prototype.getNativeFormatter = function(resolvedOptions) {
                        return new Intl.DateTimeFormat(this.locales, resolvedOptions);
                    };
                    return IntlFormatter;
                }(DateTime.InvariantFormatter);
                DateTime.IntlFormatter = IntlFormatter;
                Globalization.DateTimeFormatInfo.FormatterConstructor = IntlFormatter;
            })(DateTime = Globalization.DateTime || (Globalization.DateTime = {}));
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
}("undefined" !== typeof Format ? Format : {});