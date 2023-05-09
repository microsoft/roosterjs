import * as TestHelper from '../TestHelper';
import setDirection from '../../lib/format/setDirection';
import { Direction, IEditor } from 'roosterjs-editor-types';

describe('setDirection()', () => {
    let testID = 'setDirection';
    let originalContent =
        '<div id="text" style="font-size: 12pt; font-family: Calibri, Arial, Helvetica, sans-serif; color: rgb(0, 0, 0);">text</div>';
    let editor: IEditor;

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
            '<div id="text" style="font-size: 12pt; font-family: Calibri, Arial, Helvetica, sans-serif; text-align: right; color: rgb(0, 0, 0);" dir="rtl">text</div>'
        );
    });
});
