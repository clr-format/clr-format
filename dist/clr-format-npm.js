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
             * @returns The name of a function or `"anonymous"` for lambda functions.
             */
            function getName(func) {
                if ("function" !== typeof func) {
                    throw new TypeError("Cannot call method 'getName' on non-functional objects");
                }
                var typeNameGroups = typeNameRegExp.exec(func.toString());
                return typeNameGroups && typeNameGroups[1] ? typeNameGroups[1] : "anonymous";
            }
            /**
             * Returns an empty parameterless function which returns `undefined`. Useful for defaulting optional callback arguments instead of creating new anonymous empty functions.
             * @param T The return type of the empty callback.
             */
            function getEmpty() {
                return empty;
            }
            var typeNameRegExp, empty;
            Function.getName = getName;
            typeNameRegExp = /function +(\w+)/;
            Function.getEmpty = getEmpty;
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
        /** Base system error class that allows for syntactic C#-like Error class extension. */
        var SystemError = function(_super) {
            /**
             * Creates an abstract system error object derived from the built-in javascript `Error` type and decorates it with additional properties.
             *
             * See: https://msdn.microsoft.com/en-us/library/system.systemexception.aspx
             * @param message A human-readable description of the error.
             * @param innerError An error to wrap while also preserving its stack trace.
             */
            function SystemError(message, innerError) {
                _super.call(this, message);
                this.message = message;
                this.innerError = innerError;
                this.name = Format.Utils.Function.getName(this.constructor);
                this.stack = this.getStack(innerError);
                this.source = this.getActualSource(this.stack);
            }
            __extends(SystemError, _super);
            /** Increments the [[childStackCount]]. Must be called **before** the base constructor in **all** derived error classes. */
            SystemError.prototype.incrementStackCount = function() {
                this.childStackCount = (this.childStackCount || 0) + 1;
            };
            SystemError.prototype.getStack = function(innerError) {
                return innerError ? innerError.stack : this.stack || this.getActualStack();
            };
            SystemError.prototype.getActualSource = function(stack) {
                if (stack) {
                    var stackArray = stack.split("\n");
                    return stackArray[this.getStackOmitStart(stackArray)].trim();
                }
            };
            SystemError.prototype.getActualStack = function() {
                var stackArray, builtInStack = this.getNativeStack();
                if (builtInStack) {
                    stackArray = builtInStack.split("\n");
                    // Removes the function nestings caused by the constructor and instance methods
                    // This means it also removes more lines for children that call incrementStackCount
                    stackArray.splice(this.getStackOmitStart(stackArray), this.getStackOmitCount());
                    return stackArray.join("\n");
                }
            };
            SystemError.prototype.getNativeStack = function() {
                try {
                    throw new Error();
                } catch (error) {
                    return error.stack;
                }
            };
            SystemError.prototype.getStackOmitStart = function(stackArray) {
                return "Error" === stackArray[0] ? 1 : 0;
            };
            SystemError.prototype.getStackOmitCount = function() {
                var nativeStackOffset = 4;
                if (this.childStackCount) {
                    return nativeStackOffset + this.childStackCount;
                } else {
                    return nativeStackOffset;
                }
            };
            return SystemError;
        }(Errors.ErrorClass);
        Errors.SystemError = SystemError;
    })(Errors = Format.Errors || (Format.Errors = {}));
})(Format || (Format = {}));

(function(Format) {
    var Errors;
    (function(Errors) {
        /** An error that is thrown when one of the arguments provided to a function is not valid. */
        var ArgumentError = function(_super) {
            /**
             * Creates an error that is thrown when one of the arguments provided to a function is not valid.
             *
             * See: https://msdn.microsoft.com/en-us/library/system.argumentexception.aspx
             * @param message A human-readable description of the error.
             * @param innerError An error to rethrow while also preserving its stack trace.
             */
            function ArgumentError(message, innerError) {
                _super.prototype.incrementStackCount.call(this);
                _super.call(this, message, innerError);
            }
            __extends(ArgumentError, _super);
            return ArgumentError;
        }(Errors.SystemError);
        Errors.ArgumentError = ArgumentError;
    })(Errors = Format.Errors || (Format.Errors = {}));
})(Format || (Format = {}));

(function(Format) {
    var Utils;
    (function(Utils) {
        /** Returns the actual type of an object (unlike `typeof`), i.e. `"[object Date]"`. */
        function getType(object) {
            return Object.prototype.toString.call(object);
        }
        /**
         * Returns `true` if an object's type matches the given type argument.
         * @param type A string indicating the expected type of the object, i.e. `"Array"`, `"RegExp"`, etc.
         * @param object The object to check for matching type.
         */
        function isType(type, object) {
            return getType(object) === String.format("[object {0}]", type);
        }
        /** Returns `true` if an object is a pure object instance. */
        function isObject(object) {
            return "[object Object]" === getType(object);
        }
        Utils.getType = getType;
        Utils.isType = isType;
        Utils.isObject = isObject;
    })(Utils = Format.Utils || (Format.Utils = {}));
})(Format || (Format = {}));

(function(Format) {
    var Errors;
    (function(Errors) {
        /** An error that is thrown when an `undefined` or `null` argument is passed to a method that does not accept it as a valid argument. */
        var ArgumentNullError = function(_super) {
            /**
             * Creates an error that is thrown when an undefined (or null) argument is passed to a method that does not accept it as a valid argument.
             *
             * See: https://msdn.microsoft.com/en-us/library/system.argumentnullexception.aspx
             * @param argumentName The name of the argument that caused the error.
             */
            function ArgumentNullError(argumentName) {
                _super.prototype.incrementStackCount.call(this);
                _super.call(this, String.format("Argument '{0}' cannot be undefined or null", argumentName));
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
            var Direction, setDefaultOptions, validateOptions, isValidTotalWidth, isPaddingRequired, getPadWidth, getPadding, directionStrategies;
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
            setDefaultOptions = function(options) {
                options.direction = options.direction || Direction.Right;
                options.paddingChar = options.paddingChar || " ";
            };
            validateOptions = function(options) {
                if (!isValidTotalWidth(options.totalWidth)) {
                    throw new Format.Errors.ArgumentError(String.format("Option 'totalWidth' with value '{0}' must be a positive non-zero integer value", options.totalWidth + ""));
                }
                if ("string" !== typeof options.paddingChar || options.paddingChar.length > 1) {
                    throw new Format.Errors.ArgumentError(String.format("Option 'paddingChar' with value '{0}' must be a single character string", options.paddingChar + ""));
                }
                if (null == Direction[options.direction]) {
                    throw new Format.Errors.ArgumentError(String.format("Option 'direction' with value '{0}' must be one of Padding.Direction enum values", options.direction + ""));
                }
            };
            isValidTotalWidth = function(totalWidth) {
                return totalWidth > 0 && totalWidth === totalWidth >> 0;
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
                return [ getPadding(left, options), value, getPadding(right, options) ].join("");
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
            Enumerable.takeWhile = takeWhile;
        })(Enumerable = Utils.Enumerable || (Utils.Enumerable = {}));
    })(Utils = Format.Utils || (Format.Utils = {}));
})(Format || (Format = {}));

(function(Format) {
    var Errors;
    (function(Errors) {
        /** An error that is thrown when the format of an argument is invalid, or when a composite format string is not well formed. */
        var FormatError = function(_super) {
            /**
             * Creates an error that is thrown when the format of an argument is invalid, or when a composite format string is not well formed.
             *
             * See: https://msdn.microsoft.com/en-us/library/system.formatexception.aspx
             * @param message A human-readable description of the error.
             * @param innerError An error to rethrow while also preserving its stack trace.
             */
            function FormatError(message, innerError) {
                _super.prototype.incrementStackCount.call(this);
                _super.call(this, message, innerError);
            }
            __extends(FormatError, _super);
            return FormatError;
        }(Errors.SystemError);
        Errors.FormatError = FormatError;
    })(Errors = Format.Errors || (Format.Errors = {}));
})(Format || (Format = {}));

(function(Format) {
    /**
     * Converts the value of objects to strings based on the formats specified and inserts them into another string.
     *
     * This internal version does not support arbitrary argument overloads.
     * @param provider An object that supplies culture-specific formatting information.
     * @param format A composite format string. See: https://msdn.microsoft.com/en-us/library/txafckwd.aspx
     * @param args An array of arguments that contains zero or more objects to format.
     */
    function innerFormat(provider, format, args) {
        if (null == format) {
            throw new Format.Errors.ArgumentNullError("format");
        }
        provider = provider || simpleProvider;
        return format.replace(formatItemRegExp, function(formatItem, indexComponent, alignmentComponent, formatStringComponent) {
            return replaceFormatItem(provider, args, {
                formatItem: formatItem,
                indexComponent: indexComponent,
                alignmentComponent: alignmentComponent,
                formatStringComponent: formatStringComponent
            });
        });
    }
    var formatItemRegExp, replaceFormatItem, isNullOrWhitespace, isFullyEscaped, isEven, applyFormatting, directions, applyAlignment, padBraces, SimpleProvider, ObjectFormatter, ToStringFormatter, simpleProvider;
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
            throw new Format.Errors.ArgumentError(String.format("Argument 'provider' of type '{0}' does not implement the FormatProvider interface", Format.Utils.Function.getName(provider.constructor)));
        }
        format = args[1];
        args.splice(0, 2);
        return innerFormat(provider, format, args);
    };
    Format.innerFormat = innerFormat;
    formatItemRegExp = /{+(\d+)(?:,(.+?))?(?::(.+?))?}+/g;
    replaceFormatItem = function(provider, args, options) {
        var result, escapedBracesCount = Math.floor(Format.getBracesCount(options.formatItem, "{") / 2);
        if (isFullyEscaped(options.formatItem)) {
            return options.formatItem.substring(escapedBracesCount, options.formatItem.length - escapedBracesCount);
        }
        result = applyFormatting(provider, args, options);
        if (void 0 !== options.alignmentComponent) {
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
        return Format.Utils.Enumerable.takeWhile(splits, isNullOrWhitespace).length;
    };
    isNullOrWhitespace = function(value) {
        return !(value && value.trim().length > 0);
    };
    isFullyEscaped = function(formatItem) {
        var openingBracesCount = Format.getBracesCount(formatItem, "{"), closingBracesCount = Format.getBracesCount(formatItem, "}");
        if (openingBracesCount !== closingBracesCount) {
            throw new Format.Errors.FormatError(String.format("Opening and closing brackets for item '{0}' do not match", formatItem));
        }
        return isEven(openingBracesCount);
    };
    isEven = function(value) {
        return !(1 & value);
    };
    applyFormatting = function(provider, args, options) {
        var value, valueType, index = +options.indexComponent;
        if (index >= args.length) {
            throw new Format.Errors.FormatError("Index (zero based) must be strictly less than the size of the argument's array");
        }
        value = args[index], valueType = Format.Utils.getType(value);
        try {
            return provider.getFormatter(valueType).format(options.formatStringComponent, value);
        } catch (error) {
            throw new Format.Errors.FormatError(String.format("Format string component '{0}' in format item '{1}' cannot be applied: {2}", options.formatStringComponent, options.formatItem, error.message), error);
        }
    };
    directions = Format.Utils.Padding.Direction;
    applyAlignment = function(formattedString, options) {
        var direction, totalWidth = +options.alignmentComponent;
        if (totalWidth !== totalWidth >> 0) {
            throw new Format.Errors.FormatError(String.format("Alignment component '{0}' in format item '{1}' must be a finite integer value", options.alignmentComponent, options.formatItem));
        }
        direction = totalWidth < 0 ? directions.Right : directions.Left;
        totalWidth = Math.abs(totalWidth);
        return Format.Utils.Padding.pad(formattedString, {
            totalWidth: totalWidth,
            direction: direction
        });
    };
    padBraces = function(formattedString, escapedBracesCount, paddingChar) {
        var direction = "}" === paddingChar ? directions.Right : directions.Left, totalWidth = formattedString.length + escapedBracesCount;
        return Format.Utils.Padding.pad(formattedString, {
            totalWidth: totalWidth,
            direction: direction,
            paddingChar: paddingChar
        });
    };
    /** Basic internal core implementation of a [[FormatProvider]] which does not support format string components and globalization. */
    SimpleProvider = function() {
        function SimpleProvider() {
            this.objectFormatter = new ObjectFormatter();
            this.toStringFormatter = new ToStringFormatter();
        }
        /**
         * Returns [[ObjectFormatter]] for `Object` and `Array` instances and [[OtherFormatter]] for other types.
         * @param type The type of the value object, i.e. `"[object Number]"`.
         */
        SimpleProvider.prototype.getFormatter = function(type) {
            return "[object Object]" === type || "[object Array]" === type ? this.objectFormatter : this.toStringFormatter;
        };
        return SimpleProvider;
    }();
    /** Basic internal core implementation of a [[CustomFormatter]] for `Object` and `Array` instances. Does not support format string components and globalization. */
    ObjectFormatter = function() {
        function ObjectFormatter() {}
        /**
         * Converts the value by passing it to `JSON.stringify`.
         * @param format An unsupported format string argument. Will result in a thrown [[FormatError]] if not left empty.
         * @param value An object to format.
         */
        ObjectFormatter.prototype.format = function(format, value) {
            if (format) {
                throw new Format.Errors.FormatError("Values of type Object or Array do not accept a format string component");
            }
            return value ? JSON.stringify(value) : "";
        };
        return ObjectFormatter;
    }();
    /** Basic internal core implementation of a [[CustomFormatter]] for any objects. Does not support format string components and globalization. */
    ToStringFormatter = function() {
        function ToStringFormatter() {}
        /**
         * Converts the value by forcing it into a `String` value.
         * @param format An unsupported format string argument. Will result in a thrown [[FormatError]] if not left empty.
         * @param value An object to format.
         */
        ToStringFormatter.prototype.format = function(format, value) {
            if (format) {
                throw new Format.Errors.FormatError(String.format("Formatter type '{0}' does not accept a format string component", Format.Utils.Function.getName(this.constructor)));
            }
            return null != value ? value + "" : "";
        };
        return ToStringFormatter;
    }();
    simpleProvider = new SimpleProvider();
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
            var addAll, asStatic, asPrototype, getProtoWrapper, unregister, globalRegistry = {}, prototypeRegistry = {}, prototypeExceptions = [ Format.Utils.Function.getEmpty ];
            Definitions.addUtilsToGlobals = function() {
                addAll(asStatic, Format.Utils, Object);
                addAll(asStatic, Format.Utils.Enumerable, Array);
                addAll(asStatic, Format.Utils.Function, Function);
            };
            Definitions.addUtilsToPrototype = function() {
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
                if ("anonymous" === actualName && !name) {
                    throw new Format.Errors.ArgumentError("Argument 'name' must be supplied for anonymous function declarations");
                }
                hostObject.prototype[name || actualName] = getProtoWrapper(bareFunction);
            };
            addAll = function(addFunc, source, hostObject) {
                for (var key in source) {
                    if (source.hasOwnProperty(key) && "function" === typeof source[key]) {
                        addFunc(source[key], hostObject, key);
                    }
                }
            };
            asStatic = function(utilFunction, globalObject, name) {
                if (globalObject[name]) {
                    unregister(globalRegistry);
                    throw new Format.Errors.ArgumentError(String.format("Argument 'name' is invalid. A property named '{0}' already exists in '{1}'", name, Format.Utils.Function.getName(globalObject)));
                }
                globalObject[name] = utilFunction;
                globalRegistry[name] = globalObject;
            };
            asPrototype = function(utilFunction, protoObject, name) {
                if (prototypeExceptions.indexOf(utilFunction) === -1) {
                    if (protoObject[name]) {
                        unregister(prototypeRegistry);
                        throw new Format.Errors.ArgumentError(String.format("Argument 'name' is invalid. A property named '{0}' already exists in '{1}.prototype'", name, Format.Utils.Function.getName(protoObject.constructor)));
                    }
                    protoObject[name] = getProtoWrapper(utilFunction);
                    prototypeRegistry[name] = protoObject;
                }
            };
            getProtoWrapper = function(utilFunction) {
                return function() {
                    var _i, args = [];
                    for (_i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    return utilFunction.apply(void 0, [ this ].concat(args));
                };
            };
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
            getPaddingProto = function(direction) {
                return function(totalWidth, paddingChar) {
                    return Format.Utils.Padding.pad(this, {
                        direction: direction,
                        totalWidth: totalWidth,
                        paddingChar: paddingChar
                    });
                };
            };
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
            memoize = function(hostObject, name) {
                if (!memoizedRegistry[name]) {
                    var func = hostObject[name];
                    hostObject[name] = Format.Utils.Function.memoize(func);
                    memoizedRegistry[name] = func;
                }
            };
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
         * Adds all [[Format.Utils]] methods (including ones in sub-modules like [[Format.Utils.Function]]) as static methods to respective global objects.
         *
         * For example [[ObjectConstructor.getType]] will be equivallent to calling [[Format.Utils.getType]].
         * The following mapping applies:
         * - [[Format.Utils]] methods => [[ObjectConstructor]]
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
         * Adds all [[Format.Utils]] sub-modules' methods as wrapped instance methods to respective global objects.
         *
         * The method's first argument must match the global object's type.
         * For example [[Function.getName]] will be wrapped to have its first argument replaced by the `this` object in the prototype version. Other arguments are shifted accordingly in the process.
         * The following mapping applies:
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