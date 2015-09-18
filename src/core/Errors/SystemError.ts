/// <reference path="../../use-strict" />

/// <reference path="../Utils/Function" />

/// <reference path="ErrorClass" />

namespace Format.Errors {

    Format.Errors.ErrorClass = Error;

    /**
     * Base system error class that allows for syntactic C#-like `Error` class extension.
     *
     * See: https://msdn.microsoft.com/library/system.systemexception.aspx
     */
    export class SystemError extends ErrorClass {

        /** The non-standard stack property of `Error` objects offer a trace of which functions were called, in what order, from which line and file, and with what arguments. */
        public stack: string;

        /** An inner error which the current error wraps. */
        public innerError: Error;

        /**
         * Creates an abstract system error object derived from the built-in javascript `Error` type and decorates it with additional properties.
         * @param message A human-readable description of the error.
         * @param innerError An error to wrap while also preserving its stack trace.
         */
        constructor(message?: string, innerError?: SystemError) {

            super(message);

            this.name = "SystemError";
            this.message = message;

            if (innerError) {
                this.innerError = innerError;
                this.stack = innerError.stack;
            }
        }
    }
}
