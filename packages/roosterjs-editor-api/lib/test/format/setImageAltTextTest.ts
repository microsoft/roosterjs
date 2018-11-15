import * as TestHelper from '../TestHelper';
import setImageAltText from '../../format/setImageAltText';
import { Editor } from 'roosterjs-editor-core';

describe('setImageAltText()', () => {
    let testID = 'setImageAltText';
    let originalContent =
        '<div id="text" style="font-size: 12pt; font-family: Calibri, Arial, Helvetica, sans-serif; color: rgb(0, 0, 0);"><img src="" originalsrc="cid:4de1094a-3ef8-4a9e-b5a0-caa6d4324eab" size="18361" contenttype="image/gif" id="img789350"></div>';
    let editor: Editor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('adds altText in the image', () => {
        // Arrange
        editor.setContent(originalContent);
        setSelectionForImageNode(document.getElementsByTagName('img')[0]);

        // Act
        setImageAltText(editor, 'altText');

        // Assert
        let img = document.getElementsByTagName('img')[0];
        expect(img.alt).toBe('altText');
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
