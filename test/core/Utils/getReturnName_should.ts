/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Function" />

namespace Format.Utils {

    describe("Function getReturnName", () => {

        /* tslint:disable:no-eval */

        let fatArrowExpression = "fatArrow = () => foo.bar.baz";
        let supportsFatArrow = () => {
            try { eval(fatArrowExpression); }
            catch (e) {
                return false;
            }
            return true;
        };

        it("should return the name of the rightmost accessor of the first returned variable", () => {

            expect(Function.getReturnName(String)).toBe(undefined);
            expect(Function.getReturnName((foo: any) => foo)).toBe("foo");
            expect(Function.getReturnName((foo: any) => {
                if (!foo) { return 1234567; }
                return foo.Bar;
            })).toBe("Bar");
            expect(Function.getReturnName((foo: any) => {
                if (foo.Bar) { return foo.Bar.baz; }
                return foo.bar;
            })).toBe("baz");

            if (supportsFatArrow()) {
                let fatArrow: Function;
                eval(fatArrowExpression);
                expect(Function.getReturnName(fatArrow)).toBe("baz");
            }
        });

        /* tslint:enable:no-eval */
        /* tslint:disable:no-empty */

        it("should return undefined if no return exists or does not match a variable", () => {

            expect(Function.getReturnName(() => { })).toBeUndefined();
            expect(Function.getReturnName(() => 12345)).toBeUndefined();
            expect(Function.getReturnName(() => { return; })).toBeUndefined();
            expect(Function.getReturnName(() => { return "abc"; })).toBeUndefined();
            expect(Function.getReturnName(() => { return /abc/; })).toBeUndefined();
        });

        /* tslint:enable:no-empty */

        it("should throw a TypeError when a non-functional argument is passed", () => {
            expect(() => Function.getReturnName(undefined)).toThrowError(TypeError);
            expect(() => Function.getReturnName(null)).toThrowError(TypeError);
        });
    });
}
