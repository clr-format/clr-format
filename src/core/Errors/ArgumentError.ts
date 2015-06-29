/// <reference path="../../use-strict" />

/// <reference path="SystemError" />

module Format.Errors {
    /** An error that is thrown when one of the arguments provided to a function is not valid. */
    export class ArgumentError extends SystemError {
        /**
         * Creates an error that is thrown when one of the arguments provided to a function is not valid.
         * See: https://msdn.microsoft.com/en-us/library/system.argumentexception.aspx
         * @param message Optional human-readable description of the error.
         * @param innerError Optional error to rethrow while also preserving its stack trace.
         */
        constructor(message?: string, innerError?: Error) {
            super.incrementStackCount();
            super(message, innerError);
        }
    }
}
