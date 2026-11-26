import { Editor, paste } from 'roosterjs-content-model-core';
import { PastePlugin } from '../../../lib/paste/PastePlugin';
import { cloneModel, createModelToDomContext } from 'roosterjs-content-model-dom';
import { handleTable } from 'roosterjs-content-model-dom/lib/modelToDom/handlers/handleTable';
import { insertTableRow } from 'roosterjs-content-model-api/lib/modelApi/table/insertTableRow';
import { splitTableCellVertically } from 'roosterjs-content-model-api/lib/modelApi/table/splitTableCellVertically';
import { deleteTableRow } from 'roosterjs-content-model-api/lib/modelApi/table/deleteTableRow';
import { mergeTableCells } from 'roosterjs-content-model-api/lib/modelApi/table/mergeTableCells';
import type { ContentModelTable } from 'roosterjs-content-model-types';

describe('Table header row groups', () => {
    let root: HTMLDivElement;
    let editor: Editor;

    beforeEach(() => {
        root = document.createElement('div');
        document.body.appendChild(root);
        editor = new Editor(root, { plugins: [new PastePlugin()] });
    });

    afterEach(() => {
        editor.dispose();
        root.remove();
    });

    function pasteTable(fragment: string) {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"></head><body><!--StartFragment-->${fragment}<!--EndFragment--></body></html>`,
        });
    }

    function render(table: ContentModelTable) {
        const target = document.createElement('div');
        handleTable(document, target, table, createModelToDomContext(), null);
        return target;
    }

    it('preserves consecutive repeating TD rows without inventing column headers', () => {
        pasteTable(
            '<table><thead><tr><td>Quarter</td><td>Revenue</td></tr><tr><td>USD</td><td>2026</td></tr></thead><tbody><tr><td>Q1</td><td>120</td></tr></tbody></table>'
        );
        expect(root.querySelectorAll('thead>tr').length).toBe(2);
        expect(root.querySelectorAll('tbody>tr').length).toBe(1);
        expect(root.querySelectorAll('th').length).toBe(0);

        const model = cloneModel(editor.getContentModelCopy('disconnected'));
        const table = model.blocks[0] as ContentModelTable;
        const copy = render(table);
        expect(copy.querySelectorAll('thead>tr').length).toBe(2);
        expect(copy.querySelectorAll('thead td').length).toBe(4);
        expect(copy.querySelector('thead td')!.textContent).toBe('Quarter');
    });

    it('keeps actual TH cells and footer groups on a disconnected round trip', () => {
        pasteTable(
            '<table><thead><tr><th>Label</th><td>Value</td></tr></thead><tbody><tr><td>A</td><td>1</td></tr></tbody><tfoot><tr><td>Total</td><td>1</td></tr></tfoot></table>'
        );
        const table = cloneModel(editor.getContentModelCopy('disconnected'))
            .blocks[0] as ContentModelTable;
        const copy = render(table);
        expect(copy.querySelectorAll('thead th').length).toBe(1);
        expect(copy.querySelectorAll('thead td').length).toBe(1);
        expect(copy.querySelectorAll('tfoot>tr').length).toBe(1);
    });

    it('inherits the selected row group when inserting or splitting and retains it after deletion', () => {
        pasteTable(
            '<table><thead><tr><td>A</td><td>B</td></tr></thead><tbody><tr><td>C</td><td>D</td></tr></tbody></table>'
        );
        const table = cloneModel(editor.getContentModelCopy('disconnected'))
            .blocks[0] as ContentModelTable;
        table.rows[0].cells.forEach(cell => (cell.isSelected = true));
        insertTableRow(table, 'insertBelow');
        expect(render(table).querySelectorAll('thead>tr').length).toBe(2);
        splitTableCellVertically(table);
        expect(render(table).querySelectorAll('thead>tr').length).toBe(3);
        deleteTableRow(table);
        expect(render(table).querySelectorAll('thead>tr').length).toBe(1);
        expect(render(table).querySelectorAll('tbody>tr').length).toBe(1);
    });

    it('limits row spans and cell merges to their HTML row group', () => {
        pasteTable(
            '<table><thead><tr><td rowspan="3">Header</td><td>B</td></tr></thead><tbody><tr><td>C</td><td>D</td></tr></tbody></table>'
        );
        const table = cloneModel(editor.getContentModelCopy('disconnected'))
            .blocks[0] as ContentModelTable;
        expect(table.rows[1].cells.length).toBe(2);
        table.rows.forEach(row => row.cells.forEach(cell => (cell.isSelected = true)));
        mergeTableCells(table);
        expect(table.rows[1].cells.every(cell => !cell.spanAbove)).toBeTrue();
        const copy = render(table);
        expect(copy.querySelector('tbody td')!.textContent).toBe('C');
        expect(copy.querySelectorAll('thead td').length).toBe(2);
    });
});
