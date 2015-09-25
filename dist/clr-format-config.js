!function(Format) {
    "use strict";
    if ("undefined" === typeof Format || "undefined" === typeof Format.innerFormat) {
        throw new Error("Configuration module loaded before main module");
    }
    (function(Format) {
        var Utils;
        (function(Utils) {
            var Function;
            (function(Function) {
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
                var addAll, asStatic, asPrototype, ignoreUtil, getProtoWrapper, unregister, utils = Format.Utils, text = utils.Text, numeric = utils.Numeric, func = utils.Function, enumerable = utils.Enumerable, globalRegistry = {}, globalExceptions = [], prototypeRegistry = {}, prototypeExceptions = [ text.isNullOrWhitespace, func.getEmpty ];
                Definitions.addUtilsToGlobals_ = function() {
                    addAll(asStatic, utils, Object);
                    addAll(asStatic, text, String);
                    addAll(asStatic, numeric, Number);
                    addAll(asStatic, enumerable, Array);
                    addAll(asStatic, func, Function);
                };
                Definitions.addUtilsToPrototype_ = function() {
                    addAll(asPrototype, text, String.prototype);
                    addAll(asPrototype, numeric, Number.prototype);
                    addAll(asPrototype, enumerable, Array.prototype);
                    addAll(asPrototype, func, Function.prototype);
                };
                Definitions.removeUtilGlobals_ = function() {
                    return unregister(globalRegistry);
                }, Definitions.removeUtilsFromPrototype_ = function() {
                    return unregister(prototypeRegistry);
                };
                Definitions.addToPrototype_ = function(bareFunction, hostObject, name) {
                    var actualName = func.getName(bareFunction);
                    if ("" === actualName && !name) {
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
                    if (!ignoreUtil(utilFunction, globalRegistry[name], globalExceptions)) {
                        var existingFunction = globalObject[name];
                        if (existingFunction) {
                            if (existingFunction === utilFunction) {
                                return;
                            }
                            unregister(globalRegistry);
                            throw new Format.Errors.InvalidOperationError("Argument 'name' is invalid. A property named '" + name + "' already exists in '" + func.getName(globalObject) + "'");
                        }
                        globalObject[name] = utilFunction;
                        globalRegistry[name] = globalObject;
                    }
                };
                asPrototype = function(utilFunction, protoObject, name) {
                    if (!ignoreUtil(utilFunction, prototypeRegistry[name], prototypeExceptions)) {
                        if (protoObject[name]) {
                            unregister(prototypeRegistry);
                            throw new Format.Errors.InvalidOperationError("Argument 'name' is invalid. A property named '" + name + "' already exists in '" + func.getName(protoObject.constructor) + ".prototype'");
                        }
                        protoObject[name] = getProtoWrapper(utilFunction);
                        prototypeRegistry[name] = protoObject;
                    }
                };
                ignoreUtil = function(utilFunction, registryEntry, exceptions) {
                    return void 0 !== registryEntry || utils.Polyfill.indexOf(exceptions, utilFunction) !== -1;
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
                var formatProto, padding, getPaddingProto, paddingDirection, padLeftProto, padRightProto, numberToStringProto, dateToStringProto, getToStringOverload, numberToStringOverload, dateToStringOverload, isProvider;
                Definitions.addFormatToPrototype_ = function() {
                    String.prototype.format = formatProto;
                };
                Definitions.removeFormatFromPrototype_ = function() {
                    if (String.prototype.format === formatProto) {
                        delete String.prototype.format;
                    }
                };
                Definitions.addPaddingToPrototype_ = function() {
                    String.prototype.padLeft = padLeftProto;
                    String.prototype.padRight = padRightProto;
                };
                Definitions.removePaddingFromPrototype_ = function() {
                    if (String.prototype.padLeft === padLeftProto) {
                        delete String.prototype.padLeft;
                    }
                    if (String.prototype.padRight === padRightProto) {
                        delete String.prototype.padRight;
                    }
                };
                Definitions.addToStringOverload_ = function() {
                    Number.prototype.toString = numberToStringOverload;
                    Date.prototype.toString = dateToStringOverload;
                };
                Definitions.removeToStringOverload_ = function() {
                    if (Number.prototype.toString === numberToStringOverload) {
                        Number.prototype.toString = numberToStringProto;
                    }
                    if (Date.prototype.toString === dateToStringOverload) {
                        Date.prototype.toString = dateToStringProto;
                    }
                };
                formatProto = function() {
                    var _i, provider, args = [];
                    for (_i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    if (isProvider(args[0])) {
                        provider = args.shift();
                        return Format.innerFormat(provider, this, args);
                    }
                    return Format.innerFormat(void 0, this, args);
                };
                padding = Format.Utils.Padding, getPaddingProto = function(direction) {
                    return function(totalWidth, paddingChar) {
                        return padding.pad(this, {
                            direction: direction,
                            totalWidth: totalWidth,
                            paddingChar: paddingChar
                        });
                    };
                };
                paddingDirection = padding.Direction, padLeftProto = getPaddingProto(paddingDirection.Left), 
                padRightProto = getPaddingProto(paddingDirection.Right), numberToStringProto = Number.prototype.toString, 
                dateToStringProto = Date.prototype.toString;
                getToStringOverload = function(originalProto) {
                    return function() {
                        var _i, format, provider, args = [];
                        for (_i = 0; _i < arguments.length; _i++) {
                            args[_i - 0] = arguments[_i];
                        }
                        if ("number" === typeof args[0] && originalProto === numberToStringProto) {
                            return originalProto.apply(this, args);
                        }
                        format = "";
                        if (isProvider(args[0])) {
                            return Format.innerComponentFormat(format, this, args[0]);
                        }
                        if ("string" === typeof args[0]) {
                            format = args[0];
                            if (isProvider(args[1])) {
                                provider = args[1];
                                return Format.innerComponentFormat(format, this, provider);
                            }
                            return Format.innerComponentFormat(format, this);
                        }
                        return originalProto.apply(this, args);
                    };
                };
                numberToStringOverload = getToStringOverload(numberToStringProto), dateToStringOverload = getToStringOverload(dateToStringProto);
                isProvider = function(provider) {
                    return provider && "function" === typeof provider.getFormatter;
                };
            })(Definitions = Config.Definitions || (Config.Definitions = {}));
        })(Config = Format.Config || (Format.Config = {}));
    })(Format || (Format = {}));
    (function(Format) {
        var Config;
        (function(Config) {
            var Definitions;
            (function(Definitions) {
                function enableMemoization_() {
                    memoize(Format, "getBracesCount");
                }
                function disableMemoization_() {
                    unmemoize(Format, "getBracesCount");
                }
                var memoize, unmemoize, memoizedRegistry = {};
                Definitions.enableMemoization_ = enableMemoization_;
                Definitions.disableMemoization_ = disableMemoization_;
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
            function addToPrototype(bareFunction, hostObject, name) {
                Config.Definitions.addToPrototype_(bareFunction, hostObject, name);
                return Config;
            }
            function addFormatToPrototype() {
                Config.Definitions.addFormatToPrototype_();
                return Config;
            }
            function addPaddingToPrototype() {
                Config.Definitions.addPaddingToPrototype_();
                return Config;
            }
            function addToStringOverload() {
                Config.Definitions.addToStringOverload_();
                return Config;
            }
            function removeFormatFromPrototype() {
                Config.Definitions.removeFormatFromPrototype_();
                return Config;
            }
            function removePaddingFromPrototype() {
                Config.Definitions.removePaddingFromPrototype_();
                return Config;
            }
            function removeToStringOverload() {
                Config.Definitions.removeToStringOverload_();
                return Config;
            }
            function addUtilsToGlobals() {
                Config.Definitions.addUtilsToGlobals_();
                return Config;
            }
            function removeUtilGlobals() {
                Config.Definitions.removeUtilGlobals_();
                return Config;
            }
            function addUtilsToPrototype() {
                Config.Definitions.addUtilsToPrototype_();
                return Config;
            }
            function removeUtilsFromPrototype() {
                Config.Definitions.removeUtilsFromPrototype_();
                return Config;
            }
            function enableMemoization() {
                Config.Definitions.enableMemoization_();
                return Config;
            }
            function disableMemoization() {
                Config.Definitions.disableMemoization_();
                return Config;
            }
            Config.addToPrototype = addToPrototype;
            Config.addFormatToPrototype = addFormatToPrototype;
            Config.addPaddingToPrototype = addPaddingToPrototype;
            Config.addToStringOverload = addToStringOverload;
            Config.removeFormatFromPrototype = removeFormatFromPrototype;
            Config.removePaddingFromPrototype = removePaddingFromPrototype;
            Config.removeToStringOverload = removeToStringOverload;
            Config.addUtilsToGlobals = addUtilsToGlobals;
            Config.removeUtilGlobals = removeUtilGlobals;
            Config.addUtilsToPrototype = addUtilsToPrototype;
            Config.removeUtilsFromPrototype = removeUtilsFromPrototype;
            Config.enableMemoization = enableMemoization;
            Config.disableMemoization = disableMemoization;
        })(Config = Format.Config || (Format.Config = {}));
    })(Format || (Format = {}));
}("undefined" !== typeof Format ? Format : {});