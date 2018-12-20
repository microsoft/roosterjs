import * as TestHelper from '../TestHelper';
import toggleItalic from '../../format/toggleItalic';
import { Editor } from 'roosterjs-editor-core';

describe('toggleItalic()', () => {
    let testID = 'toggleItalic';
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

    it('triggers the italic command in document', () => {
        let document = editor.getDocument();
        spyOn(document, 'execCommand').and.callThrough();

        toggleItalic(editor);

        expect(document.execCommand).toHaveBeenCalledWith('italic', false, null);
    });

    it('if select an unItalic string and then toggle italic, the string will wrap with <i></i>', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        toggleItalic(editor);

        // Assert
        expect(editor.getContent()).toBe(
            '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);"><i>text</i></div>'
        );
    });

    it('if select an unItalic string and then toggle italic, only the selected string will wrap with <i></i>', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectText(document.getElementById('text').firstChild, 0, 3);

        // Act
        toggleItalic(editor);

        // Assert
        expect(editor.getContent()).toBe(
            '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);"><i>tex</i>t</div>'
        );
    });

    it('if select an italic string and then toggle italic, the string will be unItalic', () => {
        // Arrange
        editor.setContent(
            '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);"><i>text</i></div>'
        );
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        toggleItalic(editor);

        // Assert
        expect(editor.getContent()).toBe(originalContent);
    });

    it('if select a string with font-style set as italic and then toggle italic, the font-style style will be removed', () => {
        // Arrange
        editor.setContent(
            '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);font-style: italic;">text</div>'
        );
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        toggleItalic(editor);

        // Assert
        expect(editor.getContent()).toBe(originalContent);
    });
});
