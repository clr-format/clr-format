/// <reference path="../../typings/jasmine/jasmine" />

/// <reference path="../../../src/core/Format" />
/// <reference path="../../../src/configuration/Config" />

namespace Format.Config {

    describe("Config addToStringOverload", () => {

        var num = 12, date = new Date(),
            dateString = date.toString(),
            numberToStringProto = Number.prototype.toString,
            dateToStringProto = Date.prototype.toString;

        it("should not overload 'toString' methods of Number or Date instances by default", () => {

            expect(num.toString).toBe(numberToStringProto);
            expect(date.toString).toBe(dateToStringProto);

            expect(num.toString("2")).toBe("1100");
        });

        it("should overload 'toString' methods of Number or Date instances once used", () => {

            Format.Config.addToStringOverload();

            expect(num.toString).not.toBe(numberToStringProto);
            expect(num.toString()).toBe("12");
            expect(num.toString(2)).toBe("1100");
            expect(num.toString("2")).toBe("2"); // String.format("{0:2}", 12)
            expect(num.toString(Globalization.CultureInfo.InvariantCulture)).toBe("12");
            expect(num.toString("#.00", Globalization.CultureInfo.InvariantCulture)).toBe("12.00");

            expect(date.toString).not.toBe(dateToStringProto);
            expect(date.toString()).toBe(dateString);
            expect(date.toString("MMMM dd, yyyy")).toBe(dateString);
            expect(date.toString(Globalization.CultureInfo.InvariantCulture)).toBe(dateString);
            expect(date.toString("MMMM dd, yyyy", Globalization.CultureInfo.InvariantCulture)).toBe(dateString);
        });

        it("should remove 'format' callable from a string instance after Format.Config.removeToStringOverload() is used", () => {

            Format.Config
                .addToStringOverload()
                .removeToStringOverload();

            expect(num.toString).toBe(numberToStringProto);
            expect(date.toString).toBe(dateToStringProto);
        });

        afterEach(() => {
            Format.Config.removeToStringOverload();
        });
    });
}
