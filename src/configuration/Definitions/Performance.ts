/// <reference path="../../use-strict" />

/// <reference path="../Utils/Indexable" />

namespace Format.Config.Definitions {

    let memoizedRegistry: Indexable<Function> = {};

    export function enableMemoization(): void {
        memoize(Format, "getBracesCount");
    }

    export function disableMemoization(): void {
        unmemoize(Format, "getBracesCount");
    }

    var memoize = (hostObject: any, name: string) => {
        if (!memoizedRegistry[name]) {
            let func: Function = hostObject[name];
            hostObject[name] = Utils.Function.memoize(func);
            memoizedRegistry[name] = func;
        }
    };

    var unmemoize = (hostObject: any, name: string) => {
        if (memoizedRegistry[name]) {
            let memoized: Function = hostObject[name];
            hostObject[name] = memoizedRegistry[name];
            delete memoizedRegistry[name];
            delete memoized.cache;
        }
    };
}
