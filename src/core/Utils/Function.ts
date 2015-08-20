/// <reference path="../../use-strict" />

/** A [[Format.Utils]] sub-module containing methods related to functional operations. */
module Format.Utils.Function {
    /**
     * Returns the name of a function.
     * @param func A functional object.
     * @returns The name of a function or `"anonymous"` for lambda functions.
     */
    export function getName(func: Function) {

        if (typeof func !== "function") {
            throw new TypeError("Cannot call method 'getName' on non-functional objects");
        }

        let typeNameGroups = typeNameRegExp.exec(func.toString());

        return typeNameGroups && typeNameGroups[1] ? typeNameGroups[1] : "anonymous";
    }
    var typeNameRegExp = /function +(\w+)/;

    /**
     * Returns an empty parameterless function which returns `undefined`. Useful for defaulting optional callback arguments instead of creating new anonymous empty functions.
     * @param T The return type of the empty callback.
     */
    export function getEmpty<T>() {
        return empty;
    }
    var empty = <T>(): T => { return undefined; };
}
