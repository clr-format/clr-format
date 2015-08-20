/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/configuration/Config" />

module Format.Config {

    describe("Config enableMemoization", () => {

        it("should not memoize inner functions by default", () => {
            Format.getBracesCount("{{0}}", "}");
            expect(Format.getBracesCount.cache).toBeUndefined();
        });

        it("should memoize inner functions once used", () => {

            let originalFunction = Format.getBracesCount;

            Format.Config.enableMemoization();
            Format.getBracesCount("{{0}}", "{");

            let memoizedFunction = Format.getBracesCount;
            Format.Config.enableMemoization();

            expect(Format.getBracesCount).toBe(memoizedFunction);
            expect(Format.getBracesCount).not.toBe(originalFunction);
            expect(Format.getBracesCount.cache).toEqual({ "[\"{{0}}\",\"{\"]": 2 });
        });

        it("should restore original inner functions after Format.Config.disableMemoization() is used", () => {

            let originalFunction = Format.getBracesCount;

            Format.Config.enableMemoization();
            Format.getBracesCount("{0}", "{");

            let memoizedFunction = Format.getBracesCount;

            Format.Config.disableMemoization();

            expect(Format.getBracesCount).toBe(originalFunction);
            expect(Format.getBracesCount).not.toBe(memoizedFunction);
            expect(memoizedFunction.cache).toBeUndefined();
        });

        afterEach(() => {
            Format.Config.disableMemoization();
        });
    });
}
