/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Function" />

module Format.Utils {

    describe("Function getName", () => {

        it("should return the name of a constructor function", () => {

            expect(Function.getName(String)).toBe("String");
        });

        it("should return 'anonymous' for lambda functions", () => {

            expect(Function.getName(Function.getEmpty())).toBe("anonymous");
        });

        it("should throw a TypeError when a non-functional argument is passed", () => {
            expect(() => Function.getName(undefined)).toThrowError(TypeError);
            expect(() => Function.getName(null)).toThrowError(TypeError);
        });
    });
}
