declare module Format.Globalization {
    /**
     * Defines a method that supports custom formatting of the value of an object.
     *
     * See: https://msdn.microsoft.com/en-us/library/system.icustomformatter.aspx
     */
    interface CustomFormatter {
        /**
         * Converts the value of a specified object to an equivalent string representation using specified format and culture-specific formatting information.
         * @param format A format string containing formatting specifications.
         * @param value An object to format.
         */
        format(format: string, value: Object): string;
    }
}
declare module Format.Globalization {
    /**
     * Provides a mechanism for retrieving an object to control formatting.
     *
     * See: https://msdn.microsoft.com/en-us/library/system.iformatprovider.aspx
     */
    interface FormatProvider {
        /**
         * Returns an object that provides formatting services for the specified type.
         * @param type A string indicating the type of the custom formatter to return, i.e. `"[object Array]"`.
         */
        getFormatter(type: string): CustomFormatter;
    }
}
/**
 * Extends the built-in javascript String object's static API.
 *
 * The [[StringConstructor.format]] method exposes the core logic.
 */
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
/** A [[Format.Utils]] sub-module containing methods related to functional operations. */
declare module Format.Utils.Function {
    /**
     * Returns the name of a function.
     * @param func A functional object.
     * @returns The name of a function or `"anonymous"` for lambda functions.
     */
    function getName(func: Function): string;
    /**
     * Returns an empty parameterless function which returns `undefined`. Useful for defaulting optional callback arguments instead of creating new anonymous empty functions.
     * @param T The return type of the empty callback.
     */
    function getEmpty<T>(): <T>() => T;
}
/** A core sub-module which contains C#-like error objects. */
declare module Format.Errors {
    /** TypeScript compiler-friendly class definition which allows for syntactic Error class extension. */
    class ErrorClass implements Error {
        /** A name for the type of error. */
        name: string;
        /** A human-readable description of the error. */
        message: string;
        /**
         * The built-in javascript `Error` constructor that creates an error object.
         * @param message A human-readable description of the error.
         */
        constructor(message?: string);
    }
}
declare module Format.Errors {
    /** Base system error class that allows for syntactic C#-like Error class extension. */
    class SystemError extends ErrorClass {
        /** The non-standard stack property of `Error` objects offer a trace of which functions were called, in what order, from which line and file, and with what arguments. */
        stack: string;
        /** The line from the [[stack]] property from which the error occurred. */
        source: string;
        /** An inner error which the current error wraps. */
        innerError: Error;
        /** A helper counter that allows for some degree of standardization of the [[stack]] property. */
        private childStackCount;
        /**
         * Creates an abstract system error object derived from the built-in javascript `Error` type and decorates it with additional properties.
         *
         * See: https://msdn.microsoft.com/en-us/library/system.systemexception.aspx
         * @param message A human-readable description of the error.
         * @param innerError An error to wrap while also preserving its stack trace.
         */
        constructor(message?: string, innerError?: Error);
        /** Increments the [[childStackCount]]. Must be called **before** the base constructor in **all** derived error classes. */
        protected incrementStackCount(): void;
        private getStack(innerError);
        private getActualSource(stack);
        private getActualStack();
        private getNativeStack();
        private getStackOmitStart(stackArray);
        private getStackOmitCount();
    }
}
declare module Format.Errors {
    /** An error that is thrown when one of the arguments provided to a function is not valid. */
    class ArgumentError extends SystemError {
        /**
         * Creates an error that is thrown when one of the arguments provided to a function is not valid.
         *
         * See: https://msdn.microsoft.com/en-us/library/system.argumentexception.aspx
         * @param message A human-readable description of the error.
         * @param innerError An error to rethrow while also preserving its stack trace.
         */
        constructor(message?: string, innerError?: Error);
    }
}
/** A core sub-module which contains utility methods for general purpose operations and more specialized utility sub-modules. */
declare module Format.Utils {
    /** Returns the actual type of an object (unlike `typeof`), i.e. `"[object Date]"`. */
    function getType(object: Object): string;
    /**
     * Returns `true` if an object's type matches the given type argument.
     * @param type A string indicating the expected type of the object, i.e. `"Array"`, `"RegExp"`, etc.
     * @param object The object to check for matching type.
     */
    function isType(type: string, object: Object): boolean;
    /** Returns `true` if an object is a pure object instance. */
    function isObject(object: Object): boolean;
}
declare module Format.Errors {
    /** An error that is thrown when an `undefined` or `null` argument is passed to a method that does not accept it as a valid argument. */
    class ArgumentNullError extends ArgumentError {
        /**
         * Creates an error that is thrown when an undefined (or null) argument is passed to a method that does not accept it as a valid argument.
         *
         * See: https://msdn.microsoft.com/en-us/library/system.argumentnullexception.aspx
         * @param argumentName The name of the argument that caused the error.
         */
        constructor(argumentName: string);
    }
}
/** A [[Format.Utils]] sub-module exposing the [[pad]] method for string padding operations. */
declare module Format.Utils.Padding {
    /** Defines possible options for a string padding operation. */
    interface Options {
        /** The number of characters in the resulting string, equal to the number of original characters plus any additional padding characters. */
        totalWidth: number;
        /** The padding character. Defaults to `' '`. */
        paddingChar?: string;
        /** The position of the padded characters relative to the original string. Defaults to [[Direction.Right]]. */
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
     * @param options An [[Options]] object that defines the desired output.
     */
    function pad(value: string, options: Options): string;
}
/** A [[Format.Utils]] sub-module containing methods related to enumeration operations. */
declare module Format.Utils.Enumerable {
    /**
     * Returns elements from a sequence as long as the specified condition is `true`.
     *
     * Must call [[Format.Config.addUtilsToGlobals]] to be defined.
     * @param T The type of elements in the array.
     * @param array An array instance.
     * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
     * @param predicate.item A source element that is tested for a condition.
     * @param predicate.index The index of the source element.
     * @returns A new array instance containing only items for which the predicate function returned `true`.
     */
    function takeWhile<T>(array: T[], predicate: (item: T, index?: number) => boolean): T[];
}
declare module Format.Errors {
    /** An error that is thrown when the format of an argument is invalid, or when a composite format string is not well formed. */
    class FormatError extends SystemError {
        /**
         * Creates an error that is thrown when the format of an argument is invalid, or when a composite format string is not well formed.
         *
         * See: https://msdn.microsoft.com/en-us/library/system.formatexception.aspx
         * @param message A human-readable description of the error.
         * @param innerError An error to rethrow while also preserving its stack trace.
         */
        constructor(message?: string, innerError?: Error);
    }
}
/**
 * The CLR Format main module and namespace.
 *
 * The [[StringConstructor.format]] method exposes the core API of the project. Optional configuration methods are stored in the [[Format.Config]] sub-module.
 */
declare module Format {
    /**
     * Converts the value of objects to strings based on the formats specified and inserts them into another string.
     *
     * This internal version does not support arbitrary argument overloads.
     * @param provider An object that supplies culture-specific formatting information.
     * @param format A composite format string. See: https://msdn.microsoft.com/en-us/library/txafckwd.aspx
     * @param args An array of arguments that contains zero or more objects to format.
     */
    function innerFormat(provider: Globalization.FormatProvider, format: string, args: Object[]): string;
    var getBracesCount: (formatItem: string, braceChar: string) => number;
}
