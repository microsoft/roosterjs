import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word explicitly numberless list levels', () => {
    const id = 'word-numberless-list';
    let editor: IEditor;

    beforeEach(() => {
        editor = initEditor(id);
    });

    afterEach(() => {
        editor.dispose();
        document.getElementById(id)?.remove();
    });

    const pasteList = (definitions: string, fragment: string) => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document">
                <style>${definitions}</style></head><body><!--StartFragment-->${fragment}<!--EndFragment--></body></html>`,
        });
        return document.getElementById(id)!;
    };

    it('does not invent numbers for an explicitly numberless list', () => {
        const root = pasteList(
            '@list l0:level1 { mso-level-number-format:none; }',
            '<p style="mso-list:l0 level1 lfo1">First unnumbered item</p>' +
                '<p style="mso-list:l0 level1 lfo1">Second unnumbered item</p>'
        );
        const items = root.querySelectorAll('li');

        expect(items.length).toBe(2);
        items.forEach(item => expect(getComputedStyle(item).listStyleType).toBe('none'));
        expect(root.textContent).toBe('First unnumbered itemSecond unnumbered item');
        expect(root.querySelector('ol')).not.toBeNull();
    });

    it('preserves numbering on a parent of a numberless nested level', () => {
        const root = pasteList(
            '@list l0:level1 { mso-level-start-at:7; }' +
                '@list l0:level2 { mso-level-number-format:none; }',
            '<p style="mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">7.</span>Parent</p>' +
                '<p style="mso-list:l0 level2 lfo1">Unnumbered child</p>'
        );
        const items = root.querySelectorAll('li');

        expect(items.length).toBe(2);
        expect(getComputedStyle(items[0]).listStyleType).toBe('decimal');
        expect(getComputedStyle(items[1]).listStyleType).toBe('none');
        expect(root.querySelector('ol')!.start).toBe(7);
    });

    it('keeps an explicitly supplied visible CSS list style authoritative', () => {
        const root = pasteList(
            '@list l0:level1 { mso-level-number-format:none; }',
            '<p style="mso-list:l0 level1 lfo1;list-style-type:lower-roman">CSS controls marker</p>'
        );

        expect(getComputedStyle(root.querySelector('li')!).listStyleType).toBe('lower-roman');
    });

    it('handles uppercase none on headings without changing unrelated decimal lists', () => {
        const root = pasteList(
            '@list l0:level1 { mso-level-number-format:NONE; }' +
                '@list l1:level1 { mso-level-start-at:3; }',
            '<h2 style="mso-list:l0 level1 lfo1">Unnumbered heading</h2>' +
                '<p style="mso-list:l1 level1 lfo2"><span style="mso-list:Ignore">3.</span>Numbered control</p>'
        );
        const items = root.querySelectorAll('li');

        expect(getComputedStyle(items[0]).listStyleType).toBe('none');
        expect(getComputedStyle(items[1]).listStyleType).toBe('decimal');
        expect(root.querySelectorAll('ol')[1].start).toBe(3);
    });
});
