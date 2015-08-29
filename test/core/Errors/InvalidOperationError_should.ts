/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Errors/InvalidOperationError" />

namespace Format.Errors {

    describe("InvalidOperationError constructor", () => {

        it("should initialize the 'name' property to be the same as its type name", () => {

            expect(new InvalidOperationError().name)
                .toBe("InvalidOperationError");
        });

        it("should be interceptable from all superclasses in its chain", () => {

            let expectation = expect(() => {
                throw new InvalidOperationError();
            });

            expectation.toThrowError(InvalidOperationError);
            expectation.toThrowError(SystemError);
            expectation.toThrowError(Error);
        });
    });
}
