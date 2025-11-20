import { documentContainWacElements } from './documentContainWacElements';
import { isExcelDesktopDocument } from './isExcelDesktopDocument';
import { isExcelNotNativeEvent } from './isExcelNonNativeEvent';
import { isExcelOnlineDocument } from './isExcelOnlineDocument';
import { isGoogleSheetDocument } from './isGoogleSheetDocument';
import { isOneNoteDesktopDocument } from './isOneNoteDocument';
import { isPowerPointDesktopDocument } from './isPowerPointDesktopDocument';
import { isWordDesktopDocument } from './isWordDesktopDocument';
import { shouldConvertToSingleImage } from './shouldConvertToSingleImage';
import type { GetSourceInputParams, KnownDocumentSourceType } from 'roosterjs-content-model-types';

/**
 * Represent the function type to get whether the content is from specific source
 * @internal
 */
export type GetSourceFunction = (props: GetSourceInputParams) => boolean;

const sourceFunctions = new Map<KnownDocumentSourceType, GetSourceFunction>([
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
 * Detect the source of the provided fragment based on the metadata available
 * @param param The input parameters for getDocumentSource function
 * @returns The detected source type or 'default' if none matched
 */
export function getDocumentSource(param: GetSourceInputParams): KnownDocumentSourceType {
    let result: KnownDocumentSourceType | null = null;

    sourceFunctions.forEach((func, key) => {
        if (!result && func(param)) {
            result = key;
        }
    });

    return result ?? 'default';
}
