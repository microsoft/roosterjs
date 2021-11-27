import BasePluginEvent from './BasePluginEvent';
import { PluginEventType } from './PluginEventType';

/**
 * Provides a chance for plugin to change the content before it is copied from editor.
 */
export default interface BeforeCutCopyEvent extends BasePluginEvent<PluginEventType.BeforeCutCopy> {
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

    /**
     * Is from virtual table selection
     */
    vTableSelection?: boolean;

    /**
     * Start range of a vTable
     */
    vTableStartRange?: number[];

    /**
     * End range of a vTable
     */
    vTableEndRange?: number[];
}
