/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Clone" />

namespace Format.Utils {

    describe("Utils clone", () => {

        let object = {
            a: 1,
            b: "b",
            c: {
                d: {}
            },
            e: (): string => "",
            f: [5, "f"]
        };

        let array = [object.a, object.b, object.c, object.e, object.f];

        it("should create a shallow copy object when only an object is passed as an argument", () => {

            let shallowObjectClone = clone(object);

            expect(shallowObjectClone).not.toBe(object);
            expect(shallowObjectClone).toEqual(object);
            expect(shallowObjectClone.c).toBe(object.c);
            expect(shallowObjectClone.c.d).toBe(object.c.d);
            expect(shallowObjectClone.e).toBe(object.e);
            expect(shallowObjectClone.f).toBe(object.f);

            let shallowArrayClone = clone(array);

            expect(shallowArrayClone).not.toBe(array);
            expect(shallowArrayClone).toEqual(array);
            expect(shallowArrayClone[2]).toBe(object.c);
            expect((<{ d: {} }> shallowArrayClone[2]).d).toBe(object.c.d);
            expect(shallowArrayClone[3]).toBe(object.e);
            expect(shallowArrayClone[4]).toBe(object.f);
        });

        it("should create a deep copy object when the deep flag is true", () => {

            let deepObjectClone = clone(object, true);

            expect(deepObjectClone).not.toBe(object);
            expect(deepObjectClone).toEqual(object);
            expect(deepObjectClone.c).not.toBe(object.c);
            expect(deepObjectClone.c.d).not.toBe(object.c.d);
            expect(deepObjectClone.e).toBe(object.e);
            expect(deepObjectClone.f).not.toBe(object.f);
            expect(deepObjectClone.f.length).toBe(object.f.length);

            let deepArrayClone = clone(array, true);

            expect(deepArrayClone).not.toBe(array);
            expect(deepArrayClone).toEqual(array);
            expect(deepArrayClone[2]).not.toBe(object.c);
            expect((<{ d: {} }> deepArrayClone[2]).d).not.toBe(object.c.d);
            expect(deepArrayClone[3]).toBe(object.e);
            expect(deepArrayClone[4]).not.toBe(object.f);
            expect((<(string|number)[]> deepArrayClone[4]).length).toBe(object.f.length);
        });

        it("should return a similar instance when a non-object is passed as an argument", () => {

            expect(clone(1)).toBe(1);
            expect(clone("a")).toBe("a");
            expect(clone(/a/)).toEqual(/a/);
            expect(clone(null)).toBeNull();
            expect(clone(undefined)).toBeUndefined();
            expect(clone(NaN)).toBeNaN();
            expect(clone(Infinity)).toBe(Infinity);

            let date = new Date(), dateClone = clone(date);
            expect(dateClone).not.toBe(date);
            expect(dateClone).toEqual(date);
        });
    });
}
