import type { getSourceFunction, getSourceInputParams } from './getPasteSource';

// Excel Online does not have this attribute
export const EXCEL_DESKTOP_ATTRIBUTE_NAME = 'xmlns:x';
const EXCEL_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:excel';

/**
 * @internal
 * Checks whether the Array provided contains strings that identify Excel Desktop documents
 * @param props Properties related to the PasteEvent
 * @returns
 */
const isExcelDesktopDocument: getSourceFunction = (props: getSourceInputParams) => {
    const { htmlAttributes } = props;
    return htmlAttributes[EXCEL_DESKTOP_ATTRIBUTE_NAME] == EXCEL_ATTRIBUTE_VALUE;
};
export default isExcelDesktopDocument;
