import { ContentModelBasePluginEvent } from './ContentModelBasePluginEvent';
import { DOMSelection } from 'roosterjs-content-model-types';

/**
 * Represents an event that will be fired when the user changed the selection
 */
export default interface ContentModelSelectionChangeEvent
    extends ContentModelBasePluginEvent<'selectionChanged'> {
    /**
     * Information of the selection
     */
    domSelection: DOMSelection;
}
