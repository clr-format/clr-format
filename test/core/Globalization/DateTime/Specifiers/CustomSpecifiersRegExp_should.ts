/// <reference path="../../../../typings/jasmine/jasmine" />

/// <reference path="../../../../../src/core/Globalization/DateTime/Specifiers/Custom" />

namespace Format.Globalization.DateTime.Specifiers {

    describe("CustomSpecifiersRegExp", () => {

        it("should match the expected value", () => {
            expect(CustomSpecifiersRegExp).toEqual(new RegExp("'[^']*?'|\"[^\"]*?\"|\\%.|\\\\.|K|:|\/|'|\"|[dfFghHmMstyz]+", "g"));
        });
    });
}
