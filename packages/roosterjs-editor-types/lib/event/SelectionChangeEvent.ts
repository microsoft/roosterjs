import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from '../enum/PluginEventType';
import { SelectionRangeTypes } from '../enum';
import { TableSelection } from '../interface';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * Data of SelectionChangedEvent
 */
export interface SelectionChangedEventData {
    /**
     * Type of the selection
     */
    selectionType: SelectionRangeTypes;

    /**
     * The HTMLElement selected
     */
    selectedElement?: HTMLElement;

    /**
     * The range selected
     */
    range?: Range;

    /**
     * If is a table selection, the coordinates of the selection
     */
    coordinates?: TableSelection;
}

/**
 * Represents an event that will be fired when the user changed the selection
 */
export default interface SelectionChangedEvent
    extends SelectionChangedEventData,
        BasePluginEvent<PluginEventType.SelectionChanged> {}

/**
 * Represents an event that will be fired when the user changed the selection
 */
export interface CompatibleSelectionChangedEvent
    extends SelectionChangedEventData,
        BasePluginEvent<CompatiblePluginEventType.SelectionChanged> {}
