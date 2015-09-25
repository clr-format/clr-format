var Format = Format || function(Format) {
    "use strict";
    var __extends = this && this.__extends || function(d, b) {
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
        var Errors;
        (function(Errors) {
            Format.Errors.ErrorClass = Error;
            var SystemError = function(_super) {
                function SystemError(message, innerError) {
                    _super.call(this, message);
                    this.name = "SystemError";
                    this.message = message;
                    if (innerError) {
                        this.innerError = innerError;
                        this.stack = innerError.stack;
                    }
                }
                __extends(SystemError, _super);
                return SystemError;
            }(Errors.ErrorClass);
            Errors.SystemError = SystemError;
        })(Errors = Format.Errors || (Format.Errors = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Errors;
        (function(Errors) {
            var ArgumentError = function(_super) {
                function ArgumentError(message, innerError) {
                    _super.call(this, message, innerError);
                    this.name = "ArgumentError";
                }
                __extends(ArgumentError, _super);
                return ArgumentError;
            }(Errors.SystemError);
            Errors.ArgumentError = ArgumentError;
        })(Errors = Format.Errors || (Format.Errors = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Errors;
        (function(Errors) {
            var ArgumentNullError = function(_super) {
                function ArgumentNullError(argumentName) {
                    _super.call(this, "Argument '" + argumentName + "' cannot be undefined or null");
                    this.name = "ArgumentNullError";
                }
                __extends(ArgumentNullError, _super);
                return ArgumentNullError;
            }(Errors.ArgumentError);
            Errors.ArgumentNullError = ArgumentNullError;
        })(Errors = Format.Errors || (Format.Errors = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Utils;
        (function(Utils) {
            var Text;
            (function(Text) {
                function isNullOrWhitespace(value) {
                    return !(value && Utils.Polyfill.trim(value).length > 0);
                }
                function insert(value, startIndex, insertValue) {
                    if (null == value) {
                        throw new Format.Errors.ArgumentNullError("value");
                    }
                    if (null == startIndex) {
                        throw new Format.Errors.ArgumentNullError("startIndex");
                    }
                    if (null == insertValue) {
                        throw new Format.Errors.ArgumentNullError("insertValue");
                    }
                    if (startIndex < 0 || startIndex > value.length || isNaN(startIndex)) {
                        throw RangeError("Argument 'startIndex=" + startIndex + "' is not an index inside of 'value=\"" + value + "\"'");
                    }
                    return value.substring(0, startIndex) + insertValue + value.substring(startIndex);
                }
                Text.isNullOrWhitespace = isNullOrWhitespace;
                Text.insert = insert;
            })(Text = Utils.Text || (Utils.Text = {}));
        })(Utils = Format.Utils || (Format.Utils = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Utils;
        (function(Utils) {
            function isType(type, object) {
                return getType(object) === getTypeString(type);
            }
            function getType(object) {
                if (null === object) {
                    return Utils.Types.Null;
                }
                if (void 0 === object) {
                    return Utils.Types.Undefined;
                } else {
                    return Object.prototype.toString.call(object);
                }
            }
            var fillTypes, getTypeString;
            Utils.isType = isType;
            Utils.getType = getType;
            fillTypes = function(types) {
                for (var key in types) {
                    if (types.hasOwnProperty(key)) {
                        types[key] = getTypeString(key);
                    }
                }
                return types;
            };
            getTypeString = function(type) {
                return "[object " + type + "]";
            };
            Utils.Types = fillTypes({
                Array: "",
                Boolean: "",
                Date: "",
                Function: "",
                Null: "",
                Number: "",
                Object: "",
                RegExp: "",
                String: "",
                Undefined: ""
            });
        })(Utils = Format.Utils || (Format.Utils = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Utils;
        (function(Utils) {
            var Numeric;
            (function(Numeric) {
                function isCounting(value) {
                    return value > 0 && Numeric.isInteger(value);
                }
                function isWhole(value) {
                    return value >= 0 && Numeric.isInteger(value);
                }
                function isEven(value) {
                    if (!Numeric.isInteger(value)) {
                        throw new Format.Errors.ArgumentError("Argument 'value' must be an integer");
                    }
                    return 0 === (1 & value);
                }
                function toFixedMinMax(value, minDigits, maxDigits) {
                    return toMinMax(getToFixedHandler(value), minDigits, maxDigits);
                }
                function toExponentialMinMax(value, minDigits, maxDigits) {
                    return toMinMax(getToExponentialHandler(value), minDigits, maxDigits);
                }
                function toPrecisionMinMax(value, minDigits, maxDigits) {
                    return toMinMax(getToPrecisionHandler(value), minDigits, maxDigits);
                }
                var toMinMax, validateToMinMaxDigitsArguments, applyMinMax, iterateMinMax, getToFixedHandler, getToExponentialHandler, getToPrecisionHandler, validateValueArgument;
                Numeric.isCounting = isCounting;
                Numeric.isWhole = isWhole;
                Numeric.isEven = isEven;
                Numeric.isInteger = Number.isInteger || function(value) {
                    return null !== value && +value === value >> 0;
                };
                Numeric.toFixedMinMax = toFixedMinMax;
                Numeric.toExponentialMinMax = toExponentialMinMax;
                Numeric.toPrecisionMinMax = toPrecisionMinMax;
                toMinMax = function(numberHandler, minDigits, maxDigits) {
                    if (null == minDigits) {
                        minDigits = void 0;
                    }
                    if (null == maxDigits) {
                        maxDigits = void 0;
                    }
                    if (void 0 === minDigits && void 0 !== maxDigits) {
                        minDigits = numberHandler.defaultMinDigits;
                    }
                    validateToMinMaxDigitsArguments(numberHandler, minDigits, maxDigits);
                    return applyMinMax(numberHandler, minDigits, maxDigits);
                };
                validateToMinMaxDigitsArguments = function(numberHandler, minDigits, maxDigits) {
                    if (void 0 !== minDigits && !isFinite(minDigits)) {
                        throw new Format.Errors.ArgumentError("Argument 'minDigits' cannot be NaN or infinite");
                    }
                    if (void 0 !== maxDigits && !isFinite(maxDigits)) {
                        throw new Format.Errors.ArgumentError("Argument 'maxDigits' cannot be NaN or infinite");
                    }
                    if (minDigits > maxDigits) {
                        throw new RangeError("Argument 'minDigits=" + minDigits + "' cannot be greater than argument 'maxDigits=" + maxDigits + "'");
                    }
                    if (maxDigits - minDigits > 20) {
                        throw new RangeError("The difference between arguments 'minDigits=" + minDigits + "' and 'maxDigits=" + maxDigits + "' cannot exceed 20");
                    }
                };
                applyMinMax = function(numberHandler, minDigits, maxDigits) {
                    var targetValue, minValue, maxValue = numberHandler.delegate(maxDigits);
                    if (minDigits === maxDigits) {
                        return maxValue;
                    }
                    targetValue = +maxValue, minValue = numberHandler.delegate(minDigits);
                    if (targetValue === +minValue) {
                        return minValue;
                    } else {
                        return iterateMinMax(numberHandler, {
                            minDigits: minDigits,
                            maxDigits: maxDigits,
                            targetValue: targetValue
                        }) || maxValue;
                    }
                };
                iterateMinMax = function(numberHandler, options) {
                    var i, minValue;
                    for (i = options.minDigits + 1; i < options.maxDigits; i += 1) {
                        minValue = numberHandler.delegate(i);
                        if (options.targetValue === +minValue) {
                            return minValue;
                        }
                    }
                };
                getToFixedHandler = function(value) {
                    validateValueArgument(value);
                    return {
                        defaultMinDigits: 0,
                        delegate: function(digits) {
                            return null != digits ? value.toFixed(digits) : value.toString();
                        }
                    };
                };
                getToExponentialHandler = function(value) {
                    validateValueArgument(value);
                    return {
                        defaultMinDigits: 0,
                        delegate: function(digits) {
                            return void 0 !== digits ? value.toExponential(digits) : value.toExponential();
                        }
                    };
                };
                getToPrecisionHandler = function(value) {
                    validateValueArgument(value);
                    return {
                        defaultMinDigits: 1,
                        delegate: function(digits) {
                            return null !== digits ? value.toPrecision(digits) : value.toPrecision();
                        }
                    };
                };
                validateValueArgument = function(value) {
                    if (null == value) {
                        throw new Format.Errors.ArgumentNullError("value");
                    }
                    if (!isFinite(value)) {
                        throw new Format.Errors.ArgumentError("Argument 'value' cannot be NaN or infinite");
                    }
                };
            })(Numeric = Utils.Numeric || (Utils.Numeric = {}));
        })(Utils = Format.Utils || (Format.Utils = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Utils;
        (function(Utils) {
            var Padding;
            (function(Padding) {
                function pad(value, options) {
                    if (null == value) {
                        throw new Format.Errors.ArgumentNullError("value");
                    }
                    setDefaultOptions(options);
                    validateOptions(options);
                    if (isPaddingRequired(value, options)) {
                        value = directionStrategies[options.direction](value, options);
                    }
                    return value;
                }
                var Direction, setDefaultOptions, validateOptions, isPaddingRequired, getPadWidth, getPadding, directionStrategies;
                (function(Direction) {
                    Direction[Direction.Left = 1] = "Left";
                    Direction[Direction.Right = 2] = "Right";
                    Direction[Direction.Both = 3] = "Both";
                })(Padding.Direction || (Padding.Direction = {}));
                Direction = Padding.Direction;
                Padding.pad = pad;
                setDefaultOptions = function(options) {
                    options.direction = options.direction || Direction.Right;
                    options.paddingChar = options.paddingChar || " ";
                };
                validateOptions = function(options) {
                    if (!Utils.Numeric.isCounting(options.totalWidth)) {
                        throw new Format.Errors.ArgumentError("Option 'totalWidth' with value '" + options.totalWidth + "' must be a positive non-zero integer (counting) number");
                    }
                    if ("string" !== typeof options.paddingChar || options.paddingChar.length > 1) {
                        throw new Format.Errors.ArgumentError("Option 'paddingChar' with value '" + options.paddingChar + "' must be a single character string");
                    }
                    if (null == Direction[options.direction]) {
                        throw new Format.Errors.ArgumentError("Option 'direction' with value '" + options.direction + "' must be one of Padding.Direction enum values");
                    }
                };
                isPaddingRequired = function(value, options) {
                    return options.totalWidth > value.length;
                };
                getPadWidth = function(value, options) {
                    return options.totalWidth - value.length;
                };
                getPadding = function(padWidth, options) {
                    return new Array(padWidth + 1).join(options.paddingChar);
                };
                directionStrategies = {};
                directionStrategies[Direction.Left] = function(value, options) {
                    return getPadding(getPadWidth(value, options), options) + value;
                };
                directionStrategies[Direction.Right] = function(value, options) {
                    return value + getPadding(getPadWidth(value, options), options);
                };
                directionStrategies[Direction.Both] = function(value, options) {
                    var padWidth = getPadWidth(value, options), right = Math.ceil(padWidth / 2), left = padWidth - right;
                    return getPadding(left, options) + value + getPadding(right, options);
                };
            })(Padding = Utils.Padding || (Utils.Padding = {}));
        })(Utils = Format.Utils || (Format.Utils = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Utils;
        (function(Utils) {
            var Enumerable;
            (function(Enumerable) {
                function takeWhile(array, predicate) {
                    var result, i, len;
                    if (null == array) {
                        throw new Format.Errors.ArgumentNullError("array");
                    }
                    if ("function" !== typeof predicate) {
                        throw new TypeError("Cannot call method 'takeWhile' without a predicate function");
                    }
                    result = [];
                    for (i = 0, len = array.length; i < len && predicate(array[i], i); i += 1) {
                        result.push(array[i]);
                    }
                    return result;
                }
                function compact(array) {
                    var j, i, len;
                    if (null == array) {
                        throw new Format.Errors.ArgumentNullError("array");
                    }
                    j = 0;
                    for (i = 0, len = array.length; i < len; i += 1) {
                        if (void 0 !== array[i]) {
                            array[j] = array[i];
                            j += 1;
                        }
                    }
                    array.length = j;
                    return array;
                }
                Enumerable.takeWhile = takeWhile;
                Enumerable.compact = compact;
            })(Enumerable = Utils.Enumerable || (Utils.Enumerable = {}));
        })(Utils = Format.Utils || (Format.Utils = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Utils;
        (function(Utils) {
            var Polyfill;
            (function(Polyfill) {
                function indexOf(array, searchElement, fromIndex) {
                    if (null == array) {
                        throw new Format.Errors.ArgumentNullError("array");
                    }
                    fromIndex = +fromIndex || 0;
                    if (!Utils.Numeric.isInteger(fromIndex)) {
                        throw new Format.Errors.ArgumentError("Argument 'fromIndex' with value '" + fromIndex + "' must be an integer");
                    }
                    if (array.indexOf) {
                        return array.indexOf(searchElement, fromIndex);
                    } else {
                        return indexOfPolyfill(array, searchElement, fromIndex);
                    }
                }
                function round(value, exponent) {
                    if (null == value) {
                        throw new Format.Errors.ArgumentNullError("value");
                    }
                    exponent >>= 0;
                    if (!exponent || !isFinite(value)) {
                        return Math.round(value);
                    }
                    var sign = value >= 0 ? 1 : -1;
                    value = Math.round(shiftValue(value * sign, -exponent));
                    return shiftValue(value, exponent) * sign;
                }
                var shiftValue, originalToFixed, indexOfPolyfill, getIndexOfStartIndex, validateValueArgument, trimWhitespaceRegExp;
                Polyfill.indexOf = indexOf;
                Polyfill.round = round;
                shiftValue = function(value, exponent) {
                    var valueParts = (value + "").split("e");
                    if (valueParts[1]) {
                        exponent += +valueParts[1];
                    }
                    return +(valueParts[0] + "e" + exponent);
                };
                if (0 === +.005.toFixed(2)) {
                    originalToFixed = Number.prototype.toFixed;
                    Number.prototype.toFixed = function(fractionDigits) {
                        return originalToFixed.call(round(this, -fractionDigits), fractionDigits) + "";
                    };
                }
                indexOfPolyfill = function(array, searchElement, fromIndex) {
                    var index, arrayObject = Object(array), length = arrayObject.length >>> 0;
                    if (0 === length || fromIndex >= length) {
                        return -1;
                    }
                    for (index = getIndexOfStartIndex(fromIndex, length); index < length; index += 1) {
                        if (index in arrayObject && arrayObject[index] === searchElement) {
                            return index;
                        }
                    }
                    return -1;
                };
                getIndexOfStartIndex = function(fromIndex, length) {
                    if (fromIndex < 0) {
                        fromIndex += length;
                    }
                    return Math.max(0, fromIndex);
                };
                Polyfill.isArray = Array.isArray || function(object) {
                    return Utils.getType(object) === Utils.Types.Array;
                };
                Polyfill.trim = "".trim ? function(value) {
                    validateValueArgument(value);
                    return value.trim();
                } : function(value) {
                    validateValueArgument(value);
                    return value.replace(trimWhitespaceRegExp, "");
                };
                validateValueArgument = function(value) {
                    if (null == value) {
                        throw new Format.Errors.ArgumentNullError("value");
                    }
                };
                trimWhitespaceRegExp = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            })(Polyfill = Utils.Polyfill || (Utils.Polyfill = {}));
        })(Utils = Format.Utils || (Format.Utils = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Utils;
        (function(Utils) {
            function isObject(object) {
                return Utils.getType(object) === Utils.Types.Object;
            }
            function isEmpty(object) {
                if (!isEnumerable(object)) {
                    throw TypeError("Cannot call method 'isEmpty' on non-enumerable objects");
                }
                for (var key in object) {
                    if (object.hasOwnProperty(key)) {
                        return false;
                    }
                }
                return true;
            }
            var isEnumerable, validateValueAsKey, innerExtend, getDeepTarget, isArray, merge, canDeepMerge, deepMerge, getDeepMergeSource;
            Utils.isObject = isObject;
            Utils.isEmpty = isEmpty;
            isEnumerable = function(object) {
                return ("object" === typeof object || "function" === typeof object) && null !== object;
            };
            Utils.mapValuesAsKeys = function(object) {
                var objectIsArray, result, key, value;
                if (null == object) {
                    throw new Format.Errors.ArgumentNullError("object");
                }
                if ("string" === typeof object) {
                    throw new Format.Errors.ArgumentError("Cannot call method 'enumerateValues' on immutable string objects");
                }
                objectIsArray = Utils.Polyfill.isArray(object), result = objectIsArray ? [] : {};
                for (key in object) {
                    if (object.hasOwnProperty(key)) {
                        value = object[key];
                        validateValueAsKey(object, result, value);
                        result[value] = objectIsArray ? +key : key;
                        result[key] = value;
                    }
                }
                return result;
            };
            validateValueAsKey = function(object, result, value) {
                if (null == value) {
                    throw new Format.Errors.ArgumentError("Cannot call method 'enumerateValues' on objects that contain undefined or null values");
                }
                if (object.hasOwnProperty(value) || result.hasOwnProperty(value)) {
                    throw new Format.Errors.ArgumentError("Cannot enumerate value '" + value + "' because such a key already exists in " + object);
                }
            };
            Utils.extend = function(target) {
                var _i, objects = [];
                for (_i = 1; _i < arguments.length; _i++) {
                    objects[_i - 1] = arguments[_i];
                }
                return innerExtend(target, objects, {
                    deep: false,
                    seen: []
                });
            };
            Utils.deepExtend = function(target) {
                var _i, objects = [];
                for (_i = 1; _i < arguments.length; _i++) {
                    objects[_i - 1] = arguments[_i];
                }
                return innerExtend(target, objects, {
                    deep: true,
                    seen: []
                });
            };
            innerExtend = function(target, objects, context) {
                target = getDeepTarget(target, context);
                if (!objects.length) {
                    throw new Format.Errors.ArgumentError("Arguments' list 'options' must contain at least one element");
                }
                for (var i = 0, len = objects.length; i < len; i += 1) {
                    if (null != objects[i]) {
                        merge(target, objects[i], context);
                    } else {}
                }
                return target;
            };
            getDeepTarget = function(target, context) {
                if (!isEnumerable(target)) {
                    if (!context.deep) {
                        throw new Format.Errors.ArgumentError("Argument 'target' with value '" + target + "' must be an enumerable object instance");
                    }
                    return {};
                }
                return target;
            };
            isArray = Utils.Polyfill.isArray;
            merge = function(target, object, context) {
                var key, copy, objectIsArray = isArray(object);
                context.seen.push(object);
                for (key in object) {
                    context.key = key;
                    copy = object[key];
                    if (copy !== target && (!objectIsArray || object.hasOwnProperty(key))) {
                        if (canDeepMerge(copy, context)) {
                            deepMerge(target, copy, context);
                        } else {
                            if (void 0 !== copy) {
                                target[key] = copy;
                            }
                        }
                    } else {}
                }
            };
            canDeepMerge = function(copy, context) {
                return context.deep && Utils.Polyfill.indexOf(context.seen, copy) === -1 && (isObject(copy) && copy.constructor === Object || isArray(copy));
            };
            deepMerge = function(target, copy, context) {
                var source = getDeepMergeSource(target[context.key], copy);
                target[context.key] = innerExtend(source, [ copy ], context);
            };
            getDeepMergeSource = function(source, copy) {
                if (isArray(copy)) {
                    return isArray(source) ? source : [];
                } else {
                    return isObject(source) ? source : {};
                }
            };
        })(Utils = Format.Utils || (Format.Utils = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var DateTime;
            (function(DateTime) {
                var Specifiers;
                (function(Specifiers) {
                    Specifiers.MaxSubSecondPrecision = 3;
                    Specifiers.Custom = Format.Utils.mapValuesAsKeys({
                        dayPlaceholder: "d",
                        zeroSubSecondPlaceholder: "f",
                        digitSubSecondPlaceholder: "F",
                        eraPlaceholder: "g",
                        hour12Placeholder: "h",
                        hour24Placeholdr: "H",
                        timeZonePlaceholder: "K",
                        minutePlaceholder: "m",
                        monthPlaceholder: "M",
                        secondPlaceholder: "s",
                        amPmPlaceholder: "t",
                        yearPlaceholder: "y",
                        hoursOffsetPlaceholder: "z",
                        timeSeparator: ":",
                        dateSeparator: "/",
                        literalStringDelimeterSingle: "'",
                        literalStringDelimeterDouble: '"',
                        singleCharFormatSpecifier: "%",
                        escapeChar: "\\"
                    });
                    var specifiers = Specifiers.Custom, getEscapePattern = function(escapeChar) {
                        return "\\" + escapeChar + ".";
                    }, getLiteralPattern = function(literalStringDelimeter) {
                        return literalStringDelimeter + "[^" + literalStringDelimeter + "]*?" + literalStringDelimeter;
                    };
                    Specifiers.CustomSpecifiersRegExp = new RegExp([ getLiteralPattern(specifiers.literalStringDelimeterSingle), getLiteralPattern(specifiers.literalStringDelimeterDouble), getEscapePattern(specifiers.singleCharFormatSpecifier), getEscapePattern(specifiers.escapeChar), specifiers.timeZonePlaceholder, specifiers.timeSeparator, specifiers.dateSeparator, specifiers.literalStringDelimeterSingle, specifiers.literalStringDelimeterDouble, "[" + [ specifiers.dayPlaceholder, specifiers.zeroSubSecondPlaceholder, specifiers.digitSubSecondPlaceholder, specifiers.eraPlaceholder, specifiers.hour12Placeholder, specifiers.hour24Placeholdr, specifiers.minutePlaceholder, specifiers.monthPlaceholder, specifiers.secondPlaceholder, specifiers.amPmPlaceholder, specifiers.yearPlaceholder, specifiers.hoursOffsetPlaceholder ].join("") + "]+" ].join("|"), "g");
                })(Specifiers = DateTime.Specifiers || (DateTime.Specifiers = {}));
            })(DateTime = Globalization.DateTime || (Globalization.DateTime = {}));
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Errors;
        (function(Errors) {
            var FormatError = function(_super) {
                function FormatError(message, innerError) {
                    _super.call(this, message, innerError);
                    this.name = "FormatError";
                }
                __extends(FormatError, _super);
                return FormatError;
            }(Errors.SystemError);
            Errors.FormatError = FormatError;
        })(Errors = Format.Errors || (Format.Errors = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var DateTime;
            (function(DateTime) {
                var padding, pad, pad2, customSpecifiers, InfoSpecifierFormatter = function() {
                    function InfoSpecifierFormatter(formatInfo) {
                        var _this = this;
                        this.formatSpecifier_ = function(specifierMatch) {
                            return _this.formatters[customSpecifiers[specifierMatch[0]]](specifierMatch.length, specifierMatch) + "";
                        };
                        this.formatters = {
                            dayPlaceholder: function(specifierCount) {
                                switch (specifierCount) {
                                  case 1:
                                  case 2:
                                    return pad(_this.value.getDate(), specifierCount);

                                  case 3:
                                    return _this.formatInfo_.AbbreviatedDayNames[_this.value.getDay()];

                                  default:
                                    return _this.formatInfo_.DayNames[_this.value.getDay()];
                                }
                            },
                            zeroSubSecondPlaceholder: function(specifierCount) {
                                return pad(_this.getSubSecond_(specifierCount, customSpecifiers.digitSubSecondPlaceholder), specifierCount);
                            },
                            digitSubSecondPlaceholder: function(specifierCount) {
                                var subSecond = _this.getSubSecond_(specifierCount, customSpecifiers.zeroSubSecondPlaceholder);
                                return subSecond ? pad(subSecond, specifierCount) : "";
                            },
                            eraPlaceholder: function() {
                                return _this.value.getFullYear() < 0 ? "B.C." : "A.D.";
                            },
                            hour12Placeholder: function(specifierCount) {
                                return pad2(_this.value.getHours() % 12 || 12, specifierCount);
                            },
                            hour24Placeholdr: function(specifierCount) {
                                return pad2(_this.value.getHours(), specifierCount);
                            },
                            timeZonePlaceholder: function() {
                                return _this.getHoursOffset_() + ":" + pad2(Math.abs(_this.value.getTimezoneOffset() % 60));
                            },
                            minutePlaceholder: function(specifierCount) {
                                return pad2(_this.value.getMinutes(), specifierCount);
                            },
                            monthPlaceholder: function(specifierCount) {
                                switch (specifierCount) {
                                  case 1:
                                  case 2:
                                    return pad(_this.value.getMonth() + 1, specifierCount);

                                  case 3:
                                    return _this.formatInfo_.AbbreviatedMonthNames[_this.value.getMonth()];

                                  default:
                                    return _this.formatInfo_.MonthNames[_this.value.getMonth()];
                                }
                            },
                            secondPlaceholder: function(specifierCount) {
                                return pad2(_this.value.getSeconds(), specifierCount);
                            },
                            amPmPlaceholder: function(specifierCount) {
                                return (_this.value.getHours() < 12 ? _this.formatInfo_.AMDesignator : _this.formatInfo_.PMDesignator).substr(0, 1 === specifierCount ? 1 : void 0);
                            },
                            yearPlaceholder: function(specifierCount) {
                                var year = _this.value.getFullYear();
                                if (specifierCount <= 2) {
                                    year %= 100;
                                }
                                return pad(year, specifierCount);
                            },
                            hoursOffsetPlaceholder: function(specifierCount) {
                                switch (specifierCount) {
                                  case 1:
                                  case 2:
                                    return _this.getHoursOffset_(specifierCount);

                                  default:
                                    return _this.formatters.timeZonePlaceholder();
                                }
                            },
                            timeSeparator: function() {
                                return _this.formatInfo_.TimeSeparator;
                            },
                            dateSeparator: function() {
                                return _this.formatInfo_.DateSeparator;
                            },
                            literalStringDelimeterSingle: function(matchLength, specifierMatch) {
                                if (1 === matchLength) {
                                    throw new Format.Errors.FormatError("Cannot find a matching quote character for the character '" + specifierMatch + "'");
                                }
                                return specifierMatch.substring(1, matchLength - 1);
                            },
                            literalStringDelimeterDouble: function(matchLength, specifierMatch) {
                                return _this.formatters.literalStringDelimeterSingle(matchLength, specifierMatch);
                            },
                            singleCharFormatSpecifier: function(matchLength, specifierMatch) {
                                var specifier = specifierMatch[1];
                                if (specifier === customSpecifiers.singleCharFormatSpecifier) {
                                    throw new Format.Errors.FormatError("Specifier combination '" + specifier + specifier + "' is not valid");
                                }
                                return customSpecifiers[specifier] ? _this.formatSpecifier_(specifier) : specifier;
                            },
                            escapeChar: function(matchLength, specifierMatch) {
                                return specifierMatch[1];
                            }
                        };
                        if (null == formatInfo) {
                            throw new Format.Errors.ArgumentNullError("formatInfo");
                        }
                        this.formatInfo_ = formatInfo;
                    }
                    InfoSpecifierFormatter.prototype.format = function(format, value) {
                        this.value = value;
                        return format.replace(DateTime.Specifiers.CustomSpecifiersRegExp, this.formatSpecifier_);
                    };
                    InfoSpecifierFormatter.prototype.getSubSecond_ = function(precision, subSecondPlaceholder) {
                        var maxPrecision = DateTime.Specifiers.MaxSubSecondPrecision;
                        if (precision > maxPrecision) {
                            throw new Format.Errors.FormatError("Date and time format specifier '" + subSecondPlaceholder + "' cannot be used more than " + maxPrecision + " times");
                        }
                        return Math.floor(this.value.getMilliseconds() / Math.pow(10, maxPrecision - precision));
                    };
                    InfoSpecifierFormatter.prototype.getHoursOffset_ = function(totalWidth) {
                        if (totalWidth === void 0) {
                            totalWidth = 2;
                        }
                        return Format.innerComponentFormat("+" + pad(0, totalWidth) + ";-" + pad(0, totalWidth), Math.floor(-this.value.getTimezoneOffset() / 60));
                    };
                    return InfoSpecifierFormatter;
                }();
                DateTime.InfoSpecifierFormatter = InfoSpecifierFormatter;
                padding = Format.Utils.Padding, pad = function(value, totalWidth) {
                    return padding.pad(value + "", {
                        totalWidth: totalWidth,
                        paddingChar: "0",
                        direction: padding.Direction.Left
                    });
                }, pad2 = function(value, totalWidth) {
                    if (totalWidth === void 0) {
                        totalWidth = 2;
                    }
                    return pad(value, Math.min(totalWidth, 2));
                }, customSpecifiers = DateTime.Specifiers.Custom;
            })(DateTime = Globalization.DateTime || (Globalization.DateTime = {}));
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Errors;
        (function(Errors) {
            var InvalidOperationError = function(_super) {
                function InvalidOperationError(message, innerError) {
                    _super.call(this, message, innerError);
                    this.name = "InvalidOperationError";
                }
                __extends(InvalidOperationError, _super);
                return InvalidOperationError;
            }(Errors.SystemError);
            Errors.InvalidOperationError = InvalidOperationError;
        })(Errors = Format.Errors || (Format.Errors = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var DateTime;
            (function(DateTime) {
                var InfoFormatter = function() {
                    function InfoFormatter(optionsProviderConstructor, formatInfo, options) {
                        var _this = this;
                        this.formatters_ = {
                            shortDate: function() {
                                return _this.specifiersFormatter_.format("MM/dd/yyyy", _this.value_);
                            },
                            longDate: function() {
                                return _this.specifiersFormatter_.format("dddd, dd MMMM yyyy", _this.value_);
                            },
                            fullDateShortTime: function() {
                                return _this.formatters_.longDate() + " " + _this.formatters_.shortTime();
                            },
                            fullDateLongTime: function() {
                                return _this.formatters_.longDate() + " " + _this.formatters_.longTime();
                            },
                            generalDateShortTime: function() {
                                return _this.formatters_.shortDate() + " " + _this.formatters_.shortTime();
                            },
                            generalDateLongTime: function() {
                                return _this.formatters_.shortDate() + " " + _this.formatters_.longTime();
                            },
                            monthDate: function() {
                                return _this.specifiersFormatter_.format("MMMM dd", _this.value_);
                            },
                            roundTrip: function() {
                                var result = JSON.stringify(_this.value_);
                                return result.substring(1, result.length - 1);
                            },
                            rfc1123: function() {
                                return _this.value_.toUTCString();
                            },
                            sortable: function() {
                                return _this.specifiersFormatter_.format("yyyy-MM-ddTHH':'mm':'ss", _this.value_);
                            },
                            shortTime: function() {
                                return _this.specifiersFormatter_.format("HH:mm", _this.value_);
                            },
                            longTime: function() {
                                return _this.specifiersFormatter_.format("HH:mm:ss", _this.value_);
                            },
                            universalSortable: function() {
                                return _this.specifiersFormatter_.format("yyyy-MM-dd HH':'mm':'ssZ", _this.value_);
                            },
                            universalFull: function() {
                                return _this.formatters_.fullDateLongTime();
                            },
                            yearMonth: function() {
                                return _this.specifiersFormatter_.format("yyyy MMMM", _this.value_);
                            }
                        };
                        if ("function" !== typeof optionsProviderConstructor) {
                            throw new TypeError("Cannot create an instance without a concrete options provider's constructor");
                        }
                        if (null == formatInfo) {
                            throw new Format.Errors.ArgumentNullError("formatInfo");
                        }
                        this.optionsProviderConstructor_ = optionsProviderConstructor;
                        this.formatInfo = formatInfo;
                        this.baseOptions_ = options || {};
                    }
                    InfoFormatter.prototype.format = function(format, value) {
                        try {
                            return this.innerFormat_(format, value);
                        } finally {
                            this.cleanup_();
                        }
                    };
                    InfoFormatter.prototype.applyOptions = function(value) {
                        var style = this.optionsProvider_.getStyle();
                        if (this.formatters_.hasOwnProperty(style)) {
                            return this.formatters_[style]();
                        }
                        throw new Format.Errors.ArgumentError("Option 'style' with base or resolved value '" + style + "' is not supported");
                    };
                    InfoFormatter.prototype.getSpecifiersFormatter = function() {
                        return new DateTime.InfoSpecifierFormatter(this.formatInfo);
                    };
                    InfoFormatter.prototype.innerFormat_ = function(format, value) {
                        if (!format) {
                            format = DateTime.Specifiers.Standard.generalDateLongTime;
                        }
                        this.optionsProvider_ = new this.optionsProviderConstructor_(this.baseOptions_);
                        this.resolvedOptions = this.optionsProvider_.resolveOptions(format, value);
                        if (!Format.Utils.isObject(this.resolvedOptions)) {
                            throw new Format.Errors.InvalidOperationError("Invocation of 'optionsProvider' member's method 'resolveOptions' did not initialize instance member 'resolvedOptions' properly");
                        }
                        this.setValue_(value);
                        this.specifiersFormatter_ = this.getSpecifiersFormatter();
                        return this.optionsProvider_.getStyle() ? this.applyOptions(this.value_) : this.specifiersFormatter_.format(format, this.value_);
                    };
                    InfoFormatter.prototype.setValue_ = function(value) {
                        this.value_ = value;
                        if (this.optionsProvider_.useUTC()) {
                            this.value_ = new Date(this.value_.getTime() + 6e4 * this.value_.getTimezoneOffset());
                        }
                    };
                    InfoFormatter.prototype.cleanup_ = function() {
                        delete this.resolvedOptions;
                        delete this.value_;
                        delete this.optionsProvider_;
                        delete this.specifiersFormatter_;
                    };
                    return InfoFormatter;
                }();
                DateTime.InfoFormatter = InfoFormatter;
            })(DateTime = Globalization.DateTime || (Globalization.DateTime = {}));
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var DateTime;
            (function(DateTime) {
                var Specifiers;
                (function(Specifiers) {
                    Specifiers.Standard = Format.Utils.mapValuesAsKeys({
                        shortDate: "d",
                        longDate: "D",
                        fullDateShortTime: "f",
                        fullDateLongTime: "F",
                        generalDateShortTime: "g",
                        generalDateLongTime: "G",
                        monthDate: "M",
                        roundTrip: "O",
                        rfc1123: "R",
                        sortable: "s",
                        shortTime: "t",
                        longTime: "T",
                        universalSortable: "u",
                        universalFull: "U",
                        yearMonth: "Y"
                    });
                })(Specifiers = DateTime.Specifiers || (DateTime.Specifiers = {}));
            })(DateTime = Globalization.DateTime || (Globalization.DateTime = {}));
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Utils;
        (function(Utils) {
            var createExtendObject, createCloneFunction = function(cloneFunc) {
                return function(object, deep) {
                    var objectIsArray = Utils.Polyfill.isArray(object);
                    if (objectIsArray || Utils.isObject(object)) {
                        return cloneFunc(object, deep, objectIsArray);
                    } else {
                        if (Utils.isType("Date", object)) {
                            return new Date(object.getTime());
                        }
                    }
                    return object;
                };
            };
            Utils.clone = createCloneFunction(function(object, deep, objectIsArray) {
                return deep ? Utils.deepExtend(createExtendObject(object, objectIsArray), object) : Utils.extend(createExtendObject(object, objectIsArray), object);
            });
            createExtendObject = function(object, objectIsArray) {
                return objectIsArray ? [] : {};
            };
            Utils.fastClone = createCloneFunction(function(object) {
                return JSON.parse(JSON.stringify(object));
            });
        })(Utils = Format.Utils || (Format.Utils = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Utils;
        (function(Utils) {
            var removeProperty, innerRemoveProperty, removePredicates = {
                undefined: function(value) {
                    return null == value;
                },
                "": function(value) {
                    return removePredicates.undefined(value) || "" === value;
                },
                0: function(value) {
                    return !value;
                }
            }, createRemoveFunction = function(predicateKey) {
                var context = {
                    removePredicate: removePredicates[predicateKey + ""]
                };
                return function(object, deep) {
                    context.seen = [];
                    context.deep = deep;
                    return removeProperty(object, context);
                };
            };
            Utils.removeUndefined = createRemoveFunction(void 0);
            Utils.removeEmpty = createRemoveFunction("");
            Utils.removeFalsy = createRemoveFunction(0);
            removeProperty = function(object, context) {
                var objectIsArray = Utils.Polyfill.isArray(object);
                if (objectIsArray || Utils.isObject(object)) {
                    context.seen.push(object);
                    for (context.key in object) {
                        if (object.hasOwnProperty(context.key)) {
                            innerRemoveProperty(object, context);
                        }
                    }
                }
                return objectIsArray ? Utils.Enumerable.compact(object) : object;
            };
            innerRemoveProperty = function(object, context) {
                var value = object[context.key];
                if (context.removePredicate(value)) {
                    delete object[context.key];
                } else {
                    if (context.deep && Utils.Polyfill.indexOf(context.seen, value) === -1) {
                        removeProperty(value, context);
                    }
                }
            };
        })(Utils = Format.Utils || (Format.Utils = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Utils;
        (function(Utils) {
            var Function;
            (function(Function) {
                function getName(func) {
                    validateFunctionArgument(func, "getName");
                    if (void 0 !== func.name) {
                        return func.name;
                    }
                    var typeNameGroups = typeNameRegExp.exec(func.toString());
                    return typeNameGroups && typeNameGroups[1] ? typeNameGroups[1] : "";
                }
                function getReturnName(func) {
                    validateFunctionArgument(func, "getReturnName");
                    var returnNameGroups = returnNameRegExp.exec(func.toString());
                    if (returnNameGroups) {
                        return returnNameGroups[1];
                    } else {
                        return void 0;
                    }
                }
                function getEmpty() {
                    return empty;
                }
                var typeNameRegExp, returnNameRegExp, validateFunctionArgument, empty;
                Function.getName = getName;
                typeNameRegExp = /function +(\w+)/;
                Function.getReturnName = getReturnName;
                returnNameRegExp = /(?:(?:=>)|(?:return\s))\s*(?:\w+\.)*([A-Za-z]+)/;
                validateFunctionArgument = function(func, methodName) {
                    if ("function" !== typeof func) {
                        throw new TypeError("Cannot call method '" + methodName + "' on non-functional objects");
                    }
                };
                Function.getEmpty = getEmpty;
                empty = function() {
                    return void 0;
                };
            })(Function = Utils.Function || (Utils.Function = {}));
        })(Utils = Format.Utils || (Format.Utils = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var DateTime;
            (function(DateTime) {
                var numeric, long, empty, IntlOptionsProvider = function() {
                    function IntlOptionsProvider(dateTimeOptions) {
                        var _this = this;
                        this.resolvers_ = {
                            shortDate: function() {
                                _this.options_.day = _this.options_.year = _this.options_.month = numeric;
                            },
                            longDate: function() {
                                _this.resolvers_.shortDate();
                                _this.resolvers_.monthDate();
                                _this.options_.weekday = long;
                            },
                            fullDateShortTime: function() {
                                _this.resolvers_.longDate();
                                _this.resolvers_.shortTime();
                            },
                            fullDateLongTime: function() {
                                _this.resolvers_.longDate();
                                _this.resolvers_.longTime();
                            },
                            generalDateShortTime: function() {
                                _this.resolvers_.shortDate();
                                _this.resolvers_.shortTime();
                            },
                            generalDateLongTime: function() {
                                _this.resolvers_.shortDate();
                                _this.resolvers_.longTime();
                            },
                            monthDate: function() {
                                _this.options_.day = numeric;
                                _this.options_.month = long;
                            },
                            roundTrip: empty,
                            rfc1123: empty,
                            sortable: empty,
                            shortTime: function() {
                                _this.options_.hour = _this.options_.minute = numeric;
                            },
                            longTime: function() {
                                _this.resolvers_.shortTime();
                                _this.options_.second = numeric;
                            },
                            universalSortable: function() {
                                _this.options_.toUTC = true;
                            },
                            universalFull: function() {
                                _this.resolvers_.fullDateLongTime();
                                _this.options_.toUTC = true;
                            },
                            yearMonth: function() {
                                _this.options_.year = numeric;
                                _this.options_.month = long;
                            }
                        };
                        if (null == dateTimeOptions) {
                            throw new Format.Errors.ArgumentNullError("dateTimeOptions");
                        }
                        this.options_ = Format.Utils.clone(dateTimeOptions);
                    }
                    IntlOptionsProvider.prototype.resolveOptions = function(format, value) {
                        if (this.tryInitializeSpecifierOptions_(format)) {
                            this.resolvers_[this.style_]();
                            this.options_.style = this.style_;
                        }
                        return Format.Utils.removeUndefined(this.options_);
                    };
                    IntlOptionsProvider.prototype.getStyle = function() {
                        return this.options_.style;
                    };
                    IntlOptionsProvider.prototype.useUTC = function() {
                        return this.options_.toUTC;
                    };
                    IntlOptionsProvider.prototype.tryInitializeSpecifierOptions_ = function(format) {
                        if (1 !== format.length) {
                            return false;
                        }
                        var standardSpecifiers = DateTime.Specifiers.Standard;
                        this.style_ = standardSpecifiers[format] || standardSpecifiers[format.toUpperCase()];
                        if (!this.style_) {
                            throw new Format.Errors.FormatError("Date and time format specifier '" + format + "' is invalid");
                        }
                        return true;
                    };
                    return IntlOptionsProvider;
                }();
                DateTime.IntlOptionsProvider = IntlOptionsProvider;
                numeric = "numeric", long = "long", empty = Format.Utils.Function.getEmpty();
            })(DateTime = Globalization.DateTime || (Globalization.DateTime = {}));
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Errors;
        (function(Errors) {
            var NotImplementedError = function(_super) {
                function NotImplementedError(methodName) {
                    _super.call(this, "Method '" + methodName + "' is not implemented or abstract");
                    this.name = "NotImplementedError";
                }
                __extends(NotImplementedError, _super);
                return NotImplementedError;
            }(Errors.SystemError);
            Errors.NotImplementedError = NotImplementedError;
        })(Errors = Format.Errors || (Format.Errors = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var DateTimeFormatInfo = function() {
                function DateTimeFormatInfo() {
                    var _i, args = [];
                    for (_i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    this.isWritable_ = void 0 === args[0];
                    this.locales_ = args[0] || "";
                    this.resolveFormatInfo_(this.locales_);
                }
                DateTimeFormatInfo.prototype.getFormatter = function(type) {
                    if (type !== Format.Utils.Types.Date) {
                        throw new Format.Errors.InvalidOperationError("The DateTimeFormatInfo object supports formatting numeric values only");
                    }
                    return this.formatter_;
                };
                DateTimeFormatInfo.prototype.resolveFormatInfo_ = function(locales) {
                    if (!locales) {
                        this.setInvariantFormatInfo_();
                        this.formatter_ = new Globalization.DateTime.InfoFormatter(Globalization.DateTime.IntlOptionsProvider, this);
                    } else {
                        if ("function" === typeof DateTimeFormatInfo.FormatterConstructor) {
                            this.formatter_ = new DateTimeFormatInfo.FormatterConstructor(this.locales_, this);
                        } else {
                            throw new Format.Errors.InvalidOperationError("No culture-variant formatter was found (load a sub-module implementation or set the FormatterConstructor property)");
                        }
                    }
                };
                DateTimeFormatInfo.prototype.setInvariantFormatInfo_ = function() {
                    this.AbbreviatedDayNames = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
                    this.AbbreviatedMonthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
                    this.DayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
                    this.MonthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
                    this.AMDesignator = "AM";
                    this.PMDesignator = "PM";
                    this.DateSeparator = "/";
                    this.TimeSeparator = ":";
                };
                return DateTimeFormatInfo;
            }();
            Globalization.DateTimeFormatInfo = DateTimeFormatInfo;
            DateTimeFormatInfo.InvariantInfo = new DateTimeFormatInfo("");
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var Numeric;
            (function(Numeric) {
                var Specifiers;
                (function(Specifiers) {
                    Specifiers.StandardSpecifierRexExp = /^([a-z])(\d*)$/i;
                    Specifiers.DefaultStandardExponentialPrecision = 6;
                    Specifiers.Standard = Format.Utils.mapValuesAsKeys({
                        currency: "C",
                        decimal: "D",
                        exponential: "E",
                        fixedPoint: "F",
                        general: "G",
                        number: "N",
                        percent: "P",
                        roundTrip: "R",
                        hex: "X"
                    });
                })(Specifiers = Numeric.Specifiers || (Numeric.Specifiers = {}));
            })(Numeric = Globalization.Numeric || (Globalization.Numeric = {}));
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var Numeric;
            (function(Numeric) {
                var DecorationFormatter = function() {
                    function DecorationFormatter(optionsProvider, formatInfo) {
                        if (null == optionsProvider) {
                            throw new Format.Errors.ArgumentNullError("optionsProvider");
                        }
                        if (null == formatInfo) {
                            throw new Format.Errors.ArgumentNullError("formatInfo");
                        }
                        this.style_ = optionsProvider.getStyle();
                        this.noDigits_ = optionsProvider.hasNoDigits();
                        this.upperCase_ = optionsProvider.isUpperCase();
                        this.useGrouping_ = optionsProvider.useGrouping();
                        this.noLeadingZeroIntegerDigit_ = optionsProvider.hasNoLeadingZeroIntegerDigit();
                        this.prefixDecorator_ = optionsProvider.getPrefixDecorator();
                        this.suffixDecorator_ = optionsProvider.getSuffixDecorator();
                        this.internalDecorators_ = optionsProvider.getInternalDecorators();
                        this.formatInfo_ = formatInfo;
                    }
                    DecorationFormatter.prototype.applyOptions = function(value, formattedValue) {
                        formattedValue = this.removeNegativeSign_(value, formattedValue);
                        formattedValue = this.applyDigitOptions_(value, formattedValue);
                        formattedValue = this.applyInternalDecorators_(formattedValue);
                        formattedValue = this.applyExternalDecorators_(formattedValue);
                        return this.applyNegativeSign_(value, formattedValue);
                    };
                    DecorationFormatter.prototype.applyUppercase = function(formattedValue) {
                        return this.upperCase_ ? formattedValue.toUpperCase() : formattedValue;
                    };
                    DecorationFormatter.prototype.applyGrouping = function(formattedValue) {
                        if (!this.useGrouping_) {
                            return formattedValue;
                        }
                        var decimalSeparator = this.getDecimalSeparator(), numericParts = formattedValue.split(decimalSeparator);
                        numericParts[0] = numericParts[0].replace(DecorationFormatter.groupSeparatorRegExp_, this.getGroupSeparator());
                        return numericParts.join(decimalSeparator);
                    };
                    DecorationFormatter.prototype.applyIntegerPadding = function(value, formattedValue, paddingWidth) {
                        var padding, decimalSeparator = this.getDecimalSeparator(), numericParts = formattedValue.split(decimalSeparator);
                        numericParts[0] = this.removeNegativeSign_(value, numericParts[0]);
                        if (numericParts[0].length < paddingWidth) {
                            padding = Format.Utils.Padding;
                            numericParts[0] = padding.pad(numericParts[0], {
                                totalWidth: paddingWidth,
                                paddingChar: "0",
                                direction: padding.Direction.Left
                            });
                        }
                        return numericParts.join(decimalSeparator);
                    };
                    DecorationFormatter.prototype.getDecimalSeparator = function(formatInfo) {
                        formatInfo = formatInfo || this.formatInfo_;
                        return this.isCurrency_() ? formatInfo.CurrencyDecimalSeparator : formatInfo.NumberDecimalSeparator;
                    };
                    DecorationFormatter.prototype.getGroupSeparator = function(formatInfo) {
                        formatInfo = formatInfo || this.formatInfo_;
                        return this.isCurrency_() ? formatInfo.CurrencyGroupSeparator : formatInfo.NumberGroupSeparator;
                    };
                    DecorationFormatter.prototype.isCurrency_ = function() {
                        var styles = Numeric.Specifiers.Standard;
                        return this.style_ === styles[styles.decimal];
                    };
                    DecorationFormatter.prototype.removeNegativeSign_ = function(value, formattedValue) {
                        if (this.restoreNegativeSign_) {
                            return formattedValue;
                        }
                        this.restoreNegativeSign_ = value < 0 && formattedValue[0] === this.formatInfo_.NegativeSign;
                        return this.restoreNegativeSign_ ? formattedValue.substring(1) : formattedValue;
                    };
                    DecorationFormatter.prototype.applyDigitOptions_ = function(value, formattedValue) {
                        if (this.noDigits_) {
                            return "";
                        } else {
                            return this.shouldRemoveLeadingZero_(value) ? formattedValue = formattedValue.substring(1) : formattedValue;
                        }
                    };
                    DecorationFormatter.prototype.shouldRemoveLeadingZero_ = function(value) {
                        var styles = Numeric.Specifiers.Standard;
                        return this.noLeadingZeroIntegerDigit_ && this.style_ !== styles[styles.exponential] && this.style_ !== styles[styles.roundTrip] && this.style_ !== styles[styles.general] && this.style_ !== styles[styles.hex] && Math.abs(value) < 1;
                    };
                    DecorationFormatter.prototype.applyInternalDecorators_ = function(formattedValue) {
                        var decimalSeparator, numericParts, key;
                        if (!this.internalDecorators_) {
                            return formattedValue;
                        }
                        decimalSeparator = this.getDecimalSeparator(), numericParts = formattedValue.split(decimalSeparator);
                        this.decimalOffset_ = 0;
                        for (key in this.internalDecorators_) {
                            if (this.internalDecorators_.hasOwnProperty(key)) {
                                this.applyInternalDecorator_(numericParts, +key, this.internalDecorators_[key]);
                            }
                        }
                        return numericParts.join(decimalSeparator);
                    };
                    DecorationFormatter.prototype.applyInternalDecorator_ = function(numericParts, index, decorator) {
                        var decimalPart, integralPart = numericParts[0], insert = Format.Utils.Text.insert;
                        if (index < 0) {
                            index += integralPart.length + 1;
                            numericParts[0] = insert(integralPart, Math.max(0, index), decorator);
                        } else {
                            index += this.decimalOffset_;
                            this.decimalOffset_ += decorator.length;
                            decimalPart = numericParts[1];
                            if (decimalPart) {
                                numericParts[1] = insert(decimalPart, index, decorator);
                            } else {
                                numericParts[0] = insert(integralPart, Math.min(index, integralPart.length), decorator);
                            }
                        }
                    };
                    DecorationFormatter.prototype.applyExternalDecorators_ = function(formattedValue) {
                        if (this.prefixDecorator_) {
                            formattedValue = this.prefixDecorator_ + formattedValue;
                        }
                        if (this.suffixDecorator_) {
                            formattedValue += this.suffixDecorator_;
                        }
                        return formattedValue;
                    };
                    DecorationFormatter.prototype.applyNegativeSign_ = function(value, formattedValue) {
                        return this.restoreNegativeSign_ ? this.formatInfo_.NegativeSign + formattedValue : formattedValue;
                    };
                    DecorationFormatter.groupSeparatorRegExp_ = /\B(?=(\d{3})+(?!\d))/g;
                    return DecorationFormatter;
                }();
                Numeric.DecorationFormatter = DecorationFormatter;
            })(Numeric = Globalization.Numeric || (Globalization.Numeric = {}));
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var Numeric;
            (function(Numeric) {
                var ExponentialFormatter = function() {
                    function ExponentialFormatter(optionsProvider) {
                        var _this = this;
                        this.resolvers_ = {
                            "0": function(digitChar, customState) {
                                return customState.nonZeroEncountered_ ? _this.resolveDigit_(digitChar, customState) : "";
                            },
                            ".": function(digitChar, customState) {
                                customState.afterDecimal_ = true;
                                return "";
                            },
                            "-": function(digitChar) {
                                return digitChar;
                            }
                        };
                        if (null == optionsProvider) {
                            throw new Format.Errors.ArgumentNullError("optionsProvider");
                        }
                        this.minimumIntegerDigits_ = this.floorOption_(optionsProvider.getMinimumIntegerDigits());
                        this.minimumFractionDigits_ = this.floorOption_(optionsProvider.getMinimumFractionDigits());
                        this.maximumFractionDigits_ = this.floorOption_(optionsProvider.getMaximumFractionDigits());
                        this.minimumExponentDigits_ = this.floorOption_(optionsProvider.getMinimumExponentDigits());
                        this.negativellySignedExponent_ = optionsProvider.isNegativellySignedExponent();
                    }
                    ExponentialFormatter.prototype.applyOptions = function(value) {
                        var _this = this;
                        this.validateOption_(function() {
                            return _this.minimumIntegerDigits_;
                        }, 1);
                        if (this.minimumIntegerDigits_ > 1) {
                            this.validateCustomOptions_();
                            return this.toCustomExponential_(value);
                        }
                        return this.toExponential_(value);
                    };
                    ExponentialFormatter.prototype.applyExponentPadding = function(formattedExponentialValue) {
                        var exponentIndex, paddedExponent, _this = this;
                        this.validateOption_(function() {
                            return _this.minimumExponentDigits_;
                        }, 1);
                        if (this.minimumExponentDigits_ > 1) {
                            exponentIndex = formattedExponentialValue.lastIndexOf("e") + 2, paddedExponent = this.getPaddedExponent_(formattedExponentialValue.substring(exponentIndex));
                            formattedExponentialValue = formattedExponentialValue.substring(0, exponentIndex) + paddedExponent;
                        }
                        return formattedExponentialValue;
                    };
                    ExponentialFormatter.prototype.floorOption_ = function(optionValue) {
                        return null != optionValue ? Math.floor(optionValue) : void 0;
                    };
                    ExponentialFormatter.prototype.validateOption_ = function(optionSelector, minValue) {
                        var optionValue = optionSelector();
                        if (void 0 !== optionValue && (!isFinite(optionValue) || optionValue < minValue)) {
                            throw new Format.Errors.ArgumentError("Option '" + Format.Utils.Function.getReturnName(optionSelector) + "' with value '" + optionValue + "' must be finite and greater than or equal to " + minValue);
                        }
                    };
                    ExponentialFormatter.prototype.validateCustomOptions_ = function() {
                        var _this = this;
                        this.validateOption_(function() {
                            return _this.minimumFractionDigits_;
                        }, 0);
                        this.validateOption_(function() {
                            return _this.maximumFractionDigits_;
                        }, 0);
                        this.validateOption_(function() {
                            return _this.minimumExponentDigits_;
                        }, 1);
                        if (this.minimumFractionDigits_ > this.maximumFractionDigits_) {
                            throw new RangeError("Argument 'minimumFractionDigits=" + this.minimumFractionDigits_ + "' cannot be greater than argument 'maximumFractionDigits=" + this.maximumFractionDigits_ + "'");
                        }
                    };
                    ExponentialFormatter.prototype.toExponential_ = function(value) {
                        var exponentialValue = Format.Utils.Numeric.toExponentialMinMax(value, this.minimumFractionDigits_, this.maximumFractionDigits_);
                        exponentialValue = this.applyExponentPadding(exponentialValue);
                        exponentialValue = this.applyExponentSigning_(exponentialValue);
                        return exponentialValue;
                    };
                    ExponentialFormatter.prototype.getPaddedExponent_ = function(exponent) {
                        var padding = Format.Utils.Padding;
                        return padding.pad(exponent, {
                            totalWidth: this.minimumExponentDigits_,
                            direction: padding.Direction.Left,
                            paddingChar: "0"
                        });
                    };
                    ExponentialFormatter.prototype.applyExponentSigning_ = function(exponentialValue) {
                        if (this.negativellySignedExponent_) {
                            var positiveExponentSignIndex = exponentialValue.lastIndexOf("+");
                            if (positiveExponentSignIndex > 0) {
                                exponentialValue = exponentialValue.substring(0, positiveExponentSignIndex) + exponentialValue.substring(positiveExponentSignIndex + 1);
                            }
                        }
                        return exponentialValue;
                    };
                    ExponentialFormatter.prototype.toCustomExponential_ = function(value) {
                        return this.resolveFromState_({
                            index_: 0,
                            digits_: value.toString(),
                            power_: -this.minimumIntegerDigits_,
                            offset_: this.minimumIntegerDigits_,
                            nonZeroEncountered_: false,
                            afterDecimal_: false
                        });
                    };
                    ExponentialFormatter.prototype.resolveFromState_ = function(customState) {
                        var len, exponentialValue = "";
                        for (len = customState.digits_.length; customState.index_ < len; customState.index_ += 1) {
                            exponentialValue += this.resolveFromDigit_(customState);
                        }
                        return this.resolveOffset_(exponentialValue, customState) + this.resolveExponent_(customState);
                    };
                    ExponentialFormatter.prototype.resolveFromDigit_ = function(customState) {
                        var digit = customState.digits_[customState.index_], resolver = this.resolvers_[digit];
                        digit = resolver ? resolver(digit, customState) : this.resolveNonZeroDigit_(digit, customState);
                        return !digit ? "" : digit + this.resolveDecimalPoint_(customState);
                    };
                    ExponentialFormatter.prototype.resolveNonZeroDigit_ = function(digitChar, customState) {
                        if (!customState.nonZeroEncountered_) {
                            customState.nonZeroEncountered_ = true;
                        }
                        return this.resolveDigit_(digitChar, customState);
                    };
                    ExponentialFormatter.prototype.resolveDigit_ = function(digitChar, customState) {
                        this.resolvePowerState_(customState);
                        this.resolveDigitState_(customState);
                        if (void 0 !== this.maximumFractionDigits_) {
                            if (customState.decimalDigits_ > this.maximumFractionDigits_) {
                                return "";
                            } else {
                                if (customState.decimalDigits_ === this.maximumFractionDigits_) {
                                    return this.resolveDigitRounding_(digitChar, customState);
                                }
                            }
                        }
                        return digitChar;
                    };
                    ExponentialFormatter.prototype.resolvePowerState_ = function(customState) {
                        if (customState.nonZeroEncountered_) {
                            customState.offset_ -= 1;
                            if (!customState.afterDecimal_) {
                                customState.power_ += 1;
                            }
                        } else {
                            if (customState.afterDecimal_) {
                                customState.power_ -= 1;
                            }
                        }
                    };
                    ExponentialFormatter.prototype.resolveDigitState_ = function(customState) {
                        if (customState.decimalDigits_ >= 0) {
                            customState.decimalDigits_ += 1;
                        }
                        if (0 === customState.offset_) {
                            customState.decimalDigits_ = 0;
                        }
                    };
                    ExponentialFormatter.prototype.resolveDigitRounding_ = function(digitChar, customState) {
                        var nextDigit = +customState.digits_[customState.index_ + 1];
                        if (isNaN(nextDigit)) {
                            nextDigit = +customState.digits_[customState.index_ + 2];
                        }
                        return nextDigit >= 5 ? +digitChar + 1 + "" : digitChar;
                    };
                    ExponentialFormatter.prototype.resolveDecimalPoint_ = function(customState) {
                        return 0 === customState.offset_ && 0 !== this.maximumFractionDigits_ ? "." : "";
                    };
                    ExponentialFormatter.prototype.resolveOffset_ = function(exponentialValue, customState) {
                        var decimalOffset, padding = Format.Utils.Padding;
                        if (customState.offset_ > 0) {
                            exponentialValue = padding.pad(exponentialValue, {
                                totalWidth: exponentialValue.length + customState.offset_,
                                paddingChar: "0"
                            });
                            if (this.minimumFractionDigits_ > 0) {
                                exponentialValue += ".";
                            }
                        }
                        decimalOffset = this.minimumFractionDigits_ - (customState.decimalDigits_ || 0);
                        if (decimalOffset > 0) {
                            exponentialValue = padding.pad(exponentialValue, {
                                totalWidth: exponentialValue.length + decimalOffset,
                                paddingChar: "0"
                            });
                        }
                        return exponentialValue;
                    };
                    ExponentialFormatter.prototype.resolveExponent_ = function(customState) {
                        var paddedExponent = Math.abs(customState.power_).toString(), sign = customState.power_ < 0 ? "-" : this.negativellySignedExponent_ ? "" : "+";
                        if (this.minimumExponentDigits_ > 1) {
                            paddedExponent = this.getPaddedExponent_(paddedExponent);
                        }
                        return "e" + sign + paddedExponent;
                    };
                    return ExponentialFormatter;
                }();
                Numeric.ExponentialFormatter = ExponentialFormatter;
            })(Numeric = Globalization.Numeric || (Globalization.Numeric = {}));
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var Numeric;
            (function(Numeric) {
                var InfoFormatter = function() {
                    function InfoFormatter(optionsProviderConstructor, formatInfo, options) {
                        var _this = this;
                        this.formatters_ = {
                            currency: function() {
                                throw new Format.Errors.NotImplementedError("currency");
                            },
                            decimal: function() {
                                var minimumIntegerDigits = _this.optionsProvider_.getMinimumSignificantDigits();
                                if (void 0 === minimumIntegerDigits) {
                                    minimumIntegerDigits = _this.optionsProvider_.getMinimumIntegerDigits();
                                }
                                return _this.decorationFormatter.applyIntegerPadding(_this.value_, _this.value_.toFixed(0), minimumIntegerDigits);
                            },
                            exponential: function() {
                                var exponentialFormatter = new Numeric.ExponentialFormatter(_this.optionsProvider_), result = exponentialFormatter.applyOptions(_this.value_);
                                return _this.decorationFormatter.applyUppercase(result);
                            },
                            fixedPoint: function() {
                                return _this.applyDecimalFormat_();
                            },
                            general: function() {
                                var result, maximumSignificantDigits = _this.optionsProvider_.getMaximumSignificantDigits(), exponentialFormatter = new Numeric.ExponentialFormatter(_this.optionsProvider_);
                                if (Math.abs(_this.value_) < 1e-4) {
                                    result = exponentialFormatter.applyOptions(_this.value_);
                                } else {
                                    result = Format.Utils.Numeric.toPrecisionMinMax(_this.value_, void 0, maximumSignificantDigits);
                                    result = exponentialFormatter.applyExponentPadding(result);
                                }
                                return _this.decorationFormatter.applyUppercase(result);
                            },
                            number: function() {
                                return _this.applyDecimalFormat_();
                            },
                            percent: function() {
                                _this.value_ *= 100;
                                return _this.formatters_.number() + " %";
                            },
                            roundTrip: function() {
                                return JSON.stringify(_this.value_);
                            },
                            hex: function() {
                                var decorationFormatter, result, minimumHexDigits = _this.optionsProvider_.getMinimumSignificantDigits();
                                if (void 0 === minimumHexDigits) {
                                    minimumHexDigits = _this.optionsProvider_.getMinimumIntegerDigits();
                                }
                                decorationFormatter = _this.decorationFormatter, result = decorationFormatter.applyIntegerPadding(_this.value_, _this.value_.toString(16), minimumHexDigits);
                                return decorationFormatter.applyUppercase(result);
                            }
                        };
                        if ("function" !== typeof optionsProviderConstructor) {
                            throw new TypeError("Cannot create an instance without a concrete options provider's constructor");
                        }
                        if (null == formatInfo) {
                            throw new Format.Errors.ArgumentNullError("formatInfo");
                        }
                        this.optionsProviderConstructor_ = optionsProviderConstructor;
                        this.formatInfo = formatInfo;
                        this.baseOptions_ = options || {};
                    }
                    InfoFormatter.prototype.format = function(format, value) {
                        try {
                            return this.innerFormat_(format, value);
                        } finally {
                            this.cleanup_();
                        }
                    };
                    InfoFormatter.prototype.applyOptions = function(value) {
                        var decorationFormatter, result, style = this.optionsProvider_.getStyle();
                        if (style) {
                            if (this.formatters_.hasOwnProperty(style)) {
                                return this.formatters_[style]();
                            }
                            throw new Format.Errors.ArgumentError("Option 'style' with base or resolved value '" + style + "' is not supported");
                        }
                        decorationFormatter = this.decorationFormatter, result = Format.Utils.Numeric.toFixedMinMax(this.value_, this.optionsProvider_.getMinimumFractionDigits(), this.optionsProvider_.getMaximumFractionDigits());
                        result = decorationFormatter.applyIntegerPadding(this.value_, result, this.optionsProvider_.getMinimumIntegerDigits());
                        return decorationFormatter.applyGrouping(result);
                    };
                    InfoFormatter.prototype.innerFormat_ = function(format, value) {
                        this.optionsProvider_ = new this.optionsProviderConstructor_(this.baseOptions_);
                        this.resolvedOptions = this.optionsProvider_.resolveOptions(format, value);
                        if (!Format.Utils.isObject(this.resolvedOptions)) {
                            throw new Format.Errors.InvalidOperationError("Invocation of 'optionsProvider' member's method 'resolveOptions' did not initialize instance member 'resolvedOptions' properly");
                        }
                        this.setValue_(value);
                        this.decorationFormatter = new Numeric.DecorationFormatter(this.optionsProvider_, this.formatInfo);
                        return this.decorationFormatter.applyOptions(this.value_, this.applyOptions(this.value_));
                    };
                    InfoFormatter.prototype.setValue_ = function(value) {
                        this.value_ = value;
                        var valueDivisor = this.optionsProvider_.getValueDivisor();
                        if (valueDivisor) {
                            this.value_ /= valueDivisor;
                        }
                    };
                    InfoFormatter.prototype.cleanup_ = function() {
                        delete this.resolvedOptions;
                        delete this.decorationFormatter;
                        delete this.value_;
                        delete this.optionsProvider_;
                    };
                    InfoFormatter.prototype.applyDecimalFormat_ = function() {
                        var maximumFractionDigits, formatInfo = this.formatInfo, minimumFractionDigits = this.optionsProvider_.getMinimumFractionDigits();
                        if (void 0 === minimumFractionDigits) {
                            minimumFractionDigits = formatInfo.NumberDecimalDigits;
                        }
                        maximumFractionDigits = this.optionsProvider_.getMaximumFractionDigits();
                        if (void 0 === maximumFractionDigits) {
                            maximumFractionDigits = formatInfo.NumberDecimalDigits;
                        }
                        return this.decorationFormatter.applyGrouping(Format.Utils.Numeric.toFixedMinMax(this.value_, minimumFractionDigits, maximumFractionDigits));
                    };
                    return InfoFormatter;
                }();
                Numeric.InfoFormatter = InfoFormatter;
            })(Numeric = Globalization.Numeric || (Globalization.Numeric = {}));
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var Numeric;
            (function(Numeric) {
                var Specifiers;
                (function(Specifiers) {
                    var IntlStandardOptionsProvider = function() {
                        function IntlStandardOptionsProvider(numberOptions) {
                            var _this = this;
                            this.resolvers_ = {
                                currency: function() {
                                    _this.options_.useGrouping = true;
                                    _this.options_.minimumFractionDigits = _this.precision_;
                                    _this.options_.maximumFractionDigits = _this.precision_;
                                },
                                decimal: function() {
                                    _this.options_.minimumIntegerDigits = _this.precision_;
                                    _this.options_.maximumFractionDigits = 0;
                                },
                                exponential: function() {
                                    var precision = _this.precision_ >= 0 ? _this.precision_ : Specifiers.DefaultStandardExponentialPrecision;
                                    _this.options_.upperCase = _this.specifier_ === _this.specifier_.toUpperCase();
                                    _this.options_.minimumFractionDigits = precision;
                                    _this.options_.maximumFractionDigits = precision;
                                    _this.options_.minimumExponentDigits = 3;
                                },
                                fixedPoint: function() {
                                    _this.options_.minimumFractionDigits = _this.precision_;
                                    _this.options_.maximumFractionDigits = _this.precision_;
                                },
                                general: function() {
                                    _this.options_.minimumExponentDigits = 2;
                                    _this.options_.upperCase = _this.specifier_ === _this.specifier_.toUpperCase();
                                    if (_this.precision_ >= 1) {
                                        _this.options_.maximumSignificantDigits = _this.precision_;
                                        _this.options_.maximumFractionDigits = _this.precision_ >= 1 ? _this.precision_ - 1 : void 0;
                                    }
                                },
                                number: function() {
                                    _this.resolvers_.fixedPoint();
                                    _this.options_.useGrouping = true;
                                },
                                percent: function() {
                                    _this.resolvers_.number();
                                },
                                roundTrip: Format.Utils.Function.getEmpty(),
                                hex: function() {
                                    _this.options_.minimumSignificantDigits = _this.precision_;
                                    _this.options_.upperCase = _this.specifier_ === _this.specifier_.toUpperCase();
                                }
                            };
                            if (null == numberOptions) {
                                throw new Format.Errors.ArgumentNullError("numberOptions");
                            }
                            this.options_ = numberOptions;
                        }
                        IntlStandardOptionsProvider.prototype.resolveOptions = function(format, value) {
                            if (this.tryInitializeSpecifierOptions_(format)) {
                                this.resolvers_[this.style_]();
                                this.options_.style = this.style_;
                                return Format.Utils.removeUndefined(this.options_);
                            }
                        };
                        IntlStandardOptionsProvider.prototype.tryInitializeSpecifierOptions_ = function(format) {
                            var standardSpecifierGroups = Specifiers.StandardSpecifierRexExp.exec(format);
                            if (!standardSpecifierGroups) {
                                return false;
                            }
                            this.specifier_ = standardSpecifierGroups[1];
                            this.style_ = Specifiers.Standard[this.specifier_.toUpperCase()];
                            if (!this.style_) {
                                throw new Format.Errors.FormatError("Numeric format specifier '" + format + "' is invalid");
                            }
                            this.precision_ = "" !== standardSpecifierGroups[2] ? +standardSpecifierGroups[2] : void 0;
                            return true;
                        };
                        return IntlStandardOptionsProvider;
                    }();
                    Specifiers.IntlStandardOptionsProvider = IntlStandardOptionsProvider;
                })(Specifiers = Numeric.Specifiers || (Numeric.Specifiers = {}));
            })(Numeric = Globalization.Numeric || (Globalization.Numeric = {}));
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var Numeric;
            (function(Numeric) {
                var Specifiers;
                (function(Specifiers) {
                    Specifiers.CustomExponentRexExp = /^E([-\+]?)(0+)/i;
                    Specifiers.Custom = Format.Utils.mapValuesAsKeys({
                        zeroPlaceholder: "0",
                        digitPlaceholder: "#",
                        decimalPoint: ".",
                        groupSeparatorOrNumberScaling: ",",
                        percentagePlaceholder: "%",
                        perMillePlaceholder: "‰",
                        exponent: "E",
                        escapeChar: "\\",
                        literalStringDelimeterSingle: "'",
                        literalStringDelimeterDouble: '"',
                        sectionSeparator: ";"
                    });
                })(Specifiers = Numeric.Specifiers || (Numeric.Specifiers = {}));
            })(Numeric = Globalization.Numeric || (Globalization.Numeric = {}));
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Utils;
        (function(Utils) {
            var Lazy = function() {
                function Lazy(valueFactory) {
                    if (null == valueFactory) {
                        throw new Format.Errors.ArgumentNullError("valueFactory");
                    }
                    this.valueCreated = false;
                    this.valueFactory = valueFactory;
                }
                Lazy.fromConstructor = function(valueConstructor) {
                    if (null == valueConstructor) {
                        throw new Format.Errors.ArgumentNullError("valueConstructor");
                    }
                    var instance = new Lazy(Utils.Function.getEmpty());
                    instance.valueConstructor = valueConstructor;
                    return instance;
                };
                Lazy.prototype.getValue = function() {
                    if (this.valueError) {
                        throw this.valueError;
                    }
                    if (!this.valueCreated) {
                        this.value = this.lazyInitValue();
                    }
                    return this.value;
                };
                Lazy.prototype.isValueCreated = function() {
                    return this.valueCreated;
                };
                Lazy.prototype.lazyInitValue = function() {
                    try {
                        return this.createValue();
                    } catch (error) {
                        throw this.valueError = new Format.Errors.InvalidOperationError("Lazy value initializer threw an error: " + error.message, error);
                    } finally {
                        this.valueCreated = true;
                    }
                };
                Lazy.prototype.createValue = function() {
                    return this.valueConstructor ? new this.valueConstructor() : this.valueFactory();
                };
                return Lazy;
            }();
            Utils.Lazy = Lazy;
        })(Utils = Format.Utils || (Format.Utils = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var Numeric;
            (function(Numeric) {
                var Specifiers;
                (function(Specifiers) {
                    var empty, CustomParser = function() {
                        function CustomParser(format) {
                            var _this = this;
                            this.getLookahead_ = function() {
                                var lookahead = _this;
                                if (_this.index_ < _this.format_.length - 1) {
                                    lookahead = Format.Utils.clone(_this);
                                    lookahead.index_ += 1;
                                    lookahead.escapeOne_ = false;
                                    lookahead.doDetachedParse_();
                                }
                                return lookahead;
                            };
                            if (null == format) {
                                throw new Format.Errors.ArgumentNullError("format");
                            }
                            this.index_ = 0;
                            this.format_ = format;
                            this.lookahead_ = new Format.Utils.Lazy(this.getLookahead_);
                        }
                        CustomParser.getSections = function(format) {
                            var parser = new CustomParser(format);
                            parser.sections_ = [ "", "", "" ];
                            parser.sectionIndex_ = 0;
                            parser.doDetachedParse_();
                            return parser.sections_;
                        };
                        CustomParser.prototype.getCurrentChar = function() {
                            return this.secondaryExponent_ || this.format_[this.index_];
                        };
                        CustomParser.prototype.getDigitsBeforeDecimal = function() {
                            return this.exponentMatchIndex_ >= 0 ? this.getNumberPlaceholderCountBeforeDecimal_() : this.getZeroPlaceholderCountBeforeDecimal_();
                        };
                        CustomParser.prototype.getNumberPlaceholderCountAfterDecimal = function() {
                            if (this.isAfterDecimal()) {
                                return this.innerNumericSpecifiersIndex_ - this.decimalPointIndex_;
                            } else {
                                return 0;
                            }
                        };
                        CustomParser.prototype.getZeroPlaceholderCountAfterDecimal = function() {
                            if (this.lastZeroSpecifierIndex_ >= this.decimalPointIndex_) {
                                return this.lastZeroSpecifierIndex_ - this.decimalPointIndex_;
                            } else {
                                return 0;
                            }
                        };
                        CustomParser.prototype.getExponentSign = function() {
                            return this.exponentGroups_[1];
                        };
                        CustomParser.prototype.getExponentPlaceholderCount = function() {
                            return Math.min(this.exponentGroups_[2].length, 10);
                        };
                        CustomParser.prototype.getIndexFromDecimal = function() {
                            var lookahead, offset = this.decimalPointIndex_;
                            if (!this.isAfterDecimal()) {
                                lookahead = this.lookahead_.getValue();
                                offset = lookahead.decimalPointIndex_ || lookahead.innerNumericSpecifiersIndex_ + 1;
                                if (lookahead.lastGroupSeparatorIndex_ > this.firstNumericSpecifierIndex_) {
                                    offset += Math.floor((offset - this.innerNumericSpecifiersIndex_ - 2) / 3);
                                }
                            }
                            return this.innerNumericSpecifiersIndex_ - offset;
                        };
                        CustomParser.prototype.isAfterDecimal = function() {
                            return this.decimalPointIndex_ >= 0;
                        };
                        CustomParser.prototype.isBeforeNumericSpecifiers = function() {
                            return void 0 === this.firstNumericSpecifierIndex_;
                        };
                        CustomParser.prototype.isAfterNumericSpecifiers = function() {
                            return this.index_ > this.lookahead_.getValue().lastNumericSpecifierIndex_;
                        };
                        CustomParser.prototype.isImmediateAfterNumericSpecifiers = function() {
                            var lookahead = this.lookahead_.getValue();
                            if (lookahead.lastNumericSpecifierIndex_ + 1 === this.index_) {
                                lookahead.lastNumericSpecifierIndex_ += 1;
                                return true;
                            }
                            return false;
                        };
                        CustomParser.prototype.isExponentMatched = function() {
                            return this.index_ === this.exponentMatchIndex_;
                        };
                        CustomParser.prototype.isExponentUppercase = function() {
                            var exponentSpecifier = this.exponentGroups_[0][0];
                            return exponentSpecifier === exponentSpecifier.toUpperCase();
                        };
                        CustomParser.prototype.doParse = function(resolvers, charResolver) {
                            var len, handlers = this.getHandlers_();
                            for (len = this.format_.length; this.index_ < len; this.index_ += 1) {
                                this.addToSection_();
                                this.handleSpecifier_(handlers, resolvers, charResolver);
                                this.addExponentOffset_();
                            }
                        };
                        CustomParser.prototype.doDetachedParse_ = function() {
                            this.doParse(void 0, void 0);
                        };
                        CustomParser.prototype.addToSection_ = function() {
                            if (this.sections_ && this.sectionIndex_ < 3 && (this.escapeOne_ || this.escapeManyChar_ || this.getCurrentChar() !== Specifiers.Custom.sectionSeparator)) {
                                this.sections_[this.sectionIndex_] += this.getCurrentChar();
                            }
                        };
                        CustomParser.prototype.handleSpecifier_ = function(handlers, resolvers, charResolver) {
                            var customSpecifier = Specifiers.Custom[this.getCurrentChar().toUpperCase()], resolver = resolvers && resolvers[customSpecifier], handler = handlers[customSpecifier];
                            if (this.canHandleSpecifier_(handler)) {
                                handler();
                                if (resolver) {
                                    resolver();
                                }
                            } else {
                                if (charResolver) {
                                    charResolver();
                                }
                                this.escapeOne_ = false;
                            }
                        };
                        CustomParser.prototype.canHandleSpecifier_ = function(handler) {
                            return !this.escapeOne_ && handler && !(this.escapeManyChar_ && this.getCurrentChar() !== this.escapeManyChar_);
                        };
                        CustomParser.prototype.addExponentOffset_ = function() {
                            if (this.isExponentMatched()) {
                                this.index_ += this.exponentGroups_[0].length - 1;
                            } else {
                                if (this.secondaryExponent_) {
                                    this.index_ += this.secondaryExponent_.length - 1;
                                    delete this.secondaryExponent_;
                                }
                            }
                        };
                        CustomParser.prototype.handleNumericSpecifier_ = function() {
                            this.lastNumericSpecifierIndex_ = this.index_;
                            if (void 0 === this.firstNumericSpecifierIndex_) {
                                this.firstNumericSpecifierIndex_ = this.index_;
                                this.innerNumericSpecifiersIndex_ = 0;
                            } else {
                                this.innerNumericSpecifiersIndex_ += 1;
                            }
                        };
                        CustomParser.prototype.handleLiteralStringDelimeter_ = function() {
                            var currentChar = this.getCurrentChar();
                            this.escapeManyChar_ = this.escapeManyChar_ !== currentChar ? currentChar : void 0;
                        };
                        CustomParser.prototype.getExponentGroups_ = function() {
                            if (!this.lookahead_.isValueCreated()) {
                                return this.matchExponent_();
                            }
                            var lookahead = this.lookahead_.getValue();
                            if (lookahead.exponentMatchIndex_ === this.index_) {
                                return lookahead.exponentGroups_;
                            } else {
                                return void 0;
                            }
                        };
                        CustomParser.prototype.matchExponent_ = function() {
                            return Specifiers.CustomExponentRexExp.exec(this.format_.substring(this.index_));
                        };
                        CustomParser.prototype.getNumberPlaceholderCountBeforeDecimal_ = function() {
                            if (!this.isAfterDecimal()) {
                                return this.innerNumericSpecifiersIndex_ + 1;
                            }
                            if (this.decimalPointIndex_ > 0) {
                                return this.decimalPointIndex_;
                            } else {
                                return void 0;
                            }
                        };
                        CustomParser.prototype.getZeroPlaceholderCountBeforeDecimal_ = function() {
                            var numberPlaceholderCountBeforeDecimal = this.getNumberPlaceholderCountBeforeDecimal_();
                            if (numberPlaceholderCountBeforeDecimal > this.firstZeroSpecifierIndex_) {
                                return numberPlaceholderCountBeforeDecimal - this.firstZeroSpecifierIndex_;
                            } else {
                                return void 0;
                            }
                        };
                        CustomParser.prototype.getHandlers_ = function() {
                            var _this = this;
                            return {
                                zeroPlaceholder: function() {
                                    _this.handleNumericSpecifier_();
                                    _this.lastZeroSpecifierIndex_ = _this.innerNumericSpecifiersIndex_;
                                    if (void 0 === _this.firstZeroSpecifierIndex_) {
                                        _this.firstZeroSpecifierIndex_ = _this.innerNumericSpecifiersIndex_;
                                    }
                                },
                                digitPlaceholder: function() {
                                    _this.handleNumericSpecifier_();
                                },
                                decimalPoint: function() {
                                    _this.handleNumericSpecifier_();
                                    if (void 0 === _this.decimalPointIndex_) {
                                        _this.decimalPointIndex_ = _this.innerNumericSpecifiersIndex_;
                                    }
                                },
                                groupSeparatorOrNumberScaling: function() {
                                    if (!_this.isAfterDecimal()) {
                                        _this.lastGroupSeparatorIndex_ = _this.index_;
                                    }
                                },
                                exponent: function() {
                                    var exponentGroups, secondaryExponent;
                                    if (!_this.exponentGroups_) {
                                        exponentGroups = _this.getExponentGroups_();
                                        if (exponentGroups) {
                                            _this.exponentGroups_ = exponentGroups;
                                            _this.exponentMatchIndex_ = _this.index_;
                                        }
                                    } else {
                                        secondaryExponent = _this.matchExponent_();
                                        if (secondaryExponent) {
                                            _this.secondaryExponent_ = secondaryExponent[0];
                                        }
                                    }
                                },
                                escapeChar: function() {
                                    _this.escapeOne_ = true;
                                },
                                literalStringDelimeterSingle: function() {
                                    _this.handleLiteralStringDelimeter_();
                                },
                                literalStringDelimeterDouble: function() {
                                    _this.handleLiteralStringDelimeter_();
                                },
                                sectionSeparator: function() {
                                    _this.sectionIndex_ += 1;
                                },
                                percentagePlaceholder: empty,
                                perMillePlaceholder: empty
                            };
                        };
                        return CustomParser;
                    }();
                    Specifiers.CustomParser = CustomParser;
                    empty = Format.Utils.Function.getEmpty();
                })(Specifiers = Numeric.Specifiers || (Numeric.Specifiers = {}));
            })(Numeric = Globalization.Numeric || (Globalization.Numeric = {}));
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var Numeric;
            (function(Numeric) {
                var Specifiers;
                (function(Specifiers) {
                    var IntlCustomOptionsProvider = function() {
                        function IntlCustomOptionsProvider(numberOptions) {
                            var _this = this;
                            this.resolveDecoractingChar_ = function() {
                                var formatChar = _this.parser_.getCurrentChar();
                                if (_this.parser_.isBeforeNumericSpecifiers()) {
                                    _this.options_.prefixDecorator += formatChar;
                                } else {
                                    if (_this.parser_.isAfterNumericSpecifiers()) {
                                        _this.options_.suffixDecorator += formatChar;
                                    } else {
                                        _this.setInternalDecorator_(formatChar);
                                    }
                                }
                            };
                            this.resolvers_ = {
                                zeroPlaceholder: function() {
                                    _this.resolvers_.digitPlaceholder();
                                    if (!_this.parser_.isAfterDecimal()) {
                                        _this.options_.noLeadingZeroIntegerDigit = false;
                                    }
                                },
                                digitPlaceholder: function() {
                                    _this.options_.noDigits = false;
                                },
                                decimalPoint: function() {
                                    _this.resolvers_.digitPlaceholder();
                                },
                                groupSeparatorOrNumberScaling: function() {
                                    if (!_this.parser_.isBeforeNumericSpecifiers()) {
                                        if (!_this.parser_.isAfterDecimal() && !_this.parser_.isAfterNumericSpecifiers()) {
                                            _this.options_.useGrouping = true;
                                        } else {
                                            if (Math.abs(_this.options_.valueDivisor) >= 1 && _this.parser_.isImmediateAfterNumericSpecifiers()) {
                                                _this.options_.valueDivisor *= 1e3;
                                            }
                                        }
                                    }
                                },
                                percentagePlaceholder: function() {
                                    _this.resolveDecoractingChar_();
                                    _this.resetValueDivisor_();
                                    _this.options_.valueDivisor /= 100;
                                },
                                perMillePlaceholder: function() {
                                    _this.resolveDecoractingChar_();
                                    _this.resetValueDivisor_();
                                    _this.options_.valueDivisor /= 1e3;
                                },
                                exponent: function() {
                                    if (_this.parser_.isExponentMatched()) {
                                        var styles = Specifiers.Standard;
                                        _this.options_.style = styles[styles.exponential];
                                        _this.options_.upperCase = _this.parser_.isExponentUppercase();
                                        _this.options_.negativellySignedExponent = "+" !== _this.parser_.getExponentSign();
                                        _this.options_.minimumExponentDigits = _this.parser_.getExponentPlaceholderCount();
                                    } else {
                                        _this.resolveDecoractingChar_();
                                    }
                                },
                                escapeChar: void 0,
                                sectionSeparator: void 0,
                                literalStringDelimeterSingle: void 0,
                                literalStringDelimeterDouble: void 0
                            };
                            if (null == numberOptions) {
                                throw new Format.Errors.ArgumentNullError("numberOptions");
                            }
                            this.options_ = Format.Utils.extend(numberOptions, {
                                noDigits: true,
                                noLeadingZeroIntegerDigit: true,
                                valueDivisor: 1,
                                prefixDecorator: "",
                                internalDecorators: {},
                                suffixDecorator: ""
                            });
                        }
                        IntlCustomOptionsProvider.prototype.resolveOptions = function(format, value) {
                            format = this.getSectionFormat_(format, value);
                            this.parseOptions_(format);
                            return this.stripDefaultOptions_(value);
                        };
                        IntlCustomOptionsProvider.prototype.parseOptions_ = function(format) {
                            if (format) {
                                this.parser_ = new Specifiers.CustomParser(format);
                                this.parser_.doParse(this.resolvers_, this.resolveDecoractingChar_);
                                this.options_.minimumIntegerDigits = this.parser_.getDigitsBeforeDecimal();
                                this.options_.minimumFractionDigits = this.parser_.getZeroPlaceholderCountAfterDecimal();
                                this.options_.maximumFractionDigits = this.parser_.getNumberPlaceholderCountAfterDecimal();
                            }
                        };
                        IntlCustomOptionsProvider.prototype.stripDefaultOptions_ = function(value) {
                            if (1 === this.options_.valueDivisor) {
                                delete this.options_.valueDivisor;
                            }
                            if (Format.Utils.isEmpty(this.options_.internalDecorators)) {
                                delete this.options_.internalDecorators;
                            }
                            return this.stripDigitOptions_(value);
                        };
                        IntlCustomOptionsProvider.prototype.stripDigitOptions_ = function(value) {
                            if (this.options_.valueDivisor) {
                                value /= this.options_.valueDivisor;
                            }
                            var styles = Specifiers.Standard;
                            if (this.options_.style === styles[styles.exponential] || !(this.options_.noLeadingZeroIntegerDigit && Math.abs(value) < 1)) {
                                delete this.options_.noLeadingZeroIntegerDigit;
                            }
                            if (!this.options_.noDigits) {
                                delete this.options_.noDigits;
                            }
                            return Format.Utils.removeEmpty(this.options_);
                        };
                        IntlCustomOptionsProvider.prototype.getSectionFormat_ = function(format, value) {
                            if (format.indexOf(Specifiers.Custom.sectionSeparator) === -1) {
                                return format;
                            }
                            var sections = Specifiers.CustomParser.getSections(format);
                            if (this.tryNonZeroSectionFormat_(sections, value)) {
                                return "";
                            } else {
                                return sections[2] || sections[0];
                            }
                        };
                        IntlCustomOptionsProvider.prototype.tryNonZeroSectionFormat_ = function(sections, value) {
                            if (value > 0) {
                                return this.tryRoundToZeroFormat_(sections[0], value);
                            }
                            if (value < 0) {
                                return this.tryNegativeZeroSectionFormat_(sections, value);
                            } else {
                                return void 0;
                            }
                        };
                        IntlCustomOptionsProvider.prototype.tryNegativeZeroSectionFormat_ = function(sections, value) {
                            var nonZeroSectionFormat = sections[1];
                            if (nonZeroSectionFormat) {
                                this.options_.valueDivisor = -1;
                            } else {
                                nonZeroSectionFormat = sections[0];
                            }
                            return this.tryRoundToZeroFormat_(nonZeroSectionFormat, value);
                        };
                        IntlCustomOptionsProvider.prototype.tryRoundToZeroFormat_ = function(nonZeroSectionFormat, value) {
                            var nonZeroProvider = new IntlCustomOptionsProvider({});
                            nonZeroProvider.parseOptions_(nonZeroSectionFormat);
                            if (0 !== +value.toFixed(nonZeroProvider.options_.maximumFractionDigits)) {
                                nonZeroProvider.options_.valueDivisor *= this.options_.valueDivisor;
                                Format.Utils.extend(this.options_, nonZeroProvider.options_);
                                return true;
                            }
                        };
                        IntlCustomOptionsProvider.prototype.resetValueDivisor_ = function() {
                            var absoluteDivisor = Math.abs(this.options_.valueDivisor);
                            if (absoluteDivisor >= 1) {
                                this.options_.valueDivisor /= absoluteDivisor;
                            }
                        };
                        IntlCustomOptionsProvider.prototype.setInternalDecorator_ = function(formatChar) {
                            var indexFromDecimal = this.parser_.getIndexFromDecimal(), currentDecorator = this.options_.internalDecorators[indexFromDecimal] || "";
                            this.options_.internalDecorators[indexFromDecimal] = currentDecorator + formatChar;
                        };
                        return IntlCustomOptionsProvider;
                    }();
                    Specifiers.IntlCustomOptionsProvider = IntlCustomOptionsProvider;
                })(Specifiers = Numeric.Specifiers || (Numeric.Specifiers = {}));
            })(Numeric = Globalization.Numeric || (Globalization.Numeric = {}));
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var Numeric;
            (function(Numeric) {
                var IntlOptionsProvider = function() {
                    function IntlOptionsProvider(numberOptions) {
                        if (null == numberOptions) {
                            throw new Format.Errors.ArgumentNullError("numberOptions");
                        }
                        this.options_ = Format.Utils.clone(numberOptions);
                    }
                    IntlOptionsProvider.prototype.resolveOptions = function(format, value) {
                        var standardSpecifierOptionsProvider, standardSpecifierOptions, customSpecifierOptionsProvider;
                        if (format) {
                            standardSpecifierOptionsProvider = new Numeric.Specifiers.IntlStandardOptionsProvider(this.options_), 
                            standardSpecifierOptions = standardSpecifierOptionsProvider.resolveOptions(format, value);
                            if (!standardSpecifierOptions) {
                                customSpecifierOptionsProvider = new Numeric.Specifiers.IntlCustomOptionsProvider(this.options_);
                                customSpecifierOptionsProvider.resolveOptions(format, value);
                            }
                        }
                        return this.options_;
                    };
                    IntlOptionsProvider.prototype.getStyle = function() {
                        return this.options_.style;
                    };
                    IntlOptionsProvider.prototype.useGrouping = function() {
                        return this.options_.useGrouping;
                    };
                    IntlOptionsProvider.prototype.getMinimumIntegerDigits = function() {
                        return this.options_.minimumIntegerDigits;
                    };
                    IntlOptionsProvider.prototype.getMinimumFractionDigits = function() {
                        return this.options_.minimumFractionDigits;
                    };
                    IntlOptionsProvider.prototype.getMaximumFractionDigits = function() {
                        return this.options_.maximumFractionDigits;
                    };
                    IntlOptionsProvider.prototype.getMinimumSignificantDigits = function() {
                        return this.options_.minimumSignificantDigits;
                    };
                    IntlOptionsProvider.prototype.getMaximumSignificantDigits = function() {
                        return this.options_.maximumSignificantDigits;
                    };
                    IntlOptionsProvider.prototype.hasNoDigits = function() {
                        return this.options_.noDigits;
                    };
                    IntlOptionsProvider.prototype.hasNoLeadingZeroIntegerDigit = function() {
                        return this.options_.noLeadingZeroIntegerDigit;
                    };
                    IntlOptionsProvider.prototype.isUpperCase = function() {
                        return this.options_.upperCase;
                    };
                    IntlOptionsProvider.prototype.isNegativellySignedExponent = function() {
                        return this.options_.negativellySignedExponent;
                    };
                    IntlOptionsProvider.prototype.getMinimumExponentDigits = function() {
                        return this.options_.minimumExponentDigits;
                    };
                    IntlOptionsProvider.prototype.getValueDivisor = function() {
                        return this.options_.valueDivisor;
                    };
                    IntlOptionsProvider.prototype.getPrefixDecorator = function() {
                        return this.options_.prefixDecorator;
                    };
                    IntlOptionsProvider.prototype.getInternalDecorators = function() {
                        return this.options_.internalDecorators;
                    };
                    IntlOptionsProvider.prototype.getSuffixDecorator = function() {
                        return this.options_.suffixDecorator;
                    };
                    return IntlOptionsProvider;
                }();
                Numeric.IntlOptionsProvider = IntlOptionsProvider;
            })(Numeric = Globalization.Numeric || (Globalization.Numeric = {}));
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var NumberFormatInfo = function() {
                function NumberFormatInfo() {
                    var _i, args = [];
                    for (_i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    this.isWritable_ = void 0 === args[0];
                    this.locales_ = args[0] || "";
                    this.resolveFormatInfo_(this.locales_);
                }
                NumberFormatInfo.prototype.getFormatter = function(type) {
                    if (type !== Format.Utils.Types.Number) {
                        throw new Format.Errors.InvalidOperationError("The NumberFormatInfo object supports formatting numeric values only");
                    }
                    return this.formatter_;
                };
                NumberFormatInfo.prototype.resolveFormatInfo_ = function(locales) {
                    if (!locales) {
                        this.setInvariantFormatInfo_();
                        this.formatter_ = new Globalization.Numeric.InfoFormatter(Globalization.Numeric.IntlOptionsProvider, this);
                    } else {
                        if ("function" === typeof NumberFormatInfo.FormatterConstructor) {
                            this.formatter_ = new NumberFormatInfo.FormatterConstructor(this.locales_, this);
                        } else {
                            throw new Format.Errors.InvalidOperationError("No culture-variant formatter was found (load a sub-module implementation or set the FormatterConstructor property)");
                        }
                    }
                };
                NumberFormatInfo.prototype.setInvariantFormatInfo_ = function() {
                    this.CurrencyDecimalSeparator = this.NumberDecimalSeparator = ".";
                    this.CurrencyGroupSeparator = this.NumberGroupSeparator = ",";
                    this.NumberDecimalDigits = 2;
                    this.NegativeSign = "-";
                };
                return NumberFormatInfo;
            }();
            Globalization.NumberFormatInfo = NumberFormatInfo;
            NumberFormatInfo.InvariantInfo = new NumberFormatInfo("");
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Globalization;
        (function(Globalization) {
            var CultureInfo = function() {
                function CultureInfo(locales) {
                    if (null == locales) {
                        throw new Format.Errors.ArgumentNullError("locales");
                    }
                    this.locales_ = locales;
                    this.DateTimeFormat = new Globalization.DateTimeFormatInfo(locales);
                    this.NumberFormat = new Globalization.NumberFormatInfo(locales);
                    this.formatters_ = this.getFormatters_(locales);
                }
                CultureInfo.prototype.getFormatter = function(type) {
                    return this.formatters_[type] || CultureInfo.fallbackFormatter_;
                };
                CultureInfo.prototype.getFormatters_ = function(locales) {
                    var formatters = {}, types = Format.Utils.Types;
                    formatters[types.Date] = this.DateTimeFormat.getFormatter(types.Date);
                    formatters[types.Number] = this.NumberFormat.getFormatter(types.Number);
                    formatters[types.Array] = formatters[types.Object] = CultureInfo.objectFormatter_;
                    return formatters;
                };
                CultureInfo.objectFormatter_ = {
                    format: function(format, value) {
                        return value ? JSON.stringify(value) : "";
                    }
                };
                CultureInfo.fallbackFormatter_ = {
                    format: function(format, value) {
                        return null != value ? value + "" : "";
                    }
                };
                return CultureInfo;
            }();
            Globalization.CultureInfo = CultureInfo;
            CultureInfo.CurrentCulture = CultureInfo.InvariantCulture = new CultureInfo("");
        })(Globalization = Format.Globalization || (Format.Globalization = {}));
    })(Format || (Format = {}));
    (function(Format) {
        function setCulture(locale) {
            CultureInfo.CurrentCulture = "" === locale ? CultureInfo.InvariantCulture : new CultureInfo(locale);
        }
        function setCurrency(currencyCode) {
            if (null == currencyCode) {
                throw new Format.Errors.ArgumentNullError("currencyCode");
            }
            Format.Globalization.NumberFormatInfo.CurrentCurrency = currencyCode;
        }
        function innerFormat(provider, format, args) {
            if (null == format) {
                throw new Format.Errors.ArgumentNullError("format");
            }
            provider = provider || CultureInfo.CurrentCulture;
            return format.replace(formatItemRegExp, function(formatItem, indexComponent, alignmentComponent, formatStringComponent) {
                return replaceFormatItem(provider, args, {
                    formatItem: formatItem,
                    indexComponent: indexComponent,
                    alignmentComponent: alignmentComponent,
                    formatStringComponent: formatStringComponent
                });
            });
        }
        function innerComponentFormat(formatStringComponent, value, provider) {
            var valueType = Format.Utils.getType(value);
            provider = provider || CultureInfo.CurrentCulture;
            return provider.getFormatter(valueType).format(formatStringComponent, value);
        }
        var CultureInfo, formatItemRegExp, replaceFormatItem, isFullyEscaped, applyFormatting, padding, paddingDirection, applyAlignment, padBraces;
        String.format = function() {
            var _i, provider, format, args = [];
            for (_i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if ("string" === typeof args[0]) {
                return innerFormat(void 0, args.shift(), args);
            }
            provider = args[0];
            if (provider && "function" !== typeof provider.getFormatter) {
                throw new Format.Errors.ArgumentError("Argument 'provider' of type '" + Format.Utils.Function.getName(provider.constructor) + "' does not implement the FormatProvider interface");
            }
            format = args[1];
            args.splice(0, 2);
            return innerFormat(provider, format, args);
        };
        CultureInfo = Format.Globalization.CultureInfo;
        Format.setCulture = setCulture;
        Format.setCurrency = setCurrency;
        Format.innerFormat = innerFormat;
        formatItemRegExp = /{+(\d+)(?:,(.+?))?(?::(.+?))?}+/g;
        Format.innerComponentFormat = innerComponentFormat;
        replaceFormatItem = function(provider, args, options) {
            var result, escapedBracesCount = Math.floor(Format.getBracesCount(options.formatItem, "{") / 2);
            if (isFullyEscaped(options.formatItem)) {
                return options.formatItem.substring(escapedBracesCount, options.formatItem.length - escapedBracesCount);
            }
            result = applyFormatting(provider, args, options);
            if (options.alignmentComponent) {
                result = applyAlignment(result, options);
            }
            if (escapedBracesCount > 0) {
                result = padBraces(result, escapedBracesCount, "{");
                result = padBraces(result, escapedBracesCount, "}");
            }
            return result;
        };
        Format.getBracesCount = function(formatItem, braceChar) {
            var splits = formatItem.split(braceChar);
            if ("}" === braceChar) {
                splits = splits.reverse();
            }
            return Format.Utils.Enumerable.takeWhile(splits, Format.Utils.Text.isNullOrWhitespace).length;
        };
        isFullyEscaped = function(formatItem) {
            var openingBracesCount = Format.getBracesCount(formatItem, "{"), closingBracesCount = Format.getBracesCount(formatItem, "}");
            if (openingBracesCount !== closingBracesCount) {
                throw new Format.Errors.FormatError("Opening and closing brackets for item '" + formatItem + "' do not match");
            }
            return Format.Utils.Numeric.isEven(openingBracesCount);
        };
        applyFormatting = function(provider, args, options) {
            var index = +options.indexComponent;
            if (index >= args.length) {
                throw new Format.Errors.FormatError("Index (zero based) must be strictly less than the size of the argument's array");
            }
            try {
                return innerComponentFormat(options.formatStringComponent, args[index], provider);
            } catch (error) {
                throw new Format.Errors.FormatError("Format string component '" + options.formatStringComponent + "' in format item '" + options.formatItem + "' cannot be applied: " + error.message, error);
            }
        };
        padding = Format.Utils.Padding, paddingDirection = padding.Direction;
        applyAlignment = function(formattedString, options) {
            var direction, totalWidth = +options.alignmentComponent;
            if (!Format.Utils.Numeric.isInteger(totalWidth)) {
                throw new Format.Errors.FormatError("Alignment component '" + options.alignmentComponent + "' in format item '" + options.formatItem + "' must be an integer");
            }
            direction = totalWidth < 0 ? paddingDirection.Right : paddingDirection.Left;
            totalWidth = Math.abs(totalWidth);
            return padding.pad(formattedString, {
                totalWidth: totalWidth,
                direction: direction
            });
        };
        padBraces = function(formattedString, escapedBracesCount, paddingChar) {
            var direction = "}" === paddingChar ? paddingDirection.Right : paddingDirection.Left, totalWidth = formattedString.length + escapedBracesCount;
            return padding.pad(formattedString, {
                totalWidth: totalWidth,
                direction: direction,
                paddingChar: paddingChar
            });
        };
    })(Format || (Format = {}));
    return Format;
}(Format || {});