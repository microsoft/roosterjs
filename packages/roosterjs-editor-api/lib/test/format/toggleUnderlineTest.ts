import * as TestHelper from '../TestHelper';
import toggleUnderline from '../../format/toggleUnderline';
import { Editor } from 'roosterjs-editor-core';

describe('toggleUnderline()', () => {
    let testID = 'toggleUnderline';
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

    it('triggers the underline command in document', () => {
        let document = editor.getDocument();
        spyOn(document, 'execCommand').and.callThrough();

        toggleUnderline(editor);

        expect(document.execCommand).toHaveBeenCalledWith('underline', false, null);
    });

    it('if select a normal string and then toggle underline, the string will wrap with <u></u>', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        toggleUnderline(editor);

        // Assert
        expect(editor.getContent()).toBe(
            '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);"><u>text</u></div>'
        );
    });

    it('if select a normal string and then toggle underline, only the selected string will wrap with <u></u>', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectText(document.getElementById('text').firstChild, 0, 3);

        // Act
        toggleUnderline(editor);

        // Assert
        expect(editor.getContent()).toBe(
            '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);"><u>tex</u>t</div>'
        );
    });

    it('if select an underline string and then toggle underline, the string will be normal', () => {
        // Arrange
        editor.setContent(
            '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);"><u>text</u></div>'
        );
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        toggleUnderline(editor);

        // Assert
        expect(editor.getContent()).toBe(originalContent);
    });

    it('if select a string with text-decoration set as underline and then toggle underline, the text-decoration style will be removed', () => {
        // Arrange
        editor.setContent(
            '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0); text-decoration: underline;">text</div>'
        );
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        toggleUnderline(editor);

        // Assert
        expect(editor.getContent()).toBe(originalContent);
    });
});
