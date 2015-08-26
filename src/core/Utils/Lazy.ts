/// <reference path="../../use-strict" />

/// <reference path="Function" />
/// <reference path="Constructable" />

/// <reference path="../Errors/ArgumentError" />
/// <reference path="../Errors/ArgumentNullError" />

namespace Format.Utils {
    /**
     * Provides support for lazy initialization.
     *
     * See: https://msdn.microsoft.com/en-us/library/dd642331.aspx
     * @param T The type of object that is being lazily initialized.
     */
    export class Lazy<T> {

        private value: T;
        private valueError: Error;
        private valueCreated: boolean;
        private valueFactory: () => T;
        private valueConstructor: Constructable<T>;

        /**
         * Initializes a new instance of the class that uses the supplied value factory.
         * @param valueFactory The delegate that is invoked to produce the lazily initialized value when it is needed.
         */
        constructor(valueFactory: () => T) {

            if (valueFactory == null) {
                throw new Errors.ArgumentNullError("valueFactory");
            }

            this.valueCreated = false;
            this.valueFactory = valueFactory;
        }

        /**
         * Returns a new instance of the class that uses the specified constructor to create a value of its type.
         * @param TStatic The type of object that is being lazily initialized.
         * @param valueConstructor The parameterless constructor that is invoked to produce the lazily initialized value when it is needed.
         */
        public static fromConstructor<TStatic>(valueConstructor: Constructable<TStatic>): Lazy<TStatic> {

            if (valueConstructor == null) {
                throw new Errors.ArgumentNullError("valueConstructor");
            }

            let instance = new Lazy(Function.getEmpty<TStatic>());
            instance.valueConstructor = valueConstructor;

            return instance;
        }

        /**
         * Gets the lazily initialized value of the current [[Lazy]] instance.
         * @returns The lazily initialized value of the current instance.
         */
        public getValue(): T {

            if (this.valueError) {
                throw this.valueError;
            }

            if (!this.valueCreated) {
                this.value = this.lazyInitValue();
            }

            return this.value;
        }

        /**
         * Gets a value that indicates whether a value has been created for this [[Lazy]] instance.
         * @returns `true` if a value has been created for this instance; otherwise, `false`.
         */
        public isValueCreated(): boolean {
            return this.valueCreated;
        }

        private lazyInitValue(): T {
            try {
                return this.createValue();
            }
            catch (error) {
                throw this.valueError = new Errors.InvalidOperationError("Lazy value initializer threw an error: " + (<Error> error).message, error);
            }
            finally {
                this.valueCreated = true;
            }
        }

        private createValue(): T {
            return this.valueConstructor ?
                new this.valueConstructor() :
                this.valueFactory();
        }
    }
}
