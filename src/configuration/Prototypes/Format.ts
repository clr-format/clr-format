module Format.Prototypes {
    export function format(...args: Object[]) {

        let provider = <Format.Globalization.FormatProvider>args[0];
        if (provider && typeof provider.getFormatter === "function") {
            args.shift();
            return Format.innerFormat(provider, this, args);
        }

        return Format.innerFormat(undefined, this, args);
    };
}
