import type { ContentModelBasePluginEvent } from './ContentModelBasePluginEvent';
import type { DOMSelection } from 'roosterjs-content-model-types';

/**
 * Represents an event that will be fired when the user changed the selection
 */
export interface ContentModelSelectionChangedEvent
    extends ContentModelBasePluginEvent<'selectionChanged'> {
    selection: DOMSelection;
}
