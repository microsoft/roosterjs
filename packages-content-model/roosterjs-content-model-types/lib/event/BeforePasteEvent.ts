import type { DomToModelOptionForSanitizing } from '../context/DomToModelOption';
import type { PasteType } from '../enum/PasteType';
import type { ClipboardData } from '../parameter/ClipboardData';
import type { BasePluginEvent } from './BasePluginEvent';
import type { ContentModelDocument } from '../group/ContentModelDocument';
import type { InsertPoint } from '../selection/InsertPoint';

/**
 * A function type used by merging pasted content into current Content Model
 * @param target Target Content Model to merge into
 * @param source Source Content Model to merge from
 * @returns Insert point after merge
 */
export type MergePastedContentFunc = (
    target: ContentModelDocument,
    source: ContentModelDocument
) => InsertPoint | null;

/**
 * Data of BeforePasteEvent
 */
export interface BeforePasteEvent extends BasePluginEvent<'beforePaste'> {
    /**
     * An object contains all related data for pasting
     */
    readonly clipboardData: ClipboardData;

    /**
     * HTML Document Fragment which will be inserted into content
     */
    readonly fragment: DocumentFragment;

    /**
     * Stripped HTML string before "StartFragment" comment
     */
    readonly htmlBefore: string;

    /**
     * Stripped HTML string after "EndFragment" comment
     */
    readonly htmlAfter: string;

    /**
     * Attributes of the root "HTML" tag
     */
    readonly htmlAttributes: Record<string, string>;

    /**
     * Paste type option (as plain text, merge format, normal, as image)
     */
    readonly pasteType: PasteType;

    /**
     * domToModel Options to use when creating the content model from the paste fragment
     */
    readonly domToModelOption: DomToModelOptionForSanitizing;

    /**
     * customizedMerge Customized merge function to use when merging the paste fragment into the editor
     */
    customizedMerge?: MergePastedContentFunc;
}
