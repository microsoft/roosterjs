import * as TestHelper from 'roosterjs-editor-api/lib/test/TestHelper';
import HtmlSnapshotUndo from '../../HtmlSnapshotUndo/HtmlSnapshotUndo';
import { Direction } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import {
    clearFormat,
    createLink,
    removeLink,
    setDirection,
    setImageAltText,
    toggleBold,
    toggleItalic,
    toggleUnderline,
} from 'roosterjs-editor-api';

describe('undo()', () => {
    let testID = 'undo';
    let originalContent =
        '<div id="text" style="font-size: 12pt; font-family: Calibri, Arial, Helvetica, sans-serif; color: rgb(0, 0, 0);">text</div>';
    let editor: Editor;

    beforeEach(() => {
        let undo = new HtmlSnapshotUndo();
        editor = TestHelper.initEditor(testID, [undo], undo);
    });

    it('if select a string and then remove links, then undo, the string will be the original one', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        clearFormat(editor);
        editor.undo();

        // Assert
        expect(editor.getContent()).toBe(originalContent);
    });

    it('if select a string and then add link, then undo, the string will be the original one', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        createLink(editor, 'www.example.com');
        editor.undo();

        // Assert
        expect(editor.getContent()).toBe(originalContent);
    });

    it('if select a string and then remove links, then undo, the string will be the original one', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        removeLink(editor);
        editor.undo();

        // Assert
        expect(editor.getContent()).toBe(originalContent);
    });

    xit('if sets the direction, then undo, the content will be the original', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        setDirection(editor, Direction.RightToLeft);
        editor.undo();

        // Assert
        expect(editor.getContent()).toBe(originalContent);
    });

    xit('if add alt text to image, then undo, the image will be the original one', () => {
        // Arrange
        editor.setContent(originalContent);
        setSelectionForImageNode(document.getElementsByTagName('img')[0]);

        // Act
        setImageAltText(editor, 'altText');
        editor.undo();

        // Assert
        expect(editor.getContent()).toBe(originalContent);
    });

    it('if select a string and then toggle bold, then undo, the string will be the original one', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        toggleBold(editor);
        editor.undo();

        // Assert
        expect(editor.getContent()).toBe(originalContent);
    });

    it('if select a string and then toggle italic, then undo, the string will be the original one', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        toggleItalic(editor);
        editor.undo();

        // Assert
        expect(editor.getContent()).toBe(originalContent);
    });

    it('if select a string and then toggle underline, then undo, the string will be the original one', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        toggleUnderline(editor);
        editor.undo();

        // Assert
        expect(editor.getContent()).toBe(originalContent);
    });

    // Add selection for the image node
    function setSelectionForImageNode(node: Node) {
        var range = document.createRange();
        range.selectNode(node);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
});
