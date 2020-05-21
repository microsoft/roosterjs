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
        createLink(editor, 'https://www.example.com');

        // Assert
        let link = document.getElementsByTagName('a')[0];
        expect(link.outerHTML).toBe('<a href="https://www.example.com">text</a>');
    });

    it('appends a http protocol if it is missing', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        createLink(editor, 'www.example.com');

        // Assert
        let link = document.getElementsByTagName('a')[0];
        expect(link.outerHTML).toBe('<a href="http://www.example.com">text</a>');
    });

    it('appends a mailto: protocol if it is an email address missing', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        createLink(editor, 'LauraJPowers@contoso.com');

        // Assert
        let link = document.getElementsByTagName('a')[0];
        expect(link.outerHTML).toBe('<a href="mailto:LauraJPowers@contoso.com">text</a>');
    });

    it('appends a ftp:// protocol if the link starts with an ftp.', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        createLink(editor, 'ftp.contoso.com');

        // Assert
        let link = document.getElementsByTagName('a')[0];
        expect(link.outerHTML).toBe('<a href="ftp://ftp.contoso.com">text</a>');
    });

    it('preserves any URI scheme that already exists', () => {
        // Arrange
        editor.setContent(originalContent);
        TestHelper.selectNode(document.getElementById('text'));

        // Act
        createLink(editor, 'steam://gaben@valvesoftware.com');

        // Assert
        let link = document.getElementsByTagName('a')[0];
        expect(link.outerHTML).toBe('<a href="steam://gaben@valvesoftware.com">text</a>');
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
