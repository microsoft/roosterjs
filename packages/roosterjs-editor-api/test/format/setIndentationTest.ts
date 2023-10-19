import * as TestHelper from '../TestHelper';
import setIndentation from '../../lib/format/setIndentation';
import { ExperimentalFeatures, IEditor, Indentation, TableSelection } from 'roosterjs-editor-types';

describe('setIndentation()', () => {
    let testID = 'setImageAltText';
    let editor: IEditor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID, [], [ExperimentalFeatures.TabKeyTextFeatures]);
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
            '<div><blockquote style="margin-top:0;margin-bottom:0"><ol style="list-style-position: inside;"><li><span id="test">Text</span></li></ol></blockquote></div>',
            () => {
                const range = new Range();
                range.setStart(editor.getDocument().getElementById('test'), 0);
                editor.select(range);
            },
            Indentation.Decrease,
            '<div><ol style="list-style-position: inside;"><li><span id="test">Text</span></li></ol></div>'
        );
    });

    it('Outdent whole table selected, when no Blockquote wraping table', () => {
        runTest(
            '<table id="test"><tbody><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table>',
            () => {
                const table = editor.getDocument().getElementById('test') as HTMLTableElement;
                editor.select(table, <TableSelection>{
                    firstCell: { x: 0, y: 0 },
                    lastCell: { y: 1, x: 1 },
                });
            },
            Indentation.Decrease,
            '<table id="test"><tbody><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table>'
        );
    });

    it('Indent whole table selected', () => {
        runTest(
            '<table id="test"><tbody><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table>',
            () => {
                const table = editor.getDocument().getElementById('test') as HTMLTableElement;
                editor.select(table, <TableSelection>{
                    firstCell: { x: 0, y: 0 },
                    lastCell: { y: 1, x: 1 },
                });
            },
            Indentation.Increase,
            '<blockquote style="margin-top:0;margin-bottom:0"><table id="test"><tbody><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table></blockquote>'
        );
    });

    it('Outdent whole table selected', () => {
        runTest(
            '<blockquote style="margin-top:0;margin-bottom:0"><table id="test"><tbody><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table></blockquote>',
            () => {
                const table = editor.getDocument().getElementById('test') as HTMLTableElement;
                editor.select(table, <TableSelection>{
                    firstCell: { x: 0, y: 0 },
                    lastCell: { y: 1, x: 1 },
                });
            },
            Indentation.Decrease,
            '<table id="test"><tbody><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table>'
        );
    });
});
