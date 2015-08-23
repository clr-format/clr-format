/// <reference path="../../use-strict" />

/// <reference path="../Utils/Function" />

/// <reference path="ErrorClass" />

namespace Format.Errors {

    Format.Errors.ErrorClass = Error;

    /** Base system error class that allows for syntactic C#-like Error class extension. */
    export class SystemError extends ErrorClass {

        /** The non-standard stack property of `Error` objects offer a trace of which functions were called, in what order, from which line and file, and with what arguments. */
        public stack: string;

        /** The line from the [[stack]] property from which the error occurred. */
        public source: string;

        /** An inner error which the current error wraps. */
        public innerError: Error;

        /** A helper counter that allows for some degree of standardization of the [[stack]] property. */
        private childStackCount: number;

        /**
         * Creates an abstract system error object derived from the built-in javascript `Error` type and decorates it with additional properties.
         *
         * See: https://msdn.microsoft.com/en-us/library/system.systemexception.aspx
         * @param message A human-readable description of the error.
         * @param innerError An error to wrap while also preserving its stack trace.
         */
        constructor(message?: string, innerError?: Error) {
            super(message);
            this.message = message;
            this.innerError = innerError;
            this.name = Utils.Function.getName(this.constructor);
            this.stack = this.getStack(innerError);
            this.source = this.getActualSource(this.stack);
        }

        /** Increments the [[childStackCount]]. Must be called **before** the base constructor in **all** derived error classes. */
        protected incrementStackCount(): void {
            this.childStackCount = (this.childStackCount || 0) + 1;
        }

        private getStack(innerError: Error): string {
            return innerError ?
                (<SystemError> innerError).stack :
                this.stack || this.getActualStack();
        }

        private getActualSource(stack: string): string {
            if (stack) {
                let stackArray = stack.split("\n");
                return stackArray[this.getStackOmitStart(stackArray)].trim();
            }
        }

        private getActualStack(): string {

            let builtInStack: string = this.getNativeStack();
            if (builtInStack) {
                let stackArray = builtInStack.split("\n");

                // Removes the function nestings caused by the constructor and instance methods
                // This means it also removes more lines for children that call incrementStackCount
                stackArray.splice(this.getStackOmitStart(stackArray), this.getStackOmitCount());

                return stackArray.join("\n");
            }
        }

        private getNativeStack(): string {
            try {
                throw new Error();
            }
            catch (error) {
                return (<SystemError> error).stack;
            }
        }

        private getStackOmitStart(stackArray: string[]): number {
            return stackArray[0] === "Error" ? 1 : 0;
        }

        private getStackOmitCount(): number {

            let nativeStackOffset = 4;

            if (this.childStackCount) {
                return nativeStackOffset + this.childStackCount;
            }

            return nativeStackOffset;
        }
    }
}
