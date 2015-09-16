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
                var addAll, asStatic, asPrototype, ignoreUtil, getProtoWrapper, unregister, globalRegistry = {}, globalExceptions = [], prototypeRegistry = {}, prototypeExceptions = [ Format.Utils.Text.isNullOrWhitespace, Format.Utils.Function.getEmpty ];
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
                    return void 0 !== registryEntry || Format.Utils.Polyfill.indexOf(exceptions, utilFunction) !== -1;
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
                var formatProto, getPaddingProto, padLeftProto, padRightProto, numberToStringProto, dateToStringProto, getToStringOverload, numberToStringOverload, dateToStringOverload, isProvider;
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
                Definitions.addToStringOverload = function() {
                    Number.prototype.toString = numberToStringOverload;
                    Date.prototype.toString = dateToStringOverload;
                };
                Definitions.removeToStringOverload = function() {
                    if (Number.prototype.toString === numberToStringOverload) {
                        Number.prototype.toString = numberToStringProto;
                    }
                    if (Date.prototype.toString === dateToStringOverload) {
                        Date.prototype.toString = dateToStringProto;
                    }
                };
                /** @private */
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
                padLeftProto = getPaddingProto(Format.Utils.Padding.Direction.Left), padRightProto = getPaddingProto(Format.Utils.Padding.Direction.Right), 
                numberToStringProto = Number.prototype.toString, dateToStringProto = Date.prototype.toString;
                /** @private */
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
                /** @private */
                numberToStringOverload = getToStringOverload(numberToStringProto), dateToStringOverload = getToStringOverload(dateToStringProto);
                /** @private */
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
            /**
             * Adds the [[Number.toString]] and [[Date.toString]] overloads while retaining the original `toString` behaviour if those overloads are not matched by the supplied parameters.
             *
             * For example `(12).toString(2) === "1100"` but `(12).toString("2") === String.format("{0:2}", 12)` because it matches the format string overload.
             */
            function addToStringOverload() {
                Config.Definitions.addToStringOverload();
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
            /** Removes the [[Number.toString]] and [[Date.toString]] overloads that are set by calling [[addToStringOverload]] and restores the original `toString` behaviour. */
            function removeToStringOverload() {
                Config.Definitions.removeToStringOverload();
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