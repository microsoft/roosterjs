import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import {
    contentModelToDom,
    createDomToModelContext,
    createModelToDomContext,
    domToContentModel,
} from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word equal section columns', () => {
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor('word-columns');
        root = document.getElementById('word-columns')!;
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    function run(content: string, sheet = '@page WordSection1{mso-columns:2 even .5in}') {
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
    it('recovers the named page count and physical inter-column gap', () => {
        const section = run(
            '<div class="WordSection1"><p>One</p><p>Two</p></div>',
            '@page WordSection1{mso-columns:2 even .5in} div.WordSection1{page:WordSection1}'
        );
        expect(getComputedStyle(section).columnCount).toBe('2');
        expect(getComputedStyle(section).columnGap).toBe('48px');
        expect(section.querySelectorAll('p').length).toBe(2);
    });
    it('associates each section with its own named page without leaking columns', () => {
        run(
            '<div style="page:First"><p>First</p></div><div style="page:Second"><p>Second</p></div><div id="plain-section"><p>Plain</p></div>',
            '@page First{mso-columns:2 even 18pt}@page Second{mso-columns:3 even 9pt}'
        );
        const sections = root.querySelectorAll('div');
        expect(getComputedStyle(sections[0]).columnCount).toBe('2');
        expect(getComputedStyle(sections[1]).columnCount).toBe('3');
        expect(getComputedStyle(sections[1]).columnGap).toBe('12px');
        expect(getComputedStyle(sections[2]).columnCount).toBe('auto');
    });
    it('keeps explicit browser column counts, gaps and separator rules', () => {
        const section = run(
            '<div style="page:WordSection1;column-count:3;column-gap:12px;column-rule:2px solid red"><p>One</p></div>'
        );
        expect(getComputedStyle(section).columnCount).toBe('3');
        expect(getComputedStyle(section).columnGap).toBe('12px');
        expect(getComputedStyle(section).columnRuleColor).toBe('rgb(255, 0, 0)');
    });
    it('retains a single implicit paragraph container through ordinary DOM round-trip', () => {
        const section = run('<div style="page:WordSection1">Single text paragraph</div>');
        expect(getComputedStyle(section).columnCount).toBe('2');
        const model = domToContentModel(root, createDomToModelContext());
        const output = document.createElement('div');
        contentModelToDom(document, output, model, createModelToDomContext());
        const result = output.querySelector('div')!;
        expect(result.style.columnCount).toBe('2');
        expect(result.style.columnGap).toBe('0.5in');
        expect(result.textContent).toBe('Single text paragraph');
    });
    it('does not approximate unequal native column widths or invent separator metrics', () => {
        const section = run(
            '<div style="page:WordSection1"><p>Unequal</p></div>',
            '@page WordSection1{mso-columns:2 not-even 2in .5in 3in;mso-column-separator:solid}'
        );
        expect(getComputedStyle(section).columnCount).toBe('auto');
        expect(getComputedStyle(section).columnRuleStyle).toBe('none');
    });
    it('does not apply column metadata from an unrelated named page', () => {
        const section = run('<div style="page:Other"><p>Plain</p></div>');
        expect(getComputedStyle(section).columnCount).toBe('auto');
    });
});
