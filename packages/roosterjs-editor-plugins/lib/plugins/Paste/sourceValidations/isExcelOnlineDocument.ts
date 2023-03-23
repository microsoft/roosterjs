import { EXCEL_DESKTOP_ATTRIBUTE_NAME } from './isExcelDesktopDocument';
import { PROG_ID_NAME } from './constants';
import type { getSourceFunction, getSourceInputParams } from './getPasteSource';

// Excel Desktop also has this attribute
const EXCEL_ONLINE_ATTRIBUTE_VALUE = 'Excel.Sheet';

/**
 * @internal
 * Checks whether the Array provided contains strings that identify Excel Online documents
 * @param props Properties related to the PasteEvent
 * @returns
 */
const isExcelOnlineDocument: getSourceFunction = (props: getSourceInputParams) => {
    const { htmlAttributes } = props;
    return (
        htmlAttributes[PROG_ID_NAME] == EXCEL_ONLINE_ATTRIBUTE_VALUE &&
        htmlAttributes[EXCEL_DESKTOP_ATTRIBUTE_NAME] == undefined
    );
};
export default isExcelOnlineDocument;
