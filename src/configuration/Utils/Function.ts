/// <reference path="../../use-strict" />

/// <reference path="../API/Function" />

module Format.Utils.Function {
    /**
     * Returns a memoized function wrapper of the function. All calls with the same arguments to the original function are cached after the first use.
     *
     * Must load the [[Format.Config]] sub-module to be defined.
     * @param T The type/signature of the original function.
     * @param func The function whose results will be cached.
     * @param resolver A cache key resolver function used to store the call arguments' list as a string key. Defaults to `JSON.stringify`.
     * @param resolver.argumentValues An array containing the call arguments for the function.
     */
    export function memoize<T extends Function>(func: T, resolver?: (argumentValues: Object[]) => string): T {

        if (typeof func !== "function") {
            throw new TypeError("Cannot call method 'memoize' on non-functional objects");
        }

        resolver = resolver || JSON.stringify;

        let memoized: T = <any>function(...args: Object[]) {

            let key = resolver(args);
            if (memoized.cache.hasOwnProperty(key)) {
                return memoized.cache[key];
            }

            memoized.cache[key] = func.apply(this, args);

            return memoized.cache[key];
        };

        memoized.cache = {};

        return memoized;
    }
}
