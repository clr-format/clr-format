/// <reference path="../../use-strict" />

/// <reference path="General" />
/// <reference path="Indexable" />

namespace Format.Utils {

    /** @private */
    let fillTypes = <T>(types: T): T => {

        for (var key in types) {
            if (types.hasOwnProperty(key)) {
                (<any> types)[key] = getTypeString(key);
            }
        }

        return types;
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
