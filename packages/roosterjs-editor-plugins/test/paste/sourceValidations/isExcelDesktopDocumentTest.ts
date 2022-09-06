import isExcelDesktopDocument from '../../../lib/plugins/Paste/sourceValidations/isExcelDesktopDocument';
import { EXCEL_ATTRIBUTE_VALUE } from '../pasteTestUtils';
import { getSourceInputParams } from '../../../lib/plugins/Paste/sourceValidations/getPasteSource';

const EXCEL_ONLINE_ATTRIBUTE_VALUE = 'Excel.Sheet';

describe('isExcelDesktopDocument |', () => {
    it('Is a Excel document 1', () => {
        const htmlAttributes: Record<string, string> = {
            ProgId: EXCEL_ONLINE_ATTRIBUTE_VALUE,
        };

        const result = isExcelDesktopDocument(<getSourceInputParams>{ htmlAttributes });

        expect(result).toBeTrue();
    });

    it('Is a Excel document 2', () => {
        const htmlAttributes: Record<string, string> = {
            'xmlns:x': EXCEL_ATTRIBUTE_VALUE,
            ProgId: EXCEL_ONLINE_ATTRIBUTE_VALUE,
        };

        const result = isExcelDesktopDocument(<getSourceInputParams>{ htmlAttributes });

        expect(result).toBeTrue();
    });

    it('Is a Excel document 3', () => {
        const htmlAttributes: Record<string, string> = {
            'xmlns:x': EXCEL_ATTRIBUTE_VALUE,
        };
        const result = isExcelDesktopDocument(<getSourceInputParams>{ htmlAttributes });

        expect(result).toBeTrue();
    });

    it('Is not a Excel Document', () => {
        const result = isExcelDesktopDocument(<getSourceInputParams>{ htmlAttributes: {} });

        expect(result).toBeFalse();
    });
});
