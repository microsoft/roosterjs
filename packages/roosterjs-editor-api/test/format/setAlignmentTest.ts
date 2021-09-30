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

    function runningTest(alignment: Alignment, command: string) {
        let document = editor.getDocument();
        spyOn(editor, 'addUndoSnapshot').and.callThrough();
        spyOn(document, 'execCommand').and.callThrough();

        setAlignment(editor, alignment);

        expect(editor.addUndoSnapshot).toHaveBeenCalled();
        expect(document.execCommand).toHaveBeenCalledWith(command, false, null);
    }
});
