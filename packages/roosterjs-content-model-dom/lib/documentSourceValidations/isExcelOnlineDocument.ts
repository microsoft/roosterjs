import { DocumentPropertyNames } from './constants';
import type { GetSourceFunction } from './getDocumentSource';

// Excel Desktop also has this attribute
const EXCEL_ONLINE_ATTRIBUTE_VALUE = 'Excel.Sheet';

/**
 * @internal
 * Checks whether the Array provided contains strings that identify Excel Online documents
 * @param props Properties related to the PasteEvent
 * @returns
 */
export const isExcelOnlineDocument: GetSourceFunction = props => {
    const { htmlAttributes } = props;
    // The presence of Excel.Sheet confirms its origin from Excel, the absence of EXCEL_DESKTOP_ATTRIBUTE_NAME confirms it is from the Online version
    return (
        htmlAttributes[DocumentPropertyNames.PROG_ID_NAME] == EXCEL_ONLINE_ATTRIBUTE_VALUE &&
        htmlAttributes[DocumentPropertyNames.EXCEL_DESKTOP_ATTRIBUTE_NAME] == undefined
    );
};
