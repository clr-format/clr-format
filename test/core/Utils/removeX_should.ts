/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Remove" />

namespace Format.Utils {

    describe("Utils removeUndefined/removeEmpty/removeFalsy", () => {

        let func = () => "";

        let getObject = (makeCircular?: boolean) => {

            let object = {
                a: 0,
                b: "b",
                c: {
                    a: 0,
                    b: "b",
                    c: {},
                    d: <Object> undefined,
                    e: func,
                    f: [5, "f"],
                    g: <Object> null,
                    h: ""
                },
                d: <Object> undefined,
                e: func,
                f: [5, "f"],
                g: <Object> null,
                h: ""
            };

            if (makeCircular) {
                object.c.c = object;
            }

            return object;
        };

        let getArray = (makeCircular?: boolean) => {
            let object = getObject(makeCircular),
                array = [
                    object.a,
                    object.b,
                    object.c,
                    object.d,
                    object.e,
                    object.f,
                    object.g,
                    object.h
                ];

            if (makeCircular) {
                array.push(array);
            }

            return array;
        };

        it("removeUndefined should remove all properties with null or undefined values", () => {

            let object = getObject(), array = getArray();

            expect(removeUndefined(object)).toBe(object);
            expect(removeUndefined(array)).toBe(array);
            expect(removeUndefined(getObject())).toEqual({
                a: 0,
                b: "b",
                c: {
                    a: 0,
                    b: "b",
                    c: {},
                    d: undefined,
                    e: func,
                    f: [5, "f"],
                    g: null,
                    h: ""
                },
                e: func,
                f: [5, "f"],
                h: ""
            });
            expect(removeUndefined(getArray())).toEqual([
                object.a,
                object.b,
                object.c,
                object.e,
                object.f,
                object.h
            ]);
        });

        it("removeUndefined should recursivelly remove all properties with null or undefined values", () => {

            let object = getObject(true), array = getArray(true),
                expectedObject = {
                    a: 0,
                    b: "b",
                    c: {
                        a: 0,
                        b: "b",
                        c: {},
                        e: func,
                        f: [5, "f"],
                        h: ""
                    },
                    e: func,
                    f: [5, "f"],
                    h: ""
                },
                expectedArray: Object[] = [
                    expectedObject.a,
                    expectedObject.b,
                    expectedObject.c,
                    expectedObject.e,
                    expectedObject.f,
                    expectedObject.h
                ];

            expectedObject.c.c = expectedObject;
            expectedArray.push(expectedArray);

            expect(removeUndefined(object, true)).toBe(object);
            expect(removeUndefined(array, true)).toBe(array);
            expect(removeUndefined(getObject(true), true)).toEqual(expectedObject);
            expect(removeUndefined(getArray(true), true)).toEqual(expectedArray);
        });

        it("removeEmpty should remove all properties with null, undefined or empty string values", () => {

            let object = getObject(), array = getArray();
            expect(removeEmpty(object)).toBe(object);
            expect(removeEmpty(array)).toBe(array);
            expect(removeEmpty(getObject())).toEqual({
                a: 0,
                b: "b",
                c: {
                    a: 0,
                    b: "b",
                    c: {},
                    d: undefined,
                    e: func,
                    f: [5, "f"],
                    g: null,
                    h: ""
                },
                e: func,
                f: [5, "f"]
            });
            expect(removeEmpty(getArray())).toEqual([
                object.a,
                object.b,
                object.c,
                object.e,
                object.f
            ]);
        });

        it("removeEmpty should recursivelly remove all properties with null, undefined or empty string values", () => {

            let object = getObject(true), array = getArray(true),
                expectedObject = {
                    a: 0,
                    b: "b",
                    c: {
                        a: 0,
                        b: "b",
                        c: {},
                        e: func,
                        f: [5, "f"]
                    },
                    e: func,
                    f: [5, "f"]
                },
                expectedArray: Object[] = [
                    expectedObject.a,
                    expectedObject.b,
                    expectedObject.c,
                    expectedObject.e,
                    expectedObject.f
                ];

            expectedObject.c.c = expectedObject;
            expectedArray.push(expectedArray);

            expect(removeEmpty(object, true)).toBe(object);
            expect(removeEmpty(array, true)).toBe(array);
            expect(removeEmpty(getObject(true), true)).toEqual(expectedObject);
            expect(removeEmpty(getArray(true), true)).toEqual(expectedArray);
        });

        it("removeFalsy should remove all properties with null, undefined or empty string values", () => {

            let object = getObject(), array = getArray();
            expect(removeFalsy(object)).toBe(object);
            expect(removeFalsy(array)).toBe(array);
            expect(removeFalsy(getObject())).toEqual({
                b: "b",
                c: {
                    a: 0,
                    b: "b",
                    c: {},
                    d: <Object> undefined,
                    e: func,
                    f: [5, "f"],
                    g: <Object> null,
                    h: ""
                },
                e: func,
                f: [5, "f"]
            });
            expect(removeFalsy(getArray())).toEqual([
                object.b,
                object.c,
                object.e,
                object.f
            ]);
        });

        it("removeFalsy should remove all properties with null, undefined or empty string values", () => {

            let object = getObject(true), array = getArray(true),
                expectedObject = {
                    b: "b",
                    c: {
                        b: "b",
                        c: {},
                        e: func,
                        f: [5, "f"]
                    },
                    e: func,
                    f: [5, "f"]
                },
                expectedArray: Object[] = [
                    expectedObject.b,
                    expectedObject.c,
                    expectedObject.e,
                    expectedObject.f
                ];

            expectedObject.c.c = expectedObject;
            expectedArray.push(expectedArray);

            expect(removeFalsy(object, true)).toBe(object);
            expect(removeFalsy(array, true)).toBe(array);
            expect(removeFalsy(getObject(true), true)).toEqual(expectedObject);
            expect(removeFalsy(getArray(true), true)).toEqual(expectedArray);
        });
    });
}
