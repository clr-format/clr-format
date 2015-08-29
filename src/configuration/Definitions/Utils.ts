/// <reference path="../../use-strict" />

/// <reference path="../Utils/Function" />

namespace Format.Config.Definitions {

    /** @private */
    let globalRegistry: Indexable<Indexable<Function>> = {},
        globalExceptions: Function[] = [
            Utils.isArray
        ],
        prototypeRegistry: Indexable<Indexable<Function>> = {},
        prototypeExceptions: Function[] = [
            Utils.Text.isNullOrWhitespace,
            Utils.Function.getEmpty
        ];

    export var addUtilsToGlobals = () => {
        addAll(asStatic, Utils, Object);
        addAll(asStatic, Utils.Text, String);
        addAll(asStatic, Utils.Numeric, Number);
        addAll(asStatic, Utils.Enumerable, Array);
        addAll(asStatic, Utils.Function, Function);
    };

    export var addUtilsToPrototype = () => {
        addAll(asPrototype, Utils.Text, String.prototype);
        addAll(asPrototype, Utils.Numeric, Number.prototype);
        addAll(asPrototype, Utils.Enumerable, Array.prototype);
        addAll(asPrototype, Utils.Function, Function.prototype);
    };

    export var removeUtilGlobals = () => unregister(globalRegistry);
    export var removeUtilsFromPrototype = () => unregister(prototypeRegistry);

    export var addToPrototype = (bareFunction: Function, hostObject: any, name: string) => {

        let actualName = Utils.Function.getName(bareFunction);
        if (actualName === "" && !name) {
            throw new Errors.ArgumentError("Argument 'name' must be supplied for anonymous function declarations");
        }

        hostObject.prototype[name || actualName] = getProtoWrapper(bareFunction);
    };

    /* tslint:disable:no-shadowed-variable */// TSLint #500

    /** @private */
    var addAll = (addFunc: (utilFunction: Function, hostObject: Indexable<Function>, name: string) => void, source: any, hostObject: any) => {
        for (let key in source) {
            if (source.hasOwnProperty(key) && typeof source[key] === "function") {
                addFunc(source[key], hostObject, key);
            }
        }
    };
    /* tslint:enable:no-shadowed-variable */

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
                `Argument 'name' is invalid. A property named '${name}' already exists in '${ Utils.Function.getName(<any> globalObject) }'`);
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
                `Argument 'name' is invalid. A property named '${name}' already exists in '${ Utils.Function.getName(protoObject.constructor) }.prototype'`);
        }

        protoObject[name] = getProtoWrapper(utilFunction);
        prototypeRegistry[name] = protoObject;
    };

    /** @private */
    var ignoreUtil = (utilFunction: Function, registryEntry: Indexable<Function>, exceptions: Function[]): boolean => {
        return registryEntry !== undefined || exceptions.indexOf(utilFunction) !== -1;
    };

    /** @private */
    var getProtoWrapper = (utilFunction: Function): Function => {
        return function(...args: Object[]): Function {
            return utilFunction(this, ...args);
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
