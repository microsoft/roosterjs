import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word floating table alignment', () => {
    const id = 'word-floating-table-research';
    let editor: IEditor;
    let source: HTMLDivElement;

    beforeEach(() => {
        editor = initEditor(id);
        document.getElementById(id)!.style.cssText = 'display:flow-root;width:500px';
        source = document.createElement('div');
        source.style.cssText = 'display:flow-root;width:500px';
        document.body.appendChild(source);
    });

    afterEach(() => {
        editor.dispose();
        document.getElementById(id)?.remove();
        source.remove();
    });

    const getFollowingTextRect = (root: HTMLElement) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            if (node.textContent == 'Following text') {
                const range = document.createRange();
                range.selectNodeContents(node);
                return range.getBoundingClientRect();
            }
        }
        throw new Error('Missing text following the table');
    };

    ['left', 'right'].forEach(align => {
        it(`preserves Word table align=${align} and wrapping text`, () => {
            const fragment = `<table align="${align}" style="width:144pt"><tr><td style="height:72pt">Table</td></tr></table><p>Following text</p>`;
            source.innerHTML = fragment;
            paste(editor, {
                types: ['text/html'],
                text: '',
                image: null,
                customValues: {},
                rawHtml: `<html><head><meta name="ProgId" content="Word.Document"></head><body><!--StartFragment-->${fragment}<!--EndFragment--></body></html>`,
            });
            [source, document.getElementById(id)!].forEach(root => {
                const table = root.querySelector('table')!;
                expect(getComputedStyle(table).float).toBe(align);
                expect(getFollowingTextRect(root).top).toBeLessThan(
                    table.getBoundingClientRect().bottom
                );
            });
        });
    });

    it('keeps an ordinary nonfloating table above following text', () => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml:
                '<html><head><meta name="ProgId" content="Word.Document"></head><body><!--StartFragment--><table style="width:144pt"><tr><td style="height:72pt">Table</td></tr></table><p>Following text</p><!--EndFragment--></body></html>',
        });
        const root = document.getElementById(id)!;
        const table = root.querySelector('table')!;

        expect(getComputedStyle(table).float).toBe('none');
        expect(getFollowingTextRect(root).top).toBeGreaterThanOrEqual(
            table.getBoundingClientRect().bottom
        );
    });
});
