import * as TestHelper from '../TestHelper';
import setAlignment from '../../lib/format/setAlignment';
import { Alignment, IEditor } from 'roosterjs-editor-types';

describe('setAlignment()', () => {
    let testID = 'setAlignment';
    let editor: IEditor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('triggers the alignleft command in document if the alignment is left', () => {
        runningTest(Alignment.Left, 'justifyLeft');
    });

    it('triggers the aligncenter command in document if the alignment is center', () => {
        runningTest(Alignment.Center, 'justifyCenter');
    });

    it('triggers the alignright command in document if the alignment is right', () => {
        runningTest(Alignment.Right, 'justifyRight');
    });

    it('triggers the alignleft in a table', () => {
        runningTestInTable(
            Alignment.Left,
            '<table id="tableSelected0" style="margin-right: auto;"><tbody><tr><td></td></tr></tbody></table>'
        );
    });

    it('triggers the aligncenter in a table', () => {
        runningTestInTable(
            Alignment.Center,
            '<table id="tableSelected0" style="margin-left: auto; margin-right: auto;"><tbody><tr><td></td></tr></tbody></table>'
        );
    });

    it('triggers the alignright in a table', () => {
        runningTestInTable(
            Alignment.Right,
            '<table id="tableSelected0" style="margin-left: auto;"><tbody><tr><td></td></tr></tbody></table>'
        );
    });

    it('triggers the alignleft in a list', () => {
        runningTestInList(
            Alignment.Left,
            '<ul id="list" style="display: flex; flex-direction: column;"><li id="item1" style="align-self: start;"><span>item 1</span></li><li id="item2"><span>item 2</span></li><li id="item3"><span>item 3</span></li></ul>'
        );
    });

    it('triggers the aligncenter in a list', () => {
        runningTestInList(
            Alignment.Center,
            '<ul id="list" style="display: flex; flex-direction: column;"><li id="item1" style="align-self: center;"><span>item 1</span></li><li id="item2"><span>item 2</span></li><li id="item3"><span>item 3</span></li></ul>'
        );
    });

    it('triggers the alignright in a list', () => {
        runningTestInList(
            Alignment.Right,
            '<ul id="list" style="display: flex; flex-direction: column;"><li id="item1" style="align-self: end;"><span>item 1</span></li><li id="item2"><span>item 2</span></li><li id="item3"><span>item 3</span></li></ul>'
        );
    });

    it('triggers the alignleft in a list in multiple list items', () => {
        runningTestInList(
            Alignment.Left,
            '<ul id="list" style="display: flex; flex-direction: column;"><li id="item1" style="align-self: start;"><span>item 1</span></li><li id="item2" style="align-self: start;"><span>item 2</span></li><li id="item3" style="align-self: start;"><span>item 3</span></li></ul>',
            true
        );
    });

    it('triggers the aligncenter in a list multiple list items', () => {
        runningTestInList(
            Alignment.Center,
            '<ul id="list" style="display: flex; flex-direction: column;"><li id="item1" style="align-self: center;"><span>item 1</span></li><li id="item2" style="align-self: center;"><span>item 2</span></li><li id="item3" style="align-self: center;"><span>item 3</span></li></ul>',
            true
        );
    });

    it('triggers the alignright in a listmultiple list items', () => {
        runningTestInList(
            Alignment.Right,
            '<ul id="list" style="display: flex; flex-direction: column;"><li id="item1" style="align-self: end;"><span>item 1</span></li><li id="item2" style="align-self: end;"><span>item 2</span></li><li id="item3" style="align-self: end;"><span>item 3</span></li></ul>',
            true
        );
    });

    function runningTest(alignment: Alignment, command: string) {
        let document = editor.getDocument();
        spyOn(editor, 'addUndoSnapshot').and.callThrough();
        spyOn(document, 'execCommand').and.callThrough();

        setAlignment(editor, alignment);

        expect(editor.addUndoSnapshot).toHaveBeenCalled();
        expect(document.execCommand).toHaveBeenCalledWith(command, false, undefined);
    }

    function runningTestInTable(alignment: Alignment, table: string) {
        let document = editor.getDocument();
        spyOn(editor, 'addUndoSnapshot').and.callThrough();
        spyOn(editor, 'isFeatureEnabled').and.returnValue(true);
        editor.setContent('<table id="tableSelected0"><tr><td></td></tr></table>');
        const range = document.createRange();
        range.setStart(document.getElementById('tableSelected0'), 0);
        range.setEnd(document.getElementById('tableSelected0'), 1);
        editor.select(range);
        spyOn(editor, 'getSelectionRangeEx').and.returnValue({
            type: 1,
            ranges: [range],
            coordinates: { firstCell: { x: 0, y: 0 }, lastCell: { y: 0, x: 0 } },
            areAllCollapsed: false,
            table: document.getElementById('tableSelected0') as HTMLTableElement,
        });
        setAlignment(editor, alignment);
        expect(editor.addUndoSnapshot).toHaveBeenCalled();
        expect(editor.getContent()).toBe(table);
    }

    function runningTestInList(alignment: Alignment, list: string, multipleItems?: boolean) {
        let document = editor.getDocument();
        spyOn(editor, 'addUndoSnapshot').and.callThrough();
        spyOn(editor, 'isFeatureEnabled').and.returnValue(true);
        editor.setContent(
            '<ul id="list"><li id="item1"><span>item 1</span></li><li id="item2"><span>item 2</span></li><li id="item3"><span>item 3</span></li></ul>'
        );

        const range = document.createRange();
        range.setStart(document.getElementById('item1'), 0);
        range.setEnd(document.getElementById(multipleItems ? 'item3' : 'item1'), 0);
        editor.select(range);
        setAlignment(editor, alignment);
        expect(editor.addUndoSnapshot).toHaveBeenCalled();
        expect(editor.getContent()).toBe(list);
    }
});
