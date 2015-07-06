/// <reference path="API" />

/// <reference path="Prototypes/Format" />

module Format {

    export class Configuration {

        addFormatToPrototype(): Configuration {
            String.prototype.format = Prototypes.format;
            return this;
        }

        removeFormatFromPrototype(): Configuration {
            delete String.prototype.format;
            return this;
        }
    }

    export var Config = new Configuration();
}
