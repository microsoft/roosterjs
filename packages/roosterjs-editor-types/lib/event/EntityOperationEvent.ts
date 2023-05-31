import BasePluginEvent from './BasePluginEvent';
import Entity from '../interface/Entity';
import { EntityOperation } from '../enum/EntityOperation';
import { PluginEventType } from '../enum/PluginEventType';
import type { CompatibleEntityOperation } from '../compatibleEnum/EntityOperation';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * Data of EntityOperationEvent
 */
export interface EntityOperationEventData {
    /**
     * Operation to this entity
     */
    operation: EntityOperation | CompatibleEntityOperation;

    /**
     * The entity that editor is operating on
     */
    entity: Entity;

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

    /**
     * @deprecated
     */
    contentForShadowEntity?: DocumentFragment;
}

/**
 * Provide a chance for plugins to handle entity related events.
 * See enum EntityOperation for more details about each operation
 */
export default interface EntityOperationEvent
    extends EntityOperationEventData,
        BasePluginEvent<PluginEventType.EntityOperation> {}

/**
 * Provide a chance for plugins to handle entity related events.
 * See enum EntityOperation for more details about each operation
 */
export interface CompatibleEntityOperationEvent
    extends EntityOperationEventData,
        BasePluginEvent<CompatiblePluginEventType.EntityOperation> {}
