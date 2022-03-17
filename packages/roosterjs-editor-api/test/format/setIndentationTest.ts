import * as TestHelper from '../TestHelper';
import setIndentation from '../../lib/format/setIndentation';
import { IEditor, Indentation } from 'roosterjs-editor-types';

describe('setIndentation()', () => {
    let testID = 'setImageAltText';
    let editor: IEditor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    function runTest(
        ogContent: string,
        selectionCallback: () => void,
        operation: Indentation,
        expectedContent: string
    ) {
        // Arrange
        editor.setContent(ogContent);
        selectionCallback();

        // Act
        setIndentation(editor, operation);

        // Assert
        expect(editor.getContent()).toEqual(expectedContent);
    }

    it('Indent the first list item in a list', () => {
        runTest(
            '<div><ol><li><span id="test">Text</span></li></ol></div>',
            () => {
                const range = new Range();
                range.setStart(editor.getDocument().getElementById('test'), 0);
                editor.select(range);
            },
            Indentation.Increase,
            '<div><blockquote style="margin-top:0;margin-bottom:0"><ol><li><span id="test">Text</span></li></ol></blockquote></div>'
        );
    });

    it('Outdent the first list item in a list', () => {
        runTest(
            '<div><blockquote style="margin-top:0;margin-bottom:0"><ol><li><span id="test">Text</span></li></ol></blockquote></div>',
            () => {
                const range = new Range();
                range.setStart(editor.getDocument().getElementById('test'), 0);
                editor.select(range);
            },
            Indentation.Decrease,
            '<div><ol><li><span id="test">Text</span></li></ol></div>'
        );
    });
});
