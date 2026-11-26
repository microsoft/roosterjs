import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word paragraph pagination', () => {
    const id = 'word-pagination';
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
    const pasteContent = (content: string, sheet = '', word = true) => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>${
                word ? '<meta name="ProgId" content="Word.Document">' : ''
            }<style>${sheet}</style></head>
                <body><!--StartFragment-->${content}<!--EndFragment--></body></html>`,
        });
    };
    it('retains the native new-page paragraph policy', () => {
        pasteContent('<p>First</p><p style="page-break-before:always">Second</p>');
        expect(getComputedStyle(root.querySelectorAll('p')[1]).breakBefore).toBe('page');
        expect(getComputedStyle(root.querySelectorAll('p')[0]).breakBefore).toBe('auto');
    });
    it('retains native keep-with-next without forcing a new page', () => {
        pasteContent('<p style="page-break-after:avoid">Keep</p><p>Next</p>');
        expect(getComputedStyle(root.querySelectorAll('p')[0]).breakAfter).toBe('avoid');
        expect(getComputedStyle(root.querySelectorAll('p')[1]).breakAfter).toBe('auto');
    });
    it('recovers legacy page-break declarations from stylesheets', () => {
        pasteContent('<p class="NewPage">Second</p>', '.NewPage{page-break-before:always}');
        expect(getComputedStyle(root.querySelector('p')!).breakBefore).toBe('page');
    });
    it('retains the native cannot-split-row policy', () => {
        pasteContent('<table><tr style="page-break-inside:avoid"><td>Row</td></tr></table>');
        expect(getComputedStyle(root.querySelector('tr')!).breakInside).toBe('avoid');
    });
    it('does not duplicate a container break on each child paragraph', () => {
        pasteContent('<div style="page-break-before:always"><p>One</p><p>Two</p></div>');
        expect(getComputedStyle(root.querySelector('div')!).breakBefore).toBe('page');
        Array.from(root.querySelectorAll('p')).forEach(p =>
            expect(getComputedStyle(p).breakBefore).toBe('auto')
        );
    });
    it('retains standard non-Word modern fragmentation rules', () => {
        pasteContent(
            '<p style="break-before:page;break-after:avoid;break-inside:avoid">Modern</p>',
            '',
            false
        );
        const style = getComputedStyle(root.querySelector('p')!);
        expect(style.breakBefore).toBe('page');
        expect(style.breakAfter).toBe('avoid');
        expect(style.breakInside).toBe('avoid');
    });
    it('preserves explicit resets and normal paragraph controls', () => {
        pasteContent('<p style="page-break-before:auto;page-break-after:auto">Normal</p>');
        expect(getComputedStyle(root.querySelector('p')!).breakBefore).toBe('auto');
        expect(getComputedStyle(root.querySelector('p')!).breakAfter).toBe('auto');
    });
});
