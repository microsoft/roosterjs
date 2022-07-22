import * as TestHelper from '../TestHelper';
import editTable from '../../lib/table/editTable';
import { IEditor, TableOperation } from 'roosterjs-editor-types';
import { VTable } from 'roosterjs-editor-dom';

describe('editTable', () => {
    const testID = 'editTableTest';
    let editor: IEditor;
    const TEST_ELEMENT_ID = 'test_edit';

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
        spyOn(editor, 'addUndoSnapshot').and.callThrough();
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    function runTest(operation: TableOperation, row?: number, column?: number) {
        editor.setContent(
            `<table><tr><td  id="${TEST_ELEMENT_ID}">Text1</td><td>Text2</td></tr><tr><td>Text3</td><td>Text4</td></tr></table>`
        );
        const target = document.getElementById(TEST_ELEMENT_ID) as HTMLTableCellElement;
        spyOn(editor, 'getElementAtCursor').and.returnValue(target);
        const vTable = new VTable(target);
        const focusSpy = spyOn(editor, 'focus');
        const transformToDarkColorSpy = spyOn(editor, 'transformToDarkColor');
        const editSpy = spyOn(vTable, 'edit');
        const writeBackSpy = spyOn(vTable, 'writeBack');
        const getCellSpy = spyOn(vTable, 'getCell');

        editTable(editor, operation);
        expect(editor.addUndoSnapshot).toHaveBeenCalled();
        editor.runAsync(() => {
            expect(focusSpy).toHaveBeenCalled();
            expect(editSpy).toHaveBeenCalled();
            expect(editSpy).toHaveBeenCalledWith(operation);
            expect(writeBackSpy).toHaveBeenCalled();
            expect(getCellSpy).toHaveBeenCalled();
            expect(getCellSpy).toHaveBeenCalledWith(row || vTable.row, column || vTable.col);
            expect(transformToDarkColorSpy).toHaveBeenCalled();
            expect(transformToDarkColorSpy).toHaveBeenCalledWith(vTable.table as HTMLTableElement);
        });
    }

    function runTestNoTable(operation: TableOperation, row?: number, column?: number) {
        editor.setContent('');
        const focusSpy = spyOn(editor, 'focus');
        const transformToDarkColorSpy = spyOn(editor, 'transformToDarkColor');
        editTable(editor, operation);
        expect(editor.addUndoSnapshot).not.toHaveBeenCalled();
        expect(focusSpy).not.toHaveBeenCalled();
        expect(transformToDarkColorSpy).not.toHaveBeenCalled();
    }

    it('editTable | default', () => {
        runTest(TableOperation.MergeAbove);
    });

    it('editTable | InsertAbove', () => {
        runTest(TableOperation.InsertAbove, undefined, 0);
    });

    it('editTable | InsertBelow', () => {
        runTest(TableOperation.InsertBelow, 1, 0);
    });

    it('editTable | InsertLeft', () => {
        runTest(TableOperation.InsertLeft, 0);
    });

    it('editTable | InsertRight', () => {
        runTest(TableOperation.InsertRight, 0, 1);
    });

    it('editTable | No Table', () => {
        runTestNoTable(TableOperation.InsertBelow);
    });
});
