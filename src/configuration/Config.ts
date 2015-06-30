/// <reference path="API" />

module Format {

    export class Configuration {

        addFormatToPrototype() {

            String.prototype.format = function(...args: Object[]) {

                let provider = <Globalization.FormatProvider>args[0];
                if (provider && typeof provider.getFormatter === "function") {
                    args.shift();
                    return innerFormat(provider, this, args);
                }

                return innerFormat(undefined, this, args);
            };

            return this;
        }
    }

    export var Config = new Configuration();
}
