import * as TestHelper from '../TestHelper';
import insertTable from '../../lib/table/insertTable';
import { IEditor } from 'roosterjs-editor-types';

describe('InsertTable', () => {
    let testID = 'insertTableId';
    let testElementId = 'insertTableId2';
    let editor: IEditor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
    });

    it('Insert Table after not editable inline-block', () => {
        editor.setContent(
            `<div id="${testElementId}"><span class="_Entity _EType_ _EReadonly_1" contenteditable="false" style="display: inline-block;"><span data-hydrated-html=""><span><span><a><img>Document44.docx<span><img></span></a></span></span></span></span></div>`
        );
        const target = document.getElementById(testElementId);
        const range = new Range();
        range.setStart(target, 1);
        editor.select(range);
        insertTable(editor, 1, 2);

        editor.queryElements('table', table => {
            expect(table.isContentEditable).toBe(true);
        });
    });

    it('Remove background color on insert table', () => {
        editor.setContent(`<span id="${testElementId}" style='background-color: purple'></span>`);
        const target = document.getElementById(testElementId);
        const range = new Range();
        range.setStart(target!, 0);
        editor.select(range);
        insertTable(editor, 1, 1);

        expect(target?.style.backgroundColor).toBe('transparent');
    });
});
