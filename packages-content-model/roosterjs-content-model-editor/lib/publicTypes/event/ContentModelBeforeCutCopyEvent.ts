import type { ContentModelBasePluginEvent } from './ContentModelBasePluginEvent';

/**
 * Data of BeforeCutCopyEvent
 */
export interface BeforeCutCopyEventData {}

/**
 * Provides a chance for plugin to change the content before it is copied from editor.
 */
export default interface BeforeCutCopyEvent extends ContentModelBasePluginEvent<'beforeCutCopy'> {
    /**
     * Raw DOM event
     */
    rawEvent: ClipboardEvent;

    /**
     * An object contains all related data for pasting
     */
    clonedRoot: HTMLDivElement;

    /**
     * The selection range under cloned root
     */
    range: Range;

    /**
     * Whether this is a cut event
     */
    isCut: boolean;
}
