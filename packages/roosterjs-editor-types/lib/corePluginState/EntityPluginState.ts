/**
 * Represents the type of entity item in entity map of EntityPluginState
 */
export interface EntityStateItem {
    /**
     * The HTML element of entity wrapper
     */
    element: HTMLElement;

    /**
     * Whether this entity is deleted.
     */
    isDelete?: boolean;

    /**
     * Whether we want to persist this entity element during undo/redo
     */
    canPersist?: boolean;
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
     * @deprecated
     * All known entity elements
     */
    knownEntityElements?: HTMLElement[];

    /**
     * Cache for the hydrated content of shadow DOM entity.
     * When set content to replace the whole editor, we will cache the hydrated content
     * before it is gone, then after that we can use the cached content to rehydrate entity
     */
    shadowEntityCache: Record<string, HTMLElement>;

    /**
     * Entities cached for undo snapshot
     */
    entityMap: Record<string, EntityStateItem>;
}
