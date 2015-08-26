/**
 * Compiler friendly interface that allows objects to have a typed string index accessor and not have to resort to the 'suppressImplicitAnyIndexErrors' compiler option.
 * @param T The type of object returned by the indexer.
 */
interface Indexable<T> {
    [key: string]: T;
}
