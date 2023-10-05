import { ContentModelBasePluginEvent } from './ContentModelBasePluginEvent';
import type { ContentModelDocument, DOMSelection } from 'roosterjs-content-model-types';

/**
 * Represents a change to the editor made by another plugin with content model inside
 */
export default interface ContentModelContentChangedEvent
    extends ContentModelBasePluginEvent<'contentChanged'> {
    /**
     * Source of the change
     */
    source: string;

    /**
     * Optional related data
     */
    data?: any;

    /*
     * Additional Data Related to the ContentChanged Event
     */
    // additionalData?: ContentChangedData;

    /**
     * The content model that is applied which causes this content changed event
     */
    contentModel: ContentModelDocument;

    /**
     * Selection range applied to the document
     */
    selection?: DOMSelection;
}
