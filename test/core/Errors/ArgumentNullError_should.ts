/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Errors/ArgumentNullError" />

namespace Format.Errors {

    describe("ArgumentNullError constructor", () => {

        it("should initialize the 'name' property to be the same as its type name", () => {

            expect(new ArgumentNullError("").name)
                .toBe("ArgumentNullError");
        });

        it("should initialize the 'message' property according to the supplied 'argumentName'", () => {

            expect(new ArgumentNullError("arg").message)
                .toBe("Argument 'arg' cannot be undefined or null");
        });

        it("should be interceptable from all superclasses in its chain", () => {

            let expectation = expect(() => {
                throw new ArgumentNullError(undefined);
            });

            expectation.toThrowError(ArgumentNullError);
            expectation.toThrowError(ArgumentError);
            expectation.toThrowError(SystemError);
            expectation.toThrowError(Error);
        });
    });
}
