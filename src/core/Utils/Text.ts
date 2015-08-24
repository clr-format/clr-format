/** A [[Format.Utils]] sub-module containing methods related to text operations. */
namespace Format.Utils.Text {
    /**
     * Indicates whether the specified string is `undefined`, `null`, `""`, or consists only of white-space characters.
     * @param value The string to test.
     * @returns `true` if the value parameter is `undefined`, `null`, `""`, or if value consists exclusively of white-space characters.
     */
    export function isNullOrWhitespace(value: string): boolean {
        return !(value && value.trim().length > 0);
    }
}
