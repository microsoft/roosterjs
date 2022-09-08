import isGoogleSheetDocument from '../../../lib/plugins/Paste/sourceValidations/isGoogleSheetDocument';
import { getSourceInputParams } from '../../../lib/plugins/Paste/sourceValidations/getPasteSource';
import { getWacElement } from '../pasteTestUtils';
import { GOOGLE_SHEET_NODE_NAME } from '../../../lib/plugins/Paste/sourceValidations/constants';

describe('isGoogleSheetDocument |', () => {
    it('Is from Google Sheets', () => {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createElement(GOOGLE_SHEET_NODE_NAME));

        const result = isGoogleSheetDocument(<getSourceInputParams>{ fragment });

        expect(result).toBeTrue();
    });

    it('Is not from Google Sheets', () => {
        const fragment = document.createDocumentFragment();

        const result = isGoogleSheetDocument(<getSourceInputParams>{ fragment });

        expect(result).toBeFalse();
    });

    it('Is not from Google Sheets 2', () => {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(getWacElement());

        const result = isGoogleSheetDocument(<getSourceInputParams>{ fragment });

        expect(result).toBeFalse();
    });
});
