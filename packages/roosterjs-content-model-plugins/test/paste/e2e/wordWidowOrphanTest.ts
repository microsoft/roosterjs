import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import {
    contentModelToDom,
    createDomToModelContext,
    createModelToDomContext,
    domToContentModel,
} from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word native widow and orphan constraints', () => {
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor('word-widows');
        root = document.getElementById('word-widows')!;
        root.style.cssText =
            'font:20px/20px Calibri;width:400px;height:100px;column-count:2;column-gap:20px;column-fill:auto';
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
                <body><!--StartFragment-->${content}<!--EndFragment--></body></html>`,
        });
    }
    function fragment(filler: number, style: string, sheet = '') {
        run(
            `<p style="font:20px/20px Calibri;margin:0">${Array.from(
                { length: filler },
                (_, i) => `Filler ${i}`
            ).join(
                '<br>'
            )}</p><p class="Native" style="font:20px/20px Calibri;margin:0;${style}">Native A<br>Native B<br>Native C</p>`,
            sheet
        );
        const paragraph = root.querySelectorAll('p')[1];
        const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
        const lefts: number[] = [];
        let node: Node | null;
        while ((node = walker.nextNode())) {
            if (node.textContent?.startsWith('Native')) {
                const range = document.createRange();
                range.selectNodeContents(node);
                lefts.push(range.getBoundingClientRect().left - root.getBoundingClientRect().left);
            }
        }
        return lefts;
    }
    it('permits a one-line orphan fragment for explicit native none', () => {
        const lefts = fragment(4, 'mso-pagination:none');
        expect(lefts[0]).toBeLessThan(190);
        expect(lefts[1]).toBeGreaterThan(190);
    });
    it('permits a one-line widow at the following fragment', () => {
        const lefts = fragment(3, 'mso-pagination:none');
        expect(lefts[1]).toBeLessThan(190);
        expect(lefts[2]).toBeGreaterThan(190);
    });
    it('retains the native two-line control when explicitly enabled', () => {
        const lefts = fragment(4, 'mso-pagination:widow-orphan');
        expect(lefts[0]).toBeGreaterThan(190);
    });
    it('recovers original stylesheet line constraints', () => {
        const lefts = fragment(4, '', '.Native{mso-pagination:none}');
        expect(lefts[0]).toBeLessThan(190);
    });
    it('resets inherited disabled native constraints when enabled on a child', () => {
        run(
            '<div id="parent" style="orphans:1;widows:1"><p style="mso-pagination:widow-orphan">Restored</p></div>'
        );
        const paragraph = root.querySelector('p')!;
        expect(getComputedStyle(paragraph).widows).toBe('2');
        expect(getComputedStyle(paragraph).orphans).toBe('2');
    });
    it('preserves explicit browser values and inherited unset versus initial', () => {
        run(
            '<div id="parent" style="orphans:3;widows:4"><p style="mso-pagination:none;orphans:unset;widows:initial">Explicit</p></div>'
        );
        const paragraph = root.querySelector('p')!;
        expect(getComputedStyle(paragraph).orphans).toBe('3');
        expect(getComputedStyle(paragraph).widows).toBe('2');
    });
    it('round-trips the native disabled constraint without Word metadata', () => {
        run('<p style="mso-pagination:none">Round trip</p>');
        const model = domToContentModel(root, createDomToModelContext());
        const output = document.createElement('div');
        contentModelToDom(document, output, model, createModelToDomContext());
        expect(output.querySelector('p')!.style.orphans).toBe('1');
        expect(output.querySelector('p')!.style.widows).toBe('1');
    });
});
