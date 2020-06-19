import BasePluginEvent from './BasePluginEvent';
import Entity from '../interface/Entity';
import { EntityOperation } from '../enum/EntityOperation';
import { PluginEventType } from './PluginEventType';

/**
 * Provide a chance for plugins to handle entity related events.
 * See enum EntityOperation for more details about each operation
 */
export default interface EntityOperationEvent
    extends BasePluginEvent<PluginEventType.EntityOperation> {
    /**
     * Operation to this entity
     */
    operation: EntityOperation;

    /**
     * The entity that editor is operating on
     */
    entity: Entity;

    /**
     * Optional raw UI event. Need to do null check before use its value
     */
    rawEvent?: UIEvent;
}
