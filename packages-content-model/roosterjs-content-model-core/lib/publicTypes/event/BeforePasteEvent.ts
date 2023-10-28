import type { BasePluginEvent } from './BasePluginEvent';
import type {
    ClipboardData,
    ContentModelDocument,
    DomToModelOption,
    PasteType,
} from 'roosterjs-content-model-types';

/**
 * Data of BeforePasteEvent
 */
export interface BeforePasteEvent extends BasePluginEvent<'beforePaste'> {
    /**
     * An object contains all related data for pasting
     */
    clipboardData: ClipboardData;

    /**
     * HTML Document Fragment which will be inserted into content
     */
    fragment: DocumentFragment;

    /**
     * Stripped HTML string before "StartFragment" comment
     */
    htmlBefore: string;

    /**
     * Stripped HTML string after "EndFragment" comment
     */
    htmlAfter: string;

    /**
     * Attributes of the root "HTML" tag
     */
    htmlAttributes: Record<string, string>;

    /**
     * Paste type option (as plain text, merge format, normal, as image)
     */
    readonly pasteType: PasteType;

    /**
     * domToModel Options to use when creating the content model from the paste fragment
     */
    domToModelOption: Partial<DomToModelOption>;

    /**
     * customizedMerge Customized merge function to use when merging the paste fragment into the editor
     */
    customizedMerge?: (target: ContentModelDocument, source: ContentModelDocument) => void;
}
