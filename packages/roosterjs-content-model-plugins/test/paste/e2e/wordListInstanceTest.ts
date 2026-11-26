import { initEditor } from './testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { IEditor } from 'roosterjs-content-model-types';

describe('Word list-instance numbering', () => {
    const id = 'word-list-instance';
    let editor: IEditor;

    beforeEach(() => {
        editor = initEditor(id);
    });

    afterEach(() => {
        editor.dispose();
        document.getElementById(id)?.remove();
    });

    const pasteItems = (items: string) => {
        paste(editor, {
            types: ['text/html'],
            text: '',
            image: null,
            customValues: {},
            rawHtml: `<html><head><meta name="ProgId" content="Word.Document">
                <style>@list l0:level1 {mso-level-number-format:decimal;mso-level-start-at:1;}
                @list l0:level2 {mso-level-number-format:decimal;mso-level-start-at:1;}</style>
                </head><body><!--StartFragment-->${items}<!--EndFragment--></body></html>`,
        });
        return document.getElementById(id)!;
    };

    const item = (instance: string, number: number, text: string, level = 1) =>
        `<p style="mso-list:l0 level${level} ${instance}"><span style="mso-list:Ignore">${number}.</span>${text}</p>`;

    it('restarts a second list instance that shares the same definition', () => {
        const root = pasteItems(
            item('lfo1', 1, 'First list') +
                item('lfo1', 2, 'Continued first list') +
                item('lfo2', 1, 'Restarted second list')
        );
        const lists = root.querySelectorAll('ol');

        expect(lists.length).toBe(2);
        expect(lists[0].children.length).toBe(2);
        expect(lists[1]?.start).toBe(1);
        expect(lists[1]?.textContent).toBe('Restarted second list');
    });

    it('restarts a second instance after an ordinary paragraph', () => {
        const root = pasteItems(
            item('lfo1', 1, 'First list') +
                '<p>Not a list</p>' +
                item('lfo2', 1, 'Restarted second list')
        );
        const lists = root.querySelectorAll('ol');

        expect(lists.length).toBe(2);
        expect(lists[1].start).toBe(1);
        expect(root.textContent).toBe('First listNot a listRestarted second list');
    });

    it('keeps adjacent items in the same instance continuous', () => {
        const root = pasteItems(item('lfo1', 1, 'First') + item('lfo1', 2, 'Second'));
        const lists = root.querySelectorAll('ol');

        expect(lists.length).toBe(1);
        expect(lists[0].start).toBe(1);
        expect(lists[0].children.length).toBe(2);
        expect(root.textContent).toBe('FirstSecond');
    });

    it('does not reuse a nested instance when another instance begins at its root', () => {
        const root = pasteItems(
            item('lfo1', 1, 'First parent') +
                item('lfo1', 1, 'First child', 2) +
                item('lfo2', 1, 'Second parent')
        );
        const lists = root.querySelectorAll('ol');

        expect(lists.length).toBe(3);
        expect(lists[2]?.start).toBe(1);
        expect(lists[2]?.textContent).toBe('Second parent');
    });
});
