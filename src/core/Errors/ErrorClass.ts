/* tslint:disable:no-unused-variable */

/** A core namespace which contains C#-like error objects. */
declare namespace Format.Errors {

    /** TypeScript compiler-friendly class definition which allows for syntactic Error class extension. */
    class ErrorClass implements Error {

        /** A name for the type of error. */
        public name: string;

        /** A human-readable description of the error. */
        public message: string;

        /**
         * The built-in javascript `Error` constructor that creates an error object.
         * @param message A human-readable description of the error.
         */
        constructor(message?: string);
    }
}
