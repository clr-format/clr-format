/// <reference path="../../use-strict" />

/** A [[Format.Utils]] sub-module containing methods related to functional operations. */
namespace Format.Utils.Function {
    /**
     * Returns the name of a function.
     * @param func A functional object.
     * @returns The name of a function or `"anonymous"` for lambda functions.
     */
    export function getName(func: Function): string {

        validateFunctionArgument(func, "getName");

        let typeNameGroups = typeNameRegExp.exec(func.toString());

        return typeNameGroups && typeNameGroups[1] ? typeNameGroups[1] : "anonymous";
    }
    /** @private */
    var typeNameRegExp = /function +(\w+)/;

    /**
     * Returns the rightmost accessor's name of the function's first returned variable.
     *
     * For example a return expression like `return this.field;` will yield `"field"` as a value.
     * @param func A functional object.
     * @return The text of the last literal contained in the first return expression of the function.
     */
    export function getReturnName(func: Function): string {

        validateFunctionArgument(func, "getReturnName");

        let returnNameGroups = returnNameRegExp.exec(func.toString());
        if (returnNameGroups) {
            return returnNameGroups[1];
        }
    }
    /** @private */
    var returnNameRegExp = /(?:(?:=>)|(?:return\s))\s*(?:\w+\.)*([A-Za-z]+)/;

    /** @private */
    var validateFunctionArgument = (func: Function, methodName: string) => {
        if (typeof func !== "function") {
            throw new TypeError(`Cannot call method '${methodName}' on non-functional objects`);
        }
    };

    /**
     * Returns an empty parameterless function which returns `undefined`. Useful for defaulting optional callback arguments instead of creating new anonymous empty functions.
     * @param T The return type of the empty callback.
     */
    export function getEmpty<T>(): () => T {
        return empty;
    }
    /** @private */
    var empty = <T>(): T => { return undefined; };
}
