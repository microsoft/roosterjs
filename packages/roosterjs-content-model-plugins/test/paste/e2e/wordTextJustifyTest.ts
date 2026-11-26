import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word distributed final lines', () => {
    const id = 'word-text-justify';
    let editor: IEditor;
    let root: HTMLElement;
    beforeEach(() => {
        editor = initEditor(id);
        root = document.getElementById(id)!;
        root.style.width = '420px';
    });
    afterEach(() => {
        editor.dispose();
        root.remove();
    });
    const pasteParagraph = (style: string, sheet = '', word = true, content = 'Word paste') => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>${
                word ? '<meta name="ProgId" content="Word.Document">' : ''
            }<style>${sheet}</style></head>
                <body><!--StartFragment--><p class="Dist" style="font:28px Calibri;text-align:justify;${style}">${content}</p><!--EndFragment--></body></html>`,
        });
        return root.querySelector('p')!;
    };
    it('distributes the native final line across the available width', () => {
        const p = pasteParagraph('text-justify:distribute-all-lines');
        expect(getComputedStyle(p).textAlignLast).toBe('justify');
        const range = document.createRange();
        range.selectNodeContents(p);
        expect(range.getBoundingClientRect().width).toBeGreaterThan(419);
        expect(p.textContent).toBe('Word paste');
    });
    it('recovers the native descriptor from source stylesheets', () => {
        const p = pasteParagraph('', '.Dist{text-justify:distribute-all-lines}');
        expect(getComputedStyle(p).textAlignLast).toBe('justify');
    });
    it('keeps explicit standard final-line alignment over the native descriptor', () => {
        const p = pasteParagraph('text-justify:distribute-all-lines;text-align-last:center');
        expect(getComputedStyle(p).textAlignLast).toBe('center');
    });
    it('preserves ordinary justification without distributing its final line', () => {
        const p = pasteParagraph('');
        expect(getComputedStyle(p).textAlignLast).toBe('auto');
    });
    it('does not interpret other native justification algorithms as final-line distribution', () => {
        const p = pasteParagraph('text-justify:inter-cluster');
        expect(getComputedStyle(p).textAlignLast).toBe('auto');
    });
    it('preserves standard final-line alignment outside Word', () => {
        const p = pasteParagraph('text-align-last:justify', '', false);
        expect(getComputedStyle(p).textAlignLast).toBe('justify');
    });
    it('retains the recovered policy on list paragraphs', () => {
        pasteParagraph(
            '',
            '',
            true,
            '<ul><li style="text-align:justify;text-justify:distribute-all-lines">List</li></ul>'
        );
        expect(getComputedStyle(root.querySelector('li')!).textAlignLast).toBe('justify');
    });
});
