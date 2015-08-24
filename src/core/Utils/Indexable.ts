/** Compiler friendly interface that allows objects to have a typed string index accessor and not have to resort to the 'suppressImplicitAnyIndexErrors' compiler option. */
interface Indexable<T> {
    [key: string]: T;
}
