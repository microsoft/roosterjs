import * as TestHelper from '../TestHelper';
import setIndentation from '../../format/setIndentation';
import { Editor } from 'roosterjs-editor-core';
import { Indentation } from 'roosterjs-editor-types';

describe('setIndentation()', () => {
    let testID = 'setIndentation';
    let editor: Editor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('triggers the indent command in document if the indent is increase', () => {
        runningTest(Indentation.Increase, 'indent');
    });

    it('triggers the outdent command in document if the indent is not increase', () => {
        runningTest(Indentation.Decrease, 'outdent');
    });

    function runningTest(indentation: Indentation, command: string) {
        let document = editor.getDocument();
        spyOn(editor, 'addUndoSnapshot').and.callThrough();
        spyOn(document, 'execCommand').and.callThrough();

        setIndentation(editor, indentation);

        expect(editor.addUndoSnapshot).toHaveBeenCalled();
        expect(document.execCommand).toHaveBeenCalledWith(command, false, null);
    }
});
