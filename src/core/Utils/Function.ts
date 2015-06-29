/// <reference path="../../use-strict" />

module Format.Utils.Function {

    /**
     * Returns the name of a function or "anonymous" for lambda functions.
     * @param func A functional object.
     */
    export function getName(func: Function) {

        if (typeof func !== "function") {
            throw new TypeError("Cannot call method 'getName' on non-functional objects");
        }

        let typeNameGroups = typeNameRegExp.exec(func.toString());

        return typeNameGroups && typeNameGroups[1] ? typeNameGroups[1] : "anonymous";
    };
    var typeNameRegExp = /function +(\w+)/;

    /** Returns an empty parameterless function. Useful as the default for optional callback arguments instead of creating new anonymous empty functions. */
    export function getEmpty<T>() {
        return empty;
    }
    var empty = <T>(): T => { return undefined; };
}
