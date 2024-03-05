import { EXCEL_ATTRIBUTE_VALUE } from './pasteTestUtils';
import { GetSourceInputParams } from '../../../lib/paste/pasteSourceValidations/getPasteSource';
import { isExcelDesktopDocument } from '../../../lib/paste/pasteSourceValidations/isExcelDesktopDocument';

const EXCEL_ONLINE_ATTRIBUTE_VALUE = 'Excel.Sheet';

describe('isExcelDesktopDocument |', () => {
    it('Is an ambiguous Excel document, unconfirmed if Desktop', () => {
        const htmlAttributes: Record<string, string> = {
            ProgId: EXCEL_ONLINE_ATTRIBUTE_VALUE,
        };

        const result = isExcelDesktopDocument(<GetSourceInputParams>{ htmlAttributes });

        expect(result).toBeFalse();
    });

    it('Is an Excel Desktop document 1', () => {
        const htmlAttributes: Record<string, string> = {
            'xmlns:x': EXCEL_ATTRIBUTE_VALUE,
            ProgId: EXCEL_ONLINE_ATTRIBUTE_VALUE,
        };

        const result = isExcelDesktopDocument(<GetSourceInputParams>{ htmlAttributes });

        expect(result).toBeTrue();
    });

    it('Is an Excel Desktop document 2', () => {
        const htmlAttributes: Record<string, string> = {
            'xmlns:x': EXCEL_ATTRIBUTE_VALUE,
        };
        const result = isExcelDesktopDocument(<GetSourceInputParams>{ htmlAttributes });

        expect(result).toBeTrue();
    });

    it('Is not a Excel Document', () => {
        const result = isExcelDesktopDocument(<GetSourceInputParams>{ htmlAttributes: {} });

        expect(result).toBeFalse();
    });
});
