"use strict";

var Format, __extends;

(function(Format) {
    var Utils;
    (function(Utils) {
        var Function;
        (function(Function) {
            /**
                 * Returns the name of a function.
                 * @param func A functional object.
                 * @returns The name of a function or `""` for lambda functions.
                 */
            function getName(func) {
                validateFunctionArgument(func, "getName");
                if (void 0 !== func.name) {
                    return func.name;
                }
                var typeNameGroups = typeNameRegExp.exec(func.toString());
                return typeNameGroups && typeNameGroups[1] ? typeNameGroups[1] : "";
            }
            /**
                 * Returns the rightmost accessor's name of the function's first returned variable.
                 *
                 * For example a return expression like `return this.field;` will yield `"field"` as a value.
                 * @param func A functional object.
                 * @return The text of the last literal contained in the first return expression of the function.
                 */
            function getReturnName(func) {
                validateFunctionArgument(func, "getReturnName");
                var returnNameGroups = returnNameRegExp.exec(func.toString());
                if (returnNameGroups) {
                    return returnNameGroups[1];
                } else {
                    return void 0;
                }
            }
            /**
                 * Returns an empty parameterless function which returns `undefined`. Useful for defaulting optional callback arguments instead of creating new anonymous empty functions.
                 * @param T The return type of the empty callback.
                 */
            function getEmpty() {
                return empty;
            }
            var typeNameRegExp, returnNameRegExp, validateFunctionArgument, empty;
            Function.getName = getName;
            /** @private */
            typeNameRegExp = /function +(\w+)/;
            Function.getReturnName = getReturnName;
            /** @private */
            returnNameRegExp = /(?:(?:=>)|(?:return\s))\s*(?:\w+\.)*([A-Za-z]+)/;
            /** @private */
            validateFunctionArgument = function(func, methodName) {
                if ("function" !== typeof func) {
                    throw new TypeError("Cannot call method '" + methodName + "' on non-functional objects");
                }
            };
            Function.getEmpty = getEmpty;
            /** @private */
            empty = function() {
                return void 0;
            };
        })(Function = Utils.Function || (Utils.Function = {}));
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
    __.prototype = b.prototype;
    d.prototype = new __();
};

(function(Format) {
    var Errors;
    (function(Errors) {
        Format.Errors.ErrorClass = Error;
        /**
             * Base system error class that allows for syntactic C#-like `Error` class extension.
             *
             * See: https://msdn.microsoft.com/en-us/library/system.systemexception.aspx
             */
        var SystemError = function(_super) {
            /**
                 * Creates an abstract system error object derived from the built-in javascript `Error` type and decorates it with additional properties.
                 * @param message A human-readable description of the error.
                 * @param innerError An error to wrap while also preserving its stack trace.
                 */
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
        /**
             * An error that is thrown when one of the arguments provided to a function is not valid.
             *
             * See: https://msdn.microsoft.com/en-us/library/system.argumentexception.aspx
             */
        var ArgumentError = function(_super) {
            /**
                 * Creates an error that is thrown when one of the arguments provided to a function is not valid.
                 * @param message A human-readable description of the error.
                 * @param innerError An error to rethrow while also preserving its stack trace.
                 */
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
        /**
             * An error that is thrown when an `undefined` or `null` argument is passed to a method that does not accept it as a valid argument.
             *
             * See: https://msdn.microsoft.com/en-us/library/system.argumentnullexception.aspx
             */
        var ArgumentNullError = function(_super) {
            /**
                 * Creates an error that is thrown when an undefined (or null) argument is passed to a method that does not accept it as a valid argument.
                 * @param argumentName The name of the argument that caused the error.
                 */
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
            /**
                 * Indicates whether the specified string is `undefined`, `null`, `""`, or consists only of white-space characters.
                 * @param value The string to test.
                 * @returns `true` if the value parameter is `undefined`, `null`, `""`, or if value consists exclusively of white-space characters.
                 */
            function isNullOrWhitespace(value) {
                return !(value && value.trim().length > 0);
            }
            /**
                 * Returns a new string in which a specified string is inserted at a specified index position in the value instance.
                 * @param value The string into which to insert.
                 * @param startIndex The zero-based index position of the insertion.
                 * @param insertValue The string to insert.
                 * @returns A new string that is equivalent to the value instance, but with insertValue inserted at position startIndex.
                 */
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
        /**
             * Returns `true` if an object's type matches the given type argument.
             * @param type A string indicating the expected type of the object, i.e. `"Array"`, `"RegExp"`, etc.
             * @param object The object to check for matching type.
             */
        function isType(type, object) {
            return getType(object) === getTypeString(type);
        }
        /**
             * Returns the actual type of an object (unlike `typeof`), see [[Types]].
             * @param object The object to test.
             */
        function getType(object) {
            return Object.prototype.toString.call(object);
        }
        var fillTypes, getTypeString;
        Utils.isType = isType;
        Utils.getType = getType;
        /** @private */
        fillTypes = function(types) {
            for (var key in types) {
                if (types.hasOwnProperty(key)) {
                    types[key] = getTypeString(key);
                }
            }
            return types;
        };
        /** @private */
        getTypeString = function(type) {
            return "[object " + type + "]";
        };
        /** An enumeration containing strings that represent the actual type of an object. */
        Utils.Types = fillTypes({
            /** Returns `"[object Array]"`. */
            Array: "",
            /** Returns `"[object Boolean]"`. */
            Boolean: "",
            /** Returns `"[object Date]"`. */
            Date: "",
            /** Returns `"[object Function]"`. */
            Function: "",
            /** Returns `"[object Number]"`. */
            Number: "",
            /** Returns `"[object Object]"`. */
            Object: "",
            /** Returns `"[object RegExp]"`. */
            RegExp: "",
            /** Returns `"[object String]"`. */
            String: ""
        });
    })(Utils = Format.Utils || (Format.Utils = {}));
})(Format || (Format = {}));

(function(Format) {
    var Utils;
    (function(Utils) {
        var Numeric;
        (function(Numeric) {
            /**
                 * Determines whether the passed value is a counting number (positive integer excluding `0`).
                 * @param value The number to test.
                 * @returns `true` if the value parameter is a positive integer excluding `0`.
                 */
            function isCounting(value) {
                return value > 0 && Numeric.isInteger(value);
            }
            /**
                 * Determines whether the passed value is a whole number (positive integer including `0`).
                 * @param value The number to test.
                 * @returns `true` if the value parameter is a positive integer including `0`.
                 */
            function isWhole(value) {
                return value >= 0 && Numeric.isInteger(value);
            }
            /**
                 * Determines whether the passed value is an even number.
                 *
                 * Throws an error if the value is not an integer (when [[isInteger]] returns `false`).
                 * @param value The number to test.
                 * @returns `true` if the value parameter is an even number.
                 */
            function isEven(value) {
                if (!Numeric.isInteger(value)) {
                    throw new Format.Errors.ArgumentError("Argument 'value' must be an integer");
                }
                return 0 === (1 & value);
            }
            /**
                 * Returns the best fitting formatted value, returned by the `Number.toFixed` method, given a minimum and/or maximum digits precision.
                 * @param value The number to format.
                 * @param minDigits The minimum number of digits to include in the format.
                 * @param maxDigits The maximum number of digits to include in the format.
                 */
            function toFixedMinMax(value, minDigits, maxDigits) {
                return toMinMax(getToFixedHandler(value), minDigits, maxDigits);
            }
            /**
                 * Returns the best fitting formatted value, returned by the `Number.toExponential` method, given a minimum and/or maximum digits precision.
                 * @param value The number to format.
                 * @param minDigits The minimum number of digits to include in the format.
                 * @param maxDigits The maximum number of digits to include in the format.
                 */
            function toExponentialMinMax(value, minDigits, maxDigits) {
                return toMinMax(getToExponentialHandler(value), minDigits, maxDigits);
            }
            /**
                 * Returns the best fitting formatted value, returned by the `Number.toPrecision` method, given a minimum and/or maximum digits precision.
                 * @param value The number to format.
                 * @param minDigits The minimum number of digits to include in the format.
                 * @param maxDigits The maximum number of digits to include in the format.
                 */
            function toPrecisionMinMax(value, minDigits, maxDigits) {
                return toMinMax(getToPrecisionHandler(value), minDigits, maxDigits);
            }
            var toMinMax, validateToMinMaxDigitsArguments, applyMinMax, iterateMinMax, getToFixedHandler, getToExponentialHandler, getToPrecisionHandler, validateValueArgument;
            Numeric.isCounting = isCounting;
            Numeric.isWhole = isWhole;
            Numeric.isEven = isEven;
            Numeric.isInteger = Number.isInteger || function(value) {
                return value === value >> 0;
            };
            Numeric.toFixedMinMax = toFixedMinMax;
            Numeric.toExponentialMinMax = toExponentialMinMax;
            Numeric.toPrecisionMinMax = toPrecisionMinMax;
            /** @private */
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
            /** @private */
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
            /** @private */
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
            /** @private */
            iterateMinMax = function(numberHandler, options) {
                var i, minValue;
                for (i = options.minDigits + 1; i < options.maxDigits; i += 1) {
                    minValue = numberHandler.delegate(i);
                    if (options.targetValue === +minValue) {
                        return minValue;
                    }
                }
            };
            /** @private */
            getToFixedHandler = function(value) {
                validateValueArgument(value);
                return {
                    defaultMinDigits: 0,
                    delegate: function(digits) {
                        return null != digits ? value.toFixed(digits) : value.toString();
                    }
                };
            };
            /** @private */
            getToExponentialHandler = function(value) {
                validateValueArgument(value);
                return {
                    defaultMinDigits: 0,
                    delegate: function(digits) {
                        return void 0 !== digits ? value.toExponential(digits) : value.toExponential();
                    }
                };
            };
            /** @private */
            getToPrecisionHandler = function(value) {
                validateValueArgument(value);
                return {
                    defaultMinDigits: 1,
                    delegate: function(digits) {
                        return null !== digits ? value.toPrecision(digits) : value.toPrecision();
                    }
                };
            };
            /** @private */
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
            /**
                 * Returns a new string of a specified length in which the beginning and/or ending of the current string is padded with spaces or with a specified character.
                 * @param value The string to apply padding to.
                 * @param options An [[Options]] object that defines the desired output.
                 */
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
            /** An enumeration describing the possible positioning strategies of padded characters relative to the string that's being padded. */
            (function(Direction) {
                /** Position padding characters before the string. */
                Direction[Direction.Left = 1] = "Left";
                /** Position padding characters after the string. */
                Direction[Direction.Right = 2] = "Right";
                /** Position padding characters before and after the string, while keeping it centered. */
                Direction[Direction.Both = 3] = "Both";
            })(Padding.Direction || (Padding.Direction = {}));
            Direction = Padding.Direction;
            Padding.pad = pad;
            /** @private */
            setDefaultOptions = function(options) {
                options.direction = options.direction || Direction.Right;
                options.paddingChar = options.paddingChar || " ";
            };
            /** @private */
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
            /** @private */
            isPaddingRequired = function(value, options) {
                return options.totalWidth > value.length;
            };
            /** @private */
            getPadWidth = function(value, options) {
                return options.totalWidth - value.length;
            };
            /** @private */
            getPadding = function(padWidth, options) {
                return new Array(padWidth + 1).join(options.paddingChar);
            };
            /** @private */
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
            /**
                 * Returns elements from a sequence as long as the specified condition is `true`.
                 *
                 * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
                 * @param T The type of elements in the array.
                 * @param array An array instance.
                 * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
                 * @param predicate.item A source element that is tested for a condition.
                 * @param predicate.index The index of the source element.
                 * @returns A new array instance containing only items for which the predicate function returned `true`.
                 */
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
            /**
                 * Removes "holes" (`undefined` elements) from the array making it compact/dense.
                 * @param T The type of elements in the array.
                 * @param array An array instance.
                 * @returns The same array instance without `undefined` elements.
                 */
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
    var Globalization;
    (function(Globalization) {
        /**
             * Provides culture-specific information about the format of date and time values.
             *
             * Information about the culture itself and the application of overrides will be made available through this class at a later point.
             *
             * See: https://msdn.microsoft.com/en-us/library/system.globalization.datetimeformatinfo.aspx
             */
        var DateTimeFormatInfo = function() {
            function DateTimeFormatInfo() {
                var _i, args = [];
                for (_i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this.isWritable = void 0 !== args[0];
                this.locales = args[0] || "";
            }
            /**
                 * Returns an object that provides formatting services for the `Date` type.
                 * @param type A string indicating the type of the custom formatter to return, see [[Utils.Types]].
                 */
            DateTimeFormatInfo.prototype.getFormatter = function(type) {
                return void 0;
            };
            return DateTimeFormatInfo;
        }();
        Globalization.DateTimeFormatInfo = DateTimeFormatInfo;
    })(Globalization = Format.Globalization || (Format.Globalization = {}));
})(Format || (Format = {}));

(function(Format) {
    var Utils;
    (function(Utils) {
        /**
             * Returns `true` if an object is an object instance with language type of [[Types.Object]].
             * @param object The object to test.
             */
        function isObject(object) {
            return Utils.getType(object) === Utils.Types.Object;
        }
        /**
             * Returns `true` if an object is empty (contains no enumerable properties).
             * @param object The object to test.
             */
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
        /**
             * Maps the given object's values as keys with their keys as values and returns the extended object.
             *
             * Throws an error if the operation results in key duplication or keys with 'undefined' or 'null' values.
             * @param T The type of indexable object to update.
             * @param object The object to update with the mapped unique values as keys.
             * @returns The same instance that was passed as the object parameter updated with the new unique keys.
             */
        function mapValuesAsKeys(object) {
            var objectIsArray, key;
            if (null == object) {
                throw new Format.Errors.ArgumentNullError("object");
            }
            if ("string" === typeof object) {
                throw new Format.Errors.ArgumentError("Cannot call method 'enumerateValues' on immutable string objects");
            }
            objectIsArray = Utils.isArray(object);
            for (key in object) {
                if (object.hasOwnProperty(key)) {
                    addValueAsKey(object, key, objectIsArray);
                }
            }
            return object;
        }
        var isEnumerable, addValueAsKey, resolveValueAsKey, innerExtend, getDeepTarget, merge, deepMerge, getDeepMergeSource;
        Utils.isObject = isObject;
        Utils.isEmpty = isEmpty;
        /** @private */
        isEnumerable = function(object) {
            return ("object" === typeof object || "function" === typeof object) && null !== object;
        };
        Utils.mapValuesAsKeys = mapValuesAsKeys;
        /** @private */
        addValueAsKey = function(object, key, objectIsArray) {
            var value = object[key];
            if (null == value) {
                throw new Format.Errors.ArgumentError("Cannot call method 'enumerateValues' on objects that contain undefined or null values");
            }
            if (object.hasOwnProperty(value)) {
                throw new Format.Errors.ArgumentError("Cannot enumerate value '" + value + "' because such a key already exists in " + object);
            }
            object[resolveValueAsKey(value)] = objectIsArray ? +key : key;
        };
        /** @private */
        resolveValueAsKey = function(value) {
            return "symbol" !== typeof value ? value + "" : value;
        };
        Utils.isArray = Array.isArray || function(object) {
            return Utils.isType(Utils.Types.Array, object);
        };
        Utils.extend = function(target) {
            var _i, objects = [];
            for (_i = 1; _i < arguments.length; _i++) {
                objects[_i - 1] = arguments[_i];
            }
            return innerExtend(false, target, objects);
        };
        Utils.deepExtend = function(target) {
            var _i, objects = [];
            for (_i = 1; _i < arguments.length; _i++) {
                objects[_i - 1] = arguments[_i];
            }
            return innerExtend(true, target, objects);
        };
        /** @private */
        innerExtend = function(deep, target, objects) {
            target = getDeepTarget(deep, target);
            if (!objects.length) {
                throw new Format.Errors.ArgumentError("Arguments' list 'options' must contain at least one element");
            }
            for (var i = 0, len = objects.length; i < len; i += 1) {
                if (null != objects[i]) {
                    merge(deep, target, objects[i]);
                } else {}
            }
            return target;
        };
        /** @private */
        getDeepTarget = function(deep, target) {
            if (!isEnumerable(target)) {
                if (!deep) {
                    throw new Format.Errors.ArgumentError("Argument 'target' with value '" + target + "' must be an enumerable object instance");
                }
                return {};
            }
            return target;
        };
        /** @private */
        merge = function(deep, target, object) {
            var key, copy, objectIsArray = Utils.isArray(object);
            // Intentional use of for-in without checking hasOwnProperty
            for (key in object) {
                copy = object[key];
                if (copy !== target && (!objectIsArray || object.hasOwnProperty(key))) {
                    if (deep && (isObject(copy) || Utils.isArray(copy))) {
                        deepMerge(target, key, copy);
                    } else {
                        if (void 0 !== copy) {
                            target[key] = copy;
                        }
                    }
                } else {}
            }
        };
        /** @private */
        deepMerge = function(target, key, copy) {
            var source = getDeepMergeSource(target[key], copy);
            target[key] = innerExtend(true, source, [ copy ]);
        };
        /** @private */
        getDeepMergeSource = function(source, copy) {
            if (Utils.isArray(copy)) {
                return Utils.isArray(source) ? source : [];
            } else {
                return isObject(source) ? source : {};
            }
        };
    })(Utils = Format.Utils || (Format.Utils = {}));
})(Format || (Format = {}));

(function(Format) {
    var Globalization;
    (function(Globalization) {
        var Numeric;
        (function(Numeric) {
            var Specifiers;
            (function(Specifiers) {
                /**
                     * A standard numeric format string takes the form `Axx`, where:
                     * - `A` is a single alphabetic character called the format specifier.
                     * Any numeric format string that contains more than one alphabetic character, including white space, is interpreted as a custom numeric format string;
                     * - `xx` is an optional integer called the precision specifier. The precision specifier ranges from 0 to 99 and affects the number of digits in the result.
                     * Note that the precision specifier controls the number of digits in the string representation of a number. It does not round the number itself.
                     * To perform a rounding operation, use the `Math.ceil`, `Math.floor`, or `Math.round` methods;
                     *
                     * When precision specifier controls the number of fractional digits in the result string, the result strings reflect numbers that are rounded away from zero.
                     */
                Specifiers.StandardSpecifierRexExp = /^([a-z])(\d*)$/i;
                /** The default standard exponential precision specifier. */
                Specifiers.DefaultStandardExponentialPrecision = 6;
                /**
                     * Exposes a map of the standard numeric format specifiers to their alphabetic character representation as well as the inverse relation.
                     *
                     * See: https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx
                     */
                Specifiers.StandardSpecifiers = Format.Utils.mapValuesAsKeys({
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
            /**
                 * Partial formatter implementation that applies decoration options to the resulting value.
                 * @param T The type of the options container.
                 */
            var DecorationFormatter = function() {
                /**
                     * Creates an instance that uses the resolved options from the specified options provider and applies culture-specific formatting based on the given format info.
                     * @param optionsProvider A numeric options provider whose resolved options will be used.
                     * @param formatInfo An instance that provides culture-specific number format information.
                     */
                function DecorationFormatter(optionsProvider, formatInfo) {
                    this.style = optionsProvider.getStyle();
                    this.noDigits = optionsProvider.hasNoDigits();
                    this.upperCase = optionsProvider.isUpperCase();
                    this.useGrouping = optionsProvider.useGrouping();
                    this.noLeadingZeroIntegerDigit = optionsProvider.hasNoLeadingZeroIntegerDigit();
                    this.prefixDecorator = optionsProvider.getPrefixDecorator();
                    this.suffixDecorator = optionsProvider.getSuffixDecorator();
                    this.internalDecorators = optionsProvider.getInternalDecorators();
                    this.formatInfo = formatInfo;
                }
                /**
                     * Applies negative sign position and symbol, removal of the leading zero, internal and external decorators to the formatted value.
                     * @param value The number which is currently being formatted.
                     * @param formattedValue The partial resulting format value.
                     * @returns A resulting format value with applied decoration options.
                     */
                DecorationFormatter.prototype.applyOptions = function(value, formattedValue) {
                    formattedValue = this.removeNegativeSign(value, formattedValue);
                    formattedValue = this.applyDigitOptions(value, formattedValue);
                    formattedValue = this.applyInternalDecorators(formattedValue);
                    formattedValue = this.applyExternalDecorators(formattedValue);
                    return this.applyNegativeSign(value, formattedValue);
                };
                /**
                     * Applies the uppercase option for some standard specifiers that require it.
                     * @param formattedValue The partial resulting format value.
                     * @returns A resulting format value with the applied uppercase option.
                     */
                DecorationFormatter.prototype.applyUppercase = function(formattedValue) {
                    return this.upperCase ? formattedValue.toUpperCase() : formattedValue;
                };
                /**
                     * Applies the grouping option using the appropriate group separator.
                     * @param formattedValue The partial resulting format value.
                     * @returns A resulting format value with the applied grouping option.
                     */
                DecorationFormatter.prototype.applyGrouping = function(formattedValue) {
                    if (!this.useGrouping) {
                        return formattedValue;
                    }
                    var decimalSeparator = this.getDecimalSeparator(), numericParts = formattedValue.split(decimalSeparator);
                    numericParts[0] = numericParts[0].replace(DecorationFormatter.groupSeparatorRegExp, this.getGroupSeparator());
                    return numericParts.join(decimalSeparator);
                };
                /**
                     * Applies the minimum integer digits option by padding the numeric part before the decimal separator.
                     * Also temporarily removes the current [[NumberFormatInfo.NegativeSign]]. It is restored when [[applyOptions]] finishes all decoration formatting.
                     * @param value The number which is currently being formatted.
                     * @param formattedValue The partial resulting format value.
                     * @param paddingWidth The number of characters in the resulting numeric string's integral part.
                     * @returns A resulting format value with the applied minimum integer digits option and without a negative sign.
                     */
                DecorationFormatter.prototype.applyIntegerPadding = function(value, formattedValue, paddingWidth) {
                    var decimalSeparator = this.getDecimalSeparator(), numericParts = formattedValue.split(decimalSeparator);
                    numericParts[0] = this.removeNegativeSign(value, numericParts[0]);
                    if (numericParts[0].length < paddingWidth) {
                        numericParts[0] = Format.Utils.Padding.pad(numericParts[0], {
                            totalWidth: paddingWidth,
                            paddingChar: "0",
                            direction: Format.Utils.Padding.Direction.Left
                        });
                    }
                    return numericParts.join(decimalSeparator);
                };
                DecorationFormatter.prototype.isCurrency = function() {
                    var styles = Numeric.Specifiers.StandardSpecifiers;
                    return this.style === styles[styles.decimal];
                };
                DecorationFormatter.prototype.getDecimalSeparator = function() {
                    return this.isCurrency() ? this.formatInfo.CurrencyDecimalSeparator : this.formatInfo.NumberDecimalSeparator;
                };
                DecorationFormatter.prototype.getGroupSeparator = function() {
                    return this.isCurrency() ? this.formatInfo.CurrencyGroupSeparator : this.formatInfo.NumberGroupSeparator;
                };
                DecorationFormatter.prototype.removeNegativeSign = function(value, formattedValue) {
                    if (this.restoreNegativeSign) {
                        return formattedValue;
                    }
                    this.restoreNegativeSign = value < 0 && formattedValue[0] === this.formatInfo.NegativeSign;
                    return this.restoreNegativeSign ? formattedValue.substring(1) : formattedValue;
                };
                DecorationFormatter.prototype.applyDigitOptions = function(value, formattedValue) {
                    if (this.noDigits) {
                        return "";
                    } else {
                        return this.shouldRemoveLeadingZero(value) ? formattedValue = formattedValue.substring(1) : formattedValue;
                    }
                };
                DecorationFormatter.prototype.shouldRemoveLeadingZero = function(value) {
                    var styles = Numeric.Specifiers.StandardSpecifiers;
                    return this.noLeadingZeroIntegerDigit && this.style !== styles[styles.exponential] && this.style !== styles[styles.roundTrip] && this.style !== styles[styles.general] && this.style !== styles[styles.hex] && Math.abs(value) < 1;
                };
                DecorationFormatter.prototype.applyInternalDecorators = function(formattedValue) {
                    var decimalSeparator, numericParts, key;
                    if (!this.internalDecorators) {
                        return formattedValue;
                    }
                    decimalSeparator = this.getDecimalSeparator(), numericParts = formattedValue.split(decimalSeparator);
                    this.decimalOffset = 0;
                    for (key in this.internalDecorators) {
                        if (this.internalDecorators.hasOwnProperty(key)) {
                            this.applyInternalDecorator(numericParts, +key, this.internalDecorators[key]);
                        }
                    }
                    return numericParts.join(decimalSeparator);
                };
                DecorationFormatter.prototype.applyInternalDecorator = function(numericParts, index, decorator) {
                    var decimalPart, integralPart = numericParts[0];
                    if (index < 0) {
                        index += integralPart.length + 1;
                        numericParts[0] = Format.Utils.Text.insert(integralPart, Math.max(0, index), decorator);
                    } else {
                        index += this.decimalOffset;
                        this.decimalOffset += decorator.length;
                        decimalPart = numericParts[1];
                        if (decimalPart) {
                            numericParts[1] = Format.Utils.Text.insert(decimalPart, index, decorator);
                        } else {
                            numericParts[0] = Format.Utils.Text.insert(integralPart, Math.min(index, integralPart.length), decorator);
                        }
                    }
                };
                DecorationFormatter.prototype.applyExternalDecorators = function(formattedValue) {
                    if (this.prefixDecorator) {
                        formattedValue = this.prefixDecorator + formattedValue;
                    }
                    if (this.suffixDecorator) {
                        formattedValue += this.suffixDecorator;
                    }
                    return formattedValue;
                };
                DecorationFormatter.prototype.applyNegativeSign = function(value, formattedValue) {
                    return this.restoreNegativeSign ? this.formatInfo.NegativeSign + formattedValue : formattedValue;
                };
                DecorationFormatter.groupSeparatorRegExp = /\B(?=(\d{3})+(?!\d))/g;
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
            /**
                 * Partial formatter implementation that applies exponential notation options to the resulting value.
                 * @param T The type of the options container.
                 */
            var ExponentialFormatter = function() {
                /**
                     * Creates an instance that uses the resolved options from the specified options provider.
                     * @param optionsProvider A numeric options provider whose resolved options will be used.
                     */
                function ExponentialFormatter(optionsProvider) {
                    var _this = this;
                    this.resolvers = {
                        "0": function(digitChar, customState) {
                            return customState.nonZeroEncountered ? _this.resolveDigit(digitChar, customState) : "";
                        },
                        ".": function(digitChar, customState) {
                            customState.afterDecimal = true;
                            return "";
                        },
                        "-": function(digitChar) {
                            return digitChar;
                        }
                    };
                    this.minimumIntegerDigits = this.floorOption(optionsProvider.getMinimumIntegerDigits());
                    this.minimumFractionDigits = this.floorOption(optionsProvider.getMinimumFractionDigits());
                    this.maximumFractionDigits = this.floorOption(optionsProvider.getMaximumFractionDigits());
                    this.minimumExponentDigits = this.floorOption(optionsProvider.getMinimumExponentDigits());
                    this.negativellySignedExponent = optionsProvider.isNegativellySignedExponent();
                }
                /**
                     * Applies exponent precision, padding and signing options to the number.
                     * @param value The number which is currently being formatted.
                     * @returns A formatted exponential notation string.
                     */
                ExponentialFormatter.prototype.applyOptions = function(value) {
                    var _this = this;
                    this.validateOption(function() {
                        return _this.minimumIntegerDigits;
                    }, 1);
                    if (this.minimumIntegerDigits > 1) {
                        this.validateCustomOptions();
                        return this.toCustomExponential(value);
                    }
                    return this.toExponential(value);
                };
                /**
                     * Applies exponent padding options for some standard specifiers that require it.
                     * @param formattedExponentialValue The partial formatted exponential notation string.
                     */
                ExponentialFormatter.prototype.applyExponentPadding = function(formattedExponentialValue) {
                    var exponentIndex, paddedExponent, _this = this;
                    this.validateOption(function() {
                        return _this.minimumExponentDigits;
                    }, 1);
                    if (this.minimumExponentDigits > 1) {
                        exponentIndex = formattedExponentialValue.lastIndexOf("e") + 2, paddedExponent = this.getPaddedExponent(formattedExponentialValue.substring(exponentIndex));
                        formattedExponentialValue = formattedExponentialValue.substring(0, exponentIndex) + paddedExponent;
                    }
                    return formattedExponentialValue;
                };
                ExponentialFormatter.prototype.floorOption = function(optionValue) {
                    return null != optionValue ? Math.floor(optionValue) : void 0;
                };
                ExponentialFormatter.prototype.validateOption = function(optionSelector, minValue) {
                    var optionValue = optionSelector();
                    if (void 0 !== optionValue && (!isFinite(optionValue) || optionValue < minValue)) {
                        throw new Format.Errors.ArgumentError("Option '" + Format.Utils.Function.getReturnName(optionSelector) + "' with value '" + optionValue + "' must be finite and greater than or equal to " + minValue);
                    }
                };
                ExponentialFormatter.prototype.validateCustomOptions = function() {
                    var _this = this;
                    this.validateOption(function() {
                        return _this.minimumFractionDigits;
                    }, 0);
                    this.validateOption(function() {
                        return _this.maximumFractionDigits;
                    }, 0);
                    this.validateOption(function() {
                        return _this.minimumExponentDigits;
                    }, 1);
                    if (this.minimumFractionDigits > this.maximumFractionDigits) {
                        throw new RangeError("Argument 'minimumFractionDigits=" + this.minimumFractionDigits + "' cannot be greater than argument 'maximumFractionDigits=" + this.maximumFractionDigits + "'");
                    }
                };
                ExponentialFormatter.prototype.toExponential = function(value) {
                    var exponentialValue = Format.Utils.Numeric.toExponentialMinMax(value, this.minimumFractionDigits, this.maximumFractionDigits);
                    exponentialValue = this.applyExponentPadding(exponentialValue);
                    exponentialValue = this.applyExponentSigning(exponentialValue);
                    return exponentialValue;
                };
                ExponentialFormatter.prototype.getPaddedExponent = function(exponent) {
                    return Format.Utils.Padding.pad(exponent, {
                        totalWidth: this.minimumExponentDigits,
                        direction: Format.Utils.Padding.Direction.Left,
                        paddingChar: "0"
                    });
                };
                ExponentialFormatter.prototype.applyExponentSigning = function(exponentialValue) {
                    if (this.negativellySignedExponent) {
                        var positiveExponentSignIndex = exponentialValue.lastIndexOf("+");
                        if (positiveExponentSignIndex > 0) {
                            exponentialValue = exponentialValue.substring(0, positiveExponentSignIndex) + exponentialValue.substring(positiveExponentSignIndex + 1);
                        }
                    }
                    return exponentialValue;
                };
                ExponentialFormatter.prototype.toCustomExponential = function(value) {
                    return this.resolveFromState({
                        index: 0,
                        digits: value.toString(),
                        power: -this.minimumIntegerDigits,
                        offset: this.minimumIntegerDigits,
                        nonZeroEncountered: false,
                        afterDecimal: false
                    });
                };
                ExponentialFormatter.prototype.resolveFromState = function(customState) {
                    var len, exponentialValue = "";
                    for (len = customState.digits.length; customState.index < len; customState.index += 1) {
                        exponentialValue += this.resolveFromDigit(customState);
                    }
                    return this.resolveOffset(exponentialValue, customState) + this.resolveExponent(customState);
                };
                ExponentialFormatter.prototype.resolveFromDigit = function(customState) {
                    var digit = customState.digits[customState.index], resolver = this.resolvers[digit];
                    digit = resolver ? resolver(digit, customState) : this.resolveNonZeroDigit(digit, customState);
                    return !digit ? "" : digit + this.resolveDecimalPoint(customState);
                };
                ExponentialFormatter.prototype.resolveNonZeroDigit = function(digitChar, customState) {
                    if (!customState.nonZeroEncountered) {
                        customState.nonZeroEncountered = true;
                    }
                    return this.resolveDigit(digitChar, customState);
                };
                ExponentialFormatter.prototype.resolveDigit = function(digitChar, customState) {
                    this.resolvePowerState(customState);
                    this.resolveDigitState(customState);
                    if (void 0 !== this.maximumFractionDigits) {
                        if (customState.decimalDigits > this.maximumFractionDigits) {
                            return "";
                        } else {
                            if (customState.decimalDigits === this.maximumFractionDigits) {
                                return this.resolveDigitRounding(digitChar, customState);
                            }
                        }
                    }
                    return digitChar;
                };
                ExponentialFormatter.prototype.resolvePowerState = function(customState) {
                    if (customState.nonZeroEncountered) {
                        customState.offset -= 1;
                        if (!customState.afterDecimal) {
                            customState.power += 1;
                        }
                    } else {
                        if (customState.afterDecimal) {
                            customState.power -= 1;
                        }
                    }
                };
                ExponentialFormatter.prototype.resolveDigitState = function(customState) {
                    if (customState.decimalDigits >= 0) {
                        customState.decimalDigits += 1;
                    }
                    if (0 === customState.offset) {
                        customState.decimalDigits = 0;
                    }
                };
                ExponentialFormatter.prototype.resolveDigitRounding = function(digitChar, customState) {
                    var nextDigit = +customState.digits[customState.index + 1];
                    if (isNaN(nextDigit)) {
                        nextDigit = +customState.digits[customState.index + 2];
                    }
                    return nextDigit >= 5 ? +digitChar + 1 + "" : digitChar;
                };
                ExponentialFormatter.prototype.resolveDecimalPoint = function(customState) {
                    return 0 === customState.offset && 0 !== this.maximumFractionDigits ? "." : "";
                };
                ExponentialFormatter.prototype.resolveOffset = function(exponentialValue, customState) {
                    if (customState.offset > 0) {
                        exponentialValue = Format.Utils.Padding.pad(exponentialValue, {
                            totalWidth: exponentialValue.length + customState.offset,
                            paddingChar: "0"
                        });
                        if (this.minimumFractionDigits > 0) {
                            exponentialValue += ".";
                        }
                    }
                    var decimalOffset = this.minimumFractionDigits - (customState.decimalDigits || 0);
                    if (decimalOffset > 0) {
                        exponentialValue = Format.Utils.Padding.pad(exponentialValue, {
                            totalWidth: exponentialValue.length + decimalOffset,
                            paddingChar: "0"
                        });
                    }
                    return exponentialValue;
                };
                ExponentialFormatter.prototype.resolveExponent = function(customState) {
                    var paddedExponent = Math.abs(customState.power).toString(), sign = customState.power < 0 ? "-" : this.negativellySignedExponent ? "" : "+";
                    if (this.minimumExponentDigits > 1) {
                        paddedExponent = this.getPaddedExponent(paddedExponent);
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
    var Errors;
    (function(Errors) {
        /**
             * An error that is thrown when a requested method or operation is not implemented.
             *
             * See: https://msdn.microsoft.com/en-us/library/system.notimplementedexception.aspx
             */
        var NotImplementedError = function(_super) {
            /**
                 * Creates an error that is thrown when a requested method or operation is not implemented.
                 * @param methodName The name of the method that caused the error.
                 */
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
    var Errors;
    (function(Errors) {
        /**
             * An error that is thrown when a method call is invalid for the object's current state.
             *
             * See: https://msdn.microsoft.com/en-us/library/system.invalidoperationexception.aspx
             */
        var InvalidOperationError = function(_super) {
            /**
                 * Creates an error  that is thrown when a method call is invalid for the object's current state.
                 * @param message A human-readable description of the error.
                 * @param innerError An error to rethrow while also preserving its stack trace.
                 */
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
        var Numeric;
        (function(Numeric) {
            /**
                 * Invariant formatter implementation that applies invariant culture format to a numeric value.
                 * @param T The type of the options container.
                 */
            var InvariantFormatter = function() {
                /**
                     * Creates an instance with base formatting options and initializes an options provider that resolves concrete format options.
                     * @param optionsProviderConstructor A numeric options provider constructor which will be used to resolve options.
                     * @param options A base options object that can be overridden by resolved options.
                     */
                function InvariantFormatter(optionsProviderConstructor, options) {
                    var _this = this;
                    this.formatters = {
                        /** The currency format is not supported by this culture invariant instance. */
                        currency: function() {
                            throw new Format.Errors.NotImplementedError("currency");
                        },
                        /** The decimal format converts a number to a string of decimal digits (0-9), prefixed by a minus sign if the number is negative. */
                        decimal: function() {
                            var minimumIntegerDigits = _this.optionsProvider.getMinimumSignificantDigits();
                            if (void 0 === minimumIntegerDigits) {
                                minimumIntegerDigits = _this.optionsProvider.getMinimumIntegerDigits();
                            }
                            return _this.decorationFormatter.applyIntegerPadding(_this.value, _this.value.toFixed(0), minimumIntegerDigits);
                        },
                        /** The exponential format converts a number to a string of the form "-d.ddd…E+ddd" or "-d.ddd…e+ddd". */
                        exponential: function() {
                            var exponentialFormatter = new Numeric.ExponentialFormatter(_this.optionsProvider), result = exponentialFormatter.applyOptions(_this.value);
                            return _this.decorationFormatter.applyUppercase(result);
                        },
                        /** The fixed-point format converts a number to a string of the form "-ddd.ddd…" where each "d" indicates a digit (0-9). */
                        fixedPoint: function() {
                            return _this.applyDecimalFormat();
                        },
                        /**
                             * The general format converts a number to the most compact of either fixed-point or scientific notation, depending on the type of the number and whether a precision specifier
                             * is present. Fixed-point notation is used if the exponent that would result from expressing the number in scientific notation is greater than -5 and less than the precision specifier;
                             * otherwise, scientific notation is used.
                             */
                        general: function() {
                            var result, maximumSignificantDigits = _this.optionsProvider.getMaximumSignificantDigits(), exponentialFormatter = new Numeric.ExponentialFormatter(_this.optionsProvider);
                            if (Math.abs(_this.value) < 1e-4) {
                                result = exponentialFormatter.applyOptions(_this.value);
                            } else {
                                result = Format.Utils.Numeric.toPrecisionMinMax(_this.value, void 0, maximumSignificantDigits);
                                result = exponentialFormatter.applyExponentPadding(result);
                            }
                            return _this.decorationFormatter.applyUppercase(result);
                        },
                        /**
                             * The numeric format converts a number to a string of the form "-d,ddd,ddd.ddd…", where "-" indicates a negative number symbol if required,
                             * "d" indicates a digit (0-9), "," indicates a group separator, and "." indicates a decimal point symbol.
                             */
                        number: function() {
                            return _this.applyDecimalFormat();
                        },
                        /** The percent format multiplies a number by 100 and converts it to a string that represents a percentage. */
                        percent: function() {
                            _this.value *= 100;
                            return _this.formatters.number() + " %";
                        },
                        /** The round-trip format is used to ensure that a numeric value that is converted to a string will be parsed back into the same numeric value. */
                        roundTrip: function() {
                            return JSON.stringify(_this.value);
                        },
                        /** The hexadecimal format converts a number to a string of hexadecimal digits. */
                        hex: function() {
                            var result, minimumHexDigits = _this.optionsProvider.getMinimumSignificantDigits();
                            if (void 0 === minimumHexDigits) {
                                minimumHexDigits = _this.optionsProvider.getMinimumIntegerDigits();
                            }
                            result = _this.decorationFormatter.applyIntegerPadding(_this.value, _this.value.toString(16), minimumHexDigits);
                            return _this.decorationFormatter.applyUppercase(result);
                        }
                    };
                    this.optionsProviderConstructor = optionsProviderConstructor;
                    this.baseOptions = options || {};
                }
                /**
                     * Converts the number to an equivalent string representation using specified format and invariant culture formatting information.
                     * @param format A format string containing formatting specifications.
                     * @param value The number to format.
                     */
                InvariantFormatter.prototype.format = function(format, value) {
                    try {
                        return this.innerFormat(format, value);
                    } finally {
                        this.cleanup();
                    }
                };
                /**
                     * Applies all resolved format options to the number.
                     * @param value The number to format.
                     * @returns The fully formatted value.
                     */
                InvariantFormatter.prototype.applyOptions = function(value) {
                    var result, style = this.optionsProvider.getStyle();
                    if (style) {
                        if (this.formatters.hasOwnProperty(style)) {
                            return this.formatters[style]();
                        }
                        throw new Format.Errors.ArgumentError("Option 'style' with base or resolved value '" + style + "' is not supported");
                    }
                    result = Format.Utils.Numeric.toFixedMinMax(this.value, this.optionsProvider.getMinimumFractionDigits(), this.optionsProvider.getMaximumFractionDigits());
                    result = this.decorationFormatter.applyIntegerPadding(this.value, result, this.optionsProvider.getMinimumIntegerDigits());
                    return this.decorationFormatter.applyGrouping(result);
                };
                /**
                     * Returns the format info instance to use for culture-specific formatting.
                     *
                     * Must be overridden by subclasses that are not culture invariant.
                     */
                InvariantFormatter.prototype.getFormatInfo = function() {
                    return Globalization.NumberFormatInfo.InvariantInfo;
                };
                InvariantFormatter.prototype.innerFormat = function(format, value) {
                    this.optionsProvider = new this.optionsProviderConstructor(this.baseOptions);
                    this.resolvedOptions = this.optionsProvider.resolveOptions(format, value);
                    if (!Format.Utils.isObject(this.resolvedOptions)) {
                        throw new Format.Errors.InvalidOperationError("Invocation of 'optionsProvider' member's method 'resolveOptions' did not initialize instance member 'resolvedOptions' properly");
                    }
                    this.setValue(value);
                    this.decorationFormatter = new Numeric.DecorationFormatter(this.optionsProvider, this.getFormatInfo());
                    return this.decorationFormatter.applyOptions(this.value, this.applyOptions(this.value));
                };
                InvariantFormatter.prototype.setValue = function(value) {
                    this.value = value;
                    var valueDivisor = this.optionsProvider.getValueDivisor();
                    if (valueDivisor) {
                        this.value /= valueDivisor;
                    }
                };
                InvariantFormatter.prototype.cleanup = function() {
                    delete this.value;
                    delete this.resolvedOptions;
                    delete this.optionsProvider;
                    delete this.decorationFormatter;
                };
                InvariantFormatter.prototype.applyDecimalFormat = function() {
                    var maximumFractionDigits, formatInfo = this.getFormatInfo(), minimumFractionDigits = this.optionsProvider.getMinimumFractionDigits();
                    if (void 0 === minimumFractionDigits) {
                        minimumFractionDigits = formatInfo.NumberDecimalDigits;
                    }
                    maximumFractionDigits = this.optionsProvider.getMaximumFractionDigits();
                    if (void 0 === maximumFractionDigits) {
                        maximumFractionDigits = formatInfo.NumberDecimalDigits;
                    }
                    return this.decorationFormatter.applyGrouping(Format.Utils.Numeric.toFixedMinMax(this.value, minimumFractionDigits, maximumFractionDigits));
                };
                return InvariantFormatter;
            }();
            Numeric.InvariantFormatter = InvariantFormatter;
        })(Numeric = Globalization.Numeric || (Globalization.Numeric = {}));
    })(Globalization = Format.Globalization || (Format.Globalization = {}));
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
        /** @private */
        removeProperty = function(object, context) {
            var objectIsArray = Utils.isArray(object);
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
                if (context.deep && context.seen.indexOf(value) === -1) {
                    removeProperty(value, context);
                }
            }
        };
    })(Utils = Format.Utils || (Format.Utils = {}));
})(Format || (Format = {}));

(function(Format) {
    var Errors;
    (function(Errors) {
        /**
             * An error that is thrown when the format of an argument is invalid, or when a composite format string is not well formed.
             *
             * See: https://msdn.microsoft.com/en-us/library/system.formatexception.aspx
             */
        var FormatError = function(_super) {
            /**
                 * Creates an error that is thrown when the format of an argument is invalid, or when a composite format string is not well formed.
                 * @param message A human-readable description of the error.
                 * @param innerError An error to rethrow while also preserving its stack trace.
                 */
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
        var Numeric;
        (function(Numeric) {
            var Specifiers;
            (function(Specifiers) {
                /**
                     * An [[OptionsProvider]] implementation that handles [Standard Numeric Format Specifiers](https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx). The type of the returned options object is an
                     * extended version of [Intl.NumberFormat's options](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat#Parameters) parameter.
                     */
                var IntlStandardOptionsProvider = function() {
                    /**
                         * Creates an instance with base formatting options which will be extended and/or overridden by resolved options.
                         * @param numberOptions A base options object containing properties defined for the Intl.NumberFormat's options parameter.
                         */
                    function IntlStandardOptionsProvider(numberOptions) {
                        var _this = this;
                        this.resolvers = {
                            /** See: https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx#CFormatString */
                            currency: function() {
                                _this.options.useGrouping = true;
                                _this.options.minimumFractionDigits = _this.precision;
                                _this.options.maximumFractionDigits = _this.precision;
                            },
                            /** See: https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx#DFormatString */
                            decimal: function() {
                                _this.options.minimumIntegerDigits = _this.precision;
                                _this.options.maximumFractionDigits = 0;
                            },
                            /** See: https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx#EFormatString */
                            exponential: function() {
                                var precision = _this.precision >= 0 ? _this.precision : Specifiers.DefaultStandardExponentialPrecision;
                                _this.options.upperCase = _this.specifier === _this.specifier.toUpperCase();
                                _this.options.minimumFractionDigits = precision;
                                _this.options.maximumFractionDigits = precision;
                                _this.options.minimumExponentDigits = 3;
                            },
                            /** See: https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx#FFormatString */
                            fixedPoint: function() {
                                _this.options.minimumFractionDigits = _this.precision;
                                _this.options.maximumFractionDigits = _this.precision;
                            },
                            /** See: https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx#GFormatString */
                            general: function() {
                                _this.options.minimumExponentDigits = 2;
                                _this.options.upperCase = _this.specifier === _this.specifier.toUpperCase();
                                if (_this.precision >= 1) {
                                    _this.options.maximumSignificantDigits = _this.precision;
                                    _this.options.maximumFractionDigits = _this.precision >= 1 ? _this.precision - 1 : void 0;
                                }
                            },
                            /** See: https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx#NFormatString */
                            number: function() {
                                _this.resolvers.fixedPoint();
                                _this.options.useGrouping = true;
                            },
                            /** See: https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx#PFormatString */
                            percent: function() {
                                _this.resolvers.number();
                            },
                            /** See: https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx#RFormatString */
                            roundTrip: Format.Utils.Function.getEmpty(),
                            /** See: https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx#XFormatString */
                            hex: function() {
                                _this.options.minimumSignificantDigits = _this.precision;
                                _this.options.upperCase = _this.specifier === _this.specifier.toUpperCase();
                            }
                        };
                        this.options = numberOptions;
                    }
                    /**
                         * Returns an object that provides numeric formatting options resolved from standard numeric specifiers.
                         * @param format A format string representing a [Standard Numeric Format Specifiers](https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx).
                         * @param value The value object from which to infer additional options.
                         */
                    IntlStandardOptionsProvider.prototype.resolveOptions = function(format, value) {
                        if (this.tryInitializeSpecifierOptions(format)) {
                            this.resolvers[this.style]();
                            this.options.style = this.style;
                            return Format.Utils.removeUndefined(this.options);
                        }
                    };
                    IntlStandardOptionsProvider.prototype.tryInitializeSpecifierOptions = function(format) {
                        var standardSpecifierGroups = Specifiers.StandardSpecifierRexExp.exec(format);
                        if (!standardSpecifierGroups) {
                            return false;
                        }
                        this.specifier = standardSpecifierGroups[1];
                        this.style = Specifiers.StandardSpecifiers[this.specifier.toUpperCase()];
                        if (!this.style) {
                            throw new Format.Errors.FormatError("Format specifier '" + format + "' is invalid");
                        }
                        this.precision = "" !== standardSpecifierGroups[2] ? +standardSpecifierGroups[2] : void 0;
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
                /**
                     * A custom numeric exponent format string takes the form `Esxxx`, where:
                     * - `E` is a single lower or uppercase 'E' character marking the begining of the exponential notation specifier.
                     * - `s` is an optional single '+' or '-' sign which specifies the display behaviour of the same characters in the output string.
                     * - `xxx` is a zero placeholders' string (at least 1) that determines the width of the output exponent's padding.
                     */
                Specifiers.CustomExponentRexExp = /^E([-\+]?)(0+)/i;
                /**
                     * Exposes a map of the custom numeric format specifiers to their character or regexp representation as well as the inverse relation.
                     *
                     * See: https://msdn.microsoft.com/en-us/library/0c899ak8.aspx
                     */
                Specifiers.CustomSpecifiers = Format.Utils.mapValuesAsKeys({
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
        /**
             * Provides support for lazy initialization.
             *
             * See: https://msdn.microsoft.com/en-us/library/dd642331.aspx
             * @param T The type of object that is being lazily initialized.
             */
        var Lazy = function() {
            /**
                 * Initializes a new instance of the class that uses the supplied value factory.
                 * @param valueFactory The delegate that is invoked to produce the lazily initialized value when it is needed.
                 */
            function Lazy(valueFactory) {
                if (null == valueFactory) {
                    throw new Format.Errors.ArgumentNullError("valueFactory");
                }
                this.valueCreated = false;
                this.valueFactory = valueFactory;
            }
            /**
                 * Returns a new instance of the class that uses the specified constructor to create a value of its type.
                 * @param TStatic The type of object that is being lazily initialized.
                 * @param valueConstructor The parameterless constructor that is invoked to produce the lazily initialized value when it is needed.
                 */
            Lazy.fromConstructor = function(valueConstructor) {
                if (null == valueConstructor) {
                    throw new Format.Errors.ArgumentNullError("valueConstructor");
                }
                var instance = new Lazy(Utils.Function.getEmpty());
                instance.valueConstructor = valueConstructor;
                return instance;
            };
            /**
                 * Gets the lazily initialized value of the current [[Lazy]] instance.
                 * @returns The lazily initialized value of the current instance.
                 */
            Lazy.prototype.getValue = function() {
                if (this.valueError) {
                    throw this.valueError;
                }
                if (!this.valueCreated) {
                    this.value = this.lazyInitValue();
                }
                return this.value;
            };
            /**
                 * Gets a value that indicates whether a value has been created for this [[Lazy]] instance.
                 * @returns `true` if a value has been created for this instance; otherwise, `false`.
                 */
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
    var Utils;
    (function(Utils) {
        var createExtendObject, createCloneFunction = function(cloneFunc) {
            return function(object, deep) {
                var objectIsArray = Utils.isArray(object);
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
        /** @private */
        createExtendObject = function(object, objectIsArray) {
            return objectIsArray ? [] : {};
        };
        Utils.fastClone = createCloneFunction(function(object) {
            return JSON.parse(JSON.stringify(object));
        });
    })(Utils = Format.Utils || (Format.Utils = {}));
})(Format || (Format = {}));

(function(Format) {
    var Globalization;
    (function(Globalization) {
        var Numeric;
        (function(Numeric) {
            var Specifiers;
            (function(Specifiers) {
                /**
                     * A [Custom Numeric Format String](https://msdn.microsoft.com/en-us/library/0c899ak8.aspx) parser implementation.
                     * It does not produce concrete formatting options but does lend its intermediate and final state to visiting instances.
                     */
                var CustomParser = function() {
                    /**
                         * Creates an instance that parses the format string when [[doParse]] is called.
                         * @param format A format string containing formatting specifications.
                         */
                    function CustomParser(format) {
                        var _this = this;
                        // Arrow syntax used to preserve 'this' context inside the function at compile time
                        this.getLookahead = function() {
                            var lookahead = _this;
                            if (_this.index < _this.format.length - 1) {
                                lookahead = Format.Utils.clone(_this);
                                lookahead.index += 1;
                                lookahead.escapeOne = false;
                                lookahead.doDetachedParse();
                            }
                            return lookahead;
                        };
                        this.index = 0;
                        this.format = format;
                        this.lookahead = new Format.Utils.Lazy(this.getLookahead);
                    }
                    /**
                         * Creates and executes a special detached parser instance that returns only the matched format sections that are separated by [[CustomSpecifiersMap.sectionSeparator]].
                         * @param format A format string containing formatting specifications.
                         * @returns An array containing separate format sections.
                         */
                    CustomParser.getSections = function(format) {
                        var parser = new CustomParser(format);
                        parser.sections = [ "", "", "" ];
                        parser.sectionIndex = 0;
                        parser.doDetachedParse();
                        return parser.sections;
                    };
                    /** Returns the current character visited by the parser. */
                    CustomParser.prototype.getCurrentChar = function() {
                        return this.secondaryExponent || this.format[this.index];
                    };
                    /**
                         * Returns the number of [[CustomSpecifiersMap.zeroPlaceholder]] specifiers preceding the [[CustomSpecifiersMap.decimalPoint]].
                         * If the [[format]] string contains a [[CustomSpecifiersMap.exponent]] specifier then [[CustomSpecifiersMap.digitPlaceholder]] are counted as well.
                         */
                    CustomParser.prototype.getDigitsBeforeDecimal = function() {
                        return this.exponentMatchIndex >= 0 ? this.getNumberPlaceholderCountBeforeDecimal() : this.getZeroPlaceholderCountBeforeDecimal();
                    };
                    /** Returns the number of both [[CustomSpecifiersMap.zeroPlaceholder]] and [[CustomSpecifiersMap.digitPlaceholder]] specifiers after the [[CustomSpecifiersMap.decimalPoint]]. */
                    CustomParser.prototype.getNumberPlaceholderCountAfterDecimal = function() {
                        if (this.isAfterDecimal()) {
                            return this.innerNumericSpecifiersIndex - this.decimalPointIndex;
                        } else {
                            return 0;
                        }
                    };
                    /** Returns the number of [[CustomSpecifiersMap.zeroPlaceholder]] specifiers after the [[CustomSpecifiersMap.decimalPoint]]. */
                    CustomParser.prototype.getZeroPlaceholderCountAfterDecimal = function() {
                        if (this.lastZeroSpecifierIndex >= this.decimalPointIndex) {
                            return this.lastZeroSpecifierIndex - this.decimalPointIndex;
                        } else {
                            return 0;
                        }
                    };
                    /** Returns the sign character following the [[CustomSpecifiersMap.exponent]] specifier. */
                    CustomParser.prototype.getExponentSign = function() {
                        return this.exponentGroups[1];
                    };
                    /** Returns the number of `0` characters following the [[CustomSpecifiersMap.exponent]] specifier. */
                    CustomParser.prototype.getExponentPlaceholderCount = function() {
                        return Math.min(this.exponentGroups[2].length, 10);
                    };
                    /**
                         * Returns the current index offset from the [[CustomSpecifiersMap.decimalPoint]] specifier, which is considered as the starting index.
                         *
                         * May require a [[lookahead]] evaluation.
                         */
                    CustomParser.prototype.getIndexFromDecimal = function() {
                        var lookahead, offset = this.decimalPointIndex;
                        if (!this.isAfterDecimal()) {
                            lookahead = this.lookahead.getValue();
                            offset = lookahead.decimalPointIndex || lookahead.innerNumericSpecifiersIndex + 1;
                            if (lookahead.lastGroupSeparatorIndex > this.firstNumericSpecifierIndex) {
                                offset += Math.floor((offset - this.innerNumericSpecifiersIndex - 2) / 3);
                            }
                        }
                        return this.innerNumericSpecifiersIndex - offset;
                    };
                    /** Returns `true` if the parser has already encountered a [[CustomSpecifiersMap.decimalPoint]] specifier; otherwise, `false`. */
                    CustomParser.prototype.isAfterDecimal = function() {
                        return this.decimalPointIndex >= 0;
                    };
                    /**
                         * Returns `true` if the parser is yet to encounter a [[CustomSpecifiersMap.zeroPlaceholder]], [[CustomSpecifiersMap.digitPlaceholder]] or [[CustomSpecifiersMap.decimalPoint]] specifier;
                         * otherwise, `false`.
                         */
                    CustomParser.prototype.isBeforeNumericSpecifiers = function() {
                        return void 0 === this.firstNumericSpecifierIndex;
                    };
                    /**
                         * Returns `true` if the parser can no longer encounter a [[CustomSpecifiersMap.zeroPlaceholder]], [[CustomSpecifiersMap.digitPlaceholder]] or [[CustomSpecifiersMap.decimalPoint]] specifier;
                         * otherwise, `false`.
                         *
                         * Always requires a [[lookahead]] evaluation.
                         */
                    CustomParser.prototype.isAfterNumericSpecifiers = function() {
                        return this.index > this.lookahead.getValue().lastNumericSpecifierIndex;
                    };
                    /**
                         * Returns `true` if the current parser position is exactly after the last [[CustomSpecifiersMap.zeroPlaceholder]], [[CustomSpecifiersMap.digitPlaceholder]] or
                         * [[CustomSpecifiersMap.decimalPoint]] specifier; otherwise, `false`.
                         *
                         * Always requires a [[lookahead]] evaluation and internally shifts its state so that the next call to this method can also return `true` if this one did.
                         */
                    CustomParser.prototype.isImmediateAfterNumericSpecifiers = function() {
                        var lookahead = this.lookahead.getValue();
                        if (lookahead.lastNumericSpecifierIndex + 1 === this.index) {
                            lookahead.lastNumericSpecifierIndex += 1;
                            return true;
                        }
                        return false;
                    };
                    /** Returns `true` if the current parser position is exactly at the first [[CustomSpecifiersMap.exponent]] occurrence; otherwise, `false`. */
                    CustomParser.prototype.isExponentMatched = function() {
                        return this.index === this.exponentMatchIndex;
                    };
                    /**
                         * Returns `true` if the matched [[CustomSpecifiersMap.exponent]] is an uppercase character; otherwise, `false`.
                         *
                         * Call only when [[isExponentMatched]] returned a `true` value to guarantee correct behavior.
                         */
                    CustomParser.prototype.isExponentUppercase = function() {
                        var exponentSpecifier = this.exponentGroups[0][0];
                        return exponentSpecifier === exponentSpecifier.toUpperCase();
                    };
                    /**
                         * Parses the [[format]] string this instance was initialized with.
                         * The method uses the supplied resolvers map as a means for an outside class to access the intermediate state of the parser each time a specifier is visited.
                         * @param resolvers A map between a specifier type and a resolver function that is called after the parser evaluates its intermediate state.
                         * @param charResolver A standalone resolver function that is called for every visited character that is not considered a specifier.
                         */
                    CustomParser.prototype.doParse = function(resolvers, charResolver) {
                        var len, handlers = this.getHandlers();
                        for (len = this.format.length; this.index < len; this.index += 1) {
                            this.addToSection();
                            this.handleSpecifier(handlers, resolvers, charResolver);
                            this.addExponentOffset();
                        }
                    };
                    CustomParser.prototype.doDetachedParse = function() {
                        this.doParse(void 0, void 0);
                    };
                    CustomParser.prototype.addToSection = function() {
                        if (this.sections && this.sectionIndex < 3 && (this.escapeOne || this.escapeManyChar || this.getCurrentChar() !== Specifiers.CustomSpecifiers.sectionSeparator)) {
                            this.sections[this.sectionIndex] += this.getCurrentChar();
                        }
                    };
                    CustomParser.prototype.handleSpecifier = function(handlers, resolvers, charResolver) {
                        var customSpecifier = Specifiers.CustomSpecifiers[this.getCurrentChar().toUpperCase()], resolver = resolvers && resolvers[customSpecifier], handler = handlers[customSpecifier];
                        if (this.canHandleSpecifier(handler)) {
                            handler();
                            if (resolver) {
                                resolver();
                            }
                        } else {
                            if (charResolver) {
                                charResolver();
                            }
                            this.escapeOne = false;
                        }
                    };
                    CustomParser.prototype.canHandleSpecifier = function(handler) {
                        return !this.escapeOne && handler && !(this.escapeManyChar && this.getCurrentChar() !== this.escapeManyChar);
                    };
                    CustomParser.prototype.addExponentOffset = function() {
                        if (this.isExponentMatched()) {
                            this.index += this.exponentGroups[0].length - 1;
                        } else {
                            if (this.secondaryExponent) {
                                this.index += this.secondaryExponent.length - 1;
                                delete this.secondaryExponent;
                            }
                        }
                    };
                    CustomParser.prototype.handleNumericSpecifier = function() {
                        this.lastNumericSpecifierIndex = this.index;
                        if (void 0 === this.firstNumericSpecifierIndex) {
                            this.firstNumericSpecifierIndex = this.index;
                            this.innerNumericSpecifiersIndex = 0;
                        } else {
                            this.innerNumericSpecifiersIndex += 1;
                        }
                    };
                    CustomParser.prototype.handleLiteralStringDelimeter = function() {
                        var currentChar = this.getCurrentChar();
                        this.escapeManyChar = this.escapeManyChar !== currentChar ? currentChar : void 0;
                    };
                    CustomParser.prototype.getExponentGroups = function() {
                        if (!this.lookahead.isValueCreated()) {
                            return this.matchExponent();
                        }
                        var lookahead = this.lookahead.getValue();
                        if (lookahead.exponentMatchIndex === this.index) {
                            return lookahead.exponentGroups;
                        } else {
                            return void 0;
                        }
                    };
                    CustomParser.prototype.matchExponent = function() {
                        return Specifiers.CustomExponentRexExp.exec(this.format.substring(this.index));
                    };
                    CustomParser.prototype.getNumberPlaceholderCountBeforeDecimal = function() {
                        if (!this.isAfterDecimal()) {
                            return this.innerNumericSpecifiersIndex + 1;
                        }
                        if (this.decimalPointIndex > 0) {
                            return this.decimalPointIndex;
                        } else {
                            return void 0;
                        }
                    };
                    CustomParser.prototype.getZeroPlaceholderCountBeforeDecimal = function() {
                        var numberPlaceholderCountBeforeDecimal = this.getNumberPlaceholderCountBeforeDecimal();
                        if (numberPlaceholderCountBeforeDecimal > this.firstZeroSpecifierIndex) {
                            return numberPlaceholderCountBeforeDecimal - this.firstZeroSpecifierIndex;
                        } else {
                            return void 0;
                        }
                    };
                    CustomParser.prototype.getHandlers = function() {
                        var _this = this;
                        return {
                            zeroPlaceholder: function() {
                                _this.handleNumericSpecifier();
                                _this.lastZeroSpecifierIndex = _this.innerNumericSpecifiersIndex;
                                if (void 0 === _this.firstZeroSpecifierIndex) {
                                    _this.firstZeroSpecifierIndex = _this.innerNumericSpecifiersIndex;
                                }
                            },
                            digitPlaceholder: function() {
                                _this.handleNumericSpecifier();
                            },
                            decimalPoint: function() {
                                _this.handleNumericSpecifier();
                                if (void 0 === _this.decimalPointIndex) {
                                    _this.decimalPointIndex = _this.innerNumericSpecifiersIndex;
                                }
                            },
                            groupSeparatorOrNumberScaling: function() {
                                if (!_this.isAfterDecimal()) {
                                    _this.lastGroupSeparatorIndex = _this.index;
                                }
                            },
                            exponent: function() {
                                var exponentGroups, secondaryExponent;
                                if (!_this.exponentGroups) {
                                    exponentGroups = _this.getExponentGroups();
                                    if (exponentGroups) {
                                        _this.exponentGroups = exponentGroups;
                                        _this.exponentMatchIndex = _this.index;
                                    }
                                } else {
                                    secondaryExponent = _this.matchExponent();
                                    if (secondaryExponent) {
                                        _this.secondaryExponent = secondaryExponent[0];
                                    }
                                }
                            },
                            escapeChar: function() {
                                _this.escapeOne = true;
                            },
                            literalStringDelimeterSingle: function() {
                                _this.handleLiteralStringDelimeter();
                            },
                            literalStringDelimeterDouble: function() {
                                _this.handleLiteralStringDelimeter();
                            },
                            sectionSeparator: function() {
                                _this.sectionIndex += 1;
                            },
                            percentagePlaceholder: Format.Utils.Function.getEmpty(),
                            perMillePlaceholder: Format.Utils.Function.getEmpty()
                        };
                    };
                    return CustomParser;
                }();
                Specifiers.CustomParser = CustomParser;
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
                /**
                     * An [[OptionsProvider]] implementation that handles [Custom Numeric Format String](https://msdn.microsoft.com/en-us/library/0c899ak8.aspx). The type of the returned options object is an
                     * extended version of [Intl.NumberFormat's options](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat#Parameters) parameter.
                     */
                var IntlCustomOptionsProvider = function() {
                    /**
                         * Creates an instance with base formatting options which will be extended and/or overridden by resolved options.
                         * @param numberOptions A base options object containing properties defined for the Intl.NumberFormat's options parameter.
                         */
                    function IntlCustomOptionsProvider(numberOptions) {
                        var _this = this;
                        // Arrow syntax used to preserve 'this' context inside the function at compile time
                        this.decoractingCharResolver = function() {
                            var formatChar = _this.parser.getCurrentChar();
                            if (_this.parser.isBeforeNumericSpecifiers()) {
                                _this.options.prefixDecorator += formatChar;
                            } else {
                                if (_this.parser.isAfterNumericSpecifiers()) {
                                    _this.options.suffixDecorator += formatChar;
                                } else {
                                    _this.setInternalDecorator(formatChar);
                                }
                            }
                        };
                        this.resolvers = {
                            /** See: https://msdn.microsoft.com/en-us/library/0c899ak8.aspx#Specifier0 */
                            zeroPlaceholder: function() {
                                _this.resolvers.digitPlaceholder();
                                if (!_this.parser.isAfterDecimal()) {
                                    _this.options.noLeadingZeroIntegerDigit = false;
                                }
                            },
                            /** See: https://msdn.microsoft.com/en-us/library/0c899ak8.aspx#SpecifierD */
                            digitPlaceholder: function() {
                                _this.options.noDigits = false;
                            },
                            /** See: https://msdn.microsoft.com/en-us/library/0c899ak8.aspx#SpecifierPt */
                            decimalPoint: function() {
                                _this.resolvers.digitPlaceholder();
                            },
                            /** See: https://msdn.microsoft.com/en-us/library/0c899ak8.aspx#SpecifierTh */
                            groupSeparatorOrNumberScaling: function() {
                                if (!_this.parser.isBeforeNumericSpecifiers()) {
                                    if (!_this.parser.isAfterDecimal() && !_this.parser.isAfterNumericSpecifiers()) {
                                        _this.options.useGrouping = true;
                                    } else {
                                        if (Math.abs(_this.options.valueDivisor) >= 1 && _this.parser.isImmediateAfterNumericSpecifiers()) {
                                            _this.options.valueDivisor *= 1e3;
                                        }
                                    }
                                }
                            },
                            /** See: https://msdn.microsoft.com/en-us/library/0c899ak8.aspx#SpecifierPct */
                            percentagePlaceholder: function() {
                                _this.decoractingCharResolver();
                                _this.resetValueDivisor();
                                _this.options.valueDivisor /= 100;
                            },
                            /** See: https://msdn.microsoft.com/en-us/library/0c899ak8.aspx#SpecifierPerMille */
                            perMillePlaceholder: function() {
                                _this.decoractingCharResolver();
                                _this.resetValueDivisor();
                                _this.options.valueDivisor /= 1e3;
                            },
                            /** See: https://msdn.microsoft.com/en-us/library/0c899ak8.aspx#SpecifierExponent */
                            exponent: function() {
                                if (_this.parser.isExponentMatched()) {
                                    _this.options.style = Specifiers.StandardSpecifiers[Specifiers.StandardSpecifiers.exponential];
                                    _this.options.upperCase = _this.parser.isExponentUppercase();
                                    _this.options.negativellySignedExponent = "+" !== _this.parser.getExponentSign();
                                    _this.options.minimumExponentDigits = _this.parser.getExponentPlaceholderCount();
                                } else {
                                    _this.decoractingCharResolver();
                                }
                            },
                            /** See: https://msdn.microsoft.com/en-us/library/0c899ak8.aspx#SpecifierEscape */
                            escapeChar: void 0,
                            /** See: https://msdn.microsoft.com/en-us/library/0c899ak8.aspx#SectionSeparator */
                            sectionSeparator: void 0,
                            /** Indicates that the enclosed characters should be copied to the result string unchanged. */
                            literalStringDelimeterSingle: void 0,
                            /** Indicates that the enclosed characters should be copied to the result string unchanged. */
                            literalStringDelimeterDouble: void 0
                        };
                        this.options = Format.Utils.extend(numberOptions, {
                            noDigits: true,
                            noLeadingZeroIntegerDigit: true,
                            valueDivisor: 1,
                            prefixDecorator: "",
                            internalDecorators: {},
                            suffixDecorator: ""
                        });
                    }
                    /**
                         * Returns an object that provides numeric formatting options resolved from custom numeric specifiers.
                         * @param format A format string representing a [Custom Numeric Format String](https://msdn.microsoft.com/en-us/library/0c899ak8.aspx).
                         * @param value The value object from which to infer additional options.
                         */
                    IntlCustomOptionsProvider.prototype.resolveOptions = function(format, value) {
                        format = this.getSectionFormat(format, value);
                        this.parseOptions(format);
                        return this.stripDefaultOptions(value);
                    };
                    IntlCustomOptionsProvider.prototype.parseOptions = function(format) {
                        if (format) {
                            this.parser = new Specifiers.CustomParser(format);
                            this.parser.doParse(this.resolvers, this.decoractingCharResolver);
                            this.options.minimumIntegerDigits = this.parser.getDigitsBeforeDecimal();
                            this.options.minimumFractionDigits = this.parser.getZeroPlaceholderCountAfterDecimal();
                            this.options.maximumFractionDigits = this.parser.getNumberPlaceholderCountAfterDecimal();
                        }
                    };
                    IntlCustomOptionsProvider.prototype.stripDefaultOptions = function(value) {
                        if (1 === this.options.valueDivisor) {
                            delete this.options.valueDivisor;
                        }
                        if (Format.Utils.isEmpty(this.options.internalDecorators)) {
                            delete this.options.internalDecorators;
                        }
                        return this.stripDigitOptions(value);
                    };
                    IntlCustomOptionsProvider.prototype.stripDigitOptions = function(value) {
                        if (this.options.valueDivisor) {
                            value /= this.options.valueDivisor;
                        }
                        if (this.options.style === Specifiers.StandardSpecifiers[Specifiers.StandardSpecifiers.exponential] || !(this.options.noLeadingZeroIntegerDigit && Math.abs(value) < 1)) {
                            delete this.options.noLeadingZeroIntegerDigit;
                        }
                        if (!this.options.noDigits) {
                            delete this.options.noDigits;
                        }
                        return Format.Utils.removeEmpty(this.options);
                    };
                    IntlCustomOptionsProvider.prototype.getSectionFormat = function(format, value) {
                        if (format.indexOf(Specifiers.CustomSpecifiers.sectionSeparator) === -1) {
                            return format;
                        }
                        var sections = Specifiers.CustomParser.getSections(format);
                        if (this.tryNonZeroSectionFormat(sections, value)) {
                            return "";
                        } else {
                            return sections[2] || sections[0];
                        }
                    };
                    IntlCustomOptionsProvider.prototype.tryNonZeroSectionFormat = function(sections, value) {
                        if (value > 0) {
                            return this.tryRoundToZeroFormat(sections[0], value);
                        }
                        if (value < 0) {
                            return this.tryNegativeZeroSectionFormat(sections, value);
                        } else {
                            return void 0;
                        }
                    };
                    IntlCustomOptionsProvider.prototype.tryNegativeZeroSectionFormat = function(sections, value) {
                        var nonZeroSectionFormat = sections[1];
                        if (nonZeroSectionFormat) {
                            this.options.valueDivisor = -1;
                        } else {
                            nonZeroSectionFormat = sections[0];
                        }
                        return this.tryRoundToZeroFormat(nonZeroSectionFormat, value);
                    };
                    IntlCustomOptionsProvider.prototype.tryRoundToZeroFormat = function(nonZeroSectionFormat, value) {
                        var nonZeroProvider = new IntlCustomOptionsProvider({});
                        nonZeroProvider.parseOptions(nonZeroSectionFormat);
                        if (0 !== +value.toFixed(nonZeroProvider.options.maximumFractionDigits)) {
                            nonZeroProvider.options.valueDivisor *= this.options.valueDivisor;
                            Format.Utils.extend(this.options, nonZeroProvider.options);
                            return true;
                        }
                    };
                    IntlCustomOptionsProvider.prototype.setInternalDecorator = function(formatChar) {
                        var indexFromDecimal = this.parser.getIndexFromDecimal(), currentDecorator = this.options.internalDecorators[indexFromDecimal] || "";
                        this.options.internalDecorators[indexFromDecimal] = currentDecorator + formatChar;
                    };
                    IntlCustomOptionsProvider.prototype.resetValueDivisor = function() {
                        var absoluteDivisor = Math.abs(this.options.valueDivisor);
                        if (absoluteDivisor >= 1) {
                            this.options.valueDivisor /= absoluteDivisor;
                        }
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
            /**
                 * An [[OptionsProvider]] implementation that handles both [Standard Numeric Format Specifiers](https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx) and
                 * [Custom Numeric Format String](https://msdn.microsoft.com/en-us/library/0c899ak8.aspx). The type of the returned options object is an
                 * extended version of [Intl.NumberFormat's options](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat#Parameters) parameter.
                 */
            var IntlOptionsProvider = function() {
                /**
                     * Creates an instance with base formatting options which will be extended and/or overridden by resolved options.
                     * @param numberOptions A base options object containing properties defined for the Intl.NumberFormat's options parameter.
                     */
                function IntlOptionsProvider(numberOptions) {
                    this.resolvedOptions = Format.Utils.clone(numberOptions);
                }
                /**
                     * Returns an object that provides numeric formatting options resolved from numeric format specifiers.
                     * @param format A format string containing formatting specifications.
                     * @param value The value object from which to infer additional options.
                     */
                IntlOptionsProvider.prototype.resolveOptions = function(format, value) {
                    var standardSpecifierOptionsProvider, standardSpecifierOptions, customSpecifierOptionsProvider;
                    if (format) {
                        standardSpecifierOptionsProvider = new Numeric.Specifiers.IntlStandardOptionsProvider(this.resolvedOptions), 
                        standardSpecifierOptions = standardSpecifierOptionsProvider.resolveOptions(format, value);
                        if (!standardSpecifierOptions) {
                            customSpecifierOptionsProvider = new Numeric.Specifiers.IntlCustomOptionsProvider(this.resolvedOptions);
                            customSpecifierOptionsProvider.resolveOptions(format, value);
                        }
                    }
                    return this.resolvedOptions;
                };
                /** Returns the formatting style to use. Values should match the property names defined in [[StandardSpecifiersMap]]. */
                IntlOptionsProvider.prototype.getStyle = function() {
                    return this.resolvedOptions.style;
                };
                /** Returns whether to use grouping separators or not. */
                IntlOptionsProvider.prototype.useGrouping = function() {
                    return this.resolvedOptions.useGrouping;
                };
                /** Returns the minimum number of integer digits to use. */
                IntlOptionsProvider.prototype.getMinimumIntegerDigits = function() {
                    return this.resolvedOptions.minimumIntegerDigits;
                };
                /** Returns the minimum number of fraction digits to use. */
                IntlOptionsProvider.prototype.getMinimumFractionDigits = function() {
                    return this.resolvedOptions.minimumFractionDigits;
                };
                /** Returns the maximum number of fraction digits to use. */
                IntlOptionsProvider.prototype.getMaximumFractionDigits = function() {
                    return this.resolvedOptions.maximumFractionDigits;
                };
                /** Returns the minimum number of significant digits to use. */
                IntlOptionsProvider.prototype.getMinimumSignificantDigits = function() {
                    return this.resolvedOptions.minimumSignificantDigits;
                };
                /** Returns the maximum number of significant digits to use. */
                IntlOptionsProvider.prototype.getMaximumSignificantDigits = function() {
                    return this.resolvedOptions.maximumSignificantDigits;
                };
                /** Returns whether to ommit all digits or not. */
                IntlOptionsProvider.prototype.hasNoDigits = function() {
                    return this.resolvedOptions.noDigits;
                };
                /** Returns whether to ommit a single zero digit before the decimal point or not. */
                IntlOptionsProvider.prototype.hasNoLeadingZeroIntegerDigit = function() {
                    return this.resolvedOptions.noLeadingZeroIntegerDigit;
                };
                /** Returns whether an uppercase representation is required or not. */
                IntlOptionsProvider.prototype.isUpperCase = function() {
                    return this.resolvedOptions.upperCase;
                };
                /** Returns whether an exponent sign is required only for negative exponents or not. */
                IntlOptionsProvider.prototype.isNegativellySignedExponent = function() {
                    return this.resolvedOptions.negativellySignedExponent;
                };
                /** Returns the minimum number of exponent digits to use. */
                IntlOptionsProvider.prototype.getMinimumExponentDigits = function() {
                    return this.resolvedOptions.minimumExponentDigits;
                };
                /** Returns the divisor that will be applied to the value before formatting. */
                IntlOptionsProvider.prototype.getValueDivisor = function() {
                    return this.resolvedOptions.valueDivisor;
                };
                /** Returns the string that will be added before the numeric format value. */
                IntlOptionsProvider.prototype.getPrefixDecorator = function() {
                    return this.resolvedOptions.prefixDecorator;
                };
                /** Returns the mapping of index-to-text values which are inside the numeric part of the format. */
                IntlOptionsProvider.prototype.getInternalDecorators = function() {
                    return this.resolvedOptions.internalDecorators;
                };
                /** Returns the string that will be added after the numeric format value. */
                IntlOptionsProvider.prototype.getSuffixDecorator = function() {
                    return this.resolvedOptions.suffixDecorator;
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
        /**
             * Provides culture-specific information for formatting and parsing numeric values.
             *
             * Information about the culture itself and the application of overrides will be made available through this class at a later point.
             *
             * See: https://msdn.microsoft.com/en-us/library/system.globalization.numberformatinfo.aspx
             */
        var NumberFormatInfo = function() {
            function NumberFormatInfo() {
                var _i, args = [];
                for (_i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                this.isWritable = void 0 !== args[0];
                this.locales = args[0] || "";
                this.resolveFormatInfo(this.locales);
            }
            /**
                 * Returns an object that provides formatting services for the `Number` type.
                 * @param type A string indicating the type of the custom formatter to return, see [[Utils.Types]].
                 */
            NumberFormatInfo.prototype.getFormatter = function(type) {
                return this.formatter;
            };
            NumberFormatInfo.prototype.resolveFormatInfo = function(locales) {
                if (!locales) {
                    this.setInvariantFormatInfo();
                } else {
                    this.resolveCultureFormatInfo(locales);
                }
            };
            NumberFormatInfo.prototype.setInvariantFormatInfo = function() {
                this.CurrencyDecimalSeparator = this.NumberDecimalSeparator = ".";
                this.CurrencyGroupSeparator = this.NumberGroupSeparator = ",";
                this.NegativeSign = "-";
                this.NumberDecimalDigits = 2;
                this.formatter = new Globalization.Numeric.InvariantFormatter(Globalization.Numeric.IntlOptionsProvider);
                NumberFormatInfo.InvariantInfo = NumberFormatInfo.InvariantInfo || this;
            };
            NumberFormatInfo.prototype.resolveCultureFormatInfo = function(locales) {
                throw new Format.Errors.NotImplementedError("resolveCultureFormatInfo");
            };
            return NumberFormatInfo;
        }();
        Globalization.NumberFormatInfo = NumberFormatInfo;
    })(Globalization = Format.Globalization || (Format.Globalization = {}));
})(Format || (Format = {}));

(function(Format) {
    var Globalization;
    (function(Globalization) {
        /**
             * Provides a mechanism for setting a specific culture (also called a *locale*) that will be used during formatting.
             *
             * Information about the culture itself and the application of overrides will be made available through this class at a later point.
             *
             * See: https://msdn.microsoft.com/en-us/library/system.globalization.cultureinfo.aspx
             */
        var CultureInfo = function() {
            /**
                 * Initializes a new instance of the [[CultureInfo]] class based on the culture specified by *locales*.
                 * @param locales The locales argument must be either a string holding a [BCP 47 language tag](http://tools.ietf.org/html/rfc5646), or an array of such language tags.
                 */
            function CultureInfo(locales) {
                if (null == locales) {
                    throw new Format.Errors.ArgumentNullError("locales");
                }
                this.locales = locales;
                this.DateTimeFormat = new Globalization.DateTimeFormatInfo(locales);
                this.NumberFormat = new Globalization.NumberFormatInfo(locales);
                this.formatters = this.getFormatters(locales);
            }
            CultureInfo.prototype.getFormatter = function(type) {
                return this.formatters[type] || this.getFallbackFormatter();
            };
            CultureInfo.prototype.getFormatters = function(locales) {
                var formatters = {};
                formatters[Format.Utils.Types.Date] = this.DateTimeFormat.getFormatter(Format.Utils.Types.Date);
                formatters[Format.Utils.Types.Number] = this.NumberFormat.getFormatter(Format.Utils.Types.Number);
                formatters[Format.Utils.Types.Object] = formatters[Format.Utils.Types.Array] = CultureInfo.objectFormatter;
                return formatters;
            };
            CultureInfo.prototype.getFallbackFormatter = function() {
                return CultureInfo.fallbackFormatter;
            };
            /** Core implementation of a [[CustomFormatter]] for `Object` and `Array` instances. */
            CultureInfo.objectFormatter = {
                /**
                     * Converts the value of the given object using `JSON.stringify`.
                     * @param value An object to format.
                     */
                format: function(format, value) {
                    return value ? JSON.stringify(value) : "";
                }
            };
            /** Fallback implementation of a [[CustomFormatter]] for any objects. */
            CultureInfo.fallbackFormatter = {
                /**
                     * Converts the value of the given object using the `+ ""` operator.
                     * @param value An object to format.
                     */
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
    /**
         * Converts the value of objects to strings based on the formats specified and inserts them into another string.
         *
         * This project-internal (but externally visible) version does not support arbitrary argument overloads.
         * @param provider An object that supplies culture-specific formatting information.
         * @param format A composite format string. See: https://msdn.microsoft.com/en-us/library/txafckwd.aspx
         * @param args An array of arguments that contains zero or more objects to format.
         */
    function innerFormat(provider, format, args) {
        if (null == format) {
            throw new Format.Errors.ArgumentNullError("format");
        }
        provider = provider || Format.Globalization.CultureInfo.CurrentCulture;
        return format.replace(formatItemRegExp, function(formatItem, indexComponent, alignmentComponent, formatStringComponent) {
            return replaceFormatItem(provider, args, {
                formatItem: formatItem,
                indexComponent: indexComponent,
                alignmentComponent: alignmentComponent,
                formatStringComponent: formatStringComponent
            });
        });
    }
    var formatItemRegExp, replaceFormatItem, isFullyEscaped, applyFormatting, directions, applyAlignment, padBraces;
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
    Format.innerFormat = innerFormat;
    /** @private */
    formatItemRegExp = /{+(\d+)(?:,(.+?))?(?::(.+?))?}+/g;
    /** @private */
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
    /** @private */
    Format.getBracesCount = function(formatItem, braceChar) {
        var splits = formatItem.split(braceChar);
        if ("}" === braceChar) {
            splits = splits.reverse();
        }
        return Format.Utils.Enumerable.takeWhile(splits, Format.Utils.Text.isNullOrWhitespace).length;
    };
    /** @private */
    isFullyEscaped = function(formatItem) {
        var openingBracesCount = Format.getBracesCount(formatItem, "{"), closingBracesCount = Format.getBracesCount(formatItem, "}");
        if (openingBracesCount !== closingBracesCount) {
            throw new Format.Errors.FormatError("Opening and closing brackets for item '" + formatItem + "' do not match");
        }
        return Format.Utils.Numeric.isEven(openingBracesCount);
    };
    /** @private */
    applyFormatting = function(provider, args, options) {
        var value, valueType, index = +options.indexComponent;
        if (index >= args.length) {
            throw new Format.Errors.FormatError("Index (zero based) must be strictly less than the size of the argument's array");
        }
        value = args[index], valueType = Format.Utils.getType(value);
        try {
            return provider.getFormatter(valueType).format(options.formatStringComponent, value);
        } catch (error) {
            throw new Format.Errors.FormatError("Format string component '" + options.formatStringComponent + "' in format item '" + options.formatItem + "' cannot be applied: " + error.message, error);
        }
    };
    /** @private */
    directions = Format.Utils.Padding.Direction;
    /** @private */
    applyAlignment = function(formattedString, options) {
        var direction, totalWidth = +options.alignmentComponent;
        if (!Format.Utils.Numeric.isInteger(totalWidth)) {
            throw new Format.Errors.FormatError("Alignment component '" + options.alignmentComponent + "' in format item '" + options.formatItem + "' must be an integer");
        }
        direction = totalWidth < 0 ? directions.Right : directions.Left;
        totalWidth = Math.abs(totalWidth);
        return Format.Utils.Padding.pad(formattedString, {
            totalWidth: totalWidth,
            direction: direction
        });
    };
    /** @private */
    padBraces = function(formattedString, escapedBracesCount, paddingChar) {
        var direction = "}" === paddingChar ? directions.Right : directions.Left, totalWidth = formattedString.length + escapedBracesCount;
        return Format.Utils.Padding.pad(formattedString, {
            totalWidth: totalWidth,
            direction: direction,
            paddingChar: paddingChar
        });
    };
})(Format || (Format = {}));

if ("undefined" === typeof Format || "undefined" === typeof Format.innerFormat) {
    throw new Error("Configuration module loaded before main module");
}

(function(Format) {
    var Utils;
    (function(Utils) {
        var Function;
        (function(Function) {
            /**
                 * Returns a memoized function wrapper of the function. All calls with the same arguments to the original function are cached after the first use.
                 *
                 * Must load the [[Format.Config]] sub-module to be defined.
                 * @param T The type/signature of the original function.
                 * @param func The function whose results will be cached.
                 * @param resolver A cache key resolver function used to store the call arguments' list as a string key. Defaults to `JSON.stringify`.
                 * @param resolver.argumentValues An array containing the call arguments for the function.
                 */
            function memoize(func, resolver) {
                if ("function" !== typeof func) {
                    throw new TypeError("Cannot call method 'memoize' on non-functional objects");
                }
                resolver = resolver || JSON.stringify;
                var memoized = function() {
                    var _i, key, args = [];
                    for (_i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    key = resolver(args);
                    if (memoized.cache.hasOwnProperty(key)) {
                        return memoized.cache[key];
                    }
                    memoized.cache[key] = func.apply(this, args);
                    return memoized.cache[key];
                };
                memoized.cache = {};
                return memoized;
            }
            Function.memoize = memoize;
        })(Function = Utils.Function || (Utils.Function = {}));
    })(Utils = Format.Utils || (Format.Utils = {}));
})(Format || (Format = {}));

(function(Format) {
    var Config;
    (function(Config) {
        var Definitions;
        (function(Definitions) {
            var addAll, asStatic, asPrototype, ignoreUtil, getProtoWrapper, unregister, globalRegistry = {}, globalExceptions = [ Format.Utils.isArray ], prototypeRegistry = {}, prototypeExceptions = [ Format.Utils.Text.isNullOrWhitespace, Format.Utils.Function.getEmpty ];
            Definitions.addUtilsToGlobals = function() {
                addAll(asStatic, Format.Utils, Object);
                addAll(asStatic, Format.Utils.Text, String);
                addAll(asStatic, Format.Utils.Numeric, Number);
                addAll(asStatic, Format.Utils.Enumerable, Array);
                addAll(asStatic, Format.Utils.Function, Function);
            };
            Definitions.addUtilsToPrototype = function() {
                addAll(asPrototype, Format.Utils.Text, String.prototype);
                addAll(asPrototype, Format.Utils.Numeric, Number.prototype);
                addAll(asPrototype, Format.Utils.Enumerable, Array.prototype);
                addAll(asPrototype, Format.Utils.Function, Function.prototype);
            };
            Definitions.removeUtilGlobals = function() {
                return unregister(globalRegistry);
            };
            Definitions.removeUtilsFromPrototype = function() {
                return unregister(prototypeRegistry);
            };
            Definitions.addToPrototype = function(bareFunction, hostObject, name) {
                var actualName = Format.Utils.Function.getName(bareFunction);
                if ("" === actualName && !name) {
                    throw new Format.Errors.ArgumentError("Argument 'name' must be supplied for anonymous function declarations");
                }
                hostObject.prototype[name || actualName] = getProtoWrapper(bareFunction);
            };
            /** @private */
            addAll = function(addFunc, source, hostObject) {
                for (var key in source) {
                    if (source.hasOwnProperty(key) && "function" === typeof source[key]) {
                        addFunc(source[key], hostObject, key);
                    }
                }
            };
            /** @private */
            asStatic = function(utilFunction, globalObject, name) {
                if (!ignoreUtil(utilFunction, globalRegistry[name], globalExceptions)) {
                    var existingFunction = globalObject[name];
                    if (existingFunction) {
                        if (existingFunction === utilFunction) {
                            return;
                        }
                        unregister(globalRegistry);
                        throw new Format.Errors.InvalidOperationError("Argument 'name' is invalid. A property named '" + name + "' already exists in '" + Format.Utils.Function.getName(globalObject) + "'");
                    }
                    globalObject[name] = utilFunction;
                    globalRegistry[name] = globalObject;
                }
            };
            /** @private */
            asPrototype = function(utilFunction, protoObject, name) {
                if (!ignoreUtil(utilFunction, prototypeRegistry[name], prototypeExceptions)) {
                    if (protoObject[name]) {
                        unregister(prototypeRegistry);
                        throw new Format.Errors.InvalidOperationError("Argument 'name' is invalid. A property named '" + name + "' already exists in '" + Format.Utils.Function.getName(protoObject.constructor) + ".prototype'");
                    }
                    protoObject[name] = getProtoWrapper(utilFunction);
                    prototypeRegistry[name] = protoObject;
                }
            };
            /** @private */
            ignoreUtil = function(utilFunction, registryEntry, exceptions) {
                return void 0 !== registryEntry || exceptions.indexOf(utilFunction) !== -1;
            };
            /** @private */
            getProtoWrapper = function(utilFunction) {
                return function() {
                    var _i, args = [];
                    for (_i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    return utilFunction.apply(void 0, [ this ].concat(args));
                };
            };
            /** @private */
            unregister = function(registry) {
                var key, hostObject;
                for (key in registry) {
                    if (registry.hasOwnProperty(key)) {
                        hostObject = registry[key];
                        delete hostObject[key];
                        delete registry[key];
                    }
                }
            };
        })(Definitions = Config.Definitions || (Config.Definitions = {}));
    })(Config = Format.Config || (Format.Config = {}));
})(Format || (Format = {}));

(function(Format) {
    var Config;
    (function(Config) {
        var Definitions;
        (function(Definitions) {
            var formatProto, getPaddingProto, padLeftProto, padRightProto;
            Definitions.addFormatToPrototype = function() {
                String.prototype.format = formatProto;
            };
            Definitions.removeFormatFromPrototype = function() {
                if (String.prototype.format === formatProto) {
                    delete String.prototype.format;
                }
            };
            Definitions.addPaddingToPrototype = function() {
                String.prototype.padLeft = padLeftProto;
                String.prototype.padRight = padRightProto;
            };
            Definitions.removePaddingFromPrototype = function() {
                if (String.prototype.padLeft === padLeftProto) {
                    delete String.prototype.padLeft;
                }
                if (String.prototype.padRight === padRightProto) {
                    delete String.prototype.padRight;
                }
            };
            /** @private */
            formatProto = function() {
                var _i, provider, args = [];
                for (_i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                provider = args[0];
                if (provider && "function" === typeof provider.getFormatter) {
                    args.shift();
                    return Format.innerFormat(provider, this, args);
                }
                return Format.innerFormat(void 0, this, args);
            };
            /** @private */
            getPaddingProto = function(direction) {
                return function(totalWidth, paddingChar) {
                    return Format.Utils.Padding.pad(this, {
                        direction: direction,
                        totalWidth: totalWidth,
                        paddingChar: paddingChar
                    });
                };
            };
            /** @private */
            padLeftProto = getPaddingProto(Format.Utils.Padding.Direction.Left), padRightProto = getPaddingProto(Format.Utils.Padding.Direction.Right);
        })(Definitions = Config.Definitions || (Config.Definitions = {}));
    })(Config = Format.Config || (Format.Config = {}));
})(Format || (Format = {}));

(function(Format) {
    var Config;
    (function(Config) {
        var Definitions;
        (function(Definitions) {
            function enableMemoization() {
                memoize(Format, "getBracesCount");
            }
            function disableMemoization() {
                unmemoize(Format, "getBracesCount");
            }
            var memoize, unmemoize, memoizedRegistry = {};
            Definitions.enableMemoization = enableMemoization;
            Definitions.disableMemoization = disableMemoization;
            /** @private */
            memoize = function(hostObject, name) {
                if (!memoizedRegistry[name]) {
                    var func = hostObject[name];
                    hostObject[name] = Format.Utils.Function.memoize(func);
                    memoizedRegistry[name] = func;
                }
            };
            /** @private */
            unmemoize = function(hostObject, name) {
                if (memoizedRegistry[name]) {
                    var memoized = hostObject[name];
                    hostObject[name] = memoizedRegistry[name];
                    delete memoizedRegistry[name];
                    delete memoized.cache;
                }
            };
        })(Definitions = Config.Definitions || (Config.Definitions = {}));
    })(Config = Format.Config || (Format.Config = {}));
})(Format || (Format = {}));

(function(Format) {
    var Config;
    (function(Config) {
        /**
             * Adds a bare function (one that does not rely on any local `this` context) to the host object's prototype.
             * @param bareFunction A function the first argument of which can be replaced by the `this` context of the host object.
             * @param hostObject A host object (usually a constructor function) the prototype of which will be updated to contain the wrapped bare function.
             * @param name The name of the new prototype method which is added, defaults to the bare function's name. Required if the bare function is anonymous.
             */
        function addToPrototype(bareFunction, hostObject, name) {
            Config.Definitions.addToPrototype(bareFunction, hostObject, name);
            return Config;
        }
        /**
             * Adds the [[String.format]] function, which allows for direct instance calls like `"{0}".format(val1, val2, ...)`.
             *
             * If the first argument of such calls is an object that implements the [[FormatProvider]] interface (or more precisely has a method [[getFormatter]]):
             * - It will be used to create the formatting context (same behaviour as with normal [[StringConstructor.format]] overloads)
             * - The trailing arguments will be used as replacement values starting from 0
             */
        function addFormatToPrototype() {
            Config.Definitions.addFormatToPrototype();
            return Config;
        }
        /** Adds the [[String.padLeft]] and [[String.padRight]] functions, which allows for direct instance calls like `"123".padLeft(5, "0")`. */
        function addPaddingToPrototype() {
            Config.Definitions.addPaddingToPrototype();
            return Config;
        }
        /** Removes the [[String.format]] prototype wrapper that is defined by calling [[addFormatToPrototype]]. */
        function removeFormatFromPrototype() {
            Config.Definitions.removeFormatFromPrototype();
            return Config;
        }
        /** Removes the [[String.padLeft]] and [[String.padRight]] functions that are defined by calling [[addPaddingToPrototype]]. */
        function removePaddingFromPrototype() {
            Config.Definitions.removePaddingFromPrototype();
            return Config;
        }
        /**
             * Adds all [[Format.Utils]] methods (including ones in sub-modules like [[Format.Utils.Function]]) as static methods to respective built-in types.
             *
             * For example [[ObjectConstructor.getType]] will be equivallent to calling [[Format.Utils.getType]].
             * The following mapping applies:
             * - [[Format.Utils]] methods => [[ObjectConstructor]]
             * - [[Format.Utils.Text]] => [[StringConstructor]]
             * - [[Format.Utils.Numeric]] => [[NumberConstructor]]
             * - [[Format.Utils.Function]] => [[FunctionConstructor]]
             * - [[Format.Utils.Enumerable]] => [[ArrayConstructor]]
             */
        function addUtilsToGlobals() {
            Config.Definitions.addUtilsToGlobals();
            return Config;
        }
        /** Removes the static methods from global objects that are defined by calling [[addUtilsToGlobals]]. */
        function removeUtilGlobals() {
            Config.Definitions.removeUtilGlobals();
            return Config;
        }
        /**
             * Adds some [[Format.Utils]] sub-modules' methods as wrapped instance methods to respective built-in types.
             *
             * The method's first argument must match the global object's type.
             * For example [[Function.getName]] will be wrapped to have its first argument replaced by the `this` object in the prototype version. Other arguments are shifted accordingly in the process.
             * The following mapping applies:
             * - [[Format.Utils.Text]] => [[String]]
             * - [[Format.Utils.Numeric]] => [[Number]]
             * - [[Format.Utils.Function]] => [[Function]]
             * - [[Format.Utils.Enumerable]] => [[Array]]
             */
        function addUtilsToPrototype() {
            Config.Definitions.addUtilsToPrototype();
            return Config;
        }
        /** Removes the instance methods from global objects that are defined by calling [[addUtilsToPrototype]]. */
        function removeUtilsFromPrototype() {
            Config.Definitions.removeUtilsFromPrototype();
            return Config;
        }
        /** Enables performance improvements through memoization of key inner functions at the cost of memory. */
        function enableMemoization() {
            Config.Definitions.enableMemoization();
            return Config;
        }
        /** Disables performance improvements through memoization of key inner functions and releases the used memory. */
        function disableMemoization() {
            Config.Definitions.disableMemoization();
            return Config;
        }
        Config.addToPrototype = addToPrototype;
        Config.addFormatToPrototype = addFormatToPrototype;
        Config.addPaddingToPrototype = addPaddingToPrototype;
        Config.removeFormatFromPrototype = removeFormatFromPrototype;
        Config.removePaddingFromPrototype = removePaddingFromPrototype;
        Config.addUtilsToGlobals = addUtilsToGlobals;
        Config.removeUtilGlobals = removeUtilGlobals;
        Config.addUtilsToPrototype = addUtilsToPrototype;
        Config.removeUtilsFromPrototype = removeUtilsFromPrototype;
        Config.enableMemoization = enableMemoization;
        Config.disableMemoization = disableMemoization;
    })(Config = Format.Config || (Format.Config = {}));
})(Format || (Format = {}));

module.exports = String.format;

module.exports.Config = Format.Config;