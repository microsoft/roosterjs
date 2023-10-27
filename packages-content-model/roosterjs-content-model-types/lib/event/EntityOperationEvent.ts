import type { ContentModelEntity } from 'roosterjs-content-model-types';
import type { BasePluginEvent } from './BasePluginEvent';
import type { EntityOperation } from '../parameter/EntityOperation';

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
