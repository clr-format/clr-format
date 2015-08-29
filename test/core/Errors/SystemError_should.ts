/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Errors/SystemError" />

namespace Format.Errors {

    describe("SystemError constructor", () => {

        let contextFunction = () => {
            throw new SystemError();
        };

        it("should initialize the 'name' property to be the same as its type name", () => {

            expect(new SystemError().name)
                .toBe("SystemError");
        });

        it("should initialize the 'message' property according to the supplied value", () => {

            let message = "Cannot assert test without a proper message",
                error = new SystemError(message);

            expect(error.message).toBe(message);
        });

        it("should preserve the 'stack' property according to the context it's rethrowning", () => {

            try {
                contextFunction();
            }
            catch (innerError) {
                let error = new SystemError(innerError.message, innerError);
                expect(error.stack).toBe(innerError.stack);
            }
        });

        it("should be interceptable from all superclasses in its chain", () => {

            let expectation = expect(() => {
                throw new SystemError(undefined);
            });

            expectation.toThrowError(SystemError);
            expectation.toThrowError(Error);
        });
    });
}
