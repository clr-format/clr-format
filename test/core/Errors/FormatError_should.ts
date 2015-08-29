/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Errors/FormatError" />

namespace Format.Errors {

    describe("FormatError constructor", () => {

        it("should initialize the 'name' property to be the same as its type name", () => {

            expect(new FormatError().name)
                .toBe("FormatError");
        });

        it("should be interceptable from all superclasses in its chain", () => {

            let expectation = expect(() => {
                throw new FormatError();
            });

            expectation.toThrowError(FormatError);
            expectation.toThrowError(SystemError);
            expectation.toThrowError(Error);
        });
    });
}
