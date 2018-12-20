import * as TestHelper from '../TestHelper';
import toggleBold from '../../format/toggleBold';
import { Editor } from 'roosterjs-editor-core';

describe('toggleBold()', () => {
    let testID = 'toggleBold';
    let originalContent =
        '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);">text</div>';
    let editor: Editor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('triggers the bold command in document', () => {
        let document = editor.getDocument();
        spyOn(document, 'execCommand').and.callThrough();

        toggleBold(editor);

        expect(document.execCommand).toHaveBeenCalledWith('bold', false, null);
    });

    it('if select an unbold string and then toggle bold, the string will wrap with <b></b>', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        toggleBold(editor);

        // Assert
        expect(editor.getContent()).toBe(
            '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);"><b>text</b></div>'
        );
    });

    it('if select an unbold string and then toggle bold, only the selected string will wrap with <b></b>', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectText(document.getElementById('text').firstChild, 0, 3);

        // Act
        toggleBold(editor);

        // Assert
        expect(editor.getContent()).toBe(
            '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);"><b>tex</b>t</div>'
        );
    });

    it('if select a bold string and then toggle bold, the string will be unbold', () => {
        // Arrange
        editor.setContent(
            '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);"><b>text</b></div>'
        );
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        toggleBold(editor);

        // Assert
        expect(editor.getContent()).toBe(originalContent);
    });

    it('if select a string with font-weight set as bold and then toggle bold, the font-weight style will be removed', () => {
        // Arrange
        editor.setContent(
            '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);font-weight:bold">text</div>'
        );
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        toggleBold(editor);

        // Assert
        expect(editor.getContent()).toBe(originalContent);
    });
});
