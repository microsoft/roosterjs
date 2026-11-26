import { initEditor } from './testUtils';
import { Editor, paste } from 'roosterjs-content-model-core';
import { PastePlugin } from '../../../lib/paste/PastePlugin';
import { toggleUnderline } from 'roosterjs-content-model-api';
import {
    contentModelToDom,
    createDomToModelContext,
    createModelToDomContext,
    domToContentModel,
    normalizeContentModel,
} from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word word-only underline coverage', () => {
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor('word-only-underline');
        root = document.getElementById('word-only-underline')!;
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    function run(content: string, sheet = '', word = true) {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>${
                word ? '<meta name="ProgId" content="Word.Document">' : ''
            }<style>${sheet}</style></head><body><!--StartFragment-->${content}<!--EndFragment--></body></html>`,
        });
    }
    function coverage(container = root) {
        const values: { text: string; underline: boolean }[] = [];
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
            const node = walker.currentNode as Text;
            let parent = node.parentElement;
            let underline = false;
            while (parent && parent != container) {
                underline =
                    underline || getComputedStyle(parent).textDecorationLine.includes('underline');
                parent = parent.parentElement;
            }
            if (node.length) values.push({ text: node.data, underline });
        }
        return values;
    }
    it('underlines words but not ordinary or nonbreaking spaces', () => {
        run('<p><u style="text-underline:words">Alpha&nbsp;&nbsp;Beta Gamma</u></p>');
        expect(
            coverage()
                .filter(value => /\S/u.test(value.text))
                .every(value => value.underline)
        ).toBe(true);
        expect(
            coverage()
                .filter(value => !/\S/u.test(value.text))
                .every(value => !value.underline)
        ).toBe(true);
        expect(root.textContent).toBe('Alpha\u00a0\u00a0Beta Gamma');
    });
    it('recovers paragraph-class word coverage from the original stylesheet', () => {
        run(
            '<p class="Words">Alpha&nbsp;Beta</p>',
            '.Words{text-decoration:underline;TEXT-UNDERLINE:words}'
        );
        expect(
            coverage()
                .filter(value => !/\S/u.test(value.text))
                .map(value => value.underline)
        ).toEqual([false]);
        expect(
            coverage()
                .filter(value => /\S/u.test(value.text))
                .every(value => value.underline)
        ).toBe(true);
    });
    it('resolves a word-only child inside an otherwise continuously underlined paragraph', () => {
        run(
            '<p style="text-decoration:underline">Control&nbsp;text <u style="text-underline:words">Alpha&nbsp;Beta</u></p>'
        );
        const values = coverage();
        expect(values.some(value => value.text.includes('Control') && value.underline)).toBe(true);
        expect(values.some(value => value.text == '\u00a0' && !value.underline)).toBe(true);
    });
    it('retains continuous underline inherited from a paragraph class', () => {
        run(
            '<p class="Continuous">Control&nbsp;text <u style="text-underline:words">Alpha&nbsp;Beta</u></p>',
            '.Continuous{text-decoration:underline}'
        );
        expect(coverage().some(value => value.text.includes('Control') && value.underline)).toBe(
            true
        );
        expect(coverage().some(value => value.text == '\u00a0' && !value.underline)).toBe(true);
    });
    it('retains bold, strike, links, line breaks and explicit native underline resets', () => {
        run(
            '<p><u style="text-underline:words"><b>Bold&nbsp;words</b><br><s>Strike&nbsp;words</s><a href="https://example.test" style="text-underline:words">Link&nbsp;words</a><u style="text-underline:single"> single&nbsp;control</u></u></p>'
        );
        expect(root.querySelector('b')).not.toBeNull();
        expect(root.querySelector('strike,s')).not.toBeNull();
        expect(root.querySelector('br')).not.toBeNull();
        expect(root.querySelector('a')!.getAttribute('href')).toBe('https://example.test');
        expect(coverage().some(value => value.text.includes('single') && value.underline)).toBe(
            true
        );
        const link = root.querySelector('a')!;
        expect(
            coverage(link)
                .filter(value => !/\S/u.test(value.text))
                .every(value => !value.underline)
        ).toBe(true);
    });
    it('retains resolved coverage through DOM/model conversion', () => {
        run('<p><u style="text-underline:words">Alpha&nbsp;&nbsp;Beta</u></p>');
        const model = domToContentModel(root, createDomToModelContext());
        normalizeContentModel(model);
        const output = document.createElement('div');
        contentModelToDom(document, output, model, createModelToDomContext());
        document.body.appendChild(output);
        expect(
            coverage(output)
                .filter(value => !/\S/u.test(value.text))
                .every(value => !value.underline)
        ).toBe(true);
        expect(
            coverage(output)
                .filter(value => /\S/u.test(value.text))
                .every(value => value.underline)
        ).toBe(true);
        expect(output.textContent).toBe('Alpha\u00a0\u00a0Beta');
        output.remove();
    });
    it('keeps ordinary underline and non-Word content unchanged', () => {
        run(
            '<p><u>Alpha&nbsp;Beta</u></p><p><u style="text-underline:words;text-decoration:none">No underline</u></p>'
        );
        expect(coverage().some(value => value.text.includes('Alpha') && value.underline)).toBe(
            true
        );
        expect(
            coverage().some(value => value.text.includes('No underline') && !value.underline)
        ).toBe(true);
        root.innerHTML = '';
        run('<p><u style="text-underline:words">Ordinary&nbsp;HTML</u></p>', '', false);
        expect(coverage().every(value => value.underline)).toBe(true);
    });
    it('supports an ordinary underline command over the imported words and spaces', () => {
        run('<p><u style="text-underline:words">Alpha&nbsp;&nbsp;Beta</u></p>');
        const range = document.createRange();
        range.selectNodeContents(root.querySelector('p')!);
        editor.setDOMSelection({ type: 'range', range, isReverted: false });
        toggleUnderline(editor);
        expect(coverage().every(value => value.underline)).toBe(true);
        expect(root.textContent).toBe('Alpha\u00a0\u00a0Beta');
        toggleUnderline(editor);
        expect(coverage().every(value => !value.underline)).toBe(true);
        expect(root.textContent).toBe('Alpha\u00a0\u00a0Beta');
    });
    it('honors a configured text-decoration sanitizer without changing the text', () => {
        editor.dispose();
        editor = new Editor(root as HTMLDivElement, {
            plugins: [
                new PastePlugin(undefined, {
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    attributeSanitizers: {},
                    styleSanitizers: { 'text-decoration': false },
                }),
            ],
        });
        run('<p><u style="text-underline:words">Alpha&nbsp;Beta</u></p>');
        expect(coverage().every(value => !value.underline)).toBe(true);
        expect(root.textContent).toBe('Alpha\u00a0Beta');
    });
    it('honors a disabled text-decoration-line without losing nonbreaking spaces', () => {
        editor.dispose();
        editor = new Editor(root as HTMLDivElement, {
            plugins: [
                new PastePlugin(undefined, {
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    attributeSanitizers: {},
                    styleSanitizers: { 'text-decoration-line': false },
                }),
            ],
        });
        run('<p><u style="text-underline:words">Alpha&nbsp;&nbsp;Beta</u></p>');
        expect(coverage().every(value => !value.underline)).toBe(true);
        expect(root.textContent).toBe('Alpha\u00a0\u00a0Beta');
    });
});
