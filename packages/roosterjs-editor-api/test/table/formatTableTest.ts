import * as TestHelper from '../TestHelper';
import formatTable from '../../lib/table/formatTable';
import { IEditor, TableFormat } from 'roosterjs-editor-types';
import { VTable } from 'roosterjs-editor-dom';

const DEFAULT_FORMAT: Required<TableFormat> = {
    topBorderColor: '#ABABAB',
    bottomBorderColor: '#ABABAB',
    verticalBorderColor: '#ABABAB',
    hasHeaderRow: false,
    hasFirstColumn: false,
    hasBandedRows: false,
    hasBandedColumns: false,
    bgColorEven: null,
    bgColorOdd: '#ABABAB20',
    headerRowColor: '#ABABAB',
    tableBorderFormat: 0,
    keepCellShade: false,
};

describe('formatTable  ', () => {
    let testID = 'formatTableTest';
    let editor: IEditor;
    const TEST_ELEMENT_ID = 'test_format';

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
        spyOn(editor, 'addUndoSnapshot').and.callThrough();
    });

    afterEach(() => {
        editor.dispose();

        TestHelper.removeElement(testID);
    });

    function runTest(format: TableFormat) {
        editor.setContent(
            `<table id="${TEST_ELEMENT_ID}"><tr><td>Text1</td><td>Text2</td></tr><tr><td>Text3</td><td>Text4</td></tr></table>`
        );
        const target = document.getElementById(TEST_ELEMENT_ID) as HTMLTableElement;
        spyOn(editor, 'getElementAtCursor').and.returnValue(target);
        const vTable = new VTable(target);
        const focusSpy = spyOn(editor, 'focus');
        const transformToDarkColorSpy = spyOn(editor, 'transformToDarkColor');
        const applyFormatSpy = spyOn(vTable, 'applyFormat');
        const writeBackSpy = spyOn(vTable, 'writeBack');

        formatTable(editor, format);
        expect(editor.addUndoSnapshot).toHaveBeenCalled();
        editor.runAsync(() => {
            expect(focusSpy).toHaveBeenCalled();
            expect(applyFormatSpy).toHaveBeenCalled();
            expect(applyFormatSpy).toHaveBeenCalledWith(format);
            expect(writeBackSpy).toHaveBeenCalled();
            expect(transformToDarkColorSpy).toHaveBeenCalled();
            expect(transformToDarkColorSpy).toHaveBeenCalledWith(vTable.table);
        });
    }

    function runTestWithNoTable(format: TableFormat) {
        editor.setContent('');
        const focusSpy = spyOn(editor, 'focus');
        const transformToDarkColorSpy = spyOn(editor, 'transformToDarkColor');
        formatTable(editor, format);
        expect(editor.addUndoSnapshot).not.toHaveBeenCalled();
        expect(focusSpy).not.toHaveBeenCalled();
        expect(transformToDarkColorSpy).not.toHaveBeenCalled();
    }

    it('formatTable | default', () => {
        runTest(DEFAULT_FORMAT);
    });

    it('formatTable | no table', () => {
        runTestWithNoTable(DEFAULT_FORMAT);
    });
});
