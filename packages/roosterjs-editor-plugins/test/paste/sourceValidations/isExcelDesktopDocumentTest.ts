import isExcelDesktopDocument from '../../../lib/plugins/Paste/sourceValidations/isExcelDesktopDocument';
import { KnownSourceType } from '../../../lib/plugins/Paste/sourceValidations/KnownSourceType';

const EXCEL_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:excel';
const EXCEL_ONLINE_ATTRIBUTE_VALUE = 'Excel.Sheet';

describe('isExcelDesktopDocument |', () => {
    it('Is a Excel document 1', () => {
        const htmlAttributes: Record<string, string> = {
            ProgId: EXCEL_ONLINE_ATTRIBUTE_VALUE,
        };

        const result = isExcelDesktopDocument(htmlAttributes);

        expect(result).toEqual(KnownSourceType.ExcelDesktop);
    });

    it('Is a Excel document 2', () => {
        const htmlAttributes: Record<string, string> = {
            'xmlns:x': EXCEL_ATTRIBUTE_VALUE,
            ProgId: EXCEL_ONLINE_ATTRIBUTE_VALUE,
        };

        const result = isExcelDesktopDocument(htmlAttributes);

        expect(result).toEqual(KnownSourceType.ExcelDesktop);
    });

    it('Is a Excel document 3', () => {
        const htmlAttributes: Record<string, string> = {
            'xmlns:x': EXCEL_ATTRIBUTE_VALUE,
        };

        const result = isExcelDesktopDocument(htmlAttributes);

        expect(result).toEqual(KnownSourceType.ExcelDesktop);
    });

    it('Is not a Excel Document', () => {
        const result = isExcelDesktopDocument({});

        expect(result).toEqual(false);
    });
});
