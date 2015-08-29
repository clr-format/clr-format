/// <reference path="../../use-strict" />

/// <reference path="SystemError" />

namespace Format.Errors {
    /**
     * An error that is thrown when a method call is invalid for the object's current state.
     *
     * See: https://msdn.microsoft.com/en-us/library/system.invalidoperationexception.aspx
     */
    export class InvalidOperationError extends SystemError {
        /**
         * Creates an error  that is thrown when a method call is invalid for the object's current state.
         * @param message A human-readable description of the error.
         * @param innerError An error to rethrow while also preserving its stack trace.
         */
        constructor(message?: string, innerError?: SystemError) {
            super(message, innerError);
            this.name = "InvalidOperationError";
        }
    }
}
