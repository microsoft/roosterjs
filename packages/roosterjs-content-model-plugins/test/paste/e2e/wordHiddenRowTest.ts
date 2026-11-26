import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import { editTable } from 'roosterjs-content-model-api';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word hidden table rows', () => {
    const id = 'word-hidden-row';
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor(id);
        root = document.getElementById(id)!;
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    const pasteRows = (style = 'display:none', sheet = '', word = true) => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>${
                word ? '<meta name="ProgId" content="Word.Document">' : ''
            }<style>${sheet}</style></head>
                <body><!--StartFragment--><table><tr><td>First</td></tr>
                <tr class="Hidden" style="${style}"><td>Hidden</td></tr><tr><td>Last</td></tr></table><!--EndFragment--></body></html>`,
        });
        return root.querySelector('table')!;
    };
    it('does not expose explicitly hidden native rows', () => {
        const table = pasteRows();
        expect(table.rows.length).toBe(3);
        expect(getComputedStyle(table.rows[1]).display).toBe('none');
        expect(table.rows[1].getBoundingClientRect().height).toBe(0);
        expect(table.rows[1].textContent).toBe('Hidden');
        expect(getComputedStyle(table.rows[0]).display).toBe('table-row');
        expect(getComputedStyle(table.rows[2]).display).toBe('table-row');
    });
    it('retains a source stylesheet visibility rule', () => {
        const table = pasteRows('', '.Hidden{display:none}');
        expect(getComputedStyle(table.rows[1]).display).toBe('none');
    });
    it('preserves hidden rows through an actual table edit', () => {
        const table = pasteRows();
        editor.setDOMSelection({
            type: 'table',
            table,
            firstRow: 0,
            lastRow: 0,
            firstColumn: 0,
            lastColumn: 0,
        });
        editTable(editor, 'insertAbove');
        const edited = root.querySelector('table')!;
        expect(edited.rows.length).toBe(4);
        expect(getComputedStyle(edited.rows[2]).display).toBe('none');
        expect(edited.rows[2].textContent).toBe('Hidden');
        expect(getComputedStyle(edited.rows[0]).display).toBe('table-row');
    });
    it('preserves explicit visible overrides over a hidden row group', () => {
        const table = pasteRows('display:table-row', '.Hidden{display:none}');
        expect(getComputedStyle(table.rows[1]).display).toBe('table-row');
    });
    it('retains standard non-Word hidden rows', () => {
        const table = pasteRows('display:none', '', false);
        expect(getComputedStyle(table.rows[1]).display).toBe('none');
    });
});
