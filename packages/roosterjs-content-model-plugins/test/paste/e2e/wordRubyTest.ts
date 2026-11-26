import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word ruby layout', () => {
    const id = 'word-ruby';
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

    const pasteRuby = (content: string, word = true) => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>${
                word ? '<meta name="ProgId" content="Word.Document">' : ''
            }</head>
                <body><!--StartFragment--><p style="font:32px Calibri;line-height:150%">${content}</p><!--EndFragment--></body></html>`,
        });
        const ruby = root.querySelector('ruby');
        if (!ruby) {
            throw new Error('Missing pasted ruby');
        }
        return ruby;
    };

    it('does not introduce block wrappers inside native ruby', () => {
        const ruby = pasteRuby(
            '<ruby style="ruby-align:center">BASE<rp>(</rp><rt style="font-size:16px">annotation</rt><rp>)</rp></ruby>'
        );
        expect(ruby.querySelector('div,p')).toBeNull();
        expect(ruby.querySelector('rt')!.textContent).toBe('annotation');
        expect(ruby.querySelectorAll('rp').length).toBe(2);
    });

    it('keeps the annotation above the base instead of on a separate block line', () => {
        const ruby = pasteRuby(
            '<ruby>LONG BASE TEXT<rt style="font-size:16px">reading</rt></ruby>'
        );
        const annotation = ruby.querySelector('rt')!;
        const range = document.createRange();
        range.selectNodeContents(annotation);
        const annotationRect = range.getBoundingClientRect();
        const walker = document.createTreeWalker(ruby, NodeFilter.SHOW_TEXT);
        const base = walker.nextNode()!;
        range.selectNodeContents(base);
        const baseRect = range.getBoundingClientRect();
        expect(annotationRect.top).toBeLessThan(baseRect.top);
    });

    it('retains base and annotation inline formatting', () => {
        const ruby = pasteRuby(
            '<ruby><b>BASE</b><rt style="font-size:12px;color:red">reading</rt></ruby>'
        );
        expect(ruby.querySelector('div,p')).toBeNull();
        expect(ruby.querySelector('b')!.textContent).toBe('BASE');
        expect(getComputedStyle(ruby.querySelector('rt')!).fontSize).toBe('12px');
        expect(getComputedStyle(ruby.querySelector('rt')!).color).toBe('rgb(255, 0, 0)');
        expect(root.querySelector('p')!.style.lineHeight).toBe('1.8');
    });

    it('preserves multiple annotations and adjacent text', () => {
        const ruby = pasteRuby('Before<ruby>A<rt>a</rt>B<rt>b</rt></ruby>After');
        expect(ruby.querySelector('div,p')).toBeNull();
        expect(Array.from(ruby.querySelectorAll('rt')).map(rt => rt.textContent)).toEqual([
            'a',
            'b',
        ]);
        expect(root.textContent).toContain('BeforeAaBbAfter');
    });

    it('also retains standard non-Word ruby layout', () => {
        const ruby = pasteRuby('<ruby>BASE<rt>reading</rt></ruby>', false);
        expect(ruby.querySelector('div,p')).toBeNull();
    });
});
