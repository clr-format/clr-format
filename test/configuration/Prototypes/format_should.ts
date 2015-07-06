/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/configuration/Config" />

module Format.Prototypes {

    describe("Prototypes format", () => {

        it("should not be callable from a string instance by default", () => {
            expect("string".format).toBeUndefined();
        });

        it("should be callable from a string instance after Format.Config.addFormatToPrototype() is used", () => {

            Format.Config.addFormatToPrototype();

            expect("string".format).toBeDefined();
            expect("{0}".format(1)).toBe("1");
            expect("{0}".format({ getFormatter: "not-a-function" })).toBe("{\"getFormatter\":\"not-a-function\"}");
        });

        it("should not be callable from a string instance after Format.Config.removeFormatFromPrototype() is used", () => {

            Format.Config
                .addFormatToPrototype()
                .removeFormatFromPrototype();

            expect("string".format).toBeUndefined();
        });

        it("should throw a FormatError for a format provider which does not return a CustomFormatter instance", () => {

            Format.Config.addFormatToPrototype();

            expect(() => "{0}".format({ getFormatter: Utils.Function.getEmpty<Globalization.CustomFormatter>() }, undefined)).toThrowError(Errors.FormatError);
        });

        afterAll(() => {
            Format.Config.removeFormatFromPrototype();
        });
    });
}
