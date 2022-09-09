import documentContainWacElements from './documentContainWacElements';
import isExcelDesktopDocument from './isExcelDesktopDocument';
import isGoogleSheetDocument from './isGoogleSheetDocument';
import isPowerPointDesktopDocument from './isPowerPointDesktopDocument';
import isWordDesktopDocument from './isWordDesktopDocument';
import shouldConvertToSingleImage from './shouldConvertToSingleImage';
import { BeforePasteEvent, ClipboardData, IEditor } from 'roosterjs-editor-types';
import { KnownSourceType } from './KnownSourceType';

/**
 * @internal
 */
export type getSourceInputParams = {
    htmlAttributes: Record<string, string>;
    fragment: DocumentFragment;
    editor: IEditor;
    clipboardData: ClipboardData;
};

/**
 * @internal
 */
export type getSourceFunction = (props: getSourceInputParams) => boolean;

const getSourceFunctions = new Map<KnownSourceType, getSourceFunction>([
    [KnownSourceType.WordDesktop, isWordDesktopDocument],
    [KnownSourceType.ExcelDesktop, isExcelDesktopDocument],
    [KnownSourceType.PowerPointDesktop, isPowerPointDesktopDocument],
    [KnownSourceType.WacComponents, documentContainWacElements],
    [KnownSourceType.GoogleSheets, isGoogleSheetDocument],
    [KnownSourceType.SingleImage, shouldConvertToSingleImage],
]);

/**
 * @internal
 * This function tries to get the source of the Pasted content
 * @param event the before paste event
 * @param editor editor instance
 * @returns The Type of pasted content, if no type found will return {KnownSourceType.Default}
 */
export default function getPasteSource(event: BeforePasteEvent, editor: IEditor): KnownSourceType {
    const { htmlAttributes, clipboardData, fragment } = event;

    let result: KnownSourceType | null = null;
    const param: getSourceInputParams = {
        htmlAttributes,
        fragment,
        editor,
        clipboardData,
    };

    getSourceFunctions.forEach((func, key) => {
        if (!result && func(param)) {
            result = key;
        }
    });

    return result ?? KnownSourceType.Default;
}
