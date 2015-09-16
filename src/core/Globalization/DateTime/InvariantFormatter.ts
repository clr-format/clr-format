/// <reference path="../../../use-strict" />

/// <reference path="OptionsProvider" />

/// <reference path="../CustomFormatter" />

namespace Format.Globalization.DateTime {
    /**
     * Invariant formatter implementation that applies invariant culture format to a date and time value.
     * @param T The type of the options container.
     */
    export class InvariantFormatter<T> implements CustomFormatter {

        /** Gets the result of the [[baseOptions]] field extended with concrete options returned from the [[optionsProvider]] instance. */
        protected resolvedOptions: T;

        private value: Date;
        private baseOptions: T;
        private optionsProvider: OptionsProvider<T>;
        private optionsProviderConstructor: { new (baseOptions: T): OptionsProvider<T> };

        /**
         * Creates an instance with base formatting options and initializes an options provider that resolves concrete format options.
         * @param optionsProviderConstructor A date and time options provider constructor which will be used to resolve options.
         * @param options A base options object that can be overridden by resolved options.
         */
        constructor(optionsProviderConstructor: { new (baseOptions: T): OptionsProvider<T> }, options?: T) {
            this.optionsProviderConstructor = optionsProviderConstructor;
            this.baseOptions = options || <T> {};
        }

        /**
         * Converts the date to an equivalent string representation using specified format and invariant culture formatting information.
         * @param format A format string containing formatting specifications.
         * @param value The date to format.
         */
        public format(format: string, value: Date): string {
            try {
                return this.innerFormat(format, value);
            }
            finally {
                this.cleanup();
            }
        }

        /**
         * Applies all resolved format options to the date object.
         * @param value The date to format.
         * @returns A resulting format value with applied format options.
         */
        protected applyOptions(value: Date): string {
            return value + "";
        }

        private innerFormat(format: string, value: Date): string {

            this.optionsProvider = new this.optionsProviderConstructor(this.baseOptions);
            this.resolvedOptions = this.optionsProvider.resolveOptions(format, value);

            if (!Utils.isObject(this.resolvedOptions)) {
                throw new Errors.InvalidOperationError(
                    "Invocation of 'optionsProvider' member's method 'resolveOptions' did not initialize instance member 'resolvedOptions' properly");
            }

            this.setValue(value);

            return this.applyOptions(value);
        }

        private setValue(value: Date): void {
            this.value = value;
        }

        private cleanup(): void {
            delete this.value;
            delete this.resolvedOptions;
            delete this.optionsProvider;
        }
    }
}
