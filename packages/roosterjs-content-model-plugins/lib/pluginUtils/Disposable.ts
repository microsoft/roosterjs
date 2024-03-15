/**
 * @internal
 * Represents a disposable object
 */
export interface Disposable {
    /**
     * Dispose this object
     */
    dispose: () => void;
}
