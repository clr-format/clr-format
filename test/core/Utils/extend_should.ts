/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Lazy" />
/// <reference path="../../../src/core/Utils/Object" />
/// <reference path="../../../src/core/Utils/Function" />
/// <reference path="../../../src/core/Utils/Polyfill" />

/* tslint:disable:no-string-literal */

namespace Format.Utils {

    describe("Utils extend/deepExtend", () => {

        let supportsDOM = () => typeof window !== "undefined";

        let getEmpty = (): Indexable<Indexable<Indexable<Object>>> => { return {}; };

        let func = () => "";

        it("should extend target objects like jQuery.extend", () => {

            var settings: Indexable<Object> = { "xnumber1": 5, "xnumber2": 7, "xstring1": "peter", "xstring2": "pan" },
                options = { "xnumber2": 1, "xstring2": "x", "xxx": "newstring" },
                optionsCopy = { "xnumber2": 1, "xstring2": "x", "xxx": "newstring" },
                merged = { "xnumber1": 5, "xnumber2": 1, "xstring1": "peter", "xstring2": "x", "xxx": "newstring" },
                deep1: Indexable<Object> = { "foo": { "bar": true } },
                arr = [1, 2, 3], nestedarray = { "arr": arr },
                optionsWithLength = { "foo": { "length": -1 } },
                optionsWithDate = { "foo": { "date": new Date() } },
                customObject = new Lazy(Function.getEmpty()),
                optionsWithCustomObject: Indexable<Object> = { "foo": { "object": customObject } },
                CustomNumber = Number, target = getEmpty(),
                recursive = { foo: target, bar: 5 },
                defaults = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
                defaultsCopy = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
                options1 = { xnumber2: 1, xstring2: "x" },
                options1Copy = { xnumber2: 1, xstring2: "x" },
                options2 = { xstring2: "xx", xxx: "newstringx" },
                options2Copy = { xstring2: "xx", xxx: "newstringx" },
                merged2 = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "xx", xxx: "newstringx" };

            expect(extend(settings, options)).toEqual(merged);
            expect(options).toEqual(optionsCopy);
            expect(extend(settings, null, options)).toEqual(merged);
            expect(options).toEqual(optionsCopy);
            expect(Polyfill.isArray(deepExtend({ "arr": getEmpty() }, nestedarray)["arr"])).toBe(true);
            expect(isObject(deepExtend({ "arr": arr }, { "arr": getEmpty() })["arr"])).toBe(true);
            expect(deepExtend(getEmpty(), nestedarray)["arr"]).not.toBe(arr);
            expect(deepExtend(getEmpty(), nestedarray)["arr"]).toEqual(arr);
            expect(parseInt(<any> deepExtend({ "foo": 4 }, { "foo": new CustomNumber(5) }).foo, 10)).toBe(5);
            expect(deepExtend(target, recursive)).toEqual({ bar: 5 });
            expect(deepExtend({ foo: [] }, { foo: [0] }).foo.length).toBe(1);
            expect(typeof deepExtend({ foo: "1,2,3" }, { foo: [1, 2, 3] }).foo).not.toBe("string");
            expect(deepExtend({ foo: "bar" }, { foo: null }).foo).toBeDefined();
            expect(deepExtend({ foo: <any> null }, { foo: "notnull" }).foo).toBe("notnull");
            expect((<any> extend(func, { key: "value" })).key).toBe("value");
            expect(extend(getEmpty(), defaults, options1, options2)).toEqual(merged2);
            expect(defaults).toEqual(defaultsCopy);
            expect(options1).toEqual(options1Copy);
            expect(options2).toEqual(options2Copy);
            expect(deepExtend(getEmpty(), optionsWithCustomObject)["foo"]["object"]).toEqual(jasmine.objectContaining(customObject));
            expect(deepExtend(getEmpty(), optionsWithCustomObject)["foo"]["object"]).toEqual(jasmine.objectContaining(Lazy.prototype));
            expect(deepExtend(getEmpty(), optionsWithCustomObject)["foo"]["object"]["getValue"]).toBeDefined();
            expect(deepExtend(getEmpty(), optionsWithLength)["foo"]).toEqual(optionsWithLength["foo"]);
            expect(deepExtend(getEmpty(), optionsWithDate)["foo"]).toEqual(optionsWithDate["foo"]);
            expect(extend(getEmpty(), options, { "xnumber0": null })["xnumber0"]).toBeNull();
            expect(extend(getEmpty(), options, { "xnumber2": null })["xnumber2"]).toBeNull();
            expect(extend(getEmpty(), options, { "xnumber2": undefined })["xnumber2"]).toBe(options["xnumber2"]);

            if (supportsDOM()) {
                let deep2 = { "foo": { "baz": true }, "foo2": document },
                    deepmerged = { "foo": { "bar": true, "baz": true }, "foo2": document },
                    deep2copy = { "foo": { "baz": true }, "foo2": document };

                deepExtend(deep1, deep2);
                expect(deep1["foo"]).toEqual(deepmerged["foo"]);
                expect(deep2["foo"]).toEqual(deep2copy["foo"]);
                expect(deep1["foo2"]).toBe(document);
            }
        });

        it("should ignore cyclic structures when deep merging", () => {

            var cyclic = { a: "normal", b: {} };
            cyclic.b = cyclic;

            expect(deepExtend({}, cyclic)).toEqual({ a: "normal", b: cyclic });
        });

        it("should throw an ArgumentError when target is not an extensible object instance or no objects were given", () => {

            expect(() => extend(undefined, {})).toThrowError(Errors.ArgumentError);
            expect(() => extend(null, {})).toThrowError(Errors.ArgumentError);
            expect(() => extend(0, {})).toThrowError(Errors.ArgumentError);
            expect(() => extend("", {})).toThrowError(Errors.ArgumentError);

            expect(() => extend.call(undefined, {})).toThrowError(Errors.ArgumentError);
        });
    });
}
