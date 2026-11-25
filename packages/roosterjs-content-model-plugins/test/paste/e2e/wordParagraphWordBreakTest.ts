import { Editor, paste } from 'roosterjs-content-model-core';
import { PastePlugin } from '../../../lib/paste/PastePlugin';

describe('Word paragraph word-break paste', () => {
    let root: HTMLDivElement;
    let editor: Editor;

    beforeEach(() => {
        root = document.createElement('div');
        root.style.width = '100px';
        document.body.appendChild(root);
        editor = new Editor(root, { plugins: [new PastePlugin()] });
    });

    afterEach(() => {
        editor.dispose();
        root.remove();
    });

    function pasteParagraph(fragment: string) {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"></head><body><!--StartFragment-->${fragment}<!--EndFragment--></body></html>`,
        });
        return root.querySelector('p')!;
    }

    it('preserves break-all and wraps long words in a narrow editor', () => {
        const p = pasteParagraph(
            '<p style="word-break:break-all">ExtraordinaryLongUnbrokenWord</p>'
        );
        expect(getComputedStyle(p).wordBreak).toBe('break-all');
        const range = document.createRange();
        range.selectNodeContents(p);
        expect(range.getClientRects().length).toBeGreaterThan(1);
    });

    it('preserves keep-all for CJK paragraphs', () => {
        const p = pasteParagraph('<p style="word-break:keep-all">漢字漢字漢字漢字漢字</p>');
        expect(getComputedStyle(p).wordBreak).toBe('keep-all');
    });

    it('resets an inherited break-all with explicit normal', () => {
        const p = pasteParagraph(
            '<div style="word-break:break-all"><p style="word-break:normal">Normal</p><p>Inherited</p></div>'
        );
        expect(getComputedStyle(p).wordBreak).toBe('normal');
        expect(getComputedStyle(root.querySelectorAll('p')[1]).wordBreak).toBe('break-all');
    });
});
