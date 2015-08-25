/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Errors/NotImplementedError" />

namespace Format.Errors {

    describe("NotImplementedError constructor", () => {

        it("should initialize the 'message' property according to the supplied 'methodName'", () => {

            expect(new NotImplementedError('func').message)
                .toBe("Method 'func' is not implemented or abstract");
        });

        it("should be interceptable from all superclasses in its chain", () => {

            let expectation = expect(() => {
                throw new NotImplementedError();
            });

            expectation.toThrowError(NotImplementedError);
            expectation.toThrowError(SystemError);
            expectation.toThrowError(Error);
        });
    });
}
