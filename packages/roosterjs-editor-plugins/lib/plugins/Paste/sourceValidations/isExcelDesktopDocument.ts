import { PROG_ID_NAME } from './constants';

const EXCEL_ATTRIBUTE_NAME = 'xmlns:x';
const EXCEL_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:excel';
const EXCEL_ONLINE_ATTRIBUTE_VALUE = 'Excel.Sheet';

/**
 * @internal
 * Checks whether the Array provided contains strings that identify Excel Desktop documents
 * @param htmlAttributes html attributes to check.
 * @returns
 */
export function isExcelDesktopDocument(htmlAttributes: Record<string, string>) {
    return (
        htmlAttributes[EXCEL_ATTRIBUTE_NAME] == EXCEL_ATTRIBUTE_VALUE ||
        htmlAttributes[PROG_ID_NAME] == EXCEL_ONLINE_ATTRIBUTE_VALUE
    );
}
