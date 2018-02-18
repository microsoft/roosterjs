import * as TestHelper from '../TestHelper';
import clearFormat from '../../format/clearFormat';
import { Editor } from 'roosterjs-editor-core';

describe('clearFormat()', () => {
    let testID = 'clearFormat';
    let originalContent =
        '<div id="text" style="font-size: 12pt; font-family: Calibri, Arial, Helvetica, sans-serif; color: rgb(0, 0, 0);">text</div>';
    let editor: Editor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('triggers the removeformat command in document', () => {
        let document = editor.getDocument();
        spyOn(editor, 'formatWithUndo').and.callThrough();
        spyOn(document, 'execCommand').and.callThrough();

        clearFormat(editor);

        expect(editor.formatWithUndo).toHaveBeenCalled();
        expect(document.execCommand).toHaveBeenCalledWith('removeFormat', false, null);
    });

    it('removes the existing formats', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        clearFormat(editor);

        // Assert
        expect(editor.getContent()).toBe(
            '<div id="text" style=""><span style="font-family: &quot;times new roman&quot;; font-size: 16px; color: black; background-color: rgba(0, 0, 0, 0);">text</span></div>'
        );
    });
});
