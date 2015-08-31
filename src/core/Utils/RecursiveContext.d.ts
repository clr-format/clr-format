declare namespace Format.Utils {
    interface RecursiveContext {
        seen?: Object[];
        deep?: boolean;
        key?: string;
    }

    interface RemovePropertyContext extends RecursiveContext {
        removePredicate: (value: Object) => boolean;
    }
}
