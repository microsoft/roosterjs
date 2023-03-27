import { EXCEL_DESKTOP_ATTRIBUTE_NAME } from './constants';
import type { getSourceFunction, getSourceInputParams } from './getPasteSource';

const EXCEL_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:excel';

/**
 * @internal
 * Checks whether the Array provided contains strings that identify Excel Desktop documents
 * @param props Properties related to the PasteEvent
 * @returns
 */
const isExcelDesktopDocument: getSourceFunction = (props: getSourceInputParams) => {
    const { htmlAttributes } = props;
    // The presence of this attribute confirms its origin from Excel Desktop
    return htmlAttributes[EXCEL_DESKTOP_ATTRIBUTE_NAME] == EXCEL_ATTRIBUTE_VALUE;
};
export default isExcelDesktopDocument;
