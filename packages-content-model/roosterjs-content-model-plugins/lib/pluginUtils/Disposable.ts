/**
 * @internal
 * Represents a disposable object
 */
export default interface Disposable {
    /**
     * Dispose this object
     */
    dispose: () => void;
}
