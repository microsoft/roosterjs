import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word revision semantics', () => {
    const id = 'word-revision';
    const cite = 'mailto:reviewer@example.invalid';
    const datetime = '2024-01-02T03:04:00Z';
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
    const pasteRevision = (content: string, word = true) => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head>${
                word ? '<meta name="ProgId" content="Word.Document">' : ''
            }</head>
                <body><!--StartFragment--><p style="font:24px Calibri;line-height:150%">Before ${content} after.</p><!--EndFragment--></body></html>`,
        });
    };
    it('retains the native deletion element and supplied revision metadata', () => {
        pasteRevision(`<del cite="${cite}" datetime="${datetime}">deleted</del>`);
        const deletion = root.querySelector('del');
        expect(deletion).not.toBeNull();
        expect(deletion!.getAttribute('cite')).toBe(cite);
        expect(deletion!.getAttribute('datetime')).toBe(datetime);
        expect(deletion!.textContent).toBe('deleted');
        expect(deletion!.querySelector('div,p')).toBeNull();
    });
    it('retains insertion metadata without splitting inline text into block lines', () => {
        pasteRevision(`<ins cite="${cite}" datetime="${datetime}">inserted</ins>`);
        const insertion = root.querySelector('ins')!;
        expect(insertion.getAttribute('cite')).toBe(cite);
        expect(insertion.getAttribute('datetime')).toBe(datetime);
        expect(insertion.querySelector('div,p')).toBeNull();
        expect(root.querySelector('p')!.textContent).toBe('Before\u00a0inserted after.');
    });
    it('preserves nested inline formatting and explicit decoration overrides', () => {
        pasteRevision('<del style="text-decoration:none;color:red"><b>deleted</b></del>');
        const deletion = root.querySelector('del')!;
        expect(deletion).not.toBeNull();
        expect(deletion.querySelector('b')!.textContent).toBe('deleted');
        expect(getComputedStyle(deletion).color).toBe('rgb(255, 0, 0)');
        expect(getComputedStyle(deletion).textDecorationLine).toBe('none');
    });
    it('keeps insertion and deletion content and metadata distinct', () => {
        pasteRevision(
            `<del datetime="${datetime}">old</del><ins datetime="2024-01-03T03:04:00Z">new</ins>`
        );
        expect(root.querySelector('del')!.textContent).toBe('old');
        expect(root.querySelector('ins')!.textContent).toBe('new');
        expect(root.querySelector('del')!.getAttribute('datetime')).toBe(datetime);
        expect(root.querySelector('ins')!.getAttribute('datetime')).toBe('2024-01-03T03:04:00Z');
        expect(root.querySelector('p')!.textContent).toBe('Before\u00a0oldnew after.');
    });
    it('preserves standard non-Word revisions as semantic elements', () => {
        pasteRevision(`<del cite="${cite}" datetime="${datetime}">deleted</del>`, false);
        expect(root.querySelector('del')!.getAttribute('datetime')).toBe(datetime);
    });
    it('does not convert ordinary strikethrough into a tracked deletion', () => {
        pasteRevision('<s>ordinary</s>');
        expect(root.querySelector('del')).toBeNull();
        expect(root.textContent).toContain('ordinary');
    });
});
