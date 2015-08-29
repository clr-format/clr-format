/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Function" />

namespace Format.Utils {

    describe("Function getName", () => {

        function func(): string { return ""; }

        it("should return the name of a named function", () => {

            expect(Function.getName(func)).toBe("func");
            expect(Function.getName(String)).toBe("String");
        });

        it("should return \"\" for lambda/anonymous functions", () => {

            expect(Function.getName(Function.getEmpty())).toBe("");
        });

        it("should throw a TypeError when a non-functional argument is passed", () => {
            expect(() => Function.getName(undefined)).toThrowError(TypeError);
            expect(() => Function.getName(null)).toThrowError(TypeError);
        });
    });
}
