/// <reference path="../../use-strict" />

/// <reference path="Harmony" />
/// <reference path="Polyfill" />
/// <reference path="Indexable" />
/// <reference path="RecursiveContext" />

/// <reference path="../Errors/ArgumentError" />
/// <reference path="../Errors/ArgumentNullError" />

declare namespace Format.Utils {
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

        let objectIsArray = Polyfill.isArray(object),
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

    Utils.extend = (target: Indexable<Object>, ...objects: Indexable<Object>[]): Object => innerExtend(target, objects, { deep: false, seen: [] });

    Utils.deepExtend = (target: Indexable<Object>, ...objects: Indexable<Object>[]): Object => innerExtend(target, objects, { deep: true, seen: [] });

    /** @private */
    var innerExtend = (target: Indexable<Object>, objects: Indexable<Object>[], context: RecursiveContext): Object => {

        target = getDeepTarget(target, context);

        if (!objects.length) {
            throw new Errors.ArgumentError(`Arguments' list 'options' must contain at least one element`);
        }

        for (let i = 0, len = objects.length; i < len; i += 1) {

            if (objects[i] == null) {
                continue;
            }

            merge(target, objects[i], context);
        }

        return target;
    };

    /** @private */
    var getDeepTarget = (target: Indexable<Object>, context: RecursiveContext): Indexable<Object> => {

        if (!isEnumerable(target)) {
            if (!context.deep) {
                throw new Errors.ArgumentError(`Argument 'target' with value '${target}' must be an enumerable object instance`);
            }

            return {};
        }

        return target;
    };

    /** @private */
    let isArray = Polyfill.isArray;

    /** @private */
    var merge = (target: Indexable<Object>, object: Indexable<Object>, context: RecursiveContext) => {

        let objectIsArray = isArray(object);

        context.seen.push(object);

        /* tslint:disable:forin */// Intentional use of for-in without checking hasOwnProperty
        for (let key in object) {

            context.key = key;

            let copy = <Indexable<Object>> object[key];
            if (copy === target || objectIsArray && !object.hasOwnProperty(key)) {
                continue;
            }

            if (canDeepMerge(copy, context)) {
                deepMerge(target, copy, context);
            }
            else if (copy !== undefined) {
                target[key] = copy;
            }
        }
        /* tslint:enable:forin */
    };

    /** @private */
    var canDeepMerge = (copy: Indexable<Object>, context: RecursiveContext): boolean => {
        return context.deep
            && Polyfill.indexOf(context.seen, copy) === -1
            && (isObject(copy) && copy.constructor === Object || isArray(copy));
    };

    /** @private */
    var deepMerge = (target: Indexable<Object>, copy: Indexable<Object>, context: RecursiveContext) => {

        let source = getDeepMergeSource(<Indexable<Object>> target[context.key], copy);

        target[context.key] = innerExtend(source, [copy], context);
    };

    /** @private */
    var getDeepMergeSource = (source: Indexable<Object>, copy: Indexable<Object>): Indexable<Object> => {

        if (isArray(copy)) {
            return <Indexable<Object>> (isArray(source) ? source : []);
        }
        else {
            return isObject(source) ? source : {};
        }
    };
}
