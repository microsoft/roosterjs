import type { ContentModelEntity } from '../entity/ContentModelEntity';
import type { EntityRemovalOperation } from '../enum/EntityOperation';
import type { ContentModelDocument } from '../group/ContentModelDocument';
import type { DOMSelection } from '../selection/DOMSelection';
import type {
    CompatibleContentChangedEvent,
    ContentChangedEvent,
    ContentChangedEventData,
} from 'roosterjs-editor-types';

/**
 * Represents an entity that has been changed during a content change process
 */
export interface ChangedEntity {
    /**
     * The changed entity
     */
    entity: ContentModelEntity;

    /**
     * Operation that causes the change
     */
    operation: EntityRemovalOperation | 'newEntity';

    /**
     * @optional Raw DOM event that causes the chagne
     */
    rawEvent?: Event;
}

/**
 * Data of ContentModelContentChangedEvent
 */
export interface ContentModelContentChangedEventData extends ContentChangedEventData {
    /**
     * The content model that is applied which causes this content changed event
     */
    readonly contentModel?: ContentModelDocument;

    /**
     * Selection range applied to the document
     */
    readonly selection?: DOMSelection;

    /**
     * Entities got changed (added or removed) during the content change process
     */
    readonly changedEntities?: ChangedEntity[];
}

/**
 * Represents a change to the editor made by another plugin with content model inside
 */
export interface ContentModelContentChangedEvent
    extends ContentChangedEvent,
        ContentModelContentChangedEventData {}

/**
 * Represents a change to the editor made by another plugin with content model inside
 */
export interface CompatibleContentModelContentChangedEvent
    extends CompatibleContentChangedEvent,
        ContentModelContentChangedEventData {}
