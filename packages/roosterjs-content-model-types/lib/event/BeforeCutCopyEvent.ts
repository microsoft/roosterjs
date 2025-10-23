import type { BasePluginDomEvent } from './BasePluginEvent';
import type { ContentModelDocument } from '../contentModel/blockGroup/ContentModelDocument';

/**
 * Provides a chance for plugin to change the content before it is copied from editor.
 */
export interface BeforeCutCopyEvent extends BasePluginDomEvent<'beforeCutCopy', ClipboardEvent> {
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
     * The model adjusted by beforeCutCopy event
     */
    pasteModel?: ContentModelDocument;
}
