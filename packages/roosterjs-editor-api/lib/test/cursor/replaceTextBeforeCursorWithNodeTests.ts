import * as TestHelper from '../TestHelper';
import replaceTextBeforeCursorWithNode from '../../cursor/replaceTextBeforeCursorWithNode';
import { Editor } from 'roosterjs-editor-core';

describe('replaceTextBeforeCursorWithNode replaceTextBeforeCursorWithNode()', () => {
    let testID = 'replaceTextBeforeCursorWithNode';
    let editor: Editor;
    let nodeID = 'replaceNode';

    beforeEach(function() {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(function() {
        editor.dispose();
        TestHelper.removeElement(testID);
        TestHelper.removeElement(nodeID);
    });

    it('originalContent = "text", textToMatch = "text", exactMatch = true', () => {
        // Arrange
        let originalContent = '<div id="text">text</div>';
        let textToMatch = 'text';
        let originalNodeID = 'text';
        setEditorContentAndUpdateSelection(originalContent, originalNodeID);
        let content = 'newContent';
        let node = TestHelper.createElementFromContent(nodeID, content);

        // Act
        let result = replaceTextBeforeCursorWithNode(
            editor,
            textToMatch,
            node,
            true /*exactMatch*/
        );

        // Assert
        expect(result).toBe(true);
        expect(editor.getContent()).toBe(
            '<div id="text"><div id="replaceNode">newContent</div></div>'
        );
    });

    it('originalContent = "text,", textToMatch = "text", exactMatch = true', () => {
        // Arrange
        let originalContent = '<div id="text">text,</div>';
        let textToMatch = 'text';
        let originalNodeID = 'text';
        setEditorContentAndUpdateSelection(originalContent, originalNodeID);
        let content = 'newContent';
        let node = TestHelper.createElementFromContent(nodeID, content);

        // Act
        let result = replaceTextBeforeCursorWithNode(
            editor,
            textToMatch,
            node,
            true /*exactMatch*/
        );

        // Assert
        expect(result).toBe(false);
        expect(editor.getContent()).toBe(originalContent);
    });

    it('originalContent = "text,", textToMatch = "text", exactMatch = false', () => {
        // Arrange
        let originalContent = '<div id="text">text,</div>';
        let textToMatch = 'text';
        let originalNodeID = 'text';
        setEditorContentAndUpdateSelection(originalContent, originalNodeID);
        let content = 'newContent';
        let node = TestHelper.createElementFromContent(nodeID, content);

        // Act
        let result = replaceTextBeforeCursorWithNode(
            editor,
            textToMatch,
            node,
            false /*exactMatch*/
        );

        // Assert
        expect(result).toBe(true);
        expect(editor.getContent()).toBe(
            '<div id="text"><div id="replaceNode">newContent</div>,</div>'
        );
    });

    it('originalContent = "something else", textToMatch = "text", exactMatch = false', () => {
        // Arrange
        let originalContent = '<div id="text">something else</div>';
        let textToMatch = 'text';
        let originalNodeID = 'text';
        setEditorContentAndUpdateSelection(originalContent, originalNodeID);
        let content = 'newContent';
        let node = TestHelper.createElementFromContent(nodeID, content);

        // Act
        let result = replaceTextBeforeCursorWithNode(
            editor,
            textToMatch,
            node,
            false /*exactMatch*/
        );

        // Assert
        expect(result).toBe(false);
        expect(editor.getContent()).toBe(originalContent);
    });

    function setEditorContentAndUpdateSelection(originalContent: string, selectedNodeID: string) {
        editor.setContent(originalContent);
        let selectedNode = document.getElementById(selectedNodeID);
        let range = document.createRange();
        range.setStartBefore(selectedNode);
        range.setEndAfter(selectedNode);
        range.collapse(false);
        editor.updateSelection(range);
    }
});
