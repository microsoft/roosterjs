import { Editor, paste } from 'roosterjs-content-model-core';
import { PastePlugin } from '../../../lib/paste/PastePlugin';
import { applySegmentFormat, clearFormat, toggleStrikethrough } from 'roosterjs-content-model-api';
import { createText, getSegmentTextFormat } from 'roosterjs-content-model-dom';

describe('Word double strike paste', () => {
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

    function pasteFragment(fragment: string, style = '') {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"><style>${style}</style></head><body><!--StartFragment-->${fragment}<!--EndFragment--></body></html>`,
        });
    }

    function selectAll() {
        const range = document.createRange();
        range.selectNodeContents(root.querySelector('p')!);
        editor.setDOMSelection({ type: 'range', range });
    }

    it('renders the Word double strike token as native double CSS', () => {
        pasteFragment('<p><s style="text-line-through:double">double</s></p>');
        expect(getComputedStyle(root.querySelector('s')!).textDecorationStyle).toBe('double');
    });

    it('preserves stylesheet double strike and a following both-off run', () => {
        pasteFragment(
            '<p><span class="strike">double</span><span style="text-decoration:none;text-line-through:none">off</span></p>',
            '.strike {text-decoration:line-through;text-line-through:double}'
        );
        expect(getComputedStyle(root.querySelector('s')!).textDecorationStyle).toBe('double');
        expect(root.querySelector('s')!.textContent).toBe('double');
        expect(root.textContent).toBe('doubleoff');
    });

    it('keeps a single underline independent from double strike', () => {
        pasteFragment('<p><s style="text-line-through:double"><u>both</u></s></p>');
        expect(getComputedStyle(root.querySelector('s')!).textDecorationStyle).toBe('double');
        expect(getComputedStyle(root.querySelector('u')!).textDecorationStyle).toBe('solid');
    });

    it('copies double strike together with its enable flag', () => {
        const format = { strikethrough: true, strikethroughStyle: 'double' };
        expect(getSegmentTextFormat(createText('double', format), true)).toEqual(format);
        expect(getSegmentTextFormat(createText('double', format))).toEqual({});
    });

    it('clears double strike and does not revive it when toggling single strike', () => {
        pasteFragment('<p><s style="text-line-through:double">double</s></p>');
        selectAll();
        toggleStrikethrough(editor);
        expect(root.querySelector('s')).toBeNull();
        toggleStrikethrough(editor);
        expect(getComputedStyle(root.querySelector('s')!).textDecorationStyle).toBe('solid');
        clearFormat(editor);
        expect(root.querySelector('s')).toBeNull();
    });

    it('applies copied double strike and resets it when painting single strike', () => {
        pasteFragment('<p>target</p>');
        selectAll();
        applySegmentFormat(
            editor,
            getSegmentTextFormat(
                createText('source', {
                    strikethrough: true,
                    strikethroughStyle: 'double',
                }),
                true
            )
        );
        expect(getComputedStyle(root.querySelector('s')!).textDecorationStyle).toBe('double');
        applySegmentFormat(editor, { strikethrough: true });
        expect(getComputedStyle(root.querySelector('s')!).textDecorationStyle).toBe('solid');
    });
});
