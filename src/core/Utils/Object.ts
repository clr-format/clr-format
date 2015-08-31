/// <reference path="../../use-strict" />

/// <reference path="Harmony" />
/// <reference path="Indexable" />

/// <reference path="../Errors/ArgumentError" />
/// <reference path="../Errors/ArgumentNullError" />

declare namespace Format.Utils {
    /**
     * Returns `true` if an object is an array; otherwise `false`.
     * @param object The object to test.
     */
    function isArray(object: Object): boolean;

    /**
     * Maps the given object's values as keys with their keys as values and returns the extended object.
     *
     * Throws an error if the operation results in key duplication or keys with 'undefined' or 'null' values.
     * @param T The type of object to update.
     * @param object The object to update with the mapped unique values as keys.
     * @returns A new object with all of the original and inverted properties.
     */
    function mapValuesAsKeys<T>(object: T): T;

    /**
     * Merge the contents of two or more objects together into the first object.
     * @param T The type of the object to merge into.
     * @param target An object that will receive the new properties.
     * @param object An object containing additional properties to merge in.
     * @param objects A list of arguments that consists of more objects that contain additional properties to merge in.
     */
    function extend<T>(target: T, object: Object, ...objects: Object[]): T;

    /**
     * Recursivelly merge the contents of two or more objects together into the first object.
     * @param T The type of the object to merge into.
     * @param target An object that will receive the new properties.
     * @param object An object containing additional properties to merge in.
     * @param objects A list of arguments that consists of more objects that contain additional properties to merge in.
     */
    function deepExtend<T>(target: T, object: Object, ...objects: Object[]): T;
}

/** A core namespace which contains utility methods for general purpose operations and more specialized utility sub-modules. */
namespace Format.Utils {
    /**
     * Returns `true` if an object is an object instance with language type of [[Types.Object]].
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
    var isEnumerable = (object: Object): boolean => (typeof object === "object" || typeof object === "function") && object !== null;

    Utils.mapValuesAsKeys = <T extends Indexable<string>>(object: T): T => {

        if (object == null) {
            throw new Errors.ArgumentNullError("object");
        }

        if (typeof object === "string") {
            throw new Errors.ArgumentError("Cannot call method 'enumerateValues' on immutable string objects");
        }

        let objectIsArray = isArray(object),
            result = <T> (objectIsArray ? [] : {});

        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                let value = object[key];

                validateValueAsKey(object, result, value);

                result[value] = objectIsArray ? +key : key;
                result[key] = value;
            }
        }

        return result;
    };

    /** @private */
    var validateValueAsKey = <T>(object: T, result: T, value: string): void => {

        if (value == null) {
            throw new Errors.ArgumentError("Cannot call method 'enumerateValues' on objects that contain undefined or null values");
        }

        if (object.hasOwnProperty(value) || result.hasOwnProperty(value)) {
            throw new Errors.ArgumentError(`Cannot enumerate value '${value}' because such a key already exists in ${object}`);
        }
    };

    Utils.isArray = Array.isArray || function(object: Object): boolean {
        return getType(object) === Types.Array;
    };

    Utils.extend = (target: Indexable<Object>, ...objects: Indexable<Object>[]): Object => innerExtend(false, target, objects);

    Utils.deepExtend = (target: Indexable<Object>, ...objects: Indexable<Object>[]): Object => innerExtend(true, target, objects);

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

        let objectIsArray = isArray(object);

        /* tslint:disable:forin */// Intentional use of for-in without checking hasOwnProperty
        for (let key in object) {

            let copy = <Indexable<Object>> object[key];
            if (copy === target || objectIsArray && !object.hasOwnProperty(key)) {
                continue;
            }

            if (deep && (isObject(copy) || isArray(copy))) {
                deepMerge(target, key, copy);
            }
            else if (copy !== undefined) {
                target[key] = copy;
            }
        }
        /* tslint:enable:forin */
    };

    /** @private */
    var deepMerge = (target: Indexable<Object>, key: string, copy: Indexable<Object>) => {

        let source = getDeepMergeSource(<Indexable<Object>> target[key], copy);

        target[key] = innerExtend(true, source, [copy]);
    };

    /** @private */
    var getDeepMergeSource = (source: Indexable<Object>, copy: Indexable<Object>): Indexable<Object> => {

        if (isArray(copy)) {
            return isArray(source) ? source : <any> [];
        }
        else {
            return isObject(source) ? source : {};
        }
    };
}
