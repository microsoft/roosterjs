import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from '../enum/PluginEventType';
import type { CompatiblePluginEventType } from '../compatibleEnum/PluginEventType';

/**
 * Data of BeforeCutCopyEvent
 */
export interface BeforeCutCopyEventData {
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

/**
 * Provides a chance for plugin to change the content before it is copied from editor.
 */
export default interface BeforeCutCopyEvent
    extends BeforeCutCopyEventData,
        BasePluginEvent<PluginEventType.BeforeCutCopy> {}

/**
 * Provides a chance for plugin to change the content before it is copied from editor.
 */
export interface CompatibleBeforeCutCopyEvent
    extends BeforeCutCopyEventData,
        BasePluginEvent<CompatiblePluginEventType.BeforeCutCopy> {}
