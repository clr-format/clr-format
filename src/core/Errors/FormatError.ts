/// <reference path="../../use-strict" />

/// <reference path="SystemError" />

module Format.Errors {
    /** An error that is thrown when the format of an argument is invalid, or when a composite format string is not well formed. */
    export class FormatError extends SystemError {
        /**
         * Creates an error that is thrown when the format of an argument is invalid, or when a composite format string is not well formed.
         *
         * See: https://msdn.microsoft.com/en-us/library/system.formatexception.aspx
         * @param message A human-readable description of the error.
         * @param innerError An error to rethrow while also preserving its stack trace.
         */
        constructor(message?: string, innerError?: Error) {
            super.incrementStackCount();
            super(message, innerError);
        }
    }
}
