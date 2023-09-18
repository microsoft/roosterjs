import { ContentModelDocument } from 'roosterjs-content-model-types';
import {
    CompatibleContentChangedEvent,
    ContentChangedEvent,
    ContentChangedEventData,
    SelectionRangeEx,
} from 'roosterjs-editor-types';

/**
 * Data of ContentModelContentChangedEvent
 */
export interface ContentModelContentChangedEventData extends ContentChangedEventData {
    /**
     * The content model that is applied which causes this content changed event
     */
    contentModel: ContentModelDocument;

    /**
     * Selection range applied to the document
     */
    rangeEx?: SelectionRangeEx;
}

/**
 * Represents a change to the editor made by another plugin with content model inside
 */
export default interface ContentModelContentChangedEvent
    extends ContentChangedEvent,
        ContentModelContentChangedEventData {}

/**
 * Represents a change to the editor made by another plugin with content model inside
 */
export interface CompatibleContentModelContentChangedEvent
    extends CompatibleContentChangedEvent,
        ContentModelContentChangedEventData {}
