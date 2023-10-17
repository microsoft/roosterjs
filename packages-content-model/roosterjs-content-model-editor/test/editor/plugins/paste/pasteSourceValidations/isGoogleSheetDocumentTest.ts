import { GetSourceInputParams } from '../../../../../lib/editor/plugins/PastePlugin/pasteSourceValidations/getPasteSource';
import { getWacElement } from './pasteTestUtils';
import { GOOGLE_SHEET_NODE_NAME } from '../../../../../lib/editor/plugins/PastePlugin/pasteSourceValidations/constants';
import { isGoogleSheetDocument } from '../../../../../lib/editor/plugins/PastePlugin/pasteSourceValidations/isGoogleSheetDocument';

describe('isGoogleSheetDocument |', () => {
    it('Is from Google Sheets', () => {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createElement(GOOGLE_SHEET_NODE_NAME));

        const result = isGoogleSheetDocument(<GetSourceInputParams>{ fragment });

        expect(result).toBeTrue();
    });

    it('Is not from Google Sheets', () => {
        const fragment = document.createDocumentFragment();

        const result = isGoogleSheetDocument(<GetSourceInputParams>{ fragment });

        expect(result).toBeFalse();
    });

    it('Is not from Google Sheets 2', () => {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(getWacElement());

        const result = isGoogleSheetDocument(<GetSourceInputParams>{ fragment });

        expect(result).toBeFalse();
    });
});
