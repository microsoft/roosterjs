import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word negative paragraph indentation', () => {
    const id = 'word-negative-paragraph';
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
    const pasteParagraph = (style: string, tag = 'p', sheet = '', word = true) => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>${
                word ? '<meta name="ProgId" content="Word.Document">' : ''
            }<style>${sheet}</style></head>
                <body><!--StartFragment--><${tag} class="Indent" style="font:24px Calibri;text-indent:0;${style}">Native indentation</${tag}><!--EndFragment--></body></html>`,
        });
        return root.querySelector(tag)!;
    };
    it('retains the native negative paragraph left indent without a hanging indent', () => {
        const paragraph = pasteParagraph('margin-left:-24pt');
        expect(getComputedStyle(paragraph).marginLeft).toBe('-32px');
        const range = document.createRange();
        range.selectNodeContents(paragraph);
        expect(range.getBoundingClientRect().left - root.getBoundingClientRect().left).toBe(-32);
        expect(getComputedStyle(paragraph).textIndent).toBe('0px');
    });
    it('retains signed indentation from source stylesheets', () => {
        const paragraph = pasteParagraph('', 'p', '.Indent{margin-left:-24pt}');
        expect(getComputedStyle(paragraph).marginLeft).toBe('-32px');
    });
    it('retains a negative heading left indent', () => {
        const paragraph = pasteParagraph('margin-left:-24pt', 'h2');
        expect(getComputedStyle(paragraph).marginLeft).toBe('-32px');
    });
    it('does not mistake explicit no-list metadata for a real list', () => {
        const paragraph = pasteParagraph('margin-left:-24pt;mso-list:none');
        expect(getComputedStyle(paragraph).marginLeft).toBe('-32px');
    });
    it('retains existing positive paragraph indentation', () => {
        const paragraph = pasteParagraph('margin-left:24pt');
        expect(getComputedStyle(paragraph).marginLeft).toBe('32px');
    });
    it('retains standard non-Word negative indentation', () => {
        const paragraph = pasteParagraph('margin-left:-24pt', 'p', '', false);
        expect(getComputedStyle(paragraph).marginLeft).toBe('-32px');
    });
});
