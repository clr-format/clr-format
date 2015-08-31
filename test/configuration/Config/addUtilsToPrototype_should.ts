/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Format" />
/// <reference path="../../../src/configuration/Config" />

namespace Format.Config {

    describe("Config addUtilsToPrototype", () => {

        let array = [1], num = 12,
            text = "text",
            textAccessor: any = text,
            func = () => true,
            funcAccessor: any = func,
            noIndexOf = !array.indexOf;

        let expectUndefinedMethods = () => {

            expect(array.takeWhile).toBeUndefined();
            expect(array.compact).toBeUndefined();

            expect(func.getName).toBeUndefined();
            expect(func.memoize).toBeUndefined();
            expect(func.getReturnName).toBeUndefined();

            expect(num.isInteger).toBeUndefined();
            expect(num.isCounting).toBeUndefined();
            expect(num.isWhole).toBeUndefined();
            expect(num.isEven).toBeUndefined();
            expect(num.toFixedMinMax).toBeUndefined();
            expect(num.toPrecisionMinMax).toBeUndefined();
            expect(num.toExponentialMinMax).toBeUndefined();

            expect(text.insert).toBeUndefined();
        };

        it("should not define utils callable from instance objects by default", () => {
            expectUndefinedMethods();
        });

        it("should define utils callable from instance objects once used (may be called multiple times but at least once)", () => {

            Format.Config.addUtilsToPrototype();

            expect(array.takeWhile(() => true)).toEqual(array);
            expect(array.compact()).toBe(array);
            if (noIndexOf) {
                expect(array.indexOf).toBeUndefined();
            }

            expect(func.getName()).toBe("");
            expect(func.memoize()).toBeDefined();
            expect(func.getReturnName()).toBe("true");
            expect(funcAccessor.getEmpty).toBeUndefined();

            expect(Format.Config.addUtilsToPrototype).not.toThrowError(Errors.InvalidOperationError);

            expect(num.isInteger()).toBe(true);
            expect(num.isCounting()).toBe(true);
            expect(num.isWhole()).toBe(true);
            expect(num.isEven()).toBe(true);
            expect(num.toFixedMinMax(0, 0)).toBe("12");
            expect(num.toPrecisionMinMax(1, 1)).toBe("1e+1");
            expect(num.toExponentialMinMax(0, 0)).toBe("1e+1");

            expect(textAccessor.isNullOrWhitespace).toBeUndefined();
            expect(text.insert(2, "test")).toBe("tetestxt");
            expect(text).toBe("text");
        });

        it("should remove utils callable from instance objects after Format.Config.removeUtilsFromPrototype() is used", () => {

            Format.Config
                .addUtilsToPrototype()
                .removeUtilsFromPrototype();

            expectUndefinedMethods();
        });

        it("should clean up changes and throw an InvalidOperationError when any of the functions that are added already exist on a target object", () => {

            Function.prototype.getName = () => "";

            expect(() => Format.Config.addUtilsToPrototype()).toThrowError(Errors.InvalidOperationError);
            delete Function.prototype.getName;
            expectUndefinedMethods();
        });

        afterEach(() => {
            delete Function.prototype.getName;
            Format.Config.removeUtilsFromPrototype();
        });
    });
}
