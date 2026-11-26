import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import { setTextColor } from 'roosterjs-content-model-api';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word glyph text fill', () => {
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor('word-text-fill');
        root = document.getElementById('word-text-fill')!;
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    function run(content: string, sheet = '') {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"><style>${sheet}</style></head>
                <body><!--StartFragment--><p style="font:24px Calibri;color:#0066CC">${content}</p><!--EndFragment--></body></html>`,
        });
    }
    function fill(text: string) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
            if (node.textContent == text)
                return getComputedStyle(node.parentElement!).getPropertyValue(
                    '-webkit-text-fill-color'
                );
        }
        throw new Error('Missing fixture text');
    }
    const native = 'mso-style-textfill-fill-color:#0066CC;mso-style-textfill-fill-alpha:25%';
    it('retains the resolved native glyph color and alpha', () => {
        run(`<span style="${native}">Alpha</span>`);
        expect(fill('Alpha')).toBe('rgba(0, 102, 204, 0.25)');
    });
    it('retains native no-fill text without deleting its characters', () => {
        run('<span style="mso-style-textfill-type:none">No fill</span>');
        expect(fill('No fill')).toBe('rgba(0, 0, 0, 0)');
        expect(root.textContent).toBe('No fill');
    });
    it('recovers supplied stylesheet fill declarations', () => {
        run('<span class="Alpha">Sheet</span>', `.Alpha{${native}}`);
        expect(fill('Sheet')).toBe('rgba(0, 102, 204, 0.25)');
    });
    it('retains nested fill resets and surrounding opacity', () => {
        run(
            `<span style="${native}">Alpha<span style="-webkit-text-fill-color:currentcolor">Reset</span></span>`
        );
        expect(fill('Alpha')).toBe('rgba(0, 102, 204, 0.25)');
        expect(fill('Reset')).toBe('rgb(0, 102, 204)');
    });
    it('keeps explicit browser fill authoritative', () => {
        run(`<span style="${native};-webkit-text-fill-color:red">Explicit</span>`);
        expect(fill('Explicit')).toBe('rgb(255, 0, 0)');
    });
    it('inherits an unset fill but resets an initial fill to current color', () => {
        run(
            `<span style="${native}"><span style="-webkit-text-fill-color:unset">Unset</span><span style="-webkit-text-fill-color:initial">Initial</span></span>`
        );
        expect(fill('Unset')).toBe('rgba(0, 102, 204, 0.25)');
        expect(fill('Initial')).toBe('rgb(0, 102, 204)');
    });
    it('allows the text-color command to replace imported alpha', () => {
        run(`<span style="${native}">Edit</span>`);
        const range = document.createRange();
        range.selectNodeContents(root);
        editor.setDOMSelection({ type: 'range', range });
        setTextColor(editor, 'red');
        expect(fill('Edit')).toBe('rgb(255, 0, 0)');
    });
    it('does not invent a fill for invalid native metadata', () => {
        run(
            '<span style="mso-style-textfill-fill-color:invalid;mso-style-textfill-fill-alpha:125%">Control</span>'
        );
        expect(fill('Control')).toBe('rgb(0, 102, 204)');
    });
    it('does not make the decoration color transparent with a no-fill glyph', () => {
        run('<u style="mso-style-textfill-type:none">Underlined</u>');
        expect(fill('Underlined')).toBe('rgba(0, 0, 0, 0)');
        const underline = root.querySelector('u')!;
        expect(getComputedStyle(underline).textDecorationColor).toBe('rgb(0, 102, 204)');
    });
});
