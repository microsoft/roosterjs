import { GetSourceInputParams } from '../../../../lib/command/paste/pasteSourceValidations/getDocumentSource';
import { getWacElement } from './pasteTestUtils';
import { isGoogleSheetDocument } from '../../../../lib/command/paste/pasteSourceValidations/isGoogleSheetDocument';
import { PastePropertyNames } from '../../../../lib/command/paste/pasteSourceValidations/constants';

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
