import * as TestHelper from '../TestHelper';
import createLink from '../../lib/format/createLink';
import { IEditor } from 'roosterjs-editor-types';

describe('createLink()', () => {
    let testID = 'createLink';
    let originalContent =
        '<div id="text" style="font-size: 12pt; font-family: Calibri, Arial, Helvetica, sans-serif; color: rgb(0, 0, 0);">text</div>';
    let editor: IEditor;

    beforeEach(() => {
        // Arrange
        editor = TestHelper.initEditor(testID);
        editor.setContent(originalContent);
        editor.focus();
        TestHelper.selectNode(document.getElementById('text'));
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('adds <a></a> as link', () => {
        // Act
        createLink(editor, 'https://www.example.com');

        // Assert
        let link = document.getElementsByTagName('a')[0];
        expect(link.outerHTML).toBe('<a href="https://www.example.com">text</a>');
    });

    it('appends a http protocol if it is missing', () => {
        // Act
        createLink(editor, 'www.example.com');

        // Assert
        let link = document.getElementsByTagName('a')[0];
        expect(link.outerHTML).toBe('<a href="http://www.example.com">text</a>');
    });

    it('appends a mailto: protocol if it is an email address missing', () => {
        // Act
        createLink(editor, 'LauraJPowers@contoso.com');

        // Assert
        let link = document.getElementsByTagName('a')[0];
        expect(link.outerHTML).toBe('<a href="mailto:LauraJPowers@contoso.com">text</a>');
    });

    it('appends a ftp:// protocol if the link starts with an ftp.', () => {
        // Act
        createLink(editor, 'ftp.contoso.com');

        // Assert
        let link = document.getElementsByTagName('a')[0];
        expect(link.outerHTML).toBe('<a href="ftp://ftp.contoso.com">text</a>');
    });

    it('preserves any URI scheme that already exists', () => {
        // Act
        createLink(editor, 'steam://gaben@valvesoftware.com');

        // Assert
        let link = document.getElementsByTagName('a')[0];
        expect(link.outerHTML).toBe('<a href="steam://gaben@valvesoftware.com">text</a>');
    });

    it('adds altText in the link', () => {
        // Act
        createLink(editor, 'www.example.com', 'altText');

        // Assert
        let link = document.getElementsByTagName('a')[0];
        expect(link.outerHTML).toBe('<a href="http://www.example.com" title="altText">text</a>');
    });

    it('sets the display text in the link', () => {
        // Act
        createLink(editor, 'www.example.com', undefined, 'this is my link');

        // Assert
        let link = document.getElementsByTagName('a')[0];
        expect(link.outerHTML).toBe('<a href="http://www.example.com">this is my link</a>');
    });

    it('sets target attribute in the link', () => {
        // Act
        createLink(editor, 'www.example.com', undefined, undefined, '_self');

        // Assert
        let link = document.getElementsByTagName('a')[0];
        expect(link.target).toBe('_self');
    });

    it('add link to a image', () => {
        // Act
        editor.setContent("<img id='image' src=''>");
        const image = document.getElementById('image') as HTMLImageElement;
        editor.select(image);

        createLink(editor, 'www.example.com');

        // Assert
        let link = document.getElementsByTagName('a')[0];
        expect(link.href).toBe('http://www.example.com/');
        expect(link?.firstElementChild?.id).toBe('image');
    });

    it('Issue when selection is under another tag', () => {
        editor.setContent(
            '<div><span id="span1" style="box-sizing:border-box;color:rgba(0, 0, 0, 0.9);background-color:rgb(255, 255, 255);font-family:Calibri, Helvetica, sans-serif;display:inline !important">Hello<span style="box-sizing:border-box">&nbsp;</span></span><b style="box-sizing:border-box;color:rgba(0, 0, 0, 0.9);background-color:rgb(255, 255, 255);font-family:Calibri, Helvetica, sans-serif" id="span2">world<span style="box-sizing:border-box">&nbsp;</span></b><span style="box-sizing:border-box;color:rgba(0, 0, 0, 0.9);background-color:rgb(255, 255, 255);margin:0px;font-family:Calibri, Helvetica, sans-serif">🙂</span><span style="box-sizing:border-box;color:rgba(0, 0, 0, 0.9);background-color:rgb(255, 255, 255);font-family:Calibri, Helvetica, sans-serif;display:inline !important">&nbsp;this is a test</span><br></div><!--{"start":[0,0,0,0],"end":[0,0,0,0]}-->'
        );
        const anchor = document.getElementById('span1');
        const focus = document.getElementById('span2');

        const range = new Range();
        range.setStart(anchor, 0);
        range.setEnd(focus.firstChild, 5);

        editor.select(range);
        createLink(editor, 'www.microsoft.com', null, 'Hello');

        // Assert
        let link = document.getElementsByTagName('a')[0];
        expect(link.outerHTML).toBe('<a href="http://www.microsoft.com">Hello</a>');
    });
});
