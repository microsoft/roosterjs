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
            '<table id="id1" style="margin-right: auto;"><tbody><tr><td></td></tr></tbody></table>'
        );
    });

    it('triggers the aligncenter in a table', () => {
        runningTestInTable(
            Alignment.Center,
            '<table id="id1" style="margin-left: auto; margin-right: auto;"><tbody><tr><td></td></tr></tbody></table>'
        );
    });

    it('triggers the alignright in a table', () => {
        runningTestInTable(
            Alignment.Right,
            '<table id="id1" style="margin-left: auto;"><tbody><tr><td></td></tr></tbody></table>'
        );
    });

    function runningTest(alignment: Alignment, command: string) {
        let document = editor.getDocument();
        spyOn(editor, 'addUndoSnapshot').and.callThrough();
        spyOn(document, 'execCommand').and.callThrough();

        setAlignment(editor, alignment);

        expect(editor.addUndoSnapshot).toHaveBeenCalled();
        expect(document.execCommand).toHaveBeenCalledWith(command, false, null);
    }

    function runningTestInTable(alignment: Alignment, table: string) {
        let document = editor.getDocument();
        spyOn(editor, 'addUndoSnapshot').and.callThrough();
        spyOn(editor, 'isFeatureEnabled').and.returnValue(true);
        editor.setContent('<table id="id1"><tr><td></td></tr></table>');
        const range = document.createRange();
        range.setStart(document.getElementById('id1'), 0);
        range.collapse();
        editor.select(range);
        setAlignment(editor, alignment);
        expect(editor.addUndoSnapshot).toHaveBeenCalled();
        expect(editor.getContent()).toBe(table);
    }
});
