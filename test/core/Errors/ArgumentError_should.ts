/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Errors/ArgumentError" />

module Format.Errors {

    describe("ArgumentError constructor", () => {

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
