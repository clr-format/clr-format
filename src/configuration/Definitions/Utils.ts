/// <reference path="../../use-strict" />
/// <reference path="../../shared/Indexable" />

module Format.Config.Definitions {

    let globalRegistry: Indexable<Indexable<Function>> = {},
        prototypeRegistry: Indexable<Indexable<Function>> = {},
        prototypeExceptions: Function[] = [
            Utils.Function.getEmpty
        ];

    export function addUtilsToGlobals() {
        addAll(asStatic, Utils, Object);
        addAll(asStatic, Utils.Enumerable, Array);
        addAll(asStatic, Utils.Function, Function);
    }

    export function addUtilsToPrototype() {
        addAll(asPrototype, Utils.Enumerable, Array.prototype);
        addAll(asPrototype, Utils.Function, Function.prototype);
    }

    export function removeUtilGlobals() {
        unregister(globalRegistry);
    }

    export function removeUtilsFromPrototype() {
        unregister(prototypeRegistry);
    }

    export function addToPrototype(bareFunction: Function, hostObject: any, name: string) {

        let actualName = Utils.Function.getName(bareFunction);
        if (actualName === "anonymous" && !name) {
            throw new Errors.ArgumentError("Argument 'name' must be supplied for anonymous function declarations");
        }

        hostObject.prototype[name || actualName] = getProtoWrapper(bareFunction);
    }

    var addAll = function(addFunc: (utilFunction: Function, name: string, hostObject: Indexable<Function>) => void, source: any, hostObject: any) {
        for (let key in source) {
            if (source.hasOwnProperty(key) && typeof source[key] === "function") {
                addFunc(source[key], key, hostObject);
            }
        }
    };

    var asStatic = function(utilFunction: Function, name: string, globalObject: Indexable<Function>) {

        if (globalObject[name]) {
            unregister(globalRegistry);

            throw new Errors.ArgumentError(
                String.format(
                    "Argument 'name' is invalid. A property named '{0}' already exists in '{1}'",
                    name,
                    Utils.Function.getName(<any>globalObject)));
        }

        globalObject[name] = utilFunction;
        globalRegistry[name] = globalObject;
    };

    var asPrototype = function(utilFunction: Function, name: string, protoObject: Indexable<Function>) {

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

    var getProtoWrapper = function(utilFunction: Function) {
        return function() {

            let args = [this];
            for (let i = 0; i < arguments.length; i += 1) {
                args[i + 1] = arguments[i];
            }

            return utilFunction.apply(undefined, args);
        };
    };

    var unregister = function(registry: Indexable<Indexable<Function>>) {
        for (let key in registry) {
            if (registry.hasOwnProperty(key)) {
                let hostObject = registry[key];
                delete hostObject[key];
                delete registry[key];
            }
        }
    };
}
