/**
 * A utility Wrapper interface to help wrap any given type of object.
 * With the wrapper it is ok to change the wrapped value and we still hold its wrapper
 * so that we will not lose the wrapped value.
 */
export default interface Wrapper<T> {
    /**
     * The wrapped value
     */
    value: T | null;
}
