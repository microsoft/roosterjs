import BasePluginEvent from './BasePluginEvent';
import { PasteType } from '../parameter/PasteType';
import type { ContentModelDocument, DomToModelOption } from 'roosterjs-content-model-types';

/**
 * The link preview pasted info provided by Edge
 */
export interface EdgeLinkPreview {
    /**
     * Domain of the source page
     */
    domain: string;

    /**
     * Preferred paste format
     */
    preferred_format: string;

    /**
     * Title of the source page
     */
    title: string;

    /**
     * Type of the paste content
     */
    type: string;

    /**
     * Url of the source page
     */
    url: string;
}

/**
 * An object contains all related data for pasting
 */
export interface ClipboardData {
    /**
     * Available types from clipboard event
     */
    types: string[];

    /**
     * Plain text from clipboard event
     */
    text: string;

    /**
     * HTML string from clipboard event.
     * When set to null, it means there's no HTML from clipboard event.
     * When set to undefined, it means there may be HTML in clipboard event, but fail to retrieve
     */
    rawHtml: string | null | undefined;

    /**
     * Link Preview information provided by Edge
     */
    linkPreview?: EdgeLinkPreview;

    /**
     * Image file from clipboard event
     */
    image: File | null;

    /**
     * General file from clipboard event
     */
    files?: File[];

    /**
     * Html extracted from raw html string and remove content before and after fragment tag
     */
    html?: string;

    /**
     * An editor content snapshot before pasting happens. This is used for changing paste format
     */
    snapshotBeforePaste?: ContentModelDocument;

    /**
     * BASE64 encoded data uri of the image if any
     */
    imageDataUri?: string | null;

    /**
     * Array of tag names of the first level child nodes
     */
    htmlFirstLevelChildTags?: string[];

    /**
     * Value of custom paste type. By default it is always empty.
     * To allow custom paste type, pass the allowed types to EditorOptions.allowedCustomPasteType
     */
    customValues: Record<string, string>;

    /**
     * If true, the event was triggered by a native paste event (keyboard or native context menu paste)
     */
    readonly pasteNativeEvent?: boolean;
}

/**
 * Data of ContentModelBeforePasteEvent
 */
export interface ContentModelBeforePasteEvent extends BasePluginEvent<'beforePaste'> {
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
