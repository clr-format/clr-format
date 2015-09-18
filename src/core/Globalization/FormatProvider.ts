/// <reference path="CustomFormatter" />

/**
 * A core namespace which contains classes that define culture-related information, including language, country/region, calendars in use, format patterns for dates, currency, and numbers,
 * and sort order for strings. These classes are useful for writing globalized (internationalized) applications.
 *
 * See: https://msdn.microsoft.com/library/system.globalization.aspx
 */
namespace Format.Globalization {
    /**
     * Provides a mechanism for retrieving an object to control formatting.
     *
     * See: https://msdn.microsoft.com/library/system.iformatprovider.aspx
     */
    export interface FormatProvider {
        /**
         * Returns an object that provides formatting services for the specified type.
         * @param type A string indicating the type of the custom formatter to return, see [[Utils.Types]].
         */
        getFormatter(type: string): CustomFormatter;
    }
}
