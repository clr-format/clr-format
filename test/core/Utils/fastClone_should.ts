/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Object" />

namespace Format.Utils {

    describe("Utils fastClone", () => {

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

        it("should create a deep copy of the object's data", () => {

            let fastObjectClone = fastClone(object);

            expect(fastObjectClone).not.toBe(object);
            expect(jasmine.objectContaining(fastObjectClone)).toEqual(object);
            expect(fastObjectClone.c).not.toBe(object.c);
            expect(fastObjectClone.c.d).not.toBe(object.c.d);
            expect(fastObjectClone.e).toBeUndefined();
            expect(fastObjectClone.f).not.toBe(object.f);
        });

        it("should create a deep copy of the array's data", () => {

            let fastArrayClone = fastClone(array);

            expect(fastArrayClone).not.toBe(array);
            expect(fastArrayClone.length).toBe(array.length);
            expect(fastArrayClone[2]).not.toBe(object.c);
            expect((<{ d: {} }> fastArrayClone[2]).d).not.toBe(object.c.d);
            expect(fastArrayClone[3]).toBeNull();
            expect(fastArrayClone[4]).not.toBe(object.f);
            expect((<(string|number)[]> fastArrayClone[4]).length).toBe(object.f.length);
        });

        it("should return a similar instance when a non-object is passed as an argument", () => {

            expect(fastClone(1)).toBe(1);
            expect(fastClone("a")).toBe("a");
            expect(fastClone(/a/)).toEqual(/a/);
            expect(fastClone(null)).toBeNull();
            expect(fastClone(undefined)).toBeUndefined();
            expect(fastClone(NaN)).toBeNaN();
            expect(fastClone(Infinity)).toBe(Infinity);

            let date = new Date(), dateClone = fastClone(date);
            expect(dateClone).not.toBe(date);
            expect(dateClone).toEqual(date);
        });
    });
}
