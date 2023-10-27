import type { ContentModelEntity } from 'roosterjs-content-model-types';
import type { BasePluginEvent } from './BasePluginEvent';

/**
 * Define entity lifecycle related operations
 */
export type EntityLifecycleOperation =
    /**
     * Notify plugins that there is a new plugin was added into editor.
     * Plugin can handle this event to entity hydration.
     * This event will be only fired once for each entity DOM node.
     * After undo, or copy/paste, since new DOM nodes were added, this event will be fired
     * for those entities represented by newly added nodes.
     */
    | 'newEntity'

    /**
     * Notify plugins that editor is generating HTML content for save.
     * Plugin should use this event to remove any temporary content, and only leave DOM nodes that
     * should be saved as HTML string.
     * This event will provide a cloned DOM tree for each entity, do NOT compare the DOM nodes with cached nodes
     * because it will always return false.
     */
    | 'replaceTemporaryContent'
    /**
     * Notify plugins that a new entity state need to be updated to an entity.
     * This is normally happened when user undo/redo the content with an entity snapshot added by a plugin that handles entity
     */
    | 'UpdateEntityState';

/**
 * Define entity removal related operations
 */
export type EntityRemovalOperation =
    /**
     * Notify plugins that user is removing an entity from its start position using DELETE key
     */
    | 'removeFromStart'

    /**
     * Notify plugins that user is remove an entity from its end position using BACKSPACE key
     */
    | 'removeFromEnd'

    /**
     * Notify plugins that an entity is being overwritten.
     * This can be caused by key in, cut, paste, delete, backspace ... on a selection
     * which contains some entities.
     */
    | 'overwrite';

/**
 * Define possible operations to an entity
 */
export type EntityOperation = EntityLifecycleOperation | EntityRemovalOperation;

/**
 * Provide a chance for plugins to handle entity related events.
 * See enum EntityOperation for more details about each operation
 */
export interface EntityOperationEvent extends BasePluginEvent<'entityOperation'> {
    /**
     * Operation to this entity
     */
    operation: EntityOperation;

    /**
     * The entity that editor is operating on
     */
    entity: ContentModelEntity;

    /**
     * Optional raw event. Need to do null check before use its value
     */
    rawEvent?: Event;

    /**
     * For EntityOperation.UpdateEntityState, we use this object to pass the new entity state to plugin.
     * For other operation types, it is not used.
     */
    state?: string;

    /**
     * For EntityOperation.NewEntity, plugin can set this property to true then the entity will be persisted.
     * A persisted entity won't be touched during undo/redo, unless it does not exist after undo/redo.
     * For other operation types, this value will be ignored.
     */
    shouldPersist?: boolean;
}
