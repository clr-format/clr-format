/// <reference path="../../use-strict" />

/// <reference path="../Utils/Function" />
/// <reference path="../Utils/Indexable" />

namespace Format.Config.Definitions {

    let globalRegistry: Indexable<Indexable<Function>> = {},
        prototypeRegistry: Indexable<Indexable<Function>> = {},
        prototypeExceptions: Function[] = [
            Utils.Function.getEmpty
        ];

    export var addUtilsToGlobals = () => {
        addAll(asStatic, Utils, Object);
        addAll(asStatic, Utils.Enumerable, Array);
        addAll(asStatic, Utils.Function, Function);
    };

    export var addUtilsToPrototype = () => {
        addAll(asPrototype, Utils.Enumerable, Array.prototype);
        addAll(asPrototype, Utils.Function, Function.prototype);
    };

    export var removeUtilGlobals = () => unregister(globalRegistry);
    export var removeUtilsFromPrototype = () => unregister(prototypeRegistry);

    export var addToPrototype = (bareFunction: Function, hostObject: any, name: string) => {

        let actualName = Utils.Function.getName(bareFunction);
        if (actualName === "anonymous" && !name) {
            throw new Errors.ArgumentError("Argument 'name' must be supplied for anonymous function declarations");
        }

        hostObject.prototype[name || actualName] = getProtoWrapper(bareFunction);
    };

    /* tslint:disable:no-shadowed-variable */// TSLint #500
    var addAll = (addFunc: (utilFunction: Function, hostObject: Indexable<Function>, name: string) => void, source: any, hostObject: any) => {
        for (let key in source) {
            if (source.hasOwnProperty(key) && typeof source[key] === "function") {
                addFunc(source[key], hostObject, key);
            }
        }
    };
    /* tslint:enable:no-shadowed-variable */

    var asStatic = (utilFunction: Function, globalObject: Indexable<Function>, name: string) => {

        if (globalObject[name]) {
            unregister(globalRegistry);

            throw new Errors.ArgumentError(
                String.format(
                    "Argument 'name' is invalid. A property named '{0}' already exists in '{1}'",
                    name,
                    Utils.Function.getName(<any> globalObject)));
        }

        globalObject[name] = utilFunction;
        globalRegistry[name] = globalObject;
    };

    var asPrototype = (utilFunction: Function, protoObject: Indexable<Function>, name: string) => {

        if (prototypeExceptions.indexOf(utilFunction) !== -1) {
            return;
        }

        if (protoObject[name]) {
            unregister(prototypeRegistry);

            throw new Errors.ArgumentError(
                String.format(
                    "Argument 'name' is invalid. A property named '{0}' already exists in '{1}.prototype'",
                    name,
                    Utils.Function.getName(protoObject.constructor)));
        }

        protoObject[name] = getProtoWrapper(utilFunction);
        prototypeRegistry[name] = protoObject;
    };

    var getProtoWrapper = (utilFunction: Function): Function => {
        return function(...args: Object[]): Function {
            return utilFunction(this, ...args);
        };
    };

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
