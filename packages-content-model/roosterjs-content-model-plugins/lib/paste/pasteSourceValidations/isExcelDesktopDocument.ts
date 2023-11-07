import { PastePropertyNames } from './constants';
import type { GetSourceFunction } from './getPasteSource';

const EXCEL_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:excel';

/**
 * @internal
 * Checks whether the Array provided contains strings that identify Excel Desktop documents
 * @param props Properties related to the PasteEvent
 * @returns
 */
export const isExcelDesktopDocument: GetSourceFunction = props => {
    const { htmlAttributes } = props;
    // The presence of this attribute confirms its origin from Excel Desktop
    return htmlAttributes[PastePropertyNames.EXCEL_DESKTOP_ATTRIBUTE_NAME] == EXCEL_ATTRIBUTE_VALUE;
};
