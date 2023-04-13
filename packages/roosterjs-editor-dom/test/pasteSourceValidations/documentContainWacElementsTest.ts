import documentContainWacElements from '../../lib/pasteSourceValidations/documentContainWacElements';
import { getSourceInputParams } from '../../lib/pasteSourceValidations/getPasteSource';
import { getWacElement } from './pasteTestUtils';

describe('documentContainWacElements |', () => {
    it('Fragment contain Wac elements', () => {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(getWacElement());

        const result = documentContainWacElements(<getSourceInputParams>{ fragment });

        expect(result).toBeTrue();
    });

    it('Fragment does not contain Wac elements', () => {
        const fragment = document.createDocumentFragment();

        const result = documentContainWacElements(<getSourceInputParams>{ fragment });

        expect(result).toBeFalse();
    });
});
