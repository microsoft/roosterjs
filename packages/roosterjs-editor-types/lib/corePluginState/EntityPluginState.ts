/**
 * Represents an object of a cache item of a shadow DOM entity
 */
export interface ShadowEntityCache {
    /**
     * Entity wrapper element of the original entity
     */
    wrapper: HTMLElement;

    /**
     * The document fragment of hydrated entity content under shadow root
     */
    shadowDOM: DocumentFragment;
}

/**
 * The state object for EntityPlugin
 */
export default interface EntityPluginState {
    /**
     * @deprecated
     * Last clicking point when mouse down event happens
     */
    clickingPoint?: { pageX: number; pageY: number };

    /**
     * All known entity elements
     */
    knownEntityElements: HTMLElement[];

    /**
     * Cache for the hydrated content of shadow DOM entity.
     * When set content to replace the whole editor, we will cache the hydrated content
     * before it is gone, then after that we can use the cached content to rehydrate entity
     */
    shadowEntityCache: Record<string, ShadowEntityCache>;
}
