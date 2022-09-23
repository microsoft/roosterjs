import BasePluginEvent from './BasePluginEvent';
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
