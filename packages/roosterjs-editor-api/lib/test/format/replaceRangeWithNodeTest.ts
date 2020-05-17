import * as TestHelper from '../TestHelper';
import replaceRangeWithNode from '../../format/replaceWithNode';
import { Editor } from 'roosterjs-editor-core';

describe('replaceRangeWithNode replaceRangeWithNode()', () => {
    let testID = 'replaceRangeWithNode';
    let editor: Editor;
    let nodeID = 'replaceNode';

    beforeEach(function () {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(function () {
        editor.dispose();
        TestHelper.removeElement(testID);
        TestHelper.removeElement(nodeID);
    });

    it('originalContent = "text", range = (0, 4), exactMatch = false', () => {
        // Arrange
        let originalContent = '<div id="text">text</div>';
        editor.setContent(originalContent);
        let originalNodeID = 'text';
        let range = configRange(originalNodeID, 0, 4);
        let content = 'newContent';
        let node = TestHelper.createElementFromContent(nodeID, content);

        // Act
        let result = replaceRangeWithNode(editor, range, node, false /*exactMatch*/);

        // Assert
        expect(editor.getContent()).toBe(
            '<div id="text"><div id="replaceNode">newContent</div></div>'
        );
        expect(result).toBe(true);
    });

    it('originalContent = "text", range = (0, 4), exactMatch = true', () => {
        // Arrange
        let originalContent = '<div id="text">text</div>';
        editor.setContent(originalContent);
        let originalNodeID = 'text';
        let range = configRange(originalNodeID, 0, 4);
        let content = 'newContent';
        let node = TestHelper.createElementFromContent(nodeID, content);

        // Act
        let result = replaceRangeWithNode(editor, range, node, true /*exactMatch*/);

        // Assert
        expect(editor.getContent()).toBe(
            '<div id="text"><div id="replaceNode">newContent</div></div>'
        );
        expect(result).toBe(true);
    });

    it('originalContent = "hello world", range = (5, 9), exactMatch = false', () => {
        // Arrange
        let originalContent = '<div id="text">hello world</div>';
        editor.setContent(originalContent);
        let originalNodeID = 'text';
        let range = configRange(originalNodeID, 5, 9);
        let content = 'newContent';
        let node = TestHelper.createElementFromContent(nodeID, content);

        // Act
        let result = replaceRangeWithNode(editor, range, node, false /*exactMatch*/);

        // Assert
        expect(editor.getContent()).toBe(
            '<div id="text">hello<div id="replaceNode">newContent</div>ld</div>'
        );
        expect(result).toBe(true);
    });

    it('originalContent = "hello world", range = null, exactMatch = false', () => {
        // Arrange
        let originalContent = '<div id="text">hello world</div>';
        editor.setContent(originalContent);
        let content = 'newContent';
        let node = TestHelper.createElementFromContent(nodeID, content);

        // Act
        let result = replaceRangeWithNode(editor, null /*range*/, node, false /*exactMatch*/);

        // Assert
        expect(editor.getContent()).toBe(originalContent);
        expect(result).toBe(false);
    });

    it('originalContent = "hello world", range = (5, 9), exactMatch = false, replaceNode = null', () => {
        // Arrange
        let originalContent = '<div id="text">hello world</div>';
        editor.setContent(originalContent);
        let originalNodeID = 'text';
        let range = configRange(originalNodeID, 5, 9);

        // Act
        let result = replaceRangeWithNode(editor, range, null /*node*/, false /*exactMatch*/);

        // Assert
        expect(editor.getContent()).toBe(originalContent);
        expect(result).toBe(false);
    });

    function configRange(originalNodeID: string, startOffset: number, endOffset: number): Range {
        let selectedNode = document.getElementById(originalNodeID);
        let range = document.createRange();
        range.setStartBefore(selectedNode);
        range.setEndAfter(selectedNode);
        range.collapse(false);
        editor.select(range);
        let textElement = editor.getContentSearcherOfCursor().getInlineElementBefore();
        range.setStart(textElement.getContainerNode(), startOffset);
        range.setEnd(textElement.getContainerNode(), endOffset);
        return range;
    }
});
