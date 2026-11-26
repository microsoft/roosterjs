import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word float-clearing line breaks', () => {
    const id = 'word-break-clear';
    const image =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=';
    let editor: IEditor;
    let source: HTMLDivElement;

    beforeEach(() => {
        editor = initEditor(id);
        document.getElementById(id)!.style.cssText = 'width:500px;font:16px/20px Arial';
        source = document.createElement('div');
        source.style.cssText = 'width:500px;font:16px/20px Arial';
        document.body.appendChild(source);
    });

    afterEach(() => {
        editor.dispose();
        document.getElementById(id)?.remove();
        source.remove();
    });

    const pasteBreak = (float: string, attributes: string) => {
        const fragment = `<p><img src="${image}" style="float:${float};width:80px;height:100px">Before<br ${attributes}><span>After</span></p>`;
        source.innerHTML = fragment;
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"></head><body><!--StartFragment-->${fragment}<!--EndFragment--></body></html>`,
        });
        return document.getElementById(id)!;
    };

    const isBelowImage = (root: HTMLElement) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            if (node.textContent == 'After') {
                const range = document.createRange();
                range.selectNodeContents(node);
                return (
                    range.getBoundingClientRect().top >=
                    root.querySelector('img')!.getBoundingClientRect().bottom - 1
                );
            }
        }

        throw new Error('Missing pasted text after the line break');
    };

    [
        { float: 'left', clear: 'all' },
        { float: 'left', clear: 'left' },
        { float: 'right', clear: 'right' },
    ].forEach(({ float, clear }) => {
        it(`preserves clear=${clear} below a ${float}-floating image`, () => {
            const root = pasteBreak(float, `clear="${clear}"`);
            const pastedImage = root.querySelector('img')!;

            expect(getComputedStyle(pastedImage).float).toBe(float);
            expect(pastedImage.getBoundingClientRect().height).toBe(100);
            expect(isBelowImage(source)).toBeTrue();
            expect(isBelowImage(root)).toBeTrue();
        });
    });

    it('keeps explicit CSS none authoritative over the legacy clear attribute', () => {
        const root = pasteBreak('left', 'clear="all" style="clear:none"');

        expect(isBelowImage(source)).toBeFalse();
        expect(isBelowImage(root)).toBeFalse();
    });

    it('does not clear a float on the opposite side', () => {
        const root = pasteBreak('left', 'clear="right"');

        expect(isBelowImage(source)).toBeFalse();
        expect(isBelowImage(root)).toBeFalse();
    });

    it('retains supplied standard clear CSS', () => {
        const root = pasteBreak('right', 'style="clear:both"');

        expect(isBelowImage(source)).toBeTrue();
        expect(isBelowImage(root)).toBeTrue();
    });
});
