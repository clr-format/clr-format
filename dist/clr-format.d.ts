declare module Format.Globalization {
    /** Defines a method that supports custom formatting of the value of an object. */
    interface CustomFormatter {
        /**
         * Converts the value of a specified object to an equivalent string representation using specified format and culture-specific formatting information.
         * @param formatString A format string containing formatting specifications.
         * @param value An object to format.
         */
        format(formatString: string, value: Object): string;
    }
}
declare module Format.Globalization {
    /** Provides a mechanism for retrieving an object to control formatting. */
    interface FormatProvider {
        /**
         * Returns an object that provides formatting services for the specified type.
         * @param type A string indicating the type of the custom formatter to return, i.e. '[object Array]'.
         */
        getFormatter(type: string): CustomFormatter;
    }
}
interface StringConstructor {
    /**
     * Converts the value of objects to strings based on the formats specified and inserts them into another string.
     * @param format A composite format string. See: https://msdn.microsoft.com/en-us/library/txafckwd.aspx
     * @param args A list of arguments that contains zero or more objects to format.
     */
    format(format: string, ...args: Object[]): string;
    /**
     * Converts the value of objects to strings based on the formats specified and inserts them into another string.
     * @param provider An object that supplies culture-specific formatting information.
     * @param format A composite format string. See: https://msdn.microsoft.com/en-us/library/txafckwd.aspx
     * @param args A list of arguments that contains zero or more objects to format.
     */
    format(provider: Format.Globalization.FormatProvider, format: string, ...args: Object[]): string;
}
declare module Format.Utils.Function {
    /**
     * Returns the name of a function or "anonymous" for lambda functions.
     * @param func A functional object.
     */
    function getName(func: Function): string;
    /** Returns an empty parameterless function. Useful as the default for optional callback arguments instead of creating new anonymous empty functions. */
    function getEmpty<T>(): <T>() => T;
}
declare module Format.Errors {
    /** TypeScript compiler-friendly class definition which allows for syntactic Error class extension. */
    class ErrorClass implements Error {
        name: string;
        message: string;
        constructor(message?: string);
    }
}
declare module Format.Errors {
    /** Base system error class that allows for syntactic C#-like Error class extension. */
    class SystemError extends ErrorClass {
        stack: string;
        source: string;
        innerError: Error;
        private childStackCount;
        /**
         * Creates an abstract system error object derived from the built-in Error type that decorates it with error-specific properties.
         * @param message Optional human-readable description of the error.
         * @param innerError Optional error to rethrow while also preserving its stack trace.
         */
        constructor(message?: string, innerError?: Error);
        protected incrementStackCount(): void;
        private getStack(innerError);
        private getActualSource(stack);
        private getActualStack();
        private getNativeStack();
        private getStackStart(stackArray);
        private getStackCount();
    }
}
declare module Format.Errors {
    /** An error that is thrown when one of the arguments provided to a function is not valid. */
    class ArgumentError extends SystemError {
        /**
         * Creates an error that is thrown when one of the arguments provided to a function is not valid.
         * See: https://msdn.microsoft.com/en-us/library/system.argumentexception.aspx
         * @param message Optional human-readable description of the error.
         * @param innerError Optional error to rethrow while also preserving its stack trace.
         */
        constructor(message?: string, innerError?: Error);
    }
}
declare module Format.Errors {
    /** An error that is thrown when an undefined (or null) argument is passed to a method that does not accept it as a valid argument. */
    class ArgumentNullError extends ArgumentError {
        /**
         * Creates an error that is thrown when an undefined (or null) argument is passed to a method that does not accept it as a valid argument.
         * See: https://msdn.microsoft.com/en-us/library/system.argumentnullexception.aspx
         * @param argumentName The name of the argument that caused the error.
         */
        constructor(argumentName: string);
    }
}
declare module Format.Utils.Enumerable {
    /**
     * Returns elements from a sequence as long as the specified condition is true.
     * @param array An array instance.
     * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
     */
    let takeWhile: <T>(array: T[], predicate: (item: T, index?: number) => boolean) => T[];
}
declare module Format.Utils {
    /** Returns the actual type of an object (unlike typeof), i.e. [object Date]. */
    function getType(object: Object): string;
    /**
     * Returns true if an object's type matches the given type argument.
     * @param type A string indicating the expected type of the object, i.e. 'Array', 'RegExp', etc.
     * @param object The object to check for matching type.
     */
    function is(type: string, object: Object): boolean;
    /** Returns true if an object is a pure object instance, false if it's not. */
    function isObject(object: Object): boolean;
}
declare module Format.Utils.Padding {
    /** Defines possible options for a string padding operation. */
    interface Options {
        /** The number of characters in the resulting string, equal to the number of original characters plus any additional padding characters. */
        totalWidth: number;
        /** Optional padding character. Defaults to space (' '). */
        paddingChar?: string;
        /** Optional position of the padded characters relative to the original string. Defaults to Right. */
        direction?: Direction;
    }
    /** An enumeration describing the possible positioning strategies of padded characters relative to the string that's being padded. */
    enum Direction {
        /** Position padding characters before the string. */
        Left = 1,
        /** Position padding characters after the string. */
        Right = 2,
        /** Position padding characters before and after the string, while keeping it centered. */
        Both = 3,
    }
    /**
     * Returns a new string of a specified length in which the beginning and/or ending of the current string is padded with spaces or with a specified character.
     * @param value The string to apply padding to.
     * @param options A Padding.Options object defining the desired output.
     */
    function pad(value: string, options: Options): string;
}
declare module Format.Errors {
    /** An error that is thrown when the format of an argument is invalid, or when a composite format string is not well formed. */
    class FormatError extends SystemError {
        /**
         * Creates an error that is thrown when the format of an argument is invalid, or when a composite format string is not well formed.
         * See: https://msdn.microsoft.com/en-us/library/system.formatexception.aspx
         * @param message Optional human-readable description of the error.
         * @param innerError Optional error to rethrow while also preserving its stack trace.
         */
        constructor(message?: string, innerError?: Error);
    }
}
declare module Format {
    /**
     * Converts the value of objects to strings based on the formats specified and inserts them into another string.
     * @param provider An object that supplies culture-specific formatting information.
     * @param format A composite format string. See: https://msdn.microsoft.com/en-us/library/txafckwd.aspx
     * @param args An array of arguments that contains zero or more objects to format.
     */
    function innerFormat(provider: Globalization.FormatProvider, format: string, args: Object[]): string;
}
