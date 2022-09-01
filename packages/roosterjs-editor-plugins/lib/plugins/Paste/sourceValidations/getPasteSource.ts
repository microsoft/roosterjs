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
export type getSourceFunction = (
    htmlAttributes: Record<string, string>,
    fragment?: DocumentFragment,
    editor?: IEditor,
    clipboardData?: ClipboardData
) => KnownSourceType | false;

const getSourceFunctions: getSourceFunction[] = [
    isWordDesktopDocument,
    isExcelDesktopDocument,
    isPowerPointDesktopDocument,
    documentContainWacElements,
    isGoogleSheetDocument,
    shouldConvertToSingleImage,
];

/**
 * @internal
 * This function tries to get the source of the Pasted content
 * @param event the before paste event
 * @param editor editor instance
 * @returns The Type of pasted content, if no type found will return {KnownSourceType.Default}
 */
export default function getPasteSource(event: BeforePasteEvent, editor: IEditor): KnownSourceType {
    const { htmlAttributes, clipboardData, fragment } = event;

    for (const fn of getSourceFunctions) {
        const result = fn(htmlAttributes, fragment, editor, clipboardData);
        if (result) {
            return result;
        }
    }

    return KnownSourceType.Default;
}
