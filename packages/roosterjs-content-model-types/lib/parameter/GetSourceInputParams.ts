import type { EditorEnvironment } from './EditorEnvironment';

/**
 * The input parameters for getDocumentSource function
 */
export type GetSourceInputParams = {
    /**
     * HTML attributes from the content that is being checked
     */
    htmlAttributes: Record<string, string>;
    /**
     * Document fragment of the checked content
     */
    fragment: DocumentFragment | Document;
    /**
     * Whether convert single image is enabled
     */
    shouldConvertSingleImage?: boolean;
    /**
     * Array of tag names of the first level child nodes
     */
    htmlFirstLevelChildTags?: string[];
    /**
     * The clipboard item types
     */
    clipboardItemTypes?: string[];
    /**
     * The editor environment
     */
    environment: Omit<EditorEnvironment, 'domToModelSettings' | 'modelToDomSettings'>;
    /**
     * The raw HTML string from clipboard
     */
    rawHtml?: string | null;
};
