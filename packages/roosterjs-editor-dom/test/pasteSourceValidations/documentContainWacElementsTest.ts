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
        'TableInsertRowGapBlank',
        'TableColumnResizeHandle',
        'TableCellTopBorderHandle',
        'TableCellLeftBorderHandle',
        'TableHoverColumnHandle',
        'TableHoverRowHandle',
    ].forEach(className => {
        it('documentContainWacElementsTest_' + className, () => {
            const fragment = document.createDocumentFragment();

            const div = document.createElement('div');
            div.className = className;
            const table = document.createElement('table');
            const row = document.createElement('tr');
            const cell = document.createElement('td');

            cell.appendChild(div);
            row.appendChild(cell);
            table.appendChild(row);
            fragment.appendChild(table);

            const result = documentContainWacElements(<getSourceInputParams>{ fragment });

            expect(result).toBeTrue();
        });

        it('documentContainWacElementsTest_element not contained in table_' + className, () => {
            const fragment = document.createDocumentFragment();

            const div = document.createElement('div');
            div.className = className;
            fragment.appendChild(div);

            const result = documentContainWacElements(<getSourceInputParams>{ fragment });

            expect(result).toBeFalse();
        });
    });

    it('ul[class^="BulletListStyle"]>.OutlineElement', () => {
        const fragment = document.createDocumentFragment();

        const ul = document.createElement('ul');
        const li = document.createElement('li');
        ul.className = 'BulletListStyle';
        li.className = 'OutlineElement';

        ul.appendChild(li);
        fragment.appendChild(ul);

        const result = documentContainWacElements(<getSourceInputParams>{ fragment });

        expect(result).toBeTrue();
    });

    it('ol[class^="NumberListStyle"]>.OutlineElement', () => {
        const fragment = document.createDocumentFragment();

        const ol = document.createElement('ol');
        const li = document.createElement('li');
        ol.className = 'NumberListStyle';
        li.className = 'OutlineElement';

        ol.appendChild(li);
        fragment.appendChild(ol);

        const result = documentContainWacElements(<getSourceInputParams>{ fragment });

        expect(result).toBeTrue();
    });
});
