import type { DOMSelection } from '../selection/DOMSelection';
import type {
    CompatibleSelectionChangedEvent,
    SelectionChangedEvent,
    SelectionChangedEventData,
} from 'roosterjs-editor-types';

/**
 * Data of ContentModelSelectionChangedEvent
 */
export interface ContentModelSelectionChangedEventData extends SelectionChangedEventData {
    /**
     * The new selection after change
     */
    newSelection: DOMSelection | null;
}

/**
 * Represents an event that will be fired when the user changed the selection
 */
export interface ContentModelSelectionChangedEvent
    extends ContentModelSelectionChangedEventData,
        SelectionChangedEvent {}

/**
 * Represents an event that will be fired when the user changed the selection
 */
export interface CompatibleContentModelSelectionChangedEvent
    extends ContentModelSelectionChangedEventData,
        CompatibleSelectionChangedEvent {}
