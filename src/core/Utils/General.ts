/// <reference path="../../use-strict" />

/// <reference path="../Format" />

/// <reference path="../Errors/ArgumentError" />

/** A core sub-module which contains utility methods for general purpose operations and more specialized utility sub-modules. */
namespace Format.Utils {

    /** Returns the actual type of an object (unlike `typeof`), i.e. `"[object Date]"`. */
    export function getType(object: Object): string {
        return Object.prototype.toString.call(object);
    }

    /**
     * Returns `true` if an object's type matches the given type argument.
     * @param type A string indicating the expected type of the object, i.e. `"Array"`, `"RegExp"`, etc.
     * @param object The object to check for matching type.
     */
    export function isType(type: string, object: Object): boolean {
        return getType(object) === String.format("[object {0}]", type);
    }

    /** Returns `true` if an object is a pure object instance. */
    export function isObject(object: Object): boolean {
        return getType(object) === "[object Object]";
    }
}
