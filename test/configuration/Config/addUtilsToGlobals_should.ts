/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Format" />
/// <reference path="../../../src/configuration/Config" />

module Format.Config {

    describe("Config addUtilsToGlobals", () => {

        let expectUndefinedMethods = () => {
            expect(Object.isType).toBeUndefined();
            expect(Object.getType).toBeUndefined();
            expect(Object.isObject).toBeUndefined();
            expect(Array.takeWhile).toBeUndefined();
            expect(Function.getName).toBeUndefined();
            expect(Function.memoize).toBeUndefined();
            expect(Function.getEmpty).toBeUndefined();
        };

        it("should not define utils callable from global objects by default", () => {
            expectUndefinedMethods();
        });

        it("should define utils callable from global objects once used", () => {

            Format.Config.addUtilsToGlobals();

            expect(Object.isType).toBe(Utils.isType);
            expect(Object.getType).toBe(Utils.getType);
            expect(Object.isObject).toBe(Utils.isObject);
            expect(Array.takeWhile).toBe(Utils.Enumerable.takeWhile);
            expect(Function.getName).toBe(Utils.Function.getName);
            expect(Function.memoize).toBe(Utils.Function.memoize);
            expect(Function.getEmpty).toBe(Utils.Function.getEmpty);
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
