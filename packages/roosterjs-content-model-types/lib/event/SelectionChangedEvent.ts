import type { BasePluginEvent } from './BasePluginEvent';
import type { DOMSelection } from '../selection/DOMSelection';

/**
 * Represents an event that will be fired when the user changed the selection
 */
export interface SelectionChangedEvent extends BasePluginEvent<'selectionChanged'> {
    /**
     * The new selection after change
     */
    newSelection: DOMSelection | null;
}
