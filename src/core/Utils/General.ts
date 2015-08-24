/// <reference path="../../use-strict" />

/// <reference path="../Format" />

/// <reference path="../Errors/ArgumentError" />

/** A core namespace which contains utility methods for general purpose operations and more specialized utility sub-modules. */
namespace Format.Utils {
    /**
     * Returns `true` if an object's type matches the given type argument.
     * @param type A string indicating the expected type of the object, i.e. `"Array"`, `"RegExp"`, etc.
     * @param object The object to check for matching type.
     */
    export function isType(type: string, object: Object): boolean {
        return getType(object) === getTypeString(type);
    }

    /**
     * Returns `true` if an object is a pure object instance.
     * @param object The object to test.
     */
    export function isObject(object: Object): boolean {
        return getType(object) === Types.Object;
    }

    /**
     * Returns the actual type of an object (unlike `typeof`), see [[Types]].
     * @param object The object to test.
     */
    export function getType(object: Object): string {
        return Object.prototype.toString.call(object);
    }

    /**
     * Returns a string representing the actual type of an object, see [[Types]].
     * @param type The type to wrap into a type string.
     */
    export function getTypeString(type: string): string {
        return String.format("[object {0}]", type);
    }
}
