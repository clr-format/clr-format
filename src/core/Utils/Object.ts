/// <reference path="../../use-strict" />

/// <reference path="Harmony" />
/// <reference path="Indexable" />

/// <reference path="../Errors/ArgumentError" />
/// <reference path="../Errors/ArgumentNullError" />

/** A core namespace which contains utility methods for general purpose operations and more specialized utility sub-modules. */
namespace Format.Utils {
    /**
     * Returns `true` if an object is a pure object instance.
     * @param object The object to test.
     */
    export function isObject(object: Object): boolean {
        return getType(object) === Types.Object;
    }

    /**
     * Returns `true` if an object is empty (contains no enumerable properties).
     * @param object The object to test.
     */
    export function isEmpty(object: Object): boolean {

        if (!isEnumerable(object)) {
            throw TypeError("Cannot call method 'isEmpty' on non-enumerable objects");
        }

        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                return false;
            }
        }

        return true;
    }

    /** @private */
    var isEnumerable = (object: Object): boolean =>  (typeof object === "object" || typeof object === "function") && object !== null;

    /**
     * Maps the given object's values as keys with their keys as values and returns the extended object.
     *
     * Throws an error if the operation results in key duplication or keys with 'undefined' or 'null' values.
     * @param T The type of indexable object to update.
     * @param object The object to update with the mapped unique values as keys.
     * @returns The same instance that was passed as the object parameter updated with the new unique keys.
     */
    export function mapValuesAsKeys<T extends Indexable<number|string|symbol|RegExp>|string[]>(object: T): T {

        if (object == null) {
            throw new Errors.ArgumentNullError("object");
        }

        if (typeof object === "string") {
            throw new Errors.ArgumentError("Cannot call method 'enumerateValues' on immutable string objects");
        }

        let isArray = Array.isArray(object);

        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                addValueAsKey(object, key, isArray);
            }
        }

        return object;
    }

    /** @private */
    var addValueAsKey = (object: Indexable<number|string|symbol|RegExp>|string[], key: string, isArray: boolean) => {

        let value = (<Indexable<number|string|symbol|RegExp>> object)[key];
        if (value == null) {
            throw new Errors.ArgumentError("Cannot call method 'enumerateValues' on objects that contain undefined or null values");
        }

        if (object.hasOwnProperty(<string> value)) {
            throw new Errors.ArgumentError(`Cannot enumerate value '${value}' because such a key already exists in ${object}`);
        }

        (<Indexable<number|string|symbol|RegExp>> object)[resolveValueAsKey(value)] = isArray ? +key : key;
    };

    /** @private */
    var resolveValueAsKey = (value: number|string|symbol|RegExp): string|symbol =>
        typeof value !== "symbol" ?
            value + "" :
            value;

    /**
     * Merge the contents of two or more objects together into the first object.
     * @param T The type of the object to merge into.
     * @param target An object that will receive the new properties.
     * @param objects A list of arguments that consists of one or more objects that contain additional properties to merge in.
     */
    export function extend<T>(target: T, ...objects: Object[]): T {
        return <any> innerExtend(false, <any> target, <any> objects);
    }

    /**
     * Recursivelly merge the contents of two or more objects together into the first object.
     * @param T The type of the object to merge into.
     * @param target An object that will receive the new properties.
     * @param objects A list of arguments that consists of one or more objects that contain additional properties to merge in.
     */
    export function deepExtend<T>(target: T, ...objects: Object[]): T {
        return <any> innerExtend(true, <any> target, <any> objects);
    }

    /** @private */
    var innerExtend = (deep: boolean, target: Indexable<Object>, objects: Indexable<Object>[]): Object => {

        target = getDeepTarget(deep, target);

        if (!objects.length) {
            throw new Errors.ArgumentError(`Arguments' list 'options' must contain at least one element`);
        }

        for (let i = 0, len = objects.length; i < len; i += 1) {

            if (objects[i] == null) {
                continue;
            }

            merge(deep, target, objects[i]);
        }

        return target;
    };

    /** @private */
    var getDeepTarget = (deep: boolean, target: Indexable<Object>): Indexable<Object> => {

        if (!isEnumerable(target)) {
            if (!deep) {
                throw new Errors.ArgumentError(`Argument 'target' with value '${target}' must be an enumerable object instance`);
            }

            return {};
        }

        return target;
    };

    /** @private */
    var merge = (deep: boolean, target: Indexable<Object>, object: Indexable<Object>) => {

        let objectIsArray = Array.isArray(object);

        /* tslint:disable:forin */// Intentional use of for-in without checking hasOwnProperty
        for (let key in object) {

            let copy = <Indexable<Object>> object[key];
            if (copy === target || objectIsArray && !object.hasOwnProperty(key)) {
                continue;
            }

            if (deep && isExtensible(copy)) {
                deepMerge(target, key, copy);
            }
            else if (copy !== undefined) {
                target[key] = copy;
            }
        }
        /* tslint:enable:forin */
    };

    /** @private */
    var isExtensible = (object: Object, isArray?: boolean) => {

        if (isArray === undefined) {
            isArray = Array.isArray(object);
        }

        return isArray || isObject(object);
    };

    /** @private */
    var deepMerge = (target: Indexable<Object>, key: string, copy: Indexable<Object>) => {

        let source = getDeepMergeSource(<Indexable<Object>> target[key], copy);

        target[key] = innerExtend(true, source, [copy]);
    };

    /** @private */
    var getDeepMergeSource = (source: Indexable<Object>, copy: Indexable<Object>): Indexable<Object> => {

        if (Array.isArray(copy)) {
            return Array.isArray(source) ? source : <any> [];
        }
        else {
            return isObject(source) ? source : {};
        }
    };
}
