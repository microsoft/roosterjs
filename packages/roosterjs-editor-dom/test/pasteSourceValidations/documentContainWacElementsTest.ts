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

    [
        'OutlineElement',
        'NumberListStyle',
        'WACImageContainer',
        'ListContainerWrapper',
        'BulletListStyle',
        'TableInsertRowGapBlank',
        'TableColumnResizeHandle',
        'TableCellTopBorderHandle',
        'TableCellLeftBorderHandle',
        'TableHoverColumnHandle',
        'TableHoverRowHandle',
        'ListMarkerWrappingSpan',
        'TableCellContent',
        'Paragraph',
        'WACImageContainer',
        'WACImageBorder',
        'TableContainer',
        'LineBreakBlob',
        'TableWordWrap',
    ].forEach(className => {
        it('documentContainWacElementsTest_' + className, () => {
            const fragment = document.createDocumentFragment();
            const div = document.createElement('div');
            div.className = className;
            fragment.appendChild(div);

            const result = documentContainWacElements(<getSourceInputParams>{ fragment });

            expect(result).toBeTrue();
        });
    });
});
