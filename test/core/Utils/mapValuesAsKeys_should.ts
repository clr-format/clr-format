/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Object" />

namespace Format.Utils {

    describe("Utils mapValuesAsKeys", () => {

        let supportsSymbol = () => typeof Symbol !== "undefined";

        it("should enumerate an object's values as new keys", () => {

            let object: Indexable<string|number|symbol|RegExp> = { "a": 1, "b": "2", "c": /3/ },
                result: Indexable<Object> = {
                    "a": 1, "b": "2", "c": /3/,
                    "1": "a", "2": "b", "/3/": "c"
                };

            if (supportsSymbol()) {
                let symbol = Symbol(4);
                object["d"] = result["d"] = symbol;
                result[symbol] = "d";
            }

            expect(mapValuesAsKeys(object)).toEqual(result);
        });

        it("should enumerate an array's string values as new keys with their respective index as a value", () => {

            let result: any = ["a", "b", "c"];
            result.a = 0;
            result.b = 1;
            result.c = 2;

            expect(mapValuesAsKeys(["a", "b", "c"])).toEqual(result);
        });

        it("should throw an ArgumentUndefinedError for an object with an undefined value", () => {
            expect(() => mapValuesAsKeys(undefined)).toThrowError(Errors.ArgumentNullError);
            expect(() => mapValuesAsKeys(null)).toThrowError(Errors.ArgumentNullError);
        });

        it("should throw an ArgumentError when the object is a string value", () => {
            expect(() => mapValuesAsKeys(<any>"abc")).toThrowError(Errors.ArgumentError);
        });

        it("should throw an ArgumentError when the enumerated object has unsupported value types", () => {
            expect(() => mapValuesAsKeys({ "undefined": undefined })).toThrowError(Errors.ArgumentError);
            expect(() => mapValuesAsKeys({ "null": null })).toThrowError(Errors.ArgumentError);
        });

        it("should throw an ArgumentError when the enumerated object has duplicate values and/or keys", () => {
            expect(() => mapValuesAsKeys({ "a": "1", "b": "1" })).toThrowError(Errors.ArgumentError);
            expect(() => mapValuesAsKeys({ "a": "b", "b": "c" })).toThrowError(Errors.ArgumentError);
        });
    });
}
