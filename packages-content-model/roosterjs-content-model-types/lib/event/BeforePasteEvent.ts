import type { PasteType } from '../enum/PasteType';
import type { ClipboardData } from '../parameter/ClipboardData';
import type { BasePluginEvent } from './BasePluginEvent';
import type { DomToModelOption } from '../context/DomToModelOption';
import type { ContentModelDocument } from '../group/ContentModelDocument';
import type { InsertPoint } from '../selection/InsertPoint';

/**
 * Options for DOM to Content Model conversion for paste only
 */
export interface DomToModelOptionForPaste extends Required<DomToModelOption> {
    /**
     * Additional allowed HTML tags in lower case. Element with these tags will be preserved
     */
    readonly additionalAllowedTags: Lowercase<string>[];

    /**
     * Additional disallowed HTML tags in lower case. Elements with these tags will be dropped
     */
    readonly additionalDisallowedTags: Lowercase<string>[];
}

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
 * Data of ContentModelBeforePasteEvent
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
    readonly domToModelOption: DomToModelOptionForPaste;

    /**
     * customizedMerge Customized merge function to use when merging the paste fragment into the editor
     */
    customizedMerge?: MergePastedContentFunc;
}
