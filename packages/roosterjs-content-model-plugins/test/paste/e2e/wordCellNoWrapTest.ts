import { Editor, paste } from 'roosterjs-content-model-core';
import { PastePlugin } from '../../../lib/paste/PastePlugin';

describe('Word cell nowrap paste', () => {
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

    function pasteCell(attributes: string, parentStyle = '') {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"></head><body><!--StartFragment--><table style="${parentStyle}"><tr><td ${attributes}>one two three four five</td></tr></table><!--EndFragment--></body></html>`,
        });
        return root.querySelector('td')!;
    }

    it('preserves the legacy nowrap attribute on the cell', () => {
        const cell = pasteCell('nowrap');
        expect(getComputedStyle(cell).whiteSpace).toBe('nowrap');
    });

    it('lets explicit normal override nowrap and inherited nowrap', () => {
        const cell = pasteCell('nowrap style="white-space:normal"', 'white-space:nowrap');
        expect(getComputedStyle(cell).whiteSpace).toBe('normal');
    });

    it('preserves CSS nowrap without a legacy attribute', () => {
        const cell = pasteCell('style="white-space:nowrap"');
        expect(getComputedStyle(cell).whiteSpace).toBe('nowrap');
    });
});
