import type { ContentModelDocument } from '../group/ContentModelDocument';
import type { DOMSelection } from '../selection/DOMSelection';
import type {
    CompatibleContentChangedEvent,
    ContentChangedEvent,
    ContentChangedEventData,
} from 'roosterjs-editor-types';

/**
 * Data of ContentModelContentChangedEvent
 */
export interface ContentModelContentChangedEventData extends ContentChangedEventData {
    /**
     * The content model that is applied which causes this content changed event
     */
    contentModel?: ContentModelDocument;

    /**
     * Selection range applied to the document
     */
    selection?: DOMSelection;
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
