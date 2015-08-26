/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Format" />
/// <reference path="../../../src/core/Utils/Object" />

/// <reference path="../../../src/configuration/Config" />

namespace Format.Config {

    describe("Config addUtilsToGlobals", () => {

        let expectUndefinedMethods = () => {

            expect(Object.isType).toBeUndefined();
            expect(Object.getType).toBeUndefined();
            expect(Object.isEmpty).toBeUndefined();
            expect(Object.isObject).toBeUndefined();
            expect(Object.mapValuesAsKeys).toBeUndefined();
            expect(Object.deepExtend).toBeUndefined();
            expect(Object.extend).toBeUndefined();
            expect(Object.clone).toBeUndefined();
            expect(Object.fastClone).toBeUndefined();

            expect(Function.getName).toBeUndefined();
            expect(Function.memoize).toBeUndefined();
            expect(Function.getEmpty).toBeUndefined();
            expect(Function.getReturnName).toBeUndefined();

            expect(Number.isInteger).not.toBe(Utils.Numeric.isInteger);
            expect(Number.isCounting).toBeUndefined();
            expect(Number.isWhole).toBeUndefined();
            expect(Number.isEven).toBeUndefined();
            expect(Number.toFixedMinMax).toBeUndefined();
            expect(Number.toPrecisionMinMax).toBeUndefined();
            expect(Number.toExponentialMinMax).toBeUndefined();

            expect(Array.takeWhile).toBeUndefined();

            expect(String.insert).toBeUndefined();
            expect(String.isNullOrWhitespace).toBeUndefined();
        };

        it("should not define utils callable from global objects by default", () => {
            expectUndefinedMethods();
        });

        it("should define utils callable from global objects once used (may be called multiple times but at least once)", () => {

            Format.Config.addUtilsToGlobals();

            expect(Object.isType).toBe(Utils.isType);
            expect(Object.getType).toBe(Utils.getType);
            expect(Object.isEmpty).toBe(Utils.isEmpty);
            expect(Object.isObject).toBe(Utils.isObject);
            expect(Object.mapValuesAsKeys).toBe(Utils.mapValuesAsKeys);
            expect(Object.deepExtend).toBe(Utils.deepExtend);
            expect(Object.extend).toBe(Utils.extend);
            expect(Object.clone).toBe(Utils.clone);
            expect(Object.fastClone).toBe(Utils.fastClone);

            expect(Format.Config.addUtilsToGlobals).not.toThrowError(Errors.InvalidOperationError);

            expect(Function.getName).toBe(Utils.Function.getName);
            expect(Function.memoize).toBe(Utils.Function.memoize);
            expect(Function.getEmpty).toBe(Utils.Function.getEmpty);
            expect(Function.getReturnName).toBe(Utils.Function.getReturnName);

            expect(Number.isInteger).toBeDefined();
            expect(Number.isCounting).toBe(Utils.Numeric.isCounting);
            expect(Number.isWhole).toBe(Utils.Numeric.isWhole);
            expect(Number.isEven).toBe(Utils.Numeric.isEven);
            expect(Number.toFixedMinMax).toBe(Utils.Numeric.toFixedMinMax);
            expect(Number.toPrecisionMinMax).toBe(Utils.Numeric.toPrecisionMinMax);
            expect(Number.toExponentialMinMax).toBe(Utils.Numeric.toExponentialMinMax);

            expect(Array.takeWhile).toBe(Utils.Enumerable.takeWhile);

            expect(String.insert).toBe(Utils.Text.insert);
            expect(String.isNullOrWhitespace).toBe(Utils.Text.isNullOrWhitespace);
        });

        it("should remove utils callable from global objects after Format.Config.removeFormatFromPrototype() is used", () => {

            Format.Config
                .addUtilsToGlobals()
                .removeUtilGlobals();

            expectUndefinedMethods();
        });

        it("should clean up changes and throw an InvalidOperationError when any of the functions that are added already exist on a target object", () => {

            Function.getName = () => "";

            expect(() => Format.Config.addUtilsToGlobals()).toThrowError(Errors.InvalidOperationError);
            delete Function.getName;
            expectUndefinedMethods();
        });

        afterEach(() => {
            delete Function.getName;
            Format.Config.removeUtilGlobals();
        });
    });
}
