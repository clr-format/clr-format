/// <reference path="../use-strict" />

/// <reference path="API/Array" />
/// <reference path="API/Object" />
/// <reference path="API/String" />
/// <reference path="API/Number" />
/// <reference path="API/Function" />

if (typeof Format === "undefined" || typeof Format.innerFormat === "undefined") {
    throw new Error("Configuration module loaded before main module");
}
