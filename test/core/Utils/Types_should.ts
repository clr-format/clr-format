/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Utils/Types" />

namespace Format.Utils {

    describe("Types", () => {

        it("should be initialized with the expected values", () => {
            expect(Types.Array).toBe("[object Array]");
            expect(Types.Boolean).toBe("[object Boolean]");
            expect(Types.Function).toBe("[object Function]");
            expect(Types.Date).toBe("[object Date]");
            expect(Types.Null).toBe("[object Null]");
            expect(Types.Number).toBe("[object Number]");
            expect(Types.Object).toBe("[object Object]");
            expect(Types.RegExp).toBe("[object RegExp]");
            expect(Types.String).toBe("[object String]");
            expect(Types.Undefined).toBe("[object Undefined]");
        });
    });
}
