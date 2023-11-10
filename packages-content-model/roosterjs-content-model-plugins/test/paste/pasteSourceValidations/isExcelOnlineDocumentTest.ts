import { EXCEL_ATTRIBUTE_VALUE } from './pasteTestUtils';
import { GetSourceInputParams } from '../../../lib/paste/pasteSourceValidations/getPasteSource';
import { isExcelOnlineDocument } from '../../../lib/paste/pasteSourceValidations/isExcelOnlineDocument';

const EXCEL_ONLINE_ATTRIBUTE_VALUE = 'Excel.Sheet';

describe('isExcelOnlineDocument |', () => {
    it('Is not an Excel Online document', () => {
        const htmlAttributes: Record<string, string> = {
            'xmlns:x': EXCEL_ATTRIBUTE_VALUE,
            ProgId: EXCEL_ONLINE_ATTRIBUTE_VALUE,
        };

        const result = isExcelOnlineDocument(<GetSourceInputParams>{ htmlAttributes });

        expect(result).toBeFalse();
    });

    it('Is an Excel Online document', () => {
        const htmlAttributes: Record<string, string> = {
            ProgId: EXCEL_ONLINE_ATTRIBUTE_VALUE,
        };

        const result = isExcelOnlineDocument(<GetSourceInputParams>{ htmlAttributes });

        expect(result).toBeTrue();
    });

    it('Is not a Excel Document', () => {
        const result = isExcelOnlineDocument(<GetSourceInputParams>{ htmlAttributes: {} });

        expect(result).toBeFalse();
    });
});
