/**
 * @internal
 * Represents all info of a known entity, including its DOM element, whether it is deleted and if it can be persisted
 */
export interface KnownEntityItem {
    /**
     * The HTML element of entity wrapper
     */
    element: HTMLElement;

    /**
     * Whether this entity is deleted.
     */
    isDeleted?: boolean;

    /**
     * Whether we want to persist this entity element during undo/redo
     */
    canPersist?: boolean;
}

/**
 * @internal
 * The state object for EntityPlugin
 */
export interface EntityPluginState {
    /**
     * Entities cached for undo snapshot
     */
    entityMap: Record<string, KnownEntityItem>;
}
