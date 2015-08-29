/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Errors/ArgumentError" />

namespace Format.Errors {

    describe("ArgumentError constructor", () => {

        it("should initialize the 'name' property to be the same as its type name", () => {

            expect(new ArgumentError().name)
                .toBe("ArgumentError");
        });

        it("should be interceptable from all superclasses in its chain", () => {

            let expectation = expect(() => {
                throw new ArgumentError();
            });

            expectation.toThrowError(ArgumentError);
            expectation.toThrowError(SystemError);
            expectation.toThrowError(Error);
        });
    });
}
