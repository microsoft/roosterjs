import BasePluginEvent from './BasePluginEvent';
import TableSelection from '../interface/TableSelection';
import { PluginEventType } from '../enum/PluginEventType';
import { SelectionRangeTypes } from '../enum/SelectionRangeTypes';
import type { CompatibleSelectionRangeTypes } from '../compatibleEnum/SelectionRangeTypes';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * Data of SelectionChangedEvent
 */
export interface SelectionChangedEventData {
    /**
     * Type of the selection
     */
    selectionType: SelectionRangeTypes | CompatibleSelectionRangeTypes;

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

    /**
     * If the selection changed was caused by a keyboard event, the key that changed selection
     */
    keyboardKey?: number | string;
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
