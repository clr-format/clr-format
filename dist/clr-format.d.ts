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
/**
 * A core namespace which contains classes that define culture-related information, including language, country/region, calendars in use, format patterns for dates, currency, and numbers,
 * and sort order for strings. These classes are useful for writing globalized (internationalized) applications.
 *
 * See: https://msdn.microsoft.com/en-us/library/system.globalization.aspx
 */
declare module Format.Globalization {
    /**
     * Provides a mechanism for retrieving an object to control formatting.
     *
     * See: https://msdn.microsoft.com/en-us/library/system.iformatprovider.aspx
     */
    interface FormatProvider {
        /**
         * Returns an object that provides formatting services for the specified type.
         * @param type A string indicating the type of the custom formatter to return, see [[Utils.Types]].
         */
        getFormatter(type: string): CustomFormatter;
    }
}
/** The [[StringConstructor.format]] method exposes the core logic of the project. */
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
     * @returns The name of a function or `""` for lambda functions.
     */
    function getName(func: Function): string;
    /**
     * Returns the rightmost accessor's name of the function's first returned variable.
     *
     * For example a return expression like `return this.field;` will yield `"field"` as a value.
     * @param func A functional object.
     * @return The text of the last literal contained in the first return expression of the function.
     */
    function getReturnName(func: Function): string;
    /**
     * Returns an empty parameterless function which returns `undefined`. Useful for defaulting optional callback arguments instead of creating new anonymous empty functions.
     * @param T The return type of the empty callback.
     */
    function getEmpty<T>(): () => T;
}
/** A core namespace which contains C#-like error objects. */
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
    /**
     * Base system error class that allows for syntactic C#-like `Error` class extension.
     *
     * See: https://msdn.microsoft.com/en-us/library/system.systemexception.aspx
     */
    class SystemError extends ErrorClass {
        /** The non-standard stack property of `Error` objects offer a trace of which functions were called, in what order, from which line and file, and with what arguments. */
        stack: string;
        /** An inner error which the current error wraps. */
        innerError: Error;
        /**
         * Creates an abstract system error object derived from the built-in javascript `Error` type and decorates it with additional properties.
         * @param message A human-readable description of the error.
         * @param innerError An error to wrap while also preserving its stack trace.
         */
        constructor(message?: string, innerError?: SystemError);
    }
}
declare module Format.Errors {
    /**
     * An error that is thrown when one of the arguments provided to a function is not valid.
     *
     * See: https://msdn.microsoft.com/en-us/library/system.argumentexception.aspx
     */
    class ArgumentError extends SystemError {
        /**
         * Creates an error that is thrown when one of the arguments provided to a function is not valid.
         * @param message A human-readable description of the error.
         * @param innerError An error to rethrow while also preserving its stack trace.
         */
        constructor(message?: string, innerError?: SystemError);
    }
}
declare module Format.Errors {
    /**
     * An error that is thrown when an `undefined` or `null` argument is passed to a method that does not accept it as a valid argument.
     *
     * See: https://msdn.microsoft.com/en-us/library/system.argumentnullexception.aspx
     */
    class ArgumentNullError extends ArgumentError {
        /**
         * Creates an error that is thrown when an undefined (or null) argument is passed to a method that does not accept it as a valid argument.
         * @param argumentName The name of the argument that caused the error.
         */
        constructor(argumentName: string);
    }
}
/** A [[Format.Utils]] sub-module containing methods related to text operations. */
declare module Format.Utils.Text {
    /**
     * Indicates whether the specified string is `undefined`, `null`, `""`, or consists only of white-space characters.
     * @param value The string to test.
     * @returns `true` if the value parameter is `undefined`, `null`, `""`, or if value consists exclusively of white-space characters.
     */
    function isNullOrWhitespace(value: string): boolean;
    /**
     * Returns a new string in which a specified string is inserted at a specified index position in the value instance.
     * @param value The string into which to insert.
     * @param startIndex The zero-based index position of the insertion.
     * @param insertValue The string to insert.
     * @returns A new string that is equivalent to the value instance, but with insertValue inserted at position startIndex.
     */
    function insert(value: string, startIndex: number, insertValue: string): string;
}
/**
 * Compiler friendly interface that allows objects to have a typed string indexer and not have to resort to the `suppressImplicitAnyIndexErrors` compiler option.
 * @param T The type of object returned by the indexer.
 */
interface Indexable<T> {
    [key: string]: T;
}
declare module Format.Utils {
    /**
     * Returns `true` if an object's type matches the given type argument.
     * @param type A string indicating the expected type of the object, i.e. `"Array"`, `"RegExp"`, etc.
     * @param object The object to check for matching type.
     */
    function isType(type: string, object: Object): boolean;
    /**
     * Returns the actual type of an object (unlike `typeof`), see [[Types]].
     * @param object The object to test.
     */
    function getType(object: Object): string;
    /** An enumeration containing strings that represent the actual type of an object. */
    var Types: {
        Array: string;
        Boolean: string;
        Date: string;
        Function: string;
        Null: string;
        Number: string;
        Object: string;
        RegExp: string;
        String: string;
        Undefined: string;
    };
}
/** A [[Format.Utils]] sub-module containing methods related to numeric operations. */
declare module Format.Utils.Numeric {
    /**
     * Determines whether the passed value is an integer.
     * @param value The number to test.
     * @returns `true` if the value parameter is an integer.
     */
    function isInteger(value: number): boolean;
}
declare module Format.Utils.Numeric {
    /**
     * Determines whether the passed value is a counting number (positive integer excluding `0`).
     * @param value The number to test.
     * @returns `true` if the value parameter is a positive integer excluding `0`.
     */
    function isCounting(value: number): boolean;
    /**
     * Determines whether the passed value is a whole number (positive integer including `0`).
     * @param value The number to test.
     * @returns `true` if the value parameter is a positive integer including `0`.
     */
    function isWhole(value: number): boolean;
    /**
     * Determines whether the passed value is an even number.
     *
     * Throws an error if the value is not an integer (when [[isInteger]] returns `false`).
     * @param value The number to test.
     * @returns `true` if the value parameter is an even number.
     */
    function isEven(value: number): boolean;
    /**
     * Returns the best fitting formatted value, returned by the `Number.toFixed` method, given a minimum and/or maximum digits precision.
     * @param value The number to format.
     * @param minDigits The minimum number of digits to include in the format.
     * @param maxDigits The maximum number of digits to include in the format.
     */
    function toFixedMinMax(value: number, minDigits: number, maxDigits: number): string;
    /**
     * Returns the best fitting formatted value, returned by the `Number.toExponential` method, given a minimum and/or maximum digits precision.
     * @param value The number to format.
     * @param minDigits The minimum number of digits to include in the format.
     * @param maxDigits The maximum number of digits to include in the format.
     */
    function toExponentialMinMax(value: number, minDigits: number, maxDigits: number): string;
    /**
     * Returns the best fitting formatted value, returned by the `Number.toPrecision` method, given a minimum and/or maximum digits precision.
     * @param value The number to format.
     * @param minDigits The minimum number of digits to include in the format.
     * @param maxDigits The maximum number of digits to include in the format.
     */
    function toPrecisionMinMax(value: number, minDigits: number, maxDigits: number): string;
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
    /**
     * Removes "holes" (`undefined` elements) from the array making it compact/dense.
     * @param T The type of elements in the array.
     * @param array An array instance.
     * @returns The same array instance without `undefined` elements.
     */
    function compact<T>(array: T[]): T[];
}
declare module Format.Globalization {
    /**
     * Provides a mechanism for retrieving an object which contains resolved formatting options.
     * @param TOptions The type of the options container.
     * @param TValue The type of the value object.
     */
    interface OptionsProvider<TOptions, TValue> {
        /**
         * Returns an object that provides formatting options for the specified type.
         * @param format A format string containing formatting specifications.
         * @param value The value object from which to infer additional options.
         */
        resolveOptions(format: string, value: TValue): TOptions;
    }
}
/** A [[Format.Globalization]] sub-module containing classes related to date and time format operations. */
declare module Format.Globalization.DateTime {
    /**
     * Provides a mechanism for retrieving concrete date and time formatting options.
     * @param TOptions The type of the options container.
     */
    interface OptionsProvider<TOptions> extends Globalization.OptionsProvider<TOptions, Date> {
    }
}
declare module Format.Globalization.DateTime {
    /**
     * Invariant formatter implementation that applies invariant culture format to a date and time value.
     * @param T The type of the options container.
     */
    class InvariantFormatter<T> implements CustomFormatter {
        /** Gets the result of the [[baseOptions]] field extended with concrete options returned from the [[optionsProvider]] instance. */
        protected resolvedOptions: T;
        private value;
        private baseOptions;
        private optionsProvider;
        private optionsProviderConstructor;
        /**
         * Creates an instance with base formatting options and initializes an options provider that resolves concrete format options.
         * @param optionsProviderConstructor A date and time options provider constructor which will be used to resolve options.
         * @param options A base options object that can be overridden by resolved options.
         */
        constructor(optionsProviderConstructor: {
            new (baseOptions: T): OptionsProvider<T>;
        }, options?: T);
        /**
         * Converts the date to an equivalent string representation using specified format and invariant culture formatting information.
         * @param format A format string containing formatting specifications.
         * @param value The date to format.
         */
        format(format: string, value: Date): string;
        /**
         * Applies all resolved format options to the date object.
         * @param value The date to format.
         * @returns A resulting format value with applied format options.
         */
        protected applyOptions(value: Date): string;
        private innerFormat(format, value);
        private setValue(value);
        private cleanup();
    }
}
/** A [[Format.Utils]] sub-module containing methods intended to act as polyfills. */
declare module Format.Utils.Polyfill {
    /**
     * Returns `true` if an object is an array; otherwise `false`.
     * @param object The object to test.
     */
    function isArray(object: Object): boolean;
    /**
     * Removes the leading and trailing white space and line terminator characters from a string.
     * @param value The string to trim.
     */
    function trim(value: string): string;
}
declare module Format.Utils.Polyfill {
    /**
     * Returns the first index at which a given element can be found in the array, or -1 if it is not present.
     * @param array An array instance.
     * @param searchElement The element to search for.
     * @param fromIndex The index to start the search at.
     */
    function indexOf<T>(array: T[], searchElement: T, fromIndex?: number): number;
    /**
     * Returns a supplied numeric expression rounded to the exponent number.
     * @param value The number to format.
     * @param exponent The exponent which to use as a rounding base.
     */
    function round(value: number, exponent: number): number;
}
declare module Format.Utils {
    /**
     * Maps the given object's values as keys with their keys as values and returns the extended object.
     *
     * Throws an error if the operation results in key duplication or keys with 'undefined' or 'null' values.
     * @param T The type of object to update.
     * @param object The object to update with the mapped unique values as keys.
     * @returns A new object with all of the original and inverted properties.
     */
    function mapValuesAsKeys<T>(object: T): T;
    /**
     * Merge the contents of two or more objects together into the first object.
     * @param T The type of the object to merge into.
     * @param target An object that will receive the new properties.
     * @param object An object containing additional properties to merge in.
     * @param objects A list of arguments that consists of more objects that contain additional properties to merge in.
     */
    function extend<T>(target: T, object: Object, ...objects: Object[]): T;
    /**
     * Recursivelly merge the contents of two or more objects together into the first object.
     * @param T The type of the object to merge into.
     * @param target An object that will receive the new properties.
     * @param object An object containing additional properties to merge in.
     * @param objects A list of arguments that consists of more objects that contain additional properties to merge in.
     */
    function deepExtend<T>(target: T, object: Object, ...objects: Object[]): T;
}
/** A core namespace which contains utility methods for general purpose operations and more specialized utility sub-modules. */
declare module Format.Utils {
    /**
     * Returns `true` if an object is an object instance with language type of [[Types.Object]].
     * @param object The object to test.
     */
    function isObject(object: Object): boolean;
    /**
     * Returns `true` if an object is empty (contains no enumerable properties).
     * @param object The object to test.
     */
    function isEmpty(object: Object): boolean;
}
declare module Format.Utils {
    /**
     * Creates a new object that is a shallow or deep copy of the current instance.
     * @param T The type of the cloned object.
     * @param object The object to clone.
     * @param deep A flag specifying whether the result should be a deep copy or not.
     */
    function clone<T>(object: T, deep?: boolean): T;
    /**
     * Creates a new data object that is a deep data copy of the current instance.
     *
     * Non-data property values (functions or undefined) are **NOT** copied. In arrays any non-copy value is left as `null` so as to preserve the original indexing.
     * @param T The type of the cloned object.
     * @param object The data object to clone.
     */
    function fastClone<T>(object: T): T;
}
declare module Format.Utils {
}
declare module Format.Globalization.DateTime {
    /**
     * An [[OptionsProvider]] implementation that handles both [Standard Date and Time Format Strings](https://msdn.microsoft.com/en-us/library/az4se3k1.aspx) and
     * [Custom Date and Time Format Strings](https://msdn.microsoft.com/en-us/library/8kb3ddd4.aspx). The type of the returned options object is an
     * extended version of [Intl.DateTimeFormat's options](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat#Parameters) parameter.
     */
    class IntlOptionsProvider implements OptionsProvider<Intl.DateTimeFormatOptions> {
        private resolvedOptions;
        /**
         * Creates an instance with base formatting options which will be extended and/or overridden by resolved options.
         * @param dateTimeOptions A base options object containing properties defined for the Intl.DateTimeFormat's options parameter.
         */
        constructor(dateTimeOptions: Intl.DateTimeFormatOptions);
        /**
         * Returns an object that provides date and time formatting options resolved from date and time format specifiers.
         * @param format A format string containing formatting specifications.
         * @param value The value object from which to infer additional options.
         */
        resolveOptions(format: string, value: Date): Intl.DateTimeFormatOptions;
    }
}
declare module Format.Errors {
    /**
     * An error that is thrown when a requested method or operation is not implemented.
     *
     * See: https://msdn.microsoft.com/en-us/library/system.notimplementedexception.aspx
     */
    class NotImplementedError extends SystemError {
        /**
         * Creates an error that is thrown when a requested method or operation is not implemented.
         * @param methodName The name of the method that caused the error.
         */
        constructor(methodName: string);
    }
}
declare module Format.Errors {
    /**
     * An error that is thrown when a method call is invalid for the object's current state.
     *
     * See: https://msdn.microsoft.com/en-us/library/system.invalidoperationexception.aspx
     */
    class InvalidOperationError extends SystemError {
        /**
         * Creates an error  that is thrown when a method call is invalid for the object's current state.
         * @param message A human-readable description of the error.
         * @param innerError An error to rethrow while also preserving its stack trace.
         */
        constructor(message?: string, innerError?: SystemError);
    }
}
declare module Format.Globalization {
    /**
     * Provides culture-specific information about the format of date and time values.
     *
     * Information about the culture itself and the application of overrides will be made available through this class at a later point.
     *
     * See: https://msdn.microsoft.com/en-us/library/system.globalization.datetimeformatinfo.aspx
     */
    class DateTimeFormatInfo implements FormatProvider {
        /** Gets a read-only instance that is culture-independent (invariant). */
        static InvariantInfo: DateTimeFormatInfo;
        /** Gets or sets a constructor function to be used for creating culture-variant formatting instances. */
        static FormatterConstructor: {
            new (locales: string | string[], formatInfo: DateTimeFormatInfo): CustomFormatter;
        };
        protected locales: string | string[];
        private isWritable;
        private formatter;
        /** Initializes a new writable instance of the class that is culture-independent (invariant). */
        constructor();
        /**
         * Initializes a new instance of the class based on the culture specified by *locales*.
         * @param locales The locales argument must be either a string holding a [BCP 47 language tag](http://tools.ietf.org/html/rfc5646), or an array of such language tags.
         */
        constructor(locales: string | string[]);
        /**
         * Returns an object that provides formatting services for the `Date` type.
         * @param type A string indicating the type of the custom formatter to return, see [[Utils.Types]].
         */
        getFormatter(type: string): CustomFormatter;
        private resolveFormatInfo(locales);
    }
}
declare module Format.Globalization.Numeric.Specifiers {
    /**
     * A standard numeric format string takes the form `Axx`, where:
     * - `A` is a single alphabetic character called the format specifier.
     * Any numeric format string that contains more than one alphabetic character, including white space, is interpreted as a custom numeric format string;
     * - `xx` is an optional integer called the precision specifier. The precision specifier ranges from 0 to 99 and affects the number of digits in the result.
     * Note that the precision specifier controls the number of digits in the string representation of a number. It does not round the number itself.
     * To perform a rounding operation, use the `Math.ceil`, `Math.floor`, or `Math.round` methods;
     *
     * When precision specifier controls the number of fractional digits in the result string, the result strings reflect numbers that are rounded away from zero.
     */
    let StandardSpecifierRexExp: RegExp;
    /** The default standard exponential precision specifier. */
    let DefaultStandardExponentialPrecision: number;
    /**
     * Provides a compilation enforced mapping of the [Standard Numeric Format Specifiers](https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx).
     * @param T The type of the specifier's value/handler.
     */
    interface StandardSpecifiersMap<T> extends Indexable<T> {
        /** Format specifier `C` represents a currency value. */
        currency: T;
        /** Format specifier `D` represents a value's integer digits with optional negative sign. */
        decimal: T;
        /** Format specifier `E` represents a value's exponential notation. */
        exponential: T;
        /** Format specifier `F` represents a value's integral and decimal digits with optional negative sign. */
        fixedPoint: T;
        /** Format specifier `G` represents the most compact of either fixed-point or scientific notation. */
        general: T;
        /** Format specifier `N` represents a value's integral and decimal digits, group separators, and a decimal separator with optional negative sign. */
        number: T;
        /** Format specifier `P` represents a value multiplied by 100 and displayed with a percent symbol. */
        percent: T;
        /** Format specifier `R` formats a string that can round-trip to an identical number value. */
        roundTrip: T;
        /** Format specifier `X` represents a hexadecimal string. */
        hex: T;
    }
    /**
     * Exposes a map of the standard numeric format specifiers to their alphabetic character representation as well as the inverse relation.
     *
     * See: https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx
     */
    let StandardSpecifiers: StandardSpecifiersMap<string>;
}
/** A [[Format.Globalization]] sub-module containing classes related to numeric format operations. */
declare module Format.Globalization.Numeric {
    /**
     * Provides a mechanism for retrieving concrete number formatting options.
     * @param TOptions The type of the options container.
     */
    interface OptionsProvider<TOptions> extends Globalization.OptionsProvider<TOptions, number> {
        /** Returns the formatting style to use. */
        getStyle(): string;
        /** Returns whether to use grouping separators, such as thousands separators or thousand/lakh/crore separators. */
        useGrouping(): boolean;
        /** Returns the minimum number of integer digits to use. */
        getMinimumIntegerDigits(): number;
        /** Returns the minimum number of fraction digits to use. */
        getMinimumFractionDigits(): number;
        /** Returns the maximum number of fraction digits to use. */
        getMaximumFractionDigits(): number;
        /** Returns the minimum number of significant digits to use. */
        getMinimumSignificantDigits(): number;
        /** Returns the maximum number of significant digits to use. */
        getMaximumSignificantDigits(): number;
        /** Returns whether the digits part can be fully omitted. */
        hasNoDigits(): boolean;
        /** Returns whether the integral part can be fully omitted if it has a value of 0. */
        hasNoLeadingZeroIntegerDigit(): boolean;
        /** Returns whether parts of the formatted string should be upper-cased. */
        isUpperCase(): boolean;
        /** Returns whether a sign character should precede only negative exponents. */
        isNegativellySignedExponent(): boolean;
        /** Returns the minimum number of exponent digits to use. */
        getMinimumExponentDigits(): number;
        /** Returns the divisor that will be applied to the value before formatting. */
        getValueDivisor(): number;
        /** Returns the string that will be added before the numeric format value. */
        getPrefixDecorator(): string;
        /** Returns the map of index-to-text values which should be put inside the numeric part of the format. */
        getInternalDecorators(): Indexable<string>;
        /** Returns the string that will be added after the numeric format value. */
        getSuffixDecorator(): string;
    }
}
declare module Format.Globalization.Numeric {
    /**
     * Partial formatter implementation that applies decoration options to the resulting value.
     * @param T The type of the options container.
     */
    class DecorationFormatter<T> {
        private static groupSeparatorRegExp;
        private style;
        private noDigits;
        private upperCase;
        private useGrouping;
        private noLeadingZeroIntegerDigit;
        private prefixDecorator;
        private suffixDecorator;
        private internalDecorators;
        private formatInfo;
        private decimalOffset;
        private restoreNegativeSign;
        /**
         * Creates an instance that uses the resolved options from the specified options provider and applies culture-specific formatting based on the given format info.
         * @param optionsProvider A numeric options provider whose resolved options will be used.
         * @param formatInfo An instance that provides culture-specific number format information.
         */
        constructor(optionsProvider: OptionsProvider<T>, formatInfo: NumberFormatInfo);
        /**
         * Applies negative sign position and symbol, removal of the leading zero, internal and external decorators to the formatted value.
         * @param value The number which is currently being formatted.
         * @param formattedValue The partial resulting format value.
         * @returns The fully formatted value.
         */
        applyOptions(value: number, formattedValue: string): string;
        /**
         * Applies the uppercase option for some standard specifiers that require it.
         * @param formattedValue The partial resulting format value.
         * @returns A resulting format value with the applied uppercase option.
         */
        applyUppercase(formattedValue: string): string;
        /**
         * Applies the grouping option using the appropriate group separator.
         * @param formattedValue The partial resulting format value.
         * @returns A resulting format value with the applied grouping option.
         */
        applyGrouping(formattedValue: string): string;
        /**
         * Applies the minimum integer digits option by padding the numeric part before the decimal separator.
         * Also temporarily removes the current [[NumberFormatInfo.NegativeSign]]. It is restored when [[applyOptions]] finishes all decoration formatting.
         * @param value The number which is currently being formatted.
         * @param formattedValue The partial resulting format value.
         * @param paddingWidth The number of characters in the resulting numeric string's integral part.
         * @returns A resulting format value with the applied minimum integer digits option and without a negative sign.
         */
        applyIntegerPadding(value: number, formattedValue: string, paddingWidth: number): string;
        /**
         * Returns the appropriate decimal separator symbol depending on the available format info and style option.
         * @param formatInfo An overriding format info instance to be used.
         */
        getDecimalSeparator(formatInfo?: NumberFormatInfo): string;
        /**
         * Returns the appropriate group separator symbol depending on the available format info and style option.
         * @param formatInfo An overriding format info instance to be used.
         */
        getGroupSeparator(formatInfo?: NumberFormatInfo): string;
        private isCurrency();
        private removeNegativeSign(value, formattedValue);
        private applyDigitOptions(value, formattedValue);
        private shouldRemoveLeadingZero(value);
        private applyInternalDecorators(formattedValue);
        private applyInternalDecorator(numericParts, index, decorator);
        private applyExternalDecorators(formattedValue);
        private applyNegativeSign(value, formattedValue);
    }
}
declare module Format.Globalization.Numeric {
    /**
     * Partial formatter implementation that applies exponential notation options to the resulting value.
     * @param T The type of the options container.
     */
    class ExponentialFormatter<T> {
        private minimumIntegerDigits;
        private minimumFractionDigits;
        private maximumFractionDigits;
        private minimumExponentDigits;
        private negativellySignedExponent;
        /**
         * Creates an instance that uses the resolved options from the specified options provider.
         * @param optionsProvider A numeric options provider whose resolved options will be used.
         */
        constructor(optionsProvider: OptionsProvider<T>);
        /**
         * Applies exponent precision, padding and signing options to the number.
         * @param value The number which is currently being formatted.
         * @returns A formatted exponential notation string.
         */
        applyOptions(value: number): string;
        /**
         * Applies exponent padding options for some standard specifiers that require it.
         * @param formattedExponentialValue The partial formatted exponential notation string.
         */
        applyExponentPadding(formattedExponentialValue: string): string;
        private floorOption(optionValue);
        private validateOption(optionSelector, minValue);
        private validateCustomOptions();
        private toExponential(value);
        private getPaddedExponent(exponent);
        private applyExponentSigning(exponentialValue);
        private toCustomExponential(value);
        private resolveFromState(customState);
        private resolveFromDigit(customState);
        private resolvers;
        private resolveNonZeroDigit(digitChar, customState);
        private resolveDigit(digitChar, customState);
        private resolvePowerState(customState);
        private resolveDigitState(customState);
        private resolveDigitRounding(digitChar, customState);
        private resolveDecimalPoint(customState);
        private resolveOffset(exponentialValue, customState);
        private resolveExponent(customState);
    }
}
declare module Format.Globalization.Numeric {
    /**
     * Invariant formatter implementation that applies invariant culture format to a numeric value.
     * @param T The type of the options container.
     */
    class InvariantFormatter<T> implements CustomFormatter {
        /** Gets the result of the [[baseOptions]] field extended with concrete options returned from the [[optionsProvider]] instance. */
        protected resolvedOptions: T;
        /** Gets the initialized formatting [[DecorationFormatter]] instance. */
        protected decorationFormatter: DecorationFormatter<T>;
        private value;
        private baseOptions;
        private optionsProvider;
        private optionsProviderConstructor;
        /**
         * Creates an instance with base formatting options and initializes an options provider that resolves concrete format options.
         * @param optionsProviderConstructor A numeric options provider constructor which will be used to resolve options.
         * @param options A base options object that can be overridden by resolved options.
         */
        constructor(optionsProviderConstructor: {
            new (baseOptions: T): OptionsProvider<T>;
        }, options?: T);
        /**
         * Converts the number to an equivalent string representation using specified format and invariant culture formatting information.
         * @param format A format string containing formatting specifications.
         * @param value The number to format.
         */
        format(format: string, value: number): string;
        /**
         * Applies all resolved format options to the number.
         * @param value The number to format.
         * @returns A resulting format value with applied format options.
         */
        protected applyOptions(value: number): string;
        /**
         * Returns the format info instance to use for culture-specific formatting.
         *
         * Must be overridden by subclasses that are not culture invariant.
         */
        protected getFormatInfo(): NumberFormatInfo;
        private innerFormat(format, value);
        private setValue(value);
        private cleanup();
        private applyDecimalFormat();
        private formatters;
    }
}
declare module Format.Utils {
    /**
     * Removes all properties with `null` or `undefined` values.
     * @param T The type of the object to remove from.
     * @param object The object to remove from.
     * @param deep Optional flag specifying whether the removal should be recursive.
     * @returns The same object instance without `null` or `undefined` elements.
     */
    function removeUndefined<T>(object: T, deep?: boolean): T;
    /**
     * Removes all properties with `null`, `undefined` or `""` values.
     * @param T The type of the object to remove from.
     * @param object The object to remove from.
     * @param deep Optional flag specifying whether the removal should be recursive.
     * @returns The same object instance without `null`, `undefined` or `""` elements.
     */
    function removeEmpty<T>(object: T, deep?: boolean): T;
    /**
     * Removes all properties with falsy values (`null`, `undefined`, `""` or `0`).
     * @param T The type of the object to remove from.
     * @param object The object to remove from.
     * @param deep Optional flag specifying whether the removal should be recursive.
     * @returns The same object instance without falsy elements.
     */
    function removeFalsy<T>(object: T, deep?: boolean): T;
}
declare module Format.Utils {
}
declare module Format.Errors {
    /**
     * An error that is thrown when the format of an argument is invalid, or when a composite format string is not well formed.
     *
     * See: https://msdn.microsoft.com/en-us/library/system.formatexception.aspx
     */
    class FormatError extends SystemError {
        /**
         * Creates an error that is thrown when the format of an argument is invalid, or when a composite format string is not well formed.
         * @param message A human-readable description of the error.
         * @param innerError An error to rethrow while also preserving its stack trace.
         */
        constructor(message?: string, innerError?: SystemError);
    }
}
declare module Format.Globalization.Numeric.Specifiers {
    /**
     * An [[OptionsProvider]] implementation that handles [Standard Numeric Format Specifiers](https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx). The type of the returned options object is an
     * extended version of [Intl.NumberFormat's options](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat#Parameters) parameter.
     */
    class IntlStandardOptionsProvider implements Globalization.OptionsProvider<Intl.NumberFormatOptions, number> {
        private options;
        private specifier;
        private precision;
        private style;
        /**
         * Creates an instance with base formatting options which will be extended and/or overridden by resolved options.
         * @param numberOptions A base options object containing properties defined for the Intl.NumberFormat's options parameter.
         */
        constructor(numberOptions: Intl.NumberFormatOptions);
        /**
         * Returns an object that provides numeric formatting options resolved from standard numeric specifiers.
         * @param format A format string representing a [Standard Numeric Format Specifiers](https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx).
         * @param value The value object from which to infer additional options.
         */
        resolveOptions(format: string, value: number): Intl.NumberFormatOptions;
        private tryInitializeSpecifierOptions(format);
        private resolvers;
    }
}
/** A [[Globalization.Numeric]] sub-module containing classes related to numeric format specifier operations. */
declare module Format.Globalization.Numeric.Specifiers {
    /**
     * A custom numeric exponent format string takes the form `Esxxx`, where:
     * - `E` is a single lower or uppercase 'E' character marking the begining of the exponential notation specifier.
     * - `s` is an optional single '+' or '-' sign which specifies the display behaviour of the same characters in the output string.
     * - `xxx` is a zero placeholders' string (at least 1) that determines the width of the output exponent's padding.
     */
    let CustomExponentRexExp: RegExp;
    /**
     * Provides a compilation enforced mapping of the [Custom Numeric Format Specifiers](https://msdn.microsoft.com/en-us/library/0c899ak8.aspx).
     * @param T The type of the specifier's value/handler.
     */
    interface CustomSpecifiersMap<T> extends Indexable<T> {
        /** Format specifier `0` replaces the zero with the corresponding digit if one is present; otherwise, zero appears in the result string. */
        zeroPlaceholder: T;
        /** Format specifier `#` replaces symbol with the corresponding digit if one is present; otherwise, no digit appears in the result string. */
        digitPlaceholder: T;
        /** Format specifier `.` determines the location of the decimal separator in the result string. */
        decimalPoint: T;
        /** Format specifier `,` serves as both a group separator and a number scaling specifier. */
        groupSeparatorOrNumberScaling: T;
        /** Format specifier `%` multiplies a number by 100 and inserts a localized percentage symbol in the result string. */
        percentagePlaceholder: T;
        /** Format specifier `‰` multiplies a number by 1000 and inserts a localized per mille symbol in the result string. */
        perMillePlaceholder: T;
        /**
         * Format specifier `e` or `E` followed by `+` or `-`, and at least one `0` determines the presence of an exponential notation specifier.
         *
         * The "E+" and "e+" formats indicate that a plus sign or minus sign should always precede the exponent.
         * The "E", "E-", "e", or "e-" formats indicate that a sign character should precede only negative exponents.
         */
        exponent: T;
        /** Format specifier `\` causes the next character to be interpreted as a literal rather than as a custom format specifier. */
        escapeChar: T;
        /** Format specifier `'` indicates that the enclosed characters should be copied to the result string unchanged. */
        literalStringDelimeterSingle: T;
        /** Format specifier `"` indicates that the enclosed characters should be copied to the result string unchanged. */
        literalStringDelimeterDouble: T;
        /**
         * Format specifier `;` defines sections with separate format strings for positive, negative, and zero numbers - in that order.
         *
         * To produce this behavior, a custom format string can contain up to three sections separated by semicolons:
         * - One section: The format string applies to all values;
         * - Two sections: The first section applies to positive values and zeros, and the second section applies to negative values.
         * If the number to be formatted is negative, but becomes zero after rounding according to the format in the second section, the resulting zero is formatted
         * according to the first section;
         * - Three sections: The first section applies to positive values, the second section applies to negative values, and the third section applies to zeros.
         * The second section can be left empty (by having nothing between the semicolons), in which case the first section applies to all nonzero values.
         * If the number to be formatted is nonzero, but becomes zero after rounding according to the format in the first or second section, the resulting zero
         * is formatted according to the third section.
         */
        sectionSeparator: T;
    }
    /**
     * Exposes a map of the custom numeric format specifiers to their character or regexp representation as well as the inverse relation.
     *
     * See: https://msdn.microsoft.com/en-us/library/0c899ak8.aspx
     */
    let CustomSpecifiers: CustomSpecifiersMap<string>;
}
interface Constructable<T> {
    new (): T;
}
declare module Format.Utils {
    /**
     * Provides support for lazy initialization.
     *
     * See: https://msdn.microsoft.com/en-us/library/dd642331.aspx
     * @param T The type of object that is being lazily initialized.
     */
    class Lazy<T> {
        private value;
        private valueError;
        private valueCreated;
        private valueFactory;
        private valueConstructor;
        /**
         * Initializes a new instance of the class that uses the supplied value factory.
         * @param valueFactory The delegate that is invoked to produce the lazily initialized value when it is needed.
         */
        constructor(valueFactory: () => T);
        /**
         * Returns a new instance of the class that uses the specified constructor to create a value of its type.
         * @param TStatic The type of object that is being lazily initialized.
         * @param valueConstructor The parameterless constructor that is invoked to produce the lazily initialized value when it is needed.
         */
        static fromConstructor<TStatic>(valueConstructor: Constructable<TStatic>): Lazy<TStatic>;
        /**
         * Gets the lazily initialized value of the current [[Lazy]] instance.
         * @returns The lazily initialized value of the current instance.
         */
        getValue(): T;
        /**
         * Gets a value that indicates whether a value has been created for this [[Lazy]] instance.
         * @returns `true` if a value has been created for this instance; otherwise, `false`.
         */
        isValueCreated(): boolean;
        private lazyInitValue();
        private createValue();
    }
}
declare module Format.Globalization.Numeric.Specifiers {
    /**
     * A [Custom Numeric Format String](https://msdn.microsoft.com/en-us/library/0c899ak8.aspx) parser implementation.
     * It does not produce concrete formatting options but does lend its intermediate and final state to visiting instances.
     */
    class CustomParser {
        private index;
        private sections;
        private sectionIndex;
        private decimalPointIndex;
        private format;
        private escapeOne;
        private escapeManyChar;
        private exponentGroups;
        private exponentMatchIndex;
        private secondaryExponent;
        private firstNumericSpecifierIndex;
        private innerNumericSpecifiersIndex;
        private lastNumericSpecifierIndex;
        private firstZeroSpecifierIndex;
        private lastZeroSpecifierIndex;
        private lastGroupSeparatorIndex;
        private lookahead;
        private getLookahead;
        /**
         * Creates an instance that parses the format string when [[doParse]] is called.
         * @param format A format string containing formatting specifications.
         */
        constructor(format: string);
        /**
         * Creates and executes a special detached parser instance that returns only the matched format sections that are separated by [[CustomSpecifiersMap.sectionSeparator]].
         * @param format A format string containing formatting specifications.
         * @returns An array containing separate format sections.
         */
        static getSections(format: string): string[];
        /** Returns the current character visited by the parser. */
        getCurrentChar(): string;
        /**
         * Returns the number of [[CustomSpecifiersMap.zeroPlaceholder]] specifiers preceding the [[CustomSpecifiersMap.decimalPoint]].
         * If the [[format]] string contains a [[CustomSpecifiersMap.exponent]] specifier then [[CustomSpecifiersMap.digitPlaceholder]] are counted as well.
         */
        getDigitsBeforeDecimal(): number;
        /** Returns the number of both [[CustomSpecifiersMap.zeroPlaceholder]] and [[CustomSpecifiersMap.digitPlaceholder]] specifiers after the [[CustomSpecifiersMap.decimalPoint]]. */
        getNumberPlaceholderCountAfterDecimal(): number;
        /** Returns the number of [[CustomSpecifiersMap.zeroPlaceholder]] specifiers after the [[CustomSpecifiersMap.decimalPoint]]. */
        getZeroPlaceholderCountAfterDecimal(): number;
        /** Returns the sign character following the [[CustomSpecifiersMap.exponent]] specifier. */
        getExponentSign(): string;
        /** Returns the number of `0` characters following the [[CustomSpecifiersMap.exponent]] specifier. */
        getExponentPlaceholderCount(): number;
        /**
         * Returns the current index offset from the [[CustomSpecifiersMap.decimalPoint]] specifier, which is considered as the starting index.
         *
         * May require a [[lookahead]] evaluation.
         */
        getIndexFromDecimal(): number;
        /** Returns `true` if the parser has already encountered a [[CustomSpecifiersMap.decimalPoint]] specifier; otherwise, `false`. */
        isAfterDecimal(): boolean;
        /**
         * Returns `true` if the parser is yet to encounter a [[CustomSpecifiersMap.zeroPlaceholder]], [[CustomSpecifiersMap.digitPlaceholder]] or [[CustomSpecifiersMap.decimalPoint]] specifier;
         * otherwise, `false`.
         */
        isBeforeNumericSpecifiers(): boolean;
        /**
         * Returns `true` if the parser can no longer encounter a [[CustomSpecifiersMap.zeroPlaceholder]], [[CustomSpecifiersMap.digitPlaceholder]] or [[CustomSpecifiersMap.decimalPoint]] specifier;
         * otherwise, `false`.
         *
         * Always requires a [[lookahead]] evaluation.
         */
        isAfterNumericSpecifiers(): boolean;
        /**
         * Returns `true` if the current parser position is exactly after the last [[CustomSpecifiersMap.zeroPlaceholder]], [[CustomSpecifiersMap.digitPlaceholder]] or
         * [[CustomSpecifiersMap.decimalPoint]] specifier; otherwise, `false`.
         *
         * Always requires a [[lookahead]] evaluation and internally shifts its state so that the next call to this method can also return `true` if this one did.
         */
        isImmediateAfterNumericSpecifiers(): boolean;
        /** Returns `true` if the current parser position is exactly at the first [[CustomSpecifiersMap.exponent]] occurrence; otherwise, `false`. */
        isExponentMatched(): boolean;
        /**
         * Returns `true` if the matched [[CustomSpecifiersMap.exponent]] is an uppercase character; otherwise, `false`.
         *
         * Call only when [[isExponentMatched]] returned a `true` value to guarantee correct behavior.
         */
        isExponentUppercase(): boolean;
        /**
         * Parses the [[format]] string this instance was initialized with.
         * The method uses the supplied resolvers map as a means for an outside class to access the intermediate state of the parser each time a specifier is visited.
         * @param resolvers A map between a specifier type and a resolver function that is called after the parser evaluates its intermediate state.
         * @param charResolver A standalone resolver function that is called for every visited character that is not considered a specifier.
         */
        doParse(resolvers: Specifiers.CustomSpecifiersMap<() => void>, charResolver: () => void): void;
        private doDetachedParse();
        private addToSection();
        private handleSpecifier(handlers, resolvers?, charResolver?);
        private canHandleSpecifier(handler);
        private addExponentOffset();
        private handleNumericSpecifier();
        private handleLiteralStringDelimeter();
        private getExponentGroups();
        private matchExponent();
        private getNumberPlaceholderCountBeforeDecimal();
        private getZeroPlaceholderCountBeforeDecimal();
        private getHandlers();
    }
}
declare module Format.Globalization.Numeric.Specifiers {
    /**
     * An [[OptionsProvider]] implementation that handles [Custom Numeric Format String](https://msdn.microsoft.com/en-us/library/0c899ak8.aspx). The type of the returned options object is an
     * extended version of [Intl.NumberFormat's options](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat#Parameters) parameter.
     */
    class IntlCustomOptionsProvider implements Globalization.OptionsProvider<Intl.NumberFormatOptions, number> {
        private options;
        private parser;
        private decoractingCharResolver;
        /**
         * Creates an instance with base formatting options which will be extended and/or overridden by resolved options.
         * @param numberOptions A base options object containing properties defined for the Intl.NumberFormat's options parameter.
         */
        constructor(numberOptions?: Intl.NumberFormatOptions);
        /**
         * Returns an object that provides numeric formatting options resolved from custom numeric specifiers.
         * @param format A format string representing a [Custom Numeric Format String](https://msdn.microsoft.com/en-us/library/0c899ak8.aspx).
         * @param value The value object from which to infer additional options.
         */
        resolveOptions(format: string, value: number): Intl.NumberFormatOptions;
        private parseOptions(format);
        private stripDefaultOptions(value);
        private stripDigitOptions(value);
        private getSectionFormat(format, value);
        private tryNonZeroSectionFormat(sections, value);
        private tryNegativeZeroSectionFormat(sections, value);
        private tryRoundToZeroFormat(nonZeroSectionFormat, value);
        private setInternalDecorator(formatChar);
        private resetValueDivisor();
        private resolvers;
    }
}
declare module Format.Globalization.Numeric {
    /**
     * An [[OptionsProvider]] implementation that handles both [Standard Numeric Format Specifiers](https://msdn.microsoft.com/en-us/library/dwhawy9k.aspx) and
     * [Custom Numeric Format String](https://msdn.microsoft.com/en-us/library/0c899ak8.aspx). The type of the returned options object is an
     * extended version of [Intl.NumberFormat's options](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat#Parameters) parameter.
     */
    class IntlOptionsProvider implements OptionsProvider<Intl.NumberFormatOptions> {
        private resolvedOptions;
        /**
         * Creates an instance with base formatting options which will be extended and/or overridden by resolved options.
         * @param numberOptions A base options object containing properties defined for the Intl.NumberFormat's options parameter.
         */
        constructor(numberOptions: Intl.NumberFormatOptions);
        /**
         * Returns an object that provides numeric formatting options resolved from numeric format specifiers.
         * @param format A format string containing formatting specifications.
         * @param value The value object from which to infer additional options.
         */
        resolveOptions(format: string, value: number): Intl.NumberFormatOptions;
        /** Returns the formatting style to use. Values should match the property names defined in [[StandardSpecifiersMap]]. */
        getStyle(): string;
        /** Returns whether to use grouping separators or not. */
        useGrouping(): boolean;
        /** Returns the minimum number of integer digits to use. */
        getMinimumIntegerDigits(): number;
        /** Returns the minimum number of fraction digits to use. */
        getMinimumFractionDigits(): number;
        /** Returns the maximum number of fraction digits to use. */
        getMaximumFractionDigits(): number;
        /** Returns the minimum number of significant digits to use. */
        getMinimumSignificantDigits(): number;
        /** Returns the maximum number of significant digits to use. */
        getMaximumSignificantDigits(): number;
        /** Returns whether to ommit all digits or not. */
        hasNoDigits(): boolean;
        /** Returns whether to ommit a single zero digit before the decimal point or not. */
        hasNoLeadingZeroIntegerDigit(): boolean;
        /** Returns whether an uppercase representation is required or not. */
        isUpperCase(): boolean;
        /** Returns whether an exponent sign is required only for negative exponents or not. */
        isNegativellySignedExponent(): boolean;
        /** Returns the minimum number of exponent digits to use. */
        getMinimumExponentDigits(): number;
        /** Returns the divisor that will be applied to the value before formatting. */
        getValueDivisor(): number;
        /** Returns the string that will be added before the numeric format value. */
        getPrefixDecorator(): string;
        /** Returns the mapping of index-to-text values which are inside the numeric part of the format. */
        getInternalDecorators(): Indexable<string>;
        /** Returns the string that will be added after the numeric format value. */
        getSuffixDecorator(): string;
    }
}
declare module Format.Globalization {
    /**
     * Provides culture-specific information for formatting and parsing numeric values.
     *
     * Information about the culture itself and the application of overrides will be made available through this class at a later point.
     *
     * See: https://msdn.microsoft.com/en-us/library/system.globalization.numberformatinfo.aspx
     */
    class NumberFormatInfo implements FormatProvider {
        /** Gets a read-only instance that is culture-independent (invariant). */
        static InvariantInfo: NumberFormatInfo;
        /** Gets or sets the currency string. */
        static CurrentCurrency: string;
        /** Gets or sets a constructor function to be used for creating culture-variant formatting instances. */
        static FormatterConstructor: {
            new (locales: string | string[], formatInfo: NumberFormatInfo): CustomFormatter;
        };
        /** Gets or sets the string to use as the decimal separator in currency values. */
        CurrencyDecimalSeparator: string;
        /** Gets or sets the string that separates groups of digits to the left of the decimal in currency values. */
        CurrencyGroupSeparator: string;
        /** Gets or sets the number of decimal places to use in currency values. */
        CurrencyDecimalDigits: number;
        /** Gets or sets the string to use as the decimal separator in numeric values. */
        NumberDecimalSeparator: string;
        /** Gets or sets the string that separates groups of digits to the left of the decimal in numeric values. */
        NumberGroupSeparator: string;
        /** Gets or sets the number of decimal places to use in numeric values. */
        NumberDecimalDigits: number;
        /** Gets or sets the string that denotes that the associated number is negative. */
        NegativeSign: string;
        protected locales: string | string[];
        private isWritable;
        private formatter;
        /** Initializes a new writable instance of the class that is culture-independent (invariant). */
        constructor();
        /**
         * Initializes a new instance of the class based on the culture specified by *locales*.
         * @param locales The locales argument must be either a string holding a [BCP 47 language tag](http://tools.ietf.org/html/rfc5646), or an array of such language tags.
         */
        constructor(locales: string | string[]);
        /**
         * Returns an object that provides formatting services for the `Number` type.
         * @param type A string indicating the type of the custom formatter to return, see [[Utils.Types]].
         */
        getFormatter(type: string): CustomFormatter;
        private resolveFormatInfo(locales);
        private setInvariantFormatInfo();
    }
}
declare module Format.Globalization {
    /**
     * Provides a mechanism for setting a specific culture (also called a *locale*) that will be used during formatting.
     *
     * Information about the culture itself and the application of overrides will be made available through this class at a later point.
     *
     * See: https://msdn.microsoft.com/en-us/library/system.globalization.cultureinfo.aspx
     */
    class CultureInfo implements FormatProvider {
        /** Gets or sets the [[CultureInfo]] object that represents the culture used by the current context. */
        static CurrentCulture: CultureInfo;
        /** Gets the [[CultureInfo]] object that is culture-independent (invariant). */
        static InvariantCulture: CultureInfo;
        /** Core implementation of a [[CustomFormatter]] for `Object` and `Array` instances. */
        private static objectFormatter;
        /** Fallback implementation of a [[CustomFormatter]] for any objects. */
        private static fallbackFormatter;
        /** Gets or sets a [[DateTimeFormatInfo]] that defines the culturally appropriate format of displaying dates and times. */
        DateTimeFormat: DateTimeFormatInfo;
        /** Gets or sets a [[NumberFormatInfo]] that defines the culturally appropriate format of displaying numbers, currency, and percentage. */
        NumberFormat: NumberFormatInfo;
        protected locales: string | string[];
        protected formatters: Indexable<CustomFormatter>;
        /**
         * Initializes a new instance of the [[CultureInfo]] class based on the culture specified by *locales*.
         * @param locales The locales argument must be either a string holding a [BCP 47 language tag](http://tools.ietf.org/html/rfc5646), or an array of such language tags.
         */
        constructor(locales: string | string[]);
        getFormatter(type: string): CustomFormatter;
        protected getFormatters(locales: string | string[]): Indexable<CustomFormatter>;
        protected getFallbackFormatter(): CustomFormatter;
    }
}
/**
 * The CLR Format main module and namespace.
 *
 * The [[StringConstructor.format]] method exposes the core API of the project. Optional configuration methods are stored in the [[Format.Config]] sub-module.
 */
declare module Format {
    /**
     * Sets the current default culture (the [[CurrentCulture]] property) based on the supplied locale parameter.
     * @param locale A string holding a [BCP 47 language tag](http://tools.ietf.org/html/rfc5646).
     */
    function setCulture(locale: string): void;
    /**
     * Sets the current default currency (the [[CurrentCurrency]] property) based on the supplied currency code.
     * @param currencyCode The currency to use in currency formatting. See [current currency & funds code list](http://www.currency-iso.org/en/home/tables/table-a1.html).
     */
    function setCurrency(currencyCode: string): void;
    /**
     * Converts the value of objects to strings based on the formats specified and inserts them into another string.
     *
     * This project-internal (but externally visible) version does not support arbitrary argument overloads.
     * @param provider An object that supplies culture-specific formatting information.
     * @param format A composite format string. See: https://msdn.microsoft.com/en-us/library/txafckwd.aspx
     * @param args An array of arguments that contains zero or more objects to format.
     */
    function innerFormat(provider: Globalization.FormatProvider, format: string, args: Object[]): string;
    /** @private */
    var getBracesCount: (formatItem: string, braceChar: string) => number;
}
