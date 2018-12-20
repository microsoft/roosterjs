import * as TestHelper from '../TestHelper';
import setDirection from '../../format/setDirection';
import { Direction } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

describe('setDirection()', () => {
    let testID = 'setDirection';
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

    it('sets the direction', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        setDirection(editor, Direction.RightToLeft);

        // Assert
        expect(editor.getContent()).toBe(
            '<div id="text" style="font-size: 12pt; font-family: Calibri, Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); text-align: right;" dir="rtl">text</div>'
        );
    });
});
