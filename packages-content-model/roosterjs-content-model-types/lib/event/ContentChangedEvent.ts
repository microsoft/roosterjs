import type { BasePluginEvent } from './BasePluginEvent';
import type { ContentModelDocument, DOMSelection } from 'roosterjs-content-model-types';
import type { ChangeSource } from '../parameter/ChangeSource';
import type { ContentChangedData } from '../parameter/ContentChangedData';

/**
 * Represents a change to the editor made by another plugin with content model inside
 */
export interface ContentChangedEvent extends BasePluginEvent<'contentChanged'> {
    /**
     * Source of the change
     */
    source: ChangeSource | string;

    /*
     * Additional Data Related to the ContentChanged Event
     */
    changeData: ContentChangedData;

    /**
     * The content model that is applied which causes this content changed event
     */
    contentModel: ContentModelDocument;

    /**
     * Selection range applied to the document
     */
    selection?: DOMSelection;
}
