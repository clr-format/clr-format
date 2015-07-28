var Format;

!function(Format) {
    var Prototypes;
    !function(Prototypes) {
        function format() {
            for (var args = [], _i = 0; _i < arguments.length; _i++) args[_i - 0] = arguments[_i];
            var provider = args[0];
            return provider && "function" == typeof provider.getFormatter ? (args.shift(), Format.innerFormat(provider, this, args)) : Format.innerFormat(void 0, this, args);
        }
        Prototypes.format = format;
    }(Prototypes = Format.Prototypes || (Format.Prototypes = {}));
}(Format || (Format = {}));

var Format;

!function(Format) {
    var Configuration = function() {
        function Configuration() {}
        return Configuration.prototype.addFormatToPrototype = function() {
            return String.prototype.format = Format.Prototypes.format, this;
        }, Configuration.prototype.removeFormatFromPrototype = function() {
            return delete String.prototype.format, this;
        }, Configuration;
    }();
    Format.Configuration = Configuration, Format.Config = new Configuration();
}(Format || (Format = {}));