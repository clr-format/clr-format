/// <reference path="../../use-strict" />

/// <reference path="Types" />
/// <reference path="Indexable" />

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
     * Returns the actual type of an object (unlike `typeof`), see [[Types]].
     * @param object The object to test.
     */
    export function getType(object: Object): string {

        if (object === null) {
            return Types.Null;
        }

        if (object === undefined) {
            return Types.Undefined;
        }

        return Object.prototype.toString.call(object);
    }

    /** @private */
    let fillTypes = <T>(types: T): T => {

        for (var key in types) {
            if (types.hasOwnProperty(key)) {
                (<any> types)[key] = getTypeString(key);
            }
        }

        return types;
    };

    /** @private */
    var getTypeString = (type: string): string => {
        return `[object ${type}]`;
    };

    /** An enumeration containing strings that represent the actual type of an object. */
    export var Types = fillTypes({
        /** Returns `"[object Array]"`. */
        Array: "",
        /** Returns `"[object Boolean]"`. */
        Boolean: "",
        /** Returns `"[object Date]"`. */
        Date: "",
        /** Returns `"[object Function]"`. */
        Function: "",
        /** Returns `"[object Null]"`. */
        Null: "",
        /** Returns `"[object Number]"`. */
        Number: "",
        /** Returns `"[object Object]"`. */
        Object: "",
        /** Returns `"[object RegExp]"`. */
        RegExp: "",
        /** Returns `"[object String]"`. */
        String: "",
        /** Returns `"[object Undefined]"`. */
        Undefined: ""
    });
}
