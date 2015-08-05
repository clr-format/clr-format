/// <reference path="../use-strict" />

/// <reference path="API" />

/// <reference path="Definitions/Format" />
/// <reference path="Definitions/Utils" />

module Format.Config {
    /**
     * Adds a bare function (one that has no 'this' context) to the host object's prototype.
     * @param A function the first argument of which can be replaced by the 'this' context of the host object.
     * @hostObject A host object (usually a constructor function) the prototype of which will be updated to contain the wrapped bare function.
     * @name: Optional (unless the bare function is anonymous) name of the new prototype method which is added, defaults to the bare function's name.
     */
    export function addToPrototype(bareFunction: Function, hostObject: Object, name?: string) {
        Definitions.addToPrototype(bareFunction, hostObject, name);
        return Config;
    }

    /**
     * Adds the String.format function as a String.prototype member, which allows for direct instance calls like "{0}".format(1).
     * If the first parameter of such calls implements the FormatProvider interface (or more precisely has a callable method named 'getFormatter'):
     * - It will be used to create the formatting context (same behaviour as with normal String.format overloads)
     * - The trailing arguments will be used as replacement values starting from 0
     */
    export function addFormatToPrototype() {
        Definitions.addFormatToPrototype();
        return Config;
    }

    /** Removes the String.format prototype wrapper that is defined by calling 'addFormatToPrototype'. */
    export function removeFormatFromPrototype() {
        Definitions.removeFormatFromPrototype();
        return Config;
    }

    /**
     * Adds all Format.Utils methods (including ones in sub-modules like Format.Utils.Function) as static methods to respective global objects.
     * For example Object.getType will be equivallent to calling Format.Utils.getType.
     * The following mapping applies:
     * - Format.Utils methods => Object
     * - Format.Utils.Enumerable => Array
     * - Format.Utils.Function => Function
     */
    export function addUtilsToGlobals() {
        Definitions.addUtilsToGlobals();
        return Config;
    }

    /** Removes the static methods from global objects that are defined by calling 'addUtilsToGlobals'. */
    export function removeUtilGlobals() {
        Definitions.removeUtilGlobals();
        return Config;
    }

    /**
     * Adds all Format.Utils sub-modules' methods as wrapped instance methods to respective global objects. The method's first argument must match the global object's type.
     * For example Function.getName will be wrapped to have its first argument replaced by the 'this' object in the prototype version. Other arguments are shifted accordingly in the process.
     * The following mapping applies:
     * - Format.Utils.Enumerable => Array.prototype
     * - Format.Utils.Function => Function.prototype
     */
    export function addUtilsToPrototype() {
        Definitions.addUtilsToPrototype();
        return Config;
    }

    /** Removes the instance methods from global objects that are defined by calling 'addUtilsToPrototype'. */
    export function removeUtilsFromPrototype() {
        Definitions.removeUtilsFromPrototype();
        return Config;
    }
}
