/// <reference path="../../use-strict" />

/// <reference path="../Utils/Function" />

namespace Format.Config.Definitions {

    /** @private */
    let utils = Utils, text = utils.Text, numeric = utils.Numeric, func = utils.Function, enumerable = utils.Enumerable;

    /** @private */
    let globalRegistry: Indexable<Indexable<Function>> = {},
        globalExceptions: Function[] = [],
        prototypeRegistry: Indexable<Indexable<Function>> = {},
        prototypeExceptions: Function[] = [
            text.isNullOrWhitespace,
            func.getEmpty
        ];

    /** @private */
    export var addUtilsToGlobals_ = () => {
        addAll(asStatic, utils, Object);
        addAll(asStatic, text, String);
        addAll(asStatic, numeric, Number);
        addAll(asStatic, enumerable, Array);
        addAll(asStatic, func, Function);
    };

    /** @private */
    export var addUtilsToPrototype_ = () => {
        addAll(asPrototype, text, String.prototype);
        addAll(asPrototype, numeric, Number.prototype);
        addAll(asPrototype, enumerable, Array.prototype);
        addAll(asPrototype, func, Function.prototype);
    };

    /** @private */
    export var removeUtilGlobals_ = () => unregister(globalRegistry),
        removeUtilsFromPrototype_ = () => unregister(prototypeRegistry);

    /** @private */
    export var addToPrototype_ = (bareFunction: Function, hostObject: any, name: string) => {

        let actualName = func.getName(bareFunction);
        if (actualName === "" && !name) {
            throw new Errors.ArgumentError("Argument 'name' must be supplied for anonymous function declarations");
        }

        hostObject.prototype[name || actualName] = getProtoWrapper(bareFunction);
    };

    /** @private */
    var addAll = (addFunc: (utilFunction: Function, hostObject: Indexable<Function>, name: string) => void, source: any, hostObject: any) => {
        for (let key in source) {
            if (source.hasOwnProperty(key) && typeof source[key] === "function") {
                addFunc(source[key], hostObject, key);
            }
        }
    };

    /** @private */
    var asStatic = (utilFunction: Function, globalObject: Indexable<Function>, name: string) => {

        if (ignoreUtil(utilFunction, globalRegistry[name], globalExceptions)) {
            return;
        }

        let existingFunction = globalObject[name];
        if (existingFunction) {

            if (existingFunction === utilFunction) {
                return;
            }

            unregister(globalRegistry);

            throw new Errors.InvalidOperationError(
                `Argument 'name' is invalid. A property named '${name}' already exists in '${ func.getName(<any> globalObject) }'`);
        }

        globalObject[name] = utilFunction;
        globalRegistry[name] = globalObject;
    };

    /** @private */
    var asPrototype = (utilFunction: Function, protoObject: Indexable<Function>, name: string) => {

        if (ignoreUtil(utilFunction, prototypeRegistry[name], prototypeExceptions)) {
            return;
        }

        if (protoObject[name]) {
            unregister(prototypeRegistry);

            throw new Errors.InvalidOperationError(
                `Argument 'name' is invalid. A property named '${name}' already exists in '${ func.getName(protoObject.constructor) }.prototype'`);
        }

        protoObject[name] = getProtoWrapper(utilFunction);
        prototypeRegistry[name] = protoObject;
    };

    /** @private */
    var ignoreUtil = (utilFunction: Function, registryEntry: Indexable<Function>, exceptions: Function[]): boolean => {
        return registryEntry !== undefined || utils.Polyfill.indexOf(exceptions, utilFunction) !== -1;
    };

    /** @private */
    var getProtoWrapper = (utilFunction: Function): Function => {
        return function(...args: Object[]): Function {
            let context = utils.isType("Number", this) ? +this : this;
            return utilFunction(context, ...args);
        };
    };

    /** @private */
    var unregister = (registry: Indexable<Indexable<Function>>) => {
        for (let key in registry) {
            if (registry.hasOwnProperty(key)) {
                let hostObject = registry[key];
                delete hostObject[key];
                delete registry[key];
            }
        }
    };
}
