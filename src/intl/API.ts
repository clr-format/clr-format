/// <reference path="../use-strict" />

if (typeof Format === "undefined" || typeof Format.innerFormat === "undefined") {
    throw new Error("Intl module loaded before main module");
}
