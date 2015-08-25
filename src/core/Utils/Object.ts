/// <reference path="../../use-strict" />

/// <reference path="Harmony" />
/// <reference path="Indexable" />

/// <reference path="../Errors/ArgumentError" />
/// <reference path="../Errors/ArgumentNullError" />

namespace Format.Utils {
    /**
     * Maps the given object's values as keys with their keys as values and returns the extended object.
     *
     * Throws an error if the operation results in key duplication or keys with 'undefined' or 'null' values.
     * @param T The type of indexable object to update.
     * @param object The object to update with the mapped unique values as keys.
     * @returns The same instance that was passed as the object parameter updated with the new unique keys.
     */
    export function mapValuesAsKeys<T extends Indexable<number|string|symbol|RegExp>|string[]>(object: T): T {

        if (object == null) {
            throw new Errors.ArgumentNullError("object");
        }

        if (typeof object === "string") {
            throw new Errors.ArgumentError("Cannot call method 'enumerateValues' on immutable string objects");
        }

        let isArray = Array.isArray(object);

        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                addValueAsKey(object, key, isArray);
            }
        }

        return object;
    }

    /** @private */
    var addValueAsKey = (object: Indexable<number|string|symbol|RegExp>|string[], key: string, isArray: boolean) => {

        let value = (<Indexable<number|string|symbol|RegExp>> object)[key];
        if (value == null) {
            throw new Errors.ArgumentError("Cannot call method 'enumerateValues' on objects that contain undefined or null values");
        }

        if (object.hasOwnProperty(<string> value)) {
            throw new Errors.ArgumentError(`Cannot enumerate value '${value}' because such a key already exists in ${object}`);
        }

        (<Indexable<number|string|symbol|RegExp>> object)[resolveValueAsKey(value)] = isArray ? +key : key;
    };

    /** @private */
    var resolveValueAsKey = (value: number|string|symbol|RegExp): string|symbol =>
        typeof value !== "symbol" ?
            value + "" :
            value;
}
