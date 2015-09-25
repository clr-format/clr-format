!function(Format) {
    "use strict";
    var __extends;
    if ("undefined" === typeof Format || "undefined" === typeof Format.innerFormat) {
        throw new Error("Intl module loaded before main module");
    }
    (function(Format) {
        var Utils;
        (function(Utils) {
            var IntlResovlers;
            (function(IntlResovlers) {
                function setDateTimeFormatInfo_(formatInfo, formatProvider) {
                    setDayNames(formatInfo, formatProvider({
                        weekday: short
                    }), formatProvider({
                        weekday: long
                    }));
                    setAmPmDesignators(formatInfo, formatProvider({
                        hour: numeric,
                        hour12: true
                    }));
                    setSeparators(formatInfo, formatProvider({
                        month: twoDigit,
                        day: twoDigit
                    }), formatProvider({
                        hour: twoDigit,
                        minute: twoDigit,
                        hour12: false
                    }));
                }
                function getEra_(date, formatProvider) {
                    try {
                        return removeFormatDigits(formatProvider({
                            year: numeric,
                            era: short
                        }).format(date));
                    } catch (error) {
                        return "";
                    }
                }
                function getShortMonth_(date, formatProvider) {
                    return removeFormatDigits(formatProvider({
                        month: short
                    }).format(date));
                }
                function getLongMonth_(date, formatProvider) {
                    return removeFormatDigits(formatProvider({
                        month: long
                    }).format(date));
                }
                function setNumberFormatInfo_(formatInfo, decimalSampler, currencySampler) {
                    var sampleValue = 1.2, groupValue = -123456, decimalOptions = decimalSampler.resolvedOptions(), decimalNegativeSample = decimalSampler.format(-sampleValue), currencySample = currencySampler.format(sampleValue);
                    formatInfo.NegativeSign = decimalNegativeSample[0];
                    formatInfo.NumberGroupSeparator = decimalSampler.format(groupValue)[4];
                    formatInfo.NumberDecimalSeparator = getFirstNonDigit(decimalNegativeSample, 1);
                    formatInfo.NumberDecimalDigits = decimalOptions.minimumFractionDigits || decimalOptions.maximumFractionDigits;
                    formatInfo.CurrencyGroupSeparator = getFirstNonDigit(currencySampler.format(groupValue), 4);
                    formatInfo.CurrencyDecimalSeparator = getFirstNonDigit(currencySample, 1);
                }
                function getCurrencyDecimalDigits_(formatInfo, currencyCode) {
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
                function applyNumberCultureFormatting_(invariantlyFormattedString, replaceInvariantSymbolsCallback) {
                    return invariantlyFormattedString.replace(partialNumberFormatReplacementsRexExp, replaceInvariantSymbolsCallback);
                }
                function isBlank(value, customBlankChar) {
                    if (customBlankChar === void 0) {
                        customBlankChar = "";
                    }
                    return Utils.Text.isNullOrWhitespace(value) || removeControlChars(value) === customBlankChar;
                }
                var short, long, numeric, twoDigit, partialNumberFormatReplacementsRexExp, setDayNames, setAmPmDesignators, setSeparators, removeFormatDigits, digitsWithWhitespaceRegExp, removeControlChars, controlCharsRegExp, getFirstNonDigit, nonDigitSymbolRegExp, nonStandardCurrencyDecimalDigits;
                IntlResovlers.setDateTimeFormatInfo_ = setDateTimeFormatInfo_;
                IntlResovlers.getEra_ = getEra_;
                IntlResovlers.getShortMonth_ = getShortMonth_;
                IntlResovlers.getLongMonth_ = getLongMonth_;
                short = "short", long = "long", numeric = "numeric", twoDigit = "2-digit";
                IntlResovlers.setNumberFormatInfo_ = setNumberFormatInfo_;
                IntlResovlers.getCurrencyDecimalDigits_ = getCurrencyDecimalDigits_;
                IntlResovlers.applyNumberCultureFormatting_ = applyNumberCultureFormatting_;
                partialNumberFormatReplacementsRexExp = /[-.]/g;
                IntlResovlers.isBlank = isBlank;
                setDayNames = function(formatInfo, shortDayFormatter, longDayFormatter) {
                    var i, weekday = new Date(70, 2, 1);
                    formatInfo.AbbreviatedDayNames = [];
                    formatInfo.DayNames = [];
                    for (i = 1; i <= 7; i += 1, weekday.setDate(i)) {
                        formatInfo.AbbreviatedDayNames.push(shortDayFormatter.format(weekday));
                        formatInfo.DayNames.push(longDayFormatter.format(weekday));
                    }
                };
                setAmPmDesignators = function(formatInfo, amPmDesignatorFormatter) {
                    var amDate = new Date(0, 0, 1, 6), pmDate = new Date(0, 0, 1, 18), invariantInfo = Format.Globalization.DateTimeFormatInfo.InvariantInfo;
                    formatInfo.AMDesignator = removeFormatDigits(amPmDesignatorFormatter.format(amDate));
                    formatInfo.PMDesignator = removeFormatDigits(amPmDesignatorFormatter.format(pmDate));
                    if (isBlank(formatInfo.AMDesignator)) {
                        formatInfo.AMDesignator = invariantInfo.AMDesignator;
                    }
                    if (isBlank(formatInfo.PMDesignator, ".")) {
                        formatInfo.PMDesignator = invariantInfo.PMDesignator;
                    }
                };
                setSeparators = function(formatInfo, dateSeparatorFormatter, timeSeparatorFormatter) {
                    var nowDate = new Date();
                    formatInfo.DateSeparator = removeControlChars(dateSeparatorFormatter.format(nowDate))[2];
                    formatInfo.TimeSeparator = removeControlChars(timeSeparatorFormatter.format(nowDate))[2];
                };
                removeFormatDigits = function(formattedValue) {
                    return formattedValue.replace(digitsWithWhitespaceRegExp, "");
                }, digitsWithWhitespaceRegExp = /\s*\d+.?\s*/;
                removeControlChars = function(formattedValue) {
                    return formattedValue.replace(controlCharsRegExp, "");
                }, controlCharsRegExp = /\u200E|\u200F/g;
                getFirstNonDigit = function(sample, offset) {
                    return sample.substring(offset).match(nonDigitSymbolRegExp)[0];
                }, nonDigitSymbolRegExp = /[^\d]/;
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
                var styles = Numeric.Specifiers.Standard, IntlFormatter = function(_super) {
                    function IntlFormatter(locales, formatInfo, numberOptions) {
                        var _this = this;
                        _super.call(this, Numeric.IntlOptionsProvider, formatInfo, numberOptions);
                        this.getNativeFormatter = function(resolvedOptions) {
                            return new Intl.NumberFormat(_this.locales, resolvedOptions);
                        };
                        this.replaceInvariantSymbols = function(replaceChar) {
                            var invariantInfo = Globalization.NumberFormatInfo.InvariantInfo;
                            if (replaceChar === invariantInfo.NegativeSign) {
                                return _this.formatInfo.NegativeSign;
                            }
                            if (replaceChar === _this.decorationFormatter.getDecimalSeparator(invariantInfo)) {
                                return _this.decorationFormatter.getDecimalSeparator();
                            } else {
                                return replaceChar;
                            }
                        };
                        if (null == locales) {
                            throw new Format.Errors.ArgumentNullError("locales");
                        }
                        if ("undefined" === typeof Intl || "undefined" === typeof Intl.NumberFormat) {
                            throw new Format.Errors.InvalidOperationError("Intl.NumberFormat is not supported by the executing context");
                        }
                        this.locales = locales;
                        Format.Utils.IntlResovlers.setNumberFormatInfo_(this.formatInfo, this.getNativeFormatter({
                            style: styles[styles.decimal]
                        }), this.getNativeFormatter({
                            style: styles[styles.currency],
                            currency: "USD",
                            useGrouping: true
                        }));
                    }
                    __extends(IntlFormatter, _super);
                    IntlFormatter.prototype.applyOptions = function(value) {
                        var formattedValue, resolvedOptions = this.resolvedOptions, supportedStyle = IntlFormatter.supportedStyles[resolvedOptions.style];
                        if (supportedStyle) {
                            this.overrideOptions(supportedStyle);
                            formattedValue = this.getNativeFormatter(resolvedOptions).format(value);
                        } else {
                            formattedValue = _super.prototype.applyOptions.call(this, value);
                            formattedValue = this.applyCultureSpecificFormatting(formattedValue);
                        }
                        return formattedValue;
                    };
                    IntlFormatter.prototype.overrideOptions = function(overrideStyle) {
                        this.overrideCurrencyOptions();
                        this.overrideDecimalOptions();
                        var resolvedOptions = this.resolvedOptions;
                        if ("string" === typeof overrideStyle) {
                            resolvedOptions.style = overrideStyle;
                        }
                        if (null == resolvedOptions.useGrouping) {
                            resolvedOptions.useGrouping = false;
                        }
                    };
                    IntlFormatter.prototype.overrideCurrencyOptions = function() {
                        var currencyCode, resolvedOptions = this.resolvedOptions;
                        if (resolvedOptions.style === styles[styles.currency]) {
                            currencyCode = Globalization.NumberFormatInfo.CurrentCurrency;
                            if (currencyCode) {
                                resolvedOptions.currency = currencyCode;
                                this.overrideFractionDigits(Format.Utils.IntlResovlers.getCurrencyDecimalDigits_(this.formatInfo, currencyCode));
                            } else {
                                throw new Format.Errors.InvalidOperationError("No currency was set (use the Format.setCurrency method to do so)");
                            }
                        }
                    };
                    IntlFormatter.prototype.overrideDecimalOptions = function() {
                        var resolvedOptions = this.resolvedOptions;
                        if (resolvedOptions.style === styles[styles.fixedPoint] || resolvedOptions.style === styles[styles.percent] || resolvedOptions.style === styles[styles.number]) {
                            this.overrideFractionDigits(this.formatInfo.NumberDecimalDigits);
                        }
                    };
                    IntlFormatter.prototype.overrideFractionDigits = function(overrideValue) {
                        var resolvedOptions = this.resolvedOptions;
                        if (null == resolvedOptions.minimumFractionDigits && null == resolvedOptions.maximumFractionDigits) {
                            resolvedOptions.minimumFractionDigits = overrideValue;
                            resolvedOptions.maximumFractionDigits = overrideValue;
                        }
                    };
                    IntlFormatter.prototype.applyCultureSpecificFormatting = function(invariantlyFormattedString) {
                        if (this.resolvedOptions.style === styles[styles.hex]) {
                            return invariantlyFormattedString;
                        } else {
                            return Format.Utils.IntlResovlers.applyNumberCultureFormatting_(invariantlyFormattedString, this.replaceInvariantSymbols);
                        }
                    };
                    IntlFormatter.supportedStyles = {
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
                    return IntlFormatter;
                }(Numeric.InfoFormatter);
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
                var resolvers, IntlSpecifiersFormatter = function(_super) {
                    function IntlSpecifiersFormatter(formatInfo, formatProvider) {
                        _super.call(this, formatInfo);
                        this.formatProvider = formatProvider;
                        this.overrideBaseFormatters();
                    }
                    __extends(IntlSpecifiersFormatter, _super);
                    IntlSpecifiersFormatter.prototype.overrideBaseFormatters = function() {
                        var baseMonthFormatter, _this = this, baseEraFormatter = this.formatters.eraPlaceholder;
                        this.formatters.eraPlaceholder = function() {
                            var intlEra = resolvers.getEra_(_this.value, _this.formatProvider);
                            return resolvers.isBlank(intlEra) ? baseEraFormatter() : intlEra;
                        };
                        baseMonthFormatter = this.formatters.monthPlaceholder;
                        this.formatters.monthPlaceholder = function(specifierCount) {
                            switch (specifierCount) {
                              case 1:
                              case 2:
                                return baseMonthFormatter(specifierCount);

                              case 3:
                                return resolvers.getShortMonth_(_this.value, _this.formatProvider);

                              default:
                                return resolvers.getLongMonth_(_this.value, _this.formatProvider);
                            }
                        };
                    };
                    return IntlSpecifiersFormatter;
                }(DateTime.InfoSpecifierFormatter);
                DateTime.IntlSpecifiersFormatter = IntlSpecifiersFormatter;
                resolvers = Format.Utils.IntlResovlers;
            })(DateTime = Globalization.DateTime || (Globalization.DateTime = {}));
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var DateTime;
            (function(DateTime) {
                var styles = DateTime.Specifiers.Standard, IntlFormatter = function(_super) {
                    function IntlFormatter(locales, formatInfo, dateOptions) {
                        var _this = this;
                        _super.call(this, DateTime.IntlOptionsProvider, formatInfo, dateOptions);
                        this.getNativeFormatter = function(resolvedOptions) {
                            return new Intl.DateTimeFormat(_this.locales, resolvedOptions);
                        };
                        if (null == locales) {
                            throw new Format.Errors.ArgumentNullError("locales");
                        }
                        if ("undefined" === typeof Intl || "undefined" === typeof Intl.DateTimeFormat) {
                            throw new Format.Errors.InvalidOperationError("Intl.DateTimeFormat is not supported by the executing context");
                        }
                        this.locales = locales;
                        Format.Utils.IntlResovlers.setDateTimeFormatInfo_(this.formatInfo, this.getNativeFormatter);
                    }
                    __extends(IntlFormatter, _super);
                    IntlFormatter.prototype.format = function(formatString, value) {
                        return _super.prototype.format.call(this, formatString, value);
                    };
                    IntlFormatter.prototype.applyOptions = function(value) {
                        var resolvedOptions = this.resolvedOptions;
                        if (resolvedOptions.style === styles[styles.roundTrip] || resolvedOptions.style === styles[styles.rfc1123] || resolvedOptions.style === styles[styles.sortable] || resolvedOptions.style === styles[styles.universalSortable]) {
                            return _super.prototype.applyOptions.call(this, value);
                        } else {
                            return this.getNativeFormatter(resolvedOptions).format(value);
                        }
                    };
                    IntlFormatter.prototype.getSpecifiersFormatter = function() {
                        return new DateTime.IntlSpecifiersFormatter(this.formatInfo, this.getNativeFormatter);
                    };
                    return IntlFormatter;
                }(DateTime.InfoFormatter);
                DateTime.IntlFormatter = IntlFormatter;
                Globalization.DateTimeFormatInfo.FormatterConstructor = IntlFormatter;
            })(DateTime = Globalization.DateTime || (Globalization.DateTime = {}));
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
}("undefined" !== typeof Format ? Format : {});