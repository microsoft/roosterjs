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
