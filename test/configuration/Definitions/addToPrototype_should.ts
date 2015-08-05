/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Format" />
/// <reference path="../../../src/configuration/Config" />

module Format.Config {

    describe("Config addToPrototype", () => {

        let bareFunction = (source: number, value: number) => source + value,
            removeFromPrototype = (hostObject: any, name: string) => delete hostObject.prototype[name];

        it("should wrap bare functions to be callable from instances of the host object", () => {

            let numberInstance: any = 1;

            Format.Config.addToPrototype(bareFunction, Number, "add");
            Format.Config.addToPrototype(Utils.Function.getName, Function);

            expect(numberInstance.add(1)).toBe(2);
            expect(Utils.Function.getEmpty.getName()).toBe("getEmpty");
        });

        it("should throw an ArgumentError when adding an anonymous bare function without specifying a 'name' argument for the wrapped prototype method", () => {
            expect(() => Format.Config.addToPrototype(bareFunction, Number)).toThrowError(Errors.ArgumentError);
        });

        afterEach(() => {
            removeFromPrototype(Number, "add");
            removeFromPrototype(Function, "getName");
        });
    });
}
