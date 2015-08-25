interface NumberHandler {
    /** A number precision format handler function that contains a value to call in its closure. */
    delegate: (digits: number) => string;
    /** The minimum number of digits to include in the format if maximum such are specified. */
    defaultMinDigits: number;
}
