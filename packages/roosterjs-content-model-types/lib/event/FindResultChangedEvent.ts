import type { BasePluginEvent } from './BasePluginEvent';

/**
 * Represents an event that occurs when the find result changes in the editor
 */
export interface FindResultChangedEvent extends BasePluginEvent<'findResultChanged'> {
    /**
     * The index of the currently marked find result
     */
    readonly markedIndex: number;

    /**
     * The array of ranges representing the current find results
     */
    readonly ranges: ReadonlyArray<Range>;

    /**
     * An alternative range to select when there is no marked result
     */
    readonly alternativeRange?: Range | null;
}
