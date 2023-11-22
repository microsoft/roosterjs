import { ContentModelEntity } from '../entity/ContentModelEntity';
import { EntityRemovalOperation } from '../enum/EntityOperation';
import type { ContentModelDocument } from '../group/ContentModelDocument';
import type { DOMSelection } from '../selection/DOMSelection';
import type {
    CompatibleContentChangedEvent,
    ContentChangedEvent,
    ContentChangedEventData,
} from 'roosterjs-editor-types';

export interface ChangedEntity {
    entity: ContentModelEntity;
    operation: EntityRemovalOperation | 'newEntity';
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
