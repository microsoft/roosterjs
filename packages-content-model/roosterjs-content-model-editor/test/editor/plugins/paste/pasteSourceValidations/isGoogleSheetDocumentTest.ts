import { GetSourceInputParams } from '../../../../../lib/editor/plugins/PastePlugin/pasteSourceValidations/getPasteSource';
import { getWacElement } from './pasteTestUtils';
import { isGoogleSheetDocument } from '../../../../../lib/editor/plugins/PastePlugin/pasteSourceValidations/isGoogleSheetDocument';
import { PastePropertyNames } from '../../../../../lib/editor/plugins/PastePlugin/pasteSourceValidations/constants';

describe('isGoogleSheetDocument |', () => {
    it('Is from Google Sheets', () => {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createElement(PastePropertyNames.GOOGLE_SHEET_NODE_NAME));

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
