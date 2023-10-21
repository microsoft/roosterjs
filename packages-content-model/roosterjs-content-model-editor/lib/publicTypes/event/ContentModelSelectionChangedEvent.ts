import BasePluginEvent from './BasePluginEvent';
import { DOMSelection } from 'roosterjs-content-model-types';

/**
 * Represents an event that will be fired when the user changed the selection
 */
export interface ContentModelSelectionChangedEvent extends BasePluginEvent<'selectionChanged'> {
    selection: DOMSelection;
}
