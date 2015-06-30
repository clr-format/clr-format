/* tslint:disable:no-unused-variable */
declare module Format.Errors {
    /** TypeScript compiler-friendly class definition which allows for syntactic Error class extension. */
    class ErrorClass implements Error {
        public name: string;
        public message: string;
        constructor(message?: string);
    }
}
