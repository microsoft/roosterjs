import documentContainWacElements from './documentContainWacElements';
import isExcelDesktopDocument from './isExcelDesktopDocument';
import isExcelOnlineDocument from './isExcelOnlineDocument';
import isGoogleSheetDocument from './isGoogleSheetDocument';
import isPowerPointDesktopDocument from './isPowerPointDesktopDocument';
import isWordDesktopDocument from './isWordDesktopDocument';
import shouldConvertToSingleImage from './shouldConvertToSingleImage';
import { BeforePasteEvent, ClipboardData } from 'roosterjs-editor-types';
import { KnownSourceType } from './KnownSourceType';

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

const getSourceFunctions = new Map<KnownSourceType, getSourceFunction>([
    [KnownSourceType.WordDesktop, isWordDesktopDocument],
    [KnownSourceType.ExcelDesktop, isExcelDesktopDocument],
    [KnownSourceType.ExcelOnline, isExcelOnlineDocument],
    [KnownSourceType.PowerPointDesktop, isPowerPointDesktopDocument],
    [KnownSourceType.WacComponents, documentContainWacElements],
    [KnownSourceType.GoogleSheets, isGoogleSheetDocument],
    [KnownSourceType.SingleImage, shouldConvertToSingleImage],
]);

/**
 * @internal
 * This function tries to get the source of the Pasted content
 * @param event the before paste event
 * @param shouldConvertSingleImage Whether convert single image is enabled.
 * @returns The Type of pasted content, if no type found will return {KnownSourceType.Default}
 */
export default function getPasteSource(
    event: BeforePasteEvent,
    shouldConvertSingleImage: boolean
): KnownSourceType {
    const { htmlAttributes, clipboardData, fragment } = event;

    let result: KnownSourceType | null = null;
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

    return result ?? KnownSourceType.Default;
}
