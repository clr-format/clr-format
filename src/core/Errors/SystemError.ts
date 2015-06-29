/// <reference path="../../use-strict" />

/// <reference path="ErrorClass" />
/// <reference path="../Utils/Function" />

module Format.Errors {

    Format.Errors.ErrorClass = Error;

    /** Base system error class that allows for syntactic C#-like Error class extension. */
    export class SystemError extends ErrorClass {

        public stack: string;
        public source: string;
        public innerError: Error;
        private childStackCount: number;

        /**
         * Creates an abstract system error object derived from the built-in Error type that decorates it with error-specific properties.
         * @param message Optional human-readable description of the error.
         * @param innerError Optional error to rethrow while also preserving its stack trace.
         */
        constructor(message?: string, innerError?: Error) {
            super(message);
            this.message = message;
            this.innerError = innerError;
            this.name = Utils.Function.getName(this.constructor);
            this.stack = this.getStack(innerError);
            this.source = this.getActualSource(this.stack);
        }

        protected incrementStackCount() {
            this.childStackCount = (this.childStackCount || 0) + 1;
        }

        private getStack(innerError: Error): string {
            return innerError ?
                (<SystemError>innerError).stack :
                this.stack || this.getActualStack();
        }

        private getActualSource(stack: string): string {
            if (stack) {
                let stackArray = stack.split("\n");
                return stackArray[this.getStackStart(stackArray)].trim();
            }
        }

        private getActualStack(): string {

            let builtInStack: string = this.getNativeStack();
            if (builtInStack) {
                let stackArray = builtInStack.split("\n");

                // Removes the function nestings caused by the constructor and instance methods
                // This means it also removes more lines for children that call incrementStackCount
                stackArray.splice(this.getStackStart(stackArray), this.getStackCount());

                return stackArray.join("\n");
            }
        }

        private getNativeStack(): string {
            try {
                throw new Error();
            }
            catch (error) {
                return (<SystemError>error).stack;
            }
        }

        private getStackStart(stackArray: string[]): number {
            return stackArray[0] === "Error" ? 1 : 0;
        }

        private getStackCount(): number {

            let nativeStackOffset = 4;

            if (this.childStackCount) {
                return nativeStackOffset + this.childStackCount;
            }

            return nativeStackOffset;
        }
    }
}
