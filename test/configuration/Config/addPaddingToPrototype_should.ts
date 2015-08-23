/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/configuration/Config" />

namespace Format.Config {

    describe("Config addPaddingToPrototype", () => {

        it("should not define 'padLeft' or 'padRight' callable from a string instance by default", () => {
            expect("string".padLeft).toBeUndefined();
            expect("string".padRight).toBeUndefined();
        });

        it("should define 'padLeft' and 'padRight' callable from a string instance once used", () => {

            Format.Config.addPaddingToPrototype();

            expect("string".padLeft).toBeDefined();
            expect("string".padRight).toBeDefined();

            expect("123".padLeft(5, "0")).toBe("00123");
            expect("123".padRight(4)).toBe("123 ");
        });

        it("should remove 'padLeft' and 'padRight' callable from a string instance after Format.Config.removePaddingFromPrototype() is used", () => {

            Format.Config
                .addPaddingToPrototype()
                .removePaddingFromPrototype();

            expect("string".padLeft).toBeUndefined();
            expect("string".padRight).toBeUndefined();
        });

        afterEach(() => {
            Format.Config.removePaddingFromPrototype();
        });
    });
}
