/// <reference path="../use-strict" />

/// <reference path="API" />

/// <reference path="Definitions/Utils" />
/// <reference path="Definitions/String" />
/// <reference path="Definitions/Performance" />

/**
 * An optional sub-module which contains various configurational methods.
 *
 * All methods can be chained like `Format.Config.addFormatToPrototype().addUtilsToGlobals()...`
 */
module Format.Config {
    /**
     * Adds a bare function (one that does not rely on any local `this` context) to the host object's prototype.
     * @param bareFunction A function the first argument of which can be replaced by the `this` context of the host object.
     * @param hostObject A host object (usually a constructor function) the prototype of which will be updated to contain the wrapped bare function.
     * @param name The name of the new prototype method which is added, defaults to the bare function's name. Required if the bare function is anonymous.
     */
    export function addToPrototype(bareFunction: Function, hostObject: Object, name?: string) {
        Definitions.addToPrototype(bareFunction, hostObject, name);
        return Config;
    }

    /**
     * Adds the [[String.format]] function, which allows for direct instance calls like `"{0}".format(val1, val2, ...)`.
     *
     * If the first argument of such calls is an object that implements the [[FormatProvider]] interface (or more precisely has a method [[getFormatter]]):
     * - It will be used to create the formatting context (same behaviour as with normal [[StringConstructor.format]] overloads)
     * - The trailing arguments will be used as replacement values starting from 0
     */
    export function addFormatToPrototype() {
        Definitions.addFormatToPrototype();
        return Config;
    }

    /** Adds the [[String.padLeft]] and [[String.padRight]] functions, which allows for direct instance calls like `"123".padLeft(5, "0")`. */
    export function addPaddingToPrototype() {
        Definitions.addPaddingToPrototype();
        return Config;
    }

    /** Removes the [[String.format]] prototype wrapper that is defined by calling [[addFormatToPrototype]]. */
    export function removeFormatFromPrototype() {
        Definitions.removeFormatFromPrototype();
        return Config;
    }

    /** Removes the [[String.padLeft]] and [[String.padRight]] functions that are defined by calling [[addPaddingToPrototype]]. */
    export function removePaddingFromPrototype() {
        Definitions.removePaddingFromPrototype();
        return Config;
    }

    /**
     * Adds all [[Format.Utils]] methods (including ones in sub-modules like [[Format.Utils.Function]]) as static methods to respective global objects.
     *
     * For example [[ObjectConstructor.getType]] will be equivallent to calling [[Format.Utils.getType]].
     * The following mapping applies:
     * - [[Format.Utils]] methods => [[ObjectConstructor]]
     * - [[Format.Utils.Function]] => [[FunctionConstructor]]
     * - [[Format.Utils.Enumerable]] => [[ArrayConstructor]]
     */
    export function addUtilsToGlobals() {
        Definitions.addUtilsToGlobals();
        return Config;
    }

    /** Removes the static methods from global objects that are defined by calling [[addUtilsToGlobals]]. */
    export function removeUtilGlobals() {
        Definitions.removeUtilGlobals();
        return Config;
    }

    /**
     * Adds all [[Format.Utils]] sub-modules' methods as wrapped instance methods to respective global objects.
     *
     * The method's first argument must match the global object's type.
     * For example [[Function.getName]] will be wrapped to have its first argument replaced by the `this` object in the prototype version. Other arguments are shifted accordingly in the process.
     * The following mapping applies:
     * - [[Format.Utils.Function]] => [[Function]]
     * - [[Format.Utils.Enumerable]] => [[Array]]
     */
    export function addUtilsToPrototype() {
        Definitions.addUtilsToPrototype();
        return Config;
    }

    /** Removes the instance methods from global objects that are defined by calling [[addUtilsToPrototype]]. */
    export function removeUtilsFromPrototype() {
        Definitions.removeUtilsFromPrototype();
        return Config;
    }

    /** Enables performance improvements through memoization of key inner functions at the cost of memory. */
    export function enableMemoization() {
        Definitions.enableMemoization();
        return Config;
    }

    /** Disables performance improvements through memoization of key inner functions and releases the used memory. */
    export function disableMemoization() {
        Definitions.disableMemoization();
        return Config;
    }
}
