import { documentContainWacElements } from './documentContainWacElements';
import { isExcelDesktopDocument } from './isExcelDesktopDocument';
import { isExcelNotNativeEvent } from './isExcelNonNativeEvent';
import { isExcelOnlineDocument } from './isExcelOnlineDocument';
import { isGoogleSheetDocument } from './isGoogleSheetDocument';
import { isOneNoteDesktopDocument } from './isOneNoteDocument';
import { isPowerPointDesktopDocument } from './isPowerPointDesktopDocument';
import { isWordDesktopDocument } from './isWordDesktopDocument';
import { shouldConvertToSingleImage } from './shouldConvertToSingleImage';
import type {
    BeforePasteEvent,
    ClipboardData,
    EditorEnvironment,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export type GetSourceInputParams = {
    htmlAttributes: Record<string, string>;
    fragment: DocumentFragment;
    shouldConvertSingleImage: boolean;
    clipboardData: ClipboardData;
    environment: EditorEnvironment;
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
export function getPasteSource(
    event: BeforePasteEvent,
    shouldConvertSingleImage: boolean,
    environment: EditorEnvironment
): KnownPasteSourceType {
    const { htmlAttributes, clipboardData, fragment } = event;

    let result: KnownPasteSourceType | null = null;
    const param: GetSourceInputParams = {
        htmlAttributes,
        fragment,
        shouldConvertSingleImage,
        clipboardData,
        environment,
    };

    getSourceFunctions.forEach((func, key) => {
        if (!result && func(param)) {
            result = key;
        }
    });

    return result ?? 'default';
}
