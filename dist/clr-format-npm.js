"use strict";

var Format;

!function(Format) {
    var Prototypes;
    !function(Prototypes) {
        function format() {
            for (var args = [], _i = 0; _i < arguments.length; _i++) args[_i - 0] = arguments[_i];
            var provider = args[0];
            return provider && "function" == typeof provider.getFormatter ? (args.shift(), Format.innerFormat(provider, this, args)) : Format.innerFormat(void 0, this, args);
        }
        Prototypes.format = format;
    }(Prototypes = Format.Prototypes || (Format.Prototypes = {}));
}(Format || (Format = {}));

var Format;

!function(Format) {
    var Configuration = function() {
        function Configuration() {}
        return Configuration.prototype.addFormatToPrototype = function() {
            return String.prototype.format = Format.Prototypes.format, this;
        }, Configuration.prototype.removeFormatFromPrototype = function() {
            return delete String.prototype.format, this;
        }, Configuration;
    }();
    Format.Configuration = Configuration, Format.Config = new Configuration();
}(Format || (Format = {}));

var Format;

!function(Format) {
    var Utils;
    !function(Utils) {
        var Function;
        !function(Function) {
            function getName(func) {
                if ("function" != typeof func) throw new TypeError("Cannot call method 'getName' on non-functional objects");
                var typeNameGroups = typeNameRegExp.exec(func.toString());
                return typeNameGroups && typeNameGroups[1] ? typeNameGroups[1] : "anonymous";
            }
            function getEmpty() {
                return empty;
            }
            Function.getName = getName;
            var typeNameRegExp = /function +(\w+)/;
            Function.getEmpty = getEmpty;
            var empty = function() {
                return void 0;
            };
        }(Function = Utils.Function || (Utils.Function = {}));
    }(Utils = Format.Utils || (Format.Utils = {}));
}(Format || (Format = {}));

var __extends = this && this.__extends || function(d, b) {
    function __() {
        this.constructor = d;
    }
    for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
    __.prototype = b.prototype, d.prototype = new __();
}, Format;

!function(Format) {
    var Errors;
    !function(Errors) {
        Format.Errors.ErrorClass = Error;
        var SystemError = function(_super) {
            function SystemError(message, innerError) {
                _super.call(this, message), this.message = message, this.innerError = innerError, 
                this.name = Format.Utils.Function.getName(this.constructor), this.stack = this.getStack(innerError), 
                this.source = this.getActualSource(this.stack);
            }
            return __extends(SystemError, _super), SystemError.prototype.incrementStackCount = function() {
                this.childStackCount = (this.childStackCount || 0) + 1;
            }, SystemError.prototype.getStack = function(innerError) {
                return innerError ? innerError.stack : this.stack || this.getActualStack();
            }, SystemError.prototype.getActualSource = function(stack) {
                if (stack) {
                    var stackArray = stack.split("\n");
                    return stackArray[this.getStackStart(stackArray)].trim();
                }
            }, SystemError.prototype.getActualStack = function() {
                var builtInStack = this.getNativeStack();
                if (builtInStack) {
                    var stackArray = builtInStack.split("\n");
                    return stackArray.splice(this.getStackStart(stackArray), this.getStackCount()), 
                    stackArray.join("\n");
                }
            }, SystemError.prototype.getNativeStack = function() {
                try {
                    throw new Error();
                } catch (error) {
                    return error.stack;
                }
            }, SystemError.prototype.getStackStart = function(stackArray) {
                return "Error" === stackArray[0] ? 1 : 0;
            }, SystemError.prototype.getStackCount = function() {
                var nativeStackOffset = 4;
                return this.childStackCount ? nativeStackOffset + this.childStackCount : nativeStackOffset;
            }, SystemError;
        }(Errors.ErrorClass);
        Errors.SystemError = SystemError;
    }(Errors = Format.Errors || (Format.Errors = {}));
}(Format || (Format = {}));

var Format;

!function(Format) {
    var Errors;
    !function(Errors) {
        var ArgumentError = function(_super) {
            function ArgumentError(message, innerError) {
                _super.prototype.incrementStackCount.call(this), _super.call(this, message, innerError);
            }
            return __extends(ArgumentError, _super), ArgumentError;
        }(Errors.SystemError);
        Errors.ArgumentError = ArgumentError;
    }(Errors = Format.Errors || (Format.Errors = {}));
}(Format || (Format = {}));

var Format;

!function(Format) {
    var Errors;
    !function(Errors) {
        var ArgumentNullError = function(_super) {
            function ArgumentNullError(argumentName) {
                _super.prototype.incrementStackCount.call(this), _super.call(this, String.format("Argument '{0}' cannot be undefined or null", argumentName));
            }
            return __extends(ArgumentNullError, _super), ArgumentNullError;
        }(Errors.ArgumentError);
        Errors.ArgumentNullError = ArgumentNullError;
    }(Errors = Format.Errors || (Format.Errors = {}));
}(Format || (Format = {}));

var Format;

!function(Format) {
    var Utils;
    !function(Utils) {
        var Enumerable;
        !function(Enumerable) {
            Enumerable.takeWhile = function(array, predicate) {
                if (null == array) throw new Format.Errors.ArgumentNullError("array");
                if ("function" != typeof predicate) throw new TypeError("Cannot call method 'takeWhile' without a predicate function");
                for (var result = [], i = 0, len = array.length; len > i && predicate(array[i], i); i += 1) result.push(array[i]);
                return result;
            };
        }(Enumerable = Utils.Enumerable || (Utils.Enumerable = {}));
    }(Utils = Format.Utils || (Format.Utils = {}));
}(Format || (Format = {}));

var Format;

!function(Format) {
    var Utils;
    !function(Utils) {
        function getType(object) {
            return Object.prototype.toString.call(object);
        }
        function is(type, object) {
            return getType(object) === String.format("[object {0}]", type);
        }
        function isObject(object) {
            return "[object Object]" === getType(object);
        }
        Utils.getType = getType, Utils.is = is, Utils.isObject = isObject;
    }(Utils = Format.Utils || (Format.Utils = {}));
}(Format || (Format = {}));

var Format;

!function(Format) {
    var Utils;
    !function(Utils) {
        var Padding;
        !function(Padding) {
            function pad(value, options) {
                if (null == value) throw new Format.Errors.ArgumentNullError("value");
                return setDefaultOptions(options), validateOptions(options), isPaddingRequired(value, options) && (value = directionStrategies[options.direction](value, options)), 
                value;
            }
            !function(Direction) {
                Direction[Direction.Left = 1] = "Left", Direction[Direction.Right = 2] = "Right", 
                Direction[Direction.Both = 3] = "Both";
            }(Padding.Direction || (Padding.Direction = {}));
            var Direction = Padding.Direction;
            Padding.pad = pad;
            var setDefaultOptions = function(options) {
                options.direction = options.direction || Direction.Right, options.paddingChar = options.paddingChar || " ";
            }, validateOptions = function(options) {
                if (!isValidTotalWidth(options.totalWidth)) throw new Format.Errors.ArgumentError(String.format("Option 'totalWidth' with value '{0}' must be a positive non-zero integer value", options.totalWidth + ""));
                if (options.paddingChar.length > 1) throw new Format.Errors.ArgumentError(String.format("Option 'paddingChar' with value '{0}' must be a single character string", options.paddingChar + ""));
                if (null == Direction[options.direction]) throw new Format.Errors.ArgumentError(String.format("Option 'direction' with value '{0}' must be one of Padding.Direction enum values", options.direction + ""));
            }, isValidTotalWidth = function(totalWidth) {
                return totalWidth > 0 && totalWidth === totalWidth >> 0;
            }, isPaddingRequired = function(value, options) {
                return options.totalWidth > value.length;
            }, getPadWidth = function(value, options) {
                return options.totalWidth - value.length;
            }, getPadding = function(padWidth, options) {
                return new Array(padWidth + 1).join(options.paddingChar);
            }, directionStrategies = {};
            directionStrategies[Direction.Left] = function(value, options) {
                return getPadding(getPadWidth(value, options), options) + value;
            }, directionStrategies[Direction.Right] = function(value, options) {
                return value + getPadding(getPadWidth(value, options), options);
            }, directionStrategies[Direction.Both] = function(value, options) {
                var padWidth = getPadWidth(value, options), right = Math.ceil(padWidth / 2), left = padWidth - right;
                return [ getPadding(left, options), value, getPadding(right, options) ].join("");
            };
        }(Padding = Utils.Padding || (Utils.Padding = {}));
    }(Utils = Format.Utils || (Format.Utils = {}));
}(Format || (Format = {}));

var Format;

!function(Format) {
    var Errors;
    !function(Errors) {
        var FormatError = function(_super) {
            function FormatError(message, innerError) {
                _super.prototype.incrementStackCount.call(this), _super.call(this, message, innerError);
            }
            return __extends(FormatError, _super), FormatError;
        }(Errors.SystemError);
        Errors.FormatError = FormatError;
    }(Errors = Format.Errors || (Format.Errors = {}));
}(Format || (Format = {}));

var Format;

!function(Format) {
    function innerFormat(provider, format, args) {
        if (null == format) throw new Format.Errors.ArgumentNullError("format");
        return provider = provider || simpleProvider, format.replace(formatItemRegExp, function(formatItem, indexComponent, alignmentComponent, formatStringComponent) {
            return replaceFormatItem(provider, args, {
                formatItem: formatItem,
                indexComponent: indexComponent,
                alignmentComponent: alignmentComponent,
                formatStringComponent: formatStringComponent
            });
        });
    }
    String.format = function() {
        for (var args = [], _i = 0; _i < arguments.length; _i++) args[_i - 0] = arguments[_i];
        if ("string" == typeof args[0]) return innerFormat(void 0, args.shift(), args);
        var provider = args[0];
        if (provider && "function" != typeof provider.getFormatter) throw new Format.Errors.ArgumentError(String.format("Argument 'provider' of type '{0}' does not implement the FormatProvider interface", Format.Utils.Function.getName(provider.constructor)));
        var format = args[1];
        return args.splice(0, 2), innerFormat(provider, format, args);
    }, Format.innerFormat = innerFormat;
    var formatItemRegExp = /{+(\d+)(?:,(.+?))?(?::(.+?))?}+/g, replaceFormatItem = function(provider, args, options) {
        var escapedBracesCount = Math.floor(getBracesCount(options.formatItem, "{") / 2);
        if (isFullyEscaped(options.formatItem)) return options.formatItem.substring(escapedBracesCount, options.formatItem.length - escapedBracesCount);
        var result = applyFormatting(provider, args, options);
        return void 0 !== options.alignmentComponent && (result = applyAlignment(result, options)), 
        escapedBracesCount > 0 && (result = padBraces(result, escapedBracesCount, "{"), 
        result = padBraces(result, escapedBracesCount, "}")), result;
    }, getBracesCount = function(formatItem, braceChar) {
        var splits = formatItem.split(braceChar);
        return "}" === braceChar && (splits = splits.reverse()), Format.Utils.Enumerable.takeWhile(splits, isNullOrWhitespace).length;
    }, isNullOrWhitespace = function(value) {
        return !(value && value.trim().length > 0);
    }, isFullyEscaped = function(formatItem) {
        var openingBracesCount = getBracesCount(formatItem, "{"), closingBracesCount = getBracesCount(formatItem, "}");
        if (openingBracesCount !== closingBracesCount) throw new Format.Errors.FormatError(String.format("Opening and closing brackets for item '{0}' do not match", formatItem));
        return isEven(openingBracesCount);
    }, isEven = function(value) {
        return !(1 & value);
    }, applyFormatting = function(provider, args, options) {
        var index = +options.indexComponent;
        if (index >= args.length) throw new Format.Errors.FormatError("Index (zero based) must be strictly less than the size of the argument's array");
        var value = args[index], valueType = Format.Utils.getType(value);
        try {
            return provider.getFormatter(valueType).format(options.formatStringComponent, value);
        } catch (error) {
            throw new Format.Errors.FormatError(String.format("Format string component '{0}' in format item '{1}' cannot be applied: {2}", options.formatStringComponent, options.formatItem, error.message), error);
        }
    }, directions = Format.Utils.Padding.Direction, applyAlignment = function(formattedString, options) {
        var totalWidth = +options.alignmentComponent;
        if (totalWidth !== totalWidth >> 0) throw new Format.Errors.FormatError(String.format("Alignment component '{0}' in format item '{1}' must be a finite integer value", options.alignmentComponent, options.formatItem));
        var direction = 0 > totalWidth ? directions.Right : directions.Left;
        return totalWidth = Math.abs(totalWidth), Format.Utils.Padding.pad(formattedString, {
            totalWidth: totalWidth,
            direction: direction
        });
    }, padBraces = function(formattedString, escapedBracesCount, paddingChar) {
        var direction = "}" === paddingChar ? directions.Right : directions.Left, totalWidth = formattedString.length + escapedBracesCount;
        return Format.Utils.Padding.pad(formattedString, {
            totalWidth: totalWidth,
            direction: direction,
            paddingChar: paddingChar
        });
    }, SimpleProvider = function() {
        function SimpleProvider() {
            this.objectFormatter = new ObjectFormatter(), this.otherFormatter = new OtherFormatter();
        }
        return SimpleProvider.prototype.getFormatter = function(type) {
            return "[object Object]" === type || "[object Array]" === type ? this.objectFormatter : this.otherFormatter;
        }, SimpleProvider;
    }(), ObjectFormatter = function() {
        function ObjectFormatter() {}
        return ObjectFormatter.prototype.format = function(formatString, value) {
            if (formatString) throw new Format.Errors.FormatError("Values of type Object or Array do not accept a format string component");
            return value ? JSON.stringify(value) : "";
        }, ObjectFormatter;
    }(), OtherFormatter = function() {
        function OtherFormatter() {}
        return OtherFormatter.prototype.format = function(formatString, value) {
            if (formatString) throw new Format.Errors.FormatError(String.format("Formatter type '{0}' does not accept a format string component", Format.Utils.Function.getName(this.constructor)));
            return null != value ? value + "" : "";
        }, OtherFormatter;
    }(), simpleProvider = new SimpleProvider();
}(Format || (Format = {})), module.exports = String.format;