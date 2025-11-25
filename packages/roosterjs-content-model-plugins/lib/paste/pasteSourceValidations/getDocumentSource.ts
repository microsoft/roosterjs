import { documentContainWacElements } from './documentContainWacElements';
import { isExcelDesktopDocument } from './isExcelDesktopDocument';
import { isExcelNotNativeEvent } from './isExcelNonNativeEvent';
import { isExcelOnlineDocument } from './isExcelOnlineDocument';
import { isGoogleSheetDocument } from './isGoogleSheetDocument';
import { isOneNoteDesktopDocument } from './isOneNoteDocument';
import { isPowerPointDesktopDocument } from './isPowerPointDesktopDocument';
import { isWordDesktopDocument } from './isWordDesktopDocument';
import { shouldConvertToSingleImage } from './shouldConvertToSingleImage';
import type { EditorEnvironment } from 'roosterjs-content-model-types';

/**
 * @internal
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

/**
 * @internal
 * Represent the types of sources to handle in the Paste Plugin
 */
export type KnownPasteSourceType =
    | 'wordDesktop'
    | 'excelDesktop'
    | 'excelOnline'
    | 'powerPointDesktop'
    | 'googleSheets'
    | 'wacComponents'
    | 'default'
    | 'singleImage'
    | 'excelNonNativeEvent'
    | 'oneNoteDesktop';

/**
 * @internal
 */
export type GetSourceFunction = (props: GetSourceInputParams) => boolean;

const getSourceFunctions = new Map<KnownPasteSourceType, GetSourceFunction>([
    ['wordDesktop', isWordDesktopDocument],
    ['excelDesktop', isExcelDesktopDocument],
    ['excelOnline', isExcelOnlineDocument],
    ['powerPointDesktop', isPowerPointDesktopDocument],
    ['wacComponents', documentContainWacElements],
    ['googleSheets', isGoogleSheetDocument],
    ['singleImage', shouldConvertToSingleImage],
    ['excelNonNativeEvent', isExcelNotNativeEvent],
    ['oneNoteDesktop', isOneNoteDesktopDocument],
]);

/**
 * @internal
 * This function tries to get the source of the Pasted content
 * @param event the before paste event
 * @param shouldConvertSingleImage Whether convert single image is enabled.
 * @returns The Type of pasted content, if no type found will return {KnownSourceType.Default}
 */
export function getDocumentSource(param: GetSourceInputParams): KnownPasteSourceType {
    let result: KnownPasteSourceType | null = null;

    getSourceFunctions.forEach((func, key) => {
        if (!result && func(param)) {
            result = key;
        }
    });

    return result ?? 'default';
}
