import * as TestHelper from '../TestHelper';
import createLink from '../../format/createLink';
import { Editor } from 'roosterjs-editor-core';

describe('createLink()', () => {
    let testID = 'createLink';
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

    it('adds <a></a> as link', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        createLink(editor, 'www.example.com');

        // Assert
        let link = document.getElementsByTagName('a')[0];
        expect(link.outerHTML).toBe('<a href="http://www.example.com">text</a>');
    });

    it('adds altText in the link', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        createLink(editor, 'www.example.com', 'altText');

        // Assert
        let link = document.getElementsByTagName('a')[0];
        expect(link.outerHTML).toBe('<a href="http://www.example.com" title="altText">text</a>');
    });
});
