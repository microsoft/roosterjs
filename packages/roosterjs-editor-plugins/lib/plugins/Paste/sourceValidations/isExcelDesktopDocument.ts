import { PROG_ID_NAME } from './constants';
import type { getSourceFunction, getSourceInputParams } from './getPasteSource';

const EXCEL_ATTRIBUTE_NAME = 'xmlns:x';
const EXCEL_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:excel';
const EXCEL_ONLINE_ATTRIBUTE_VALUE = 'Excel.Sheet';

/**
 * @internal
 * Checks whether the Array provided contains strings that identify Excel Desktop documents
 * @param props Properties related to the PasteEvent
 * @returns
 */
const isExcelDesktopDocument: getSourceFunction = (props: getSourceInputParams) => {
    const { htmlAttributes } = props;
    return (
        htmlAttributes[EXCEL_ATTRIBUTE_NAME] == EXCEL_ATTRIBUTE_VALUE ||
        htmlAttributes[PROG_ID_NAME] == EXCEL_ONLINE_ATTRIBUTE_VALUE
    );
};
export default isExcelDesktopDocument;
