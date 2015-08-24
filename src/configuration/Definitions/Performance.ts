/// <reference path="../../use-strict" />

namespace Format.Config.Definitions {

    /** @private */
    let memoizedRegistry: Indexable<Function> = {};

    export function enableMemoization(): void {
        memoize(Format, "getBracesCount");
    }

    export function disableMemoization(): void {
        unmemoize(Format, "getBracesCount");
    }

    /** @private */
    var memoize = (hostObject: any, name: string) => {
        if (!memoizedRegistry[name]) {
            let func: Function = hostObject[name];
            hostObject[name] = Utils.Function.memoize(func);
            memoizedRegistry[name] = func;
        }
    };

    /** @private */
    var unmemoize = (hostObject: any, name: string) => {
        if (memoizedRegistry[name]) {
            let memoized: Function = hostObject[name];
            hostObject[name] = memoizedRegistry[name];
            delete memoizedRegistry[name];
            delete memoized.cache;
        }
    };
}
