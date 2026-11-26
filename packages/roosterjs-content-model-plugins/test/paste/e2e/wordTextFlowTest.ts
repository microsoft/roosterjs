import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import {
    contentModelToDom,
    createDomToModelContext,
    createModelToDomContext,
    domToContentModel,
} from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word section and paragraph text flow', () => {
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor('word-text-flow');
        root = document.getElementById('word-text-flow')!;
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    function run(content: string, sheet = '@page WordSection1{writing-mode:vertical-rl}') {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document"><style>${sheet}</style></head>
                <body><!--StartFragment-->${content}<!--EndFragment--></body></html>`,
        });
        return root.querySelector('div')!;
    }
    it('recovers section flow before DIV dispatch and progresses its paragraphs in columns', () => {
        const section = run(
            '<div class="WordSection1"><p>First</p><p>Second</p></div><p>Control</p>',
            '@page WordSection1{layout-flow:vertical-ideographic;writing-mode:vertical-rl} div.WordSection1{page:WordSection1}'
        );
        expect(section).not.toBeNull();
        if (section) {
            expect(getComputedStyle(section).writingMode).toBe('vertical-rl');
            const paragraphs = section.querySelectorAll('p');
            expect(paragraphs.length).toBe(2);
            expect(paragraphs[1].getBoundingClientRect().left).toBeLessThan(
                paragraphs[0].getBoundingClientRect().left
            );
        }
        expect(getComputedStyle(root.lastElementChild!).writingMode).toBe('horizontal-tb');
    });
    it('associates separate named sections without leaking flow and keeps later page rules', () => {
        run(
            '<div style="page:First"><p>First</p></div><div style="page:Second"><p>Second</p></div><div id="plain"><p>Plain</p></div>',
            '@page First{writing-mode:vertical-rl}@page Second{writing-mode:vertical-rl}@page Second{writing-mode:sideways-lr}'
        );
        const paragraphs = Array.from(root.querySelectorAll('p'));
        const first = paragraphs.find(p => p.textContent == 'First')!;
        const second = paragraphs.find(p => p.textContent == 'Second')!;
        const plain = paragraphs.find(p => p.textContent == 'Plain')!;
        expect(getComputedStyle(first.parentElement!).writingMode).toBe('vertical-rl');
        expect(getComputedStyle(second.parentElement!).writingMode).toBe('sideways-lr');
        expect(getComputedStyle(plain.parentElement!).writingMode).toBe('horizontal-tb');
    });
    it('preserves a single implicit paragraph section through ordinary DOM/model round-trip', () => {
        const section = run('<div style="page:WordSection1">Single paragraph</div>');
        expect(section).not.toBeNull();
        const model = domToContentModel(root, createDomToModelContext());
        const output = document.createElement('div');
        contentModelToDom(document, output, model, createModelToDomContext());
        expect(output.querySelector('div')?.style.writingMode).toBe('vertical-rl');
        expect(output.textContent).toBe('Single paragraph');
    });
    it('retains standard framed paragraph flow without double-applying legacy rotation', () => {
        run('<p style="layout-flow:horizontal;mso-rotate:-90;writing-mode:vertical-lr">Frame</p>');
        const paragraph = root.querySelector('p')!;
        expect(getComputedStyle(paragraph).writingMode).toBe('vertical-lr');
        expect(getComputedStyle(paragraph).transform).toBe('none');
        const model = domToContentModel(root, createDomToModelContext());
        const output = document.createElement('div');
        contentModelToDom(document, output, model, createModelToDomContext());
        expect(output.querySelector('p')!.style.writingMode).toBe('vertical-lr');
    });
    it('keeps explicit CSS resets and inherited values instead of overriding them with page flow', () => {
        const section = run(
            '<div style="page:WordSection1;writing-mode:vertical-lr"><p style="writing-mode:initial">Reset</p><p style="writing-mode:unset">Unset</p><p style="writing-mode:inherit">Inherit</p></div>'
        );
        expect(getComputedStyle(section).writingMode).toBe('vertical-lr');
        const paragraphs = section.querySelectorAll('p');
        expect(getComputedStyle(paragraphs[0]).writingMode).toBe('horizontal-tb');
        expect(getComputedStyle(paragraphs[1]).writingMode).toBe('vertical-lr');
        expect(getComputedStyle(paragraphs[2]).writingMode).toBe('vertical-lr');
    });
    it('does not invent flow from legacy-only or unrelated native page descriptors', () => {
        run(
            '<div id="unrelated" style="page:Other"><p>Other</p></div><p style="layout-flow:vertical;mso-rotate:90">Legacy</p>',
            '@page WordSection1{writing-mode:vertical-rl}@page Other{layout-flow:vertical}'
        );
        expect(getComputedStyle(root.querySelector('#unrelated')!).writingMode).toBe(
            'horizontal-tb'
        );
        expect(getComputedStyle(root.lastElementChild!).writingMode).toBe('horizontal-tb');
    });
});
