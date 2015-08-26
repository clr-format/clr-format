/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Lazy" />

namespace Format.Utils {

    describe("Lazy", () => {

        let lazy: Lazy<Object>;
        let lazyValue: Object;
        let lazyAccessor: any;
        let lazyFactory: jasmine.Spy;

        beforeEach(() => {
            lazyValue = undefined;
            lazyFactory = jasmine.createSpy("lazyFactory", () => lazyValue).and.callThrough();
            lazy = lazyAccessor = new Lazy(lazyFactory);
        });

        it("constructor should initialize the value's factory function without calling it", () => {
            expect(lazyAccessor.valueFactory).toBe(lazyFactory);
            expect(lazyFactory.calls.count()).toBe(0);
        });

        it("constructor should throw an ArgumentNullError for a factory with an undefined value", () => {
            expect(() => new Lazy(undefined)).toThrowError(Errors.ArgumentNullError);
            expect(() => new Lazy(null)).toThrowError(Errors.ArgumentNullError);
        });

        it("fromConstructor should initialize the value's constructor", () => {

            lazy = lazyAccessor = Lazy.fromConstructor(Object);

            expect(lazyAccessor.valueConstructor).toBe(Object);
            expect(lazyAccessor.valueFactory).toBe(Function.getEmpty());
        });

        it("fromConstructor should throw an ArgumentNullError for a constructor with an undefined value", () => {
            expect(() => Lazy.fromConstructor(undefined)).toThrowError(Errors.ArgumentNullError);
            expect(() => Lazy.fromConstructor(null)).toThrowError(Errors.ArgumentNullError);
        });

        it("Value should return the same value and trigger only one call to its factory function", () => {
            expect(lazy.getValue()).toBe(lazyValue);
            expect(lazy.getValue()).toBe(lazy.getValue());
            expect(lazyFactory.calls.count()).toBe(1);
        });

        it("IsValueCreated should return a value appropriate for the internal state", () => {
            expect(lazy.isValueCreated()).toBe(false);
            expect(lazy.getValue()).toBe(lazyValue);
            expect(lazy.isValueCreated()).toBe(true);
        });

        it("Value should throw an InvalidOperationError when accessed and IsValueCreated should retain its return value when the factory function throws an error", () => {

            lazy = new Lazy((): Object => {
                throw new Error("Fault Test");
            });

            expect(lazy.isValueCreated()).toBe(false);
            expect(() => lazy.getValue()).toThrowError(Errors.InvalidOperationError);
            expect(lazy.isValueCreated()).toBe(true);
        });
    });
}
