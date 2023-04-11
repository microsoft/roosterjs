import isExcelOnlineDocument from '../../lib/pasteSourceValidations/isExcelOnlineDocument';
import { EXCEL_ATTRIBUTE_VALUE } from './pasteTestUtils';
import { getSourceInputParams } from '../../lib/pasteSourceValidations/getPasteSource';

const EXCEL_ONLINE_ATTRIBUTE_VALUE = 'Excel.Sheet';

describe('isExcelOnlineDocument |', () => {
    it('Is not an Excel Online document', () => {
        const htmlAttributes: Record<string, string> = {
            'xmlns:x': EXCEL_ATTRIBUTE_VALUE,
            ProgId: EXCEL_ONLINE_ATTRIBUTE_VALUE,
        };

        const result = isExcelOnlineDocument(<getSourceInputParams>{ htmlAttributes });

        expect(result).toBeFalse();
    });

    it('Is an Excel Online document', () => {
        const htmlAttributes: Record<string, string> = {
            ProgId: EXCEL_ONLINE_ATTRIBUTE_VALUE,
        };

        const result = isExcelOnlineDocument(<getSourceInputParams>{ htmlAttributes });

        expect(result).toBeTrue();
    });

    it('Is not a Excel Document', () => {
        const result = isExcelOnlineDocument(<getSourceInputParams>{ htmlAttributes: {} });

        expect(result).toBeFalse();
    });
});
