declare module Intl {
    /** Represents an object that provides formatting options according to the Intl.DateTimeFormat object's constructor. */
    interface DateTimeFormatOptions {
        /** The UTC flag indicates that the date value must be presented in universal time. */
        toUTC?: boolean;
    }
}
