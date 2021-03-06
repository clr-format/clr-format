/// <reference path="../../use-strict" />

/// <reference path="Object" />
/// <reference path="Polyfill" />
/// <reference path="Indexable" />
/// <reference path="Enumerable" />
/// <reference path="RecursiveContext" />

declare namespace Format.Utils {
    /**
     * Removes all properties with `null` or `undefined` values.
     * @param T The type of the object to remove from.
     * @param object The object to remove from.
     * @param deep Optional flag specifying whether the removal should be recursive.
     * @returns The same object instance without `null` or `undefined` elements.
     */
    function removeUndefined<T>(object: T, deep?: boolean): T;

    /**
     * Removes all properties with `null`, `undefined` or `""` values.
     * @param T The type of the object to remove from.
     * @param object The object to remove from.
     * @param deep Optional flag specifying whether the removal should be recursive.
     * @returns The same object instance without `null`, `undefined` or `""` elements.
     */
    function removeEmpty<T>(object: T, deep?: boolean): T;

    /**
     * Removes all properties with falsy values (`null`, `undefined`, `""` or `0`).
     * @param T The type of the object to remove from.
     * @param object The object to remove from.
     * @param deep Optional flag specifying whether the removal should be recursive.
     * @returns The same object instance without falsy elements.
     */
    function removeFalsy<T>(object: T, deep?: boolean): T;
}

namespace Format.Utils {

    /** An interface servicing similar [[removeProperty]] method implementations that differ by a filter-predicate function. */
    interface RemovePropertyPredicates extends Indexable<(value: Object) => boolean> {
        /** Returns `true` for values equal to `null` or `undefined`. */
        undefined(value: Object): boolean;
        /** Returns `true` for values equal to `null`, `undefined` or `""`. */
        ""(value: Object): boolean;
        /** Returns `true` for values that are considered falsy (`null`, `undefined`, `""` or `0`). */
        0(value: Object): boolean;
    }

    /** @private */
    let removePredicates: RemovePropertyPredicates = {
        undefined: (value: Object): boolean => value == null,
        "": (value: Object): boolean => removePredicates.undefined(value) || value === "",
        0: (value: Object): boolean => !value
    };

    /** @private */
    let createRemoveFunction = (predicateKey?: Object) => {

        let context: RemovePropertyContext = {
            removePredicate: removePredicates[predicateKey + ""]
        };

        return (object: Indexable<Object>, deep?: boolean): Object => {

            context.seen = [];
            context.deep = deep;

            return removeProperty(object, context);
        };
    };

    Utils.removeUndefined = createRemoveFunction(undefined);
    Utils.removeEmpty = createRemoveFunction("");
    Utils.removeFalsy = createRemoveFunction(0);

    /** @private */
    var removeProperty = (object: Indexable<Object>, context: RemovePropertyContext) => {

        let objectIsArray = Polyfill.isArray(object);
        if (objectIsArray || isObject(object)) {

            context.seen.push(object);

            for (context.key in object) {
                if (object.hasOwnProperty(context.key)) {
                    innerRemoveProperty(object, context);
                }
            }
        }

        return objectIsArray ? Enumerable.compact(<any> object) : object;
    };

    /** @private */
    var innerRemoveProperty = (object: Indexable<Object>, context: RemovePropertyContext) => {

        let value = <Indexable<Object>> object[context.key];

        if (context.removePredicate(value)) {
            delete object[context.key];
        }
        else if (context.deep && Polyfill.indexOf(context.seen, value) === -1) {
            removeProperty(value, context);
        }
    };
}
