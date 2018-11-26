import * as TestHelper from '../TestHelper';
import removeLink from '../../format/removeLink';
import { Editor } from 'roosterjs-editor-core';

describe('removeLink()', () => {
    let testID = 'removeLink';
    let originalContent =
        '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);"><a href="#">link</a></div>';
    let editor: Editor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('removes the existing link', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        removeLink(editor);

        // Assert
        expect(editor.getContent()).toBe(
            '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">link</div>'
        );
    });
});
