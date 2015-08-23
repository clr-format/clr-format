/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/configuration/Utils/Function" />

namespace Format.Utils {

    describe("Function memoize", () => {

        let fibonacci: jasmine.Spy;
        let mutliVarFunc: Function;

        beforeEach(() => {

            fibonacci = jasmine.createSpy(
                "fibonacci",
                (n: number): number => {
                    return n >= 2 ? fibonacci(n - 1) + fibonacci(n - 2) : 1;
                }).and.callThrough();

            mutliVarFunc = (arg1: number, arg2: string, arg3: Object[]): Object[] => [arg1, arg2, arg3];
        });

        it("should call the inner (non-memoized) fibonacci function only N + 1 times for the Nth fibonacci number and return the same result", () => {

            let n = 5, innerFunc = fibonacci;

            fibonacci = Function.memoize(fibonacci);

            let result = fibonacci(n);

            expect(innerFunc.calls.count()).toBe(n + 1);
            expect(innerFunc(n)).toBe(result);
        });

        it("should persist results for multi-argument function in its 'cache' property", () => {

            let args = [1, "2", [3]];

            mutliVarFunc = Function.memoize(mutliVarFunc);

            mutliVarFunc.apply(undefined, args);

            expect(mutliVarFunc.cache[JSON.stringify(args)]).toEqual(args);
        });

        it("should make use of a custom key resolver", () => {

            let args = [1, "2", [3]],
                joinResolver = (value: Object[]): string => value.join("_");

            mutliVarFunc = Function.memoize(mutliVarFunc, joinResolver);

            mutliVarFunc.apply(undefined, args);

            expect(mutliVarFunc.cache[joinResolver(args)]).toEqual(args);
        });

        it("should throw a TypeError when a non-functional argument is passed", () => {
            expect(() => Function.memoize(undefined)).toThrowError(TypeError);
            expect(() => Function.memoize(null)).toThrowError(TypeError);
        });
    });
}
