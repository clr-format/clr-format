/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Format" />
/// <reference path="../../../src/configuration/Config" />

namespace Format.Config {

    describe("Config addUtilsToPrototype", () => {

        let array = [1], num = 12,
            func = () => true,
            funcAccessor: any = func;

        let expectUndefinedMethods = () => {

            expect(array.takeWhile).toBeUndefined();

            expect(func.getName).toBeUndefined();
            expect(func.memoize).toBeUndefined();

            expect(num.isInteger).toBeUndefined();
            expect(num.isCounting).toBeUndefined();
            expect(num.isWhole).toBeUndefined();
            expect(num.isEven).toBeUndefined();
        };

        it("should not define utils callable from instance objects by default", () => {
            expectUndefinedMethods();
        });

        it("should define utils callable from instance objects once used", () => {

            Format.Config.addUtilsToPrototype();

            expect(array.takeWhile(() => true)).toEqual(array);

            expect(func.getName()).toBe("anonymous");
            expect(func.memoize()).toBeDefined();
            expect(funcAccessor.getEmpty).toBeUndefined();

            expect(num.isInteger()).toBe(true);
            expect(num.isCounting()).toBe(true);
            expect(num.isWhole()).toBe(true);
            expect(num.isEven()).toBe(true);
        });

        it("should remove utils callable from instance objects after Format.Config.removeUtilsFromPrototype() is used", () => {

            Format.Config
                .addUtilsToPrototype()
                .removeUtilsFromPrototype();

            expectUndefinedMethods();
        });

        it("should clean up changes and throw an ArgumentError when any of the functions that are added already exist on a target object", () => {

            Function.prototype.getName = () => "";

            expect(() => Format.Config.addUtilsToPrototype()).toThrowError(Errors.ArgumentError);
            delete Function.prototype.getName;
            expectUndefinedMethods();
        });

        afterEach(() => {
            delete Function.prototype.getName;
            Format.Config.removeUtilsFromPrototype();
        });
    });
}
