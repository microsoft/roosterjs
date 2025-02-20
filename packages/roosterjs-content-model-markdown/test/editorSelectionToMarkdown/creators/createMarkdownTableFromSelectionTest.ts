import { createMarkdownTableFromSelection } from '../../../lib/editorSelectionToMarkdown/creators/createMarkdownTableFromSelection';
import { TableSelection } from 'roosterjs-content-model-types';

describe('createMarkdownTableFromSelection', () => {
    it('Empty table', () => {
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        table.appendChild(tr);
        const tableSelection: TableSelection = {
            type: 'table',
            table: table,
            firstRow: 0,
            lastRow: 0,
            firstColumn: 0,
            lastColumn: 0,
        };
        expect(createMarkdownTableFromSelection(tableSelection)).toBe('|\n|\n');
    });

    it('Single cell', () => {
        const table = document.createElement('table');
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = 'Cell 1';
        tr.appendChild(td);
        table.appendChild(tr);

        const tableSelection: TableSelection = {
            type: 'table',
            table: table,
            firstRow: 0,
            lastRow: 0,
            firstColumn: 0,
            lastColumn: 0,
        };
        expect(createMarkdownTableFromSelection(tableSelection)).toBe('| Cell 1 |\n|----|\n');
    });

    it('Multiple cells', () => {
        const table = document.createElement('table');
        const tr1 = document.createElement('tr');
        const td1 = document.createElement('td');
        td1.textContent = 'Cell 1';
        const td2 = document.createElement('td');
        td2.textContent = 'Cell 2';
        tr1.appendChild(td1);
        tr1.appendChild(td2);
        const tr2 = document.createElement('tr');
        const td3 = document.createElement('td');
        td3.textContent = 'Cell 3';
        const td4 = document.createElement('td');
        td4.textContent = 'Cell 4';
        tr2.appendChild(td3);
        tr2.appendChild(td4);
        table.appendChild(tr1);
        table.appendChild(tr2);
        const tableSelection: TableSelection = {
            type: 'table',
            table: table,
            firstRow: 0,
            lastRow: 1,
            firstColumn: 0,
            lastColumn: 1,
        };
        expect(createMarkdownTableFromSelection(tableSelection)).toBe(
            '| Cell 1 | Cell 2 |\n|----|----|\n| Cell 3 | Cell 4 |\n'
        );
    });
});
