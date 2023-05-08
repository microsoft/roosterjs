import documentContainWacElements from './documentContainWacElements';
import isExcelDesktopDocument from './isExcelDesktopDocument';
import isExcelOnlineDocument from './isExcelOnlineDocument';
import isGoogleSheetDocument from './isGoogleSheetDocument';
import isPowerPointDesktopDocument from './isPowerPointDesktopDocument';
import isWordDesktopDocument from './isWordDesktopDocument';
import shouldConvertToSingleImage from './shouldConvertToSingleImage';
import { BeforePasteEvent, ClipboardData, KnownPasteSourceType } from 'roosterjs-editor-types';

/**
 * @internal
 */
export type getSourceInputParams = {
    htmlAttributes: Record<string, string>;
    fragment: DocumentFragment;
    shouldConvertSingleImage: boolean;
    clipboardData: ClipboardData;
};

/**
 * @internal
 */
export type getSourceFunction = (props: getSourceInputParams) => boolean;

const getSourceFunctions = new Map<KnownPasteSourceType, getSourceFunction>([
    [KnownPasteSourceType.WordDesktop, isWordDesktopDocument],
    [KnownPasteSourceType.ExcelDesktop, isExcelDesktopDocument],
    [KnownPasteSourceType.ExcelOnline, isExcelOnlineDocument],
    [KnownPasteSourceType.PowerPointDesktop, isPowerPointDesktopDocument],
    [KnownPasteSourceType.WacComponents, documentContainWacElements],
    [KnownPasteSourceType.GoogleSheets, isGoogleSheetDocument],
    [KnownPasteSourceType.SingleImage, shouldConvertToSingleImage],
]);

/**
 * This function tries to get the source of the Pasted content
 * @param event the before paste event
 * @param shouldConvertSingleImage Whether convert single image is enabled.
 * @returns The Type of pasted content, if no type found will return {KnownSourceType.Default}
 */
export default function getPasteSource(
    event: BeforePasteEvent,
    shouldConvertSingleImage: boolean
): KnownPasteSourceType {
    const { htmlAttributes, clipboardData, fragment } = event;

    let result: KnownPasteSourceType | null = null;
    const param: getSourceInputParams = {
        htmlAttributes,
        fragment,
        shouldConvertSingleImage,
        clipboardData,
    };

    getSourceFunctions.forEach((func, key) => {
        if (!result && func(param)) {
            result = key;
        }
    });

    return result ?? KnownPasteSourceType.Default;
}
