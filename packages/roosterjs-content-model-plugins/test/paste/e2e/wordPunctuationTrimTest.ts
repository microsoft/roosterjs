import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import {
    contentModelToDom,
    createDomToModelContext,
    createModelToDomContext,
    domToContentModel,
} from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word leading punctuation compression', () => {
    let editor: IEditor;
    let root: HTMLElement;
    const text = '\uFF08\u65E5\u672C\u8A9E\uFF09';
    beforeEach(() => {
        editor = initEditor('word-punctuation');
        root = document.getElementById('word-punctuation')!;
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
    function trim(paragraph: Element) {
        return getComputedStyle(paragraph).getPropertyValue('text-spacing-trim');
    }
    function advance(paragraph: Element) {
        const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
        const node = walker.nextNode()!;
        const range = document.createRange();
        range.setStart(node, 0);
        range.setEnd(node, 1);
        return range.getBoundingClientRect().width;
    }
    it('shapes leading full-width punctuation without changing the text', async () => {
        run(
            `<p style="font:40px 'Yu Gothic';punctuation-trim:leading">${text}</p><p style="font:40px 'Yu Gothic';punctuation-trim:none">${text}</p>`
        );
        await document.fonts.ready;
        const paragraphs = root.querySelectorAll('p');
        expect(trim(paragraphs[0])).toBe('trim-start');
        expect(trim(paragraphs[1])).toBe('space-all');
        expect(advance(paragraphs[0])).toBeLessThan(advance(paragraphs[1]));
        expect(paragraphs[0].textContent).toBe(text);
        expect(paragraphs[1].textContent).toBe(text);
    });
    it('recovers original stylesheet punctuation settings', () => {
        run(`<p class="Leading">${text}</p>`, '.Leading{punctuation-trim:leading}');
        expect(trim(root.querySelector('p')!)).toBe('trim-start');
    });
    it('disables inherited leading compression for native none', () => {
        run(
            `<div id="parent" style="text-spacing-trim:trim-start"><p style="punctuation-trim:none">${text}</p></div>`
        );
        expect(trim(root.querySelector('p')!)).toBe('space-all');
    });
    it('gives explicit browser spacing priority over native descriptors', () => {
        run(`<p style="text-spacing-trim:space-all;punctuation-trim:leading">${text}</p>`);
        expect(trim(root.querySelector('p')!)).toBe('space-all');
    });
    it('distinguishes inherited unset from initial', () => {
        run(
            `<div id="parent" style="text-spacing-trim:trim-start"><p style="text-spacing-trim:unset;punctuation-trim:none">${text}</p><p style="text-spacing-trim:initial;punctuation-trim:leading">${text}</p></div>`
        );
        const paragraphs = root.querySelectorAll('p');
        expect(trim(paragraphs[0])).toBe('trim-start');
        expect(trim(paragraphs[1])).toBe('normal');
    });
    it('round-trips the paragraph setting without original Word descriptors', () => {
        run(`<p style="punctuation-trim:leading">${text}</p>`);
        const model = domToContentModel(root, createDomToModelContext());
        const output = document.createElement('div');
        contentModelToDom(document, output, model, createModelToDomContext());
        expect(output.querySelector('p')!.style.getPropertyValue('text-spacing-trim')).toBe(
            'trim-start'
        );
    });
    it('does not invent settings for an unknown native value', () => {
        run(`<p style="punctuation-trim:unknown">${text}</p>`);
        expect(trim(root.querySelector('p')!)).toBe('normal');
    });
});
