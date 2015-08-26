/// <reference path="../../use-strict" />

/// <reference path="Types" />
/// <reference path="Object" />

declare namespace Format.Utils {
    /**
     * Creates a new object that is a shallow or deep copy of the current instance.
     * @param T The type of the cloned object.
     * @param object The object to clone.
     * @param deep A flag specifying whether the result should be a deep copy or not.
     */
    function clone<T>(object: T, deep?: boolean): T;

    /**
     * Creates a new data object that is a deep data copy of the current instance.
     *
     * Non-data property values (functions or undefined) are **NOT** copied. In arrays any non-copy value is left as `null` so as to preserve the original indexing.
     * @param T The type of the cloned object.
     * @param object The data object to clone.
     */
    function fastClone<T>(object: T): T;
}

namespace Format.Utils {

    /* tslint:disable:no-shadowed-variable */// TSLint #500

    /** @private */
    let createCloneFunction = (cloneFunc: (object: Object, deep?: boolean, isArray?: boolean) => Object) =>
        (object: Object, deep?: boolean): Object => {

            let isArray = Array.isArray(object);
            if (isArray || isObject(object)) {
                return cloneFunc(object, deep, isArray);
            }
            else if (isType("Date", object)) {
                return new Date((<Date> object).getTime());
            }

            return object;
        };

    /* tslint:enable:no-shadowed-variable */

    Utils.clone = createCloneFunction((object: Object, deep?: boolean, isArray?: boolean): Object =>
        deep ? deepExtend(createExtendObject(object, isArray), object) :
            extend(createExtendObject(object, isArray), object));

    /** @private */
    var createExtendObject = (object: Object, isArray: boolean): Object => isArray ? [] : {};

    Utils.fastClone = createCloneFunction((object: Object): Object => JSON.parse(JSON.stringify(object)));
}
