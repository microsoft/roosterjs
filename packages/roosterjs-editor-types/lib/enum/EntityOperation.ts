/**
 * Define possible operations to an entity
 */
export const enum EntityOperation {
    /**
     * Notify plugins that there is a new plugin was added into editor.
     * Plugin can handle this event to entity hydration.
     * This event will be only fired once for each entity DOM node.
     * After undo, or copy/paste, since new DOM nodes were added, this event will be fired
     * for those entites represented by newly added nodes.
     */
    NewEntity,

    /**
     * Notify plugins that user is clicking target to an entity
     */
    Click,

    /**
     * Notify plugins that user is triggering context menu to an entity
     */
    ContextMenu,

    /**
     * Notify plugins that user is escaping from an entity by pressing ESC key
     */
    Escape,

    /**
     * Notify plugins that user is removing an entity from its start position using DELETE key
     */
    RemoveFromStart,

    /**
     * Notify plugins that user is remove an entity from its end position using BACKSPACE key
     */
    RemoveFromEnd,

    /**
     * Notify plugins that an entity is being overwritten.
     * This can be causes by key in, cut, paste, delete, backspace ... on a selection
     * which contains some entites.
     */
    Overwrite,

    /**
     * Notify plugins that an entity is being partially overwritten.
     * This happens when user selected part of the entity then do key press, or cut, paste, delete, backspace, ...
     */
    PartialOverwrite,

    /**
     * Notify plugins that editor is generating HTML content for save.
     * Plugin should use this event to remove any temporary content, and only leave DOM nodes that
     * should be saved as HTML string.
     * This event will provide a cloned DOM tree for each entity, do NOT compare the DOM nodes with cached nodes
     * because it will always return false.
     */
    ReplaceTemporaryContent,
}
