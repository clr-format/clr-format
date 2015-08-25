/// <reference path="../../use-strict" />

/// <reference path="SystemError" />

namespace Format.Errors {
    /**
     * An error that is thrown when a requested method or operation is not implemented.
     *
     * See: https://msdn.microsoft.com/en-us/library/system.notimplementedexception.aspx
     */
    export class NotImplementedError extends SystemError {
        /**
         * Creates an error that is thrown when a requested method or operation is not implemented.
         * @param methodName The name of the method that caused the error.
         */
        constructor(methodName: string) {
            super.incrementStackCount();
            super(`Method '${methodName}' is not implemented or abstract`);
        }
    }
}
