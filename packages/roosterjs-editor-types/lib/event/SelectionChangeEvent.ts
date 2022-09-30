import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from '../enum/PluginEventType';
import { SelectionRangeEx } from '../interface/SelectionRangeEx';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * Data of SelectionChangedEvent
 */
export interface SelectionChangedEventData {
    /**
     * Information of the selection
     */
    selectionRangeEx: SelectionRangeEx | null;
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
