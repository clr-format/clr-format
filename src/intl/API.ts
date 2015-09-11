/// <reference path="../use-strict" />

if (typeof Format === "undefined" || typeof Format.innerFormat === "undefined") {
    throw new Error("Intl module loaded before main module");
}

if (typeof Intl === "undefined" || typeof Intl.NumberFormat === "undefined") {
    throw new Format.Errors.InvalidOperationError("Intl.NumberFormat is not supported by the executing context");
}
