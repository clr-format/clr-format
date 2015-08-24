/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Format" />
/// <reference path="../../../src/core/Utils/Object" />

/// <reference path="../../../src/configuration/Config" />

namespace Format.Config {

    describe("Config addUtilsToGlobals", () => {

        let expectUndefinedMethods = () => {

            expect(Object.isType).toBeUndefined();
            expect(Object.getType).toBeUndefined();
            expect(Object.isObject).toBeUndefined();
            expect(Object.getTypeString).toBeUndefined();
            expect(Object.mapValuesAsKeys).toBeUndefined();

            expect(Function.getName).toBeUndefined();
            expect(Function.memoize).toBeUndefined();
            expect(Function.getEmpty).toBeUndefined();

            expect(Number.isInteger).not.toBe(Utils.Numeric.isInteger);
            expect(Number.isCounting).toBeUndefined();
            expect(Number.isWhole).toBeUndefined();
            expect(Number.isEven).toBeUndefined();

            expect(Array.takeWhile).toBeUndefined();
            expect(String.isNullOrWhitespace).toBeUndefined();
        };

        it("should not define utils callable from global objects by default", () => {
            expectUndefinedMethods();
        });

        it("should define utils callable from global objects once used", () => {

            Format.Config.addUtilsToGlobals();

            expect(Object.isType).toBe(Utils.isType);
            expect(Object.getType).toBe(Utils.getType);
            expect(Object.isObject).toBe(Utils.isObject);
            expect(Object.getTypeString).toBe(Utils.getTypeString);
            expect(Object.mapValuesAsKeys).toBe(Utils.mapValuesAsKeys);

            expect(Function.getName).toBe(Utils.Function.getName);
            expect(Function.memoize).toBe(Utils.Function.memoize);
            expect(Function.getEmpty).toBe(Utils.Function.getEmpty);

            expect(Number.isInteger).toBeDefined();
            expect(Number.isCounting).toBe(Utils.Numeric.isCounting);
            expect(Number.isWhole).toBe(Utils.Numeric.isWhole);
            expect(Number.isEven).toBe(Utils.Numeric.isEven);

            expect(Array.takeWhile).toBe(Utils.Enumerable.takeWhile);
            expect(String.isNullOrWhitespace).toBe(Utils.Text.isNullOrWhitespace);
        });

        it("should remove utils callable from global objects after Format.Config.removeFormatFromPrototype() is used", () => {

            Format.Config
                .addUtilsToGlobals()
                .removeUtilGlobals();

            expectUndefinedMethods();
        });

        it("should clean up changes and throw an ArgumentError when any of the functions that are added already exist on a target object", () => {

            Function.getName = () => "";

            expect(() => Format.Config.addUtilsToGlobals()).toThrowError(Errors.ArgumentError);
            delete Function.getName;
            expectUndefinedMethods();
        });

        afterEach(() => {
            delete Function.getName;
            Format.Config.removeUtilGlobals();
        });
    });
}
