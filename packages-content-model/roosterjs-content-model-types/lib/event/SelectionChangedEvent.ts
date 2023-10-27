import type { BasePluginEvent } from './BasePluginEvent';
import type { DOMSelection } from 'roosterjs-content-model-types';

/**
 * Represents an event that will be fired when the user changed the selection
 */
export interface SelectionChangedEvent extends BasePluginEvent<'selectionChanged'> {
    /**
     * Original selection before change
     */
    oldSelection: DOMSelection | null;

    /**
     * New selection after change
     */
    newSelection: DOMSelection;
}
