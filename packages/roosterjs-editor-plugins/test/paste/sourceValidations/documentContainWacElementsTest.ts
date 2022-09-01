import documentContainWacElements from '../../../lib/plugins/Paste/sourceValidations/documentContainWacElements';
import { getWacElement } from '../pasteTestUtils';
import { KnownSourceType } from '../../../lib/plugins/Paste/sourceValidations/KnownSourceType';

describe('documentContainWacElements |', () => {
    it('Fragment contain Wac elements', () => {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(getWacElement());

        const result = documentContainWacElements({}, fragment);

        expect(result).toEqual(KnownSourceType.WacComponents);
    });

    it('Fragment does not contain Wac elements', () => {
        const fragment = document.createDocumentFragment();

        const result = documentContainWacElements({}, fragment);

        expect(result).toEqual(false);
    });
});
