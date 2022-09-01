import isGoogleSheetDocument from '../../../lib/plugins/Paste/sourceValidations/isGoogleSheetDocument';
import { getWacElement } from '../pasteTestUtils';
import { GOOGLE_SHEET_NODE_NAME } from '../../../lib/plugins/Paste/sourceValidations/constants';
import { KnownSourceType } from '../../../lib/plugins/Paste/sourceValidations/KnownSourceType';

describe('isGoogleSheetDocument |', () => {
    it('Is from Google Sheets', () => {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createElement(GOOGLE_SHEET_NODE_NAME));

        const result = isGoogleSheetDocument({}, fragment);

        expect(result).toEqual(KnownSourceType.GoogleSheets);
    });

    it('Is not from Google Sheets', () => {
        const fragment = document.createDocumentFragment();

        const result = isGoogleSheetDocument({}, fragment);

        expect(result).toEqual(false);
    });

    it('Is not from Google Sheets 2', () => {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(getWacElement());

        const result = isGoogleSheetDocument({}, fragment);

        expect(result).toEqual(false);
    });
});
