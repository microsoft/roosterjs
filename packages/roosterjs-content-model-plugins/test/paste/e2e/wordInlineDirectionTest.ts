import { Editor, paste } from 'roosterjs-content-model-core';
import { PastePlugin } from '../../../lib/paste/PastePlugin';
import { clearFormat } from 'roosterjs-content-model-api';

describe('Word inline direction paste', () => {
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

    function pasteFragment(fragment: string) {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"></head><body><!--StartFragment-->${fragment}<!--EndFragment--></body></html>`,
        });
    }

    ['ltr', 'rtl'].forEach(direction => {
        it(`preserves ${direction} isolation within an opposite-direction paragraph`, () => {
            pasteFragment(
                `<p dir="${
                    direction == 'ltr' ? 'rtl' : 'ltr'
                }">before <span dir="${direction}">abc - 123</span> after</p>`
            );
            const span = root.querySelector(`span[dir="${direction}"]`)!;
            expect(span).not.toBeNull();
            if (span) {
                expect(getComputedStyle(span).direction).toBe(direction);
                expect(getComputedStyle(span).unicodeBidi).toBe('isolate');
                expect(span.textContent).toBe('abc - 123');
            }
        });
    });

    it('keeps one bidi scope across formatted runs and nested direction resets', () => {
        pasteFragment(
            '<p dir="rtl"><span dir="ltr">abc <b>bold</b> - 123 <span dir="rtl">אבג</span></span> סוף</p>'
        );
        const outer = root.querySelector('span[dir="ltr"]')!;
        expect(outer).not.toBeNull();
        if (outer) {
            expect(outer.textContent!.replace(/\u00a0/g, ' ')).toBe('abc bold - 123 אבג');
            expect(outer.querySelector('b')).not.toBeNull();
            expect(outer.querySelector('span[dir="rtl"]')!.textContent).toBe('אבג');
            expect(outer.querySelector('div,p')).toBeNull();
        }
        expect(root.querySelectorAll('span[dir="ltr"]').length).toBe(1);
    });

    it('keeps editable bidi semantics while clearing visual formatting', () => {
        pasteFragment(
            '<p dir="rtl"><span dir="ltr" style="font-size:30pt"><b>abc - 123</b></span></p>'
        );
        const range = document.createRange();
        range.selectNodeContents(root);
        editor.setDOMSelection({ type: 'range', range });
        clearFormat(editor);
        const span = root.querySelector('span[dir="ltr"]')!;
        expect(span).not.toBeNull();
        if (span) {
            expect(span.textContent).toBe('abc - 123');
            expect(span.querySelector('b')).toBeNull();
            expect(getComputedStyle(span).fontSize).toBe(getComputedStyle(root).fontSize);
            expect(span.closest('[contenteditable="false"]')).toBeNull();
        }
    });
});
