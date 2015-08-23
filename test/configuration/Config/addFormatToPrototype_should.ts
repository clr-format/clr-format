/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Format" />
/// <reference path="../../../src/configuration/Config" />

namespace Format.Config {

    describe("Config addFormatToPrototype", () => {

        it("should not define 'format' callable from a string instance by default", () => {
            expect("string".format).toBeUndefined();
        });

        it("should define 'format' callable from a string instance once used", () => {

            Format.Config.addFormatToPrototype();

            expect("string".format).toBeDefined();
            expect("{0}".format(1)).toBe("1");
            expect("{0}".format({ getFormatter: "not-a-function" })).toBe("{\"getFormatter\":\"not-a-function\"}");
        });

        it("should remove 'format' callable from a string instance after Format.Config.removeFormatFromPrototype() is used", () => {

            Format.Config
                .addFormatToPrototype()
                .removeFormatFromPrototype();

            expect("string".format).toBeUndefined();
        });

        it("should throw a FormatError for a format provider which does not return a CustomFormatter instance", () => {

            Format.Config.addFormatToPrototype();

            expect(() => "{0}".format({ getFormatter: Utils.Function.getEmpty<Globalization.CustomFormatter>() }, undefined)).toThrowError(Errors.FormatError);
        });

        afterEach(() => {
            Format.Config.removeFormatFromPrototype();
        });
    });
}
