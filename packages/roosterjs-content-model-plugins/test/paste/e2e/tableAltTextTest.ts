import { Editor, paste } from 'roosterjs-content-model-core';
import { PastePlugin } from '../../../lib/paste/PastePlugin';
import { cloneModel, createModelToDomContext } from 'roosterjs-content-model-dom';
import { handleTable } from 'roosterjs-content-model-dom/lib/modelToDom/handlers/handleTable';
import { clearModelFormat } from 'roosterjs-content-model-api/lib/modelApi/common/clearModelFormat';
import type { ContentModelTable } from 'roosterjs-content-model-types';

describe('Table alternative text', () => {
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

    function pasteTable(attributes: string) {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"></head><body><!--StartFragment--><table ${attributes}><tr><td>A</td><td>B</td></tr></table><!--EndFragment--></body></html>`,
        });
    }

    function render(table: ContentModelTable) {
        const target = document.createElement('div');
        handleTable(document, target, table, createModelToDomContext(), null);
        return target.querySelector('table')!;
    }

    it('preserves title and summary through paste, copy and clear formatting', () => {
        pasteTable(
            'title="Quarterly revenue" summary="Revenue by region and quarter" style="background-color:red"'
        );
        expect(root.querySelector('table')!.title).toBe('Quarterly revenue');
        expect(root.querySelector('table')!.getAttribute('summary')).toBe(
            'Revenue by region and quarter'
        );
        const model = cloneModel(editor.getContentModelCopy('disconnected'));
        const table = model.blocks[0] as ContentModelTable;
        expect(render(table).getAttribute('summary')).toBe('Revenue by region and quarter');
        table.rows[0].cells.forEach(cell => (cell.isSelected = true));
        clearModelFormat(model, [], [], []);
        const output = render(table);
        expect(output.title).toBe('Quarterly revenue');
        expect(output.getAttribute('summary')).toBe('Revenue by region and quarter');
        expect(output.style.backgroundColor).toBe('');
    });

    it('keeps metadata as literal attributes rather than markup', () => {
        pasteTable(
            'summary="&lt;img src=x onerror=alert(1)&gt; &amp; totals" title="&quot;Report&quot;"'
        );
        const table = cloneModel(editor.getContentModelCopy('disconnected'))
            .blocks[0] as ContentModelTable;
        const output = render(table);
        expect(output.title).toBe('"Report"');
        expect(output.getAttribute('summary')).toBe('<img src=x onerror=alert(1)> & totals');
        expect(output.querySelector('img')).toBeNull();
    });

    it('does not invent a summary for tables without alternative text', () => {
        pasteTable('');
        const table = cloneModel(editor.getContentModelCopy('disconnected'))
            .blocks[0] as ContentModelTable;
        const output = render(table);
        expect(output.hasAttribute('title')).toBeFalse();
        expect(output.hasAttribute('summary')).toBeFalse();
    });
});
