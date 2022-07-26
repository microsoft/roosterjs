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

    function compareStylesTest(table: string, operation: TableOperation, expectedTable: string) {
        editor.setContent(table);
        const target = document.getElementById(TEST_ELEMENT_ID) as HTMLTableElement;
        spyOn(editor, 'getElementAtCursor').and.returnValue(target);
        editTable(editor, operation);
        editor.runAsync(() => {
            expect(editor.getContent()).toBe(expectedTable);
        });
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

    TestHelper.itChromeOnly('editTable | Merge Styled Table', () => {
        const table = `<table id="${TEST_ELEMENT_ID}" cellspacing="0" cellpadding="1" data-editing-info="{&quot;topBorderColor&quot;:&quot;#0C64C0&quot;,&quot;bottomBorderColor&quot;:&quot;#0C64C0&quot;,&quot;verticalBorderColor&quot;:&quot;#0C64C0&quot;,&quot;hasHeaderRow&quot;:true,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:true,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#0C64C020&quot;,&quot;headerRowColor&quot;:&quot;#0C64C0&quot;,&quot;tableBorderFormat&quot;:3,&quot;keepCellShade&quot;:true}" style="border-collapse: collapse;"><tbody><tr><th style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(109, 160, 255) !important;" scope="row" data-ogsb="rgb(12, 100, 192)"><br></th><th style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(109, 160, 255) !important;" scope="row" data-ogsb="rgb(12, 100, 192)"><br></th><th style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(109, 160, 255) !important;" scope="row" data-ogsb="rgb(12, 100, 192)"><br></th></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) rgb(12, 100, 192) rgb(12, 100, 192) transparent; background-color: rgba(109, 160, 255, 0.125) !important;" scope="" data-ogsb="rgba(12, 100, 192, 0.125)"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(109, 160, 255, 0.125) !important;" data-ogsb="rgba(12, 100, 192, 0.125)"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent rgb(12, 100, 192) rgb(12, 100, 192); background-color: rgba(109, 160, 255, 0.125) !important;" data-ogsb="rgba(12, 100, 192, 0.125)"><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) rgb(12, 100, 192) rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important;" scope="" data-ogsb="transparent"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important;" data-ogsb="transparent"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent rgb(12, 100, 192) rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important;" data-ogsb="transparent"><br></td></tr></tbody></table>`;
        const expectedTable = `<table id="${TEST_ELEMENT_ID}" cellspacing="0" cellpadding="1" data-editing-info="{&quot;topBorderColor&quot;:&quot;#0C64C0&quot;,&quot;bottomBorderColor&quot;:&quot;#0C64C0&quot;,&quot;verticalBorderColor&quot;:&quot;#0C64C0&quot;,&quot;hasHeaderRow&quot;:true,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:true,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#0C64C020&quot;,&quot;headerRowColor&quot;:&quot;#0C64C0&quot;,&quot;tableBorderFormat&quot;:3,&quot;keepCellShade&quot;:true}" style="border-collapse: collapse;"><tbody><tr><th style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(109, 160, 255) !important;" scope="row" data-ogsb="rgb(12, 100, 192)"><br></th><th style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(109, 160, 255) !important;" scope="row" data-ogsb="rgb(12, 100, 192)"><br></th><th style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(109, 160, 255) !important;" scope="row" rowspan="2" data-ogsb="rgb(12, 100, 192)"><br><br></th></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) rgb(12, 100, 192) rgb(12, 100, 192) transparent; background-color: rgba(109, 160, 255, 0.125) !important;" scope="" data-ogsb="rgba(12, 100, 192, 0.125)"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(109, 160, 255, 0.125) !important;" data-ogsb="rgba(12, 100, 192, 0.125)"><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) rgb(12, 100, 192) rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important;" scope="" data-ogsb="transparent"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important;" data-ogsb="transparent"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent rgb(12, 100, 192) rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important;" data-ogsb="transparent"><br></td></tr></tbody></table>`;
        compareStylesTest(table, TableOperation.MergeBelow, expectedTable);
    });

    TestHelper.itChromeOnly('editTable | Split Styled Table', () => {
        const table = `<table id="${TEST_ELEMENT_ID}" cellspacing="0" cellpadding="1" data-editing-info="{&quot;topBorderColor&quot;:&quot;#0C64C0&quot;,&quot;bottomBorderColor&quot;:&quot;#0C64C0&quot;,&quot;verticalBorderColor&quot;:&quot;#0C64C0&quot;,&quot;hasHeaderRow&quot;:true,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:true,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#0C64C020&quot;,&quot;headerRowColor&quot;:&quot;#0C64C0&quot;,&quot;tableBorderFormat&quot;:3,&quot;keepCellShade&quot;:true}" style="border-collapse: collapse; box-sizing: border-box; width: 370px; height: 67px;"><tbody><tr><th style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(109, 160, 255) !important; box-sizing: border-box; height: 22px;" scope="row" data-ogsb="rgb(12, 100, 192)"><br></th><th style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(109, 160, 255) !important; box-sizing: border-box; height: 22px;" scope="row" data-ogsb="rgb(12, 100, 192)"><br></th><th style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(109, 160, 255) !important; box-sizing: border-box; height: 22px;" scope="row" data-ogsb="rgb(12, 100, 192)"><br></th></tr><tr><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) rgb(12, 100, 192) rgb(12, 100, 192) transparent; background-color: rgba(109, 160, 255, 0.125) !important; box-sizing: border-box; height: 22px;" scope="" data-ogsb="rgba(12, 100, 192, 0.125)"><br></td><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(109, 160, 255, 0.125) !important; box-sizing: border-box; height: 22px;" data-ogsb="rgba(12, 100, 192, 0.125)"><br></td><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent rgb(12, 100, 192) rgb(12, 100, 192); background-color: rgba(109, 160, 255, 0.125) !important; box-sizing: border-box; height: 22px;" data-ogsb="rgba(12, 100, 192, 0.125)"><br></td></tr><tr><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) rgb(12, 100, 192) rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" scope="" data-ogsb="transparent"><br></td><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" data-ogsb="transparent"><br></td><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent rgb(12, 100, 192) rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" data-ogsb="transparent"><br></td></tr></tbody></table>`;
        const expectedTable = `<table id="${TEST_ELEMENT_ID}" cellspacing="0" cellpadding="1" data-editing-info="{&quot;topBorderColor&quot;:&quot;#0C64C0&quot;,&quot;bottomBorderColor&quot;:&quot;#0C64C0&quot;,&quot;verticalBorderColor&quot;:&quot;#0C64C0&quot;,&quot;hasHeaderRow&quot;:true,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:true,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#0C64C020&quot;,&quot;headerRowColor&quot;:&quot;#0C64C0&quot;,&quot;tableBorderFormat&quot;:3,&quot;keepCellShade&quot;:true}" style="border-collapse: collapse; box-sizing: border-box; width: 370px; height: 67px;"><tbody><tr><th style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(109, 160, 255) !important; box-sizing: border-box; height: 22px;" scope="row" data-ogsb="rgb(12, 100, 192)"><br></th><th style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(109, 160, 255) !important; box-sizing: border-box; height: 22px;" scope="row" data-ogsb="rgb(12, 100, 192)"><br></th><th style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(109, 160, 255) !important; box-sizing: border-box; height: 22px;" scope="row" colspan="2" data-ogsb="rgb(12, 100, 192)"><br></th></tr><tr><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) rgb(12, 100, 192) rgb(12, 100, 192) transparent; background-color: rgba(109, 160, 255, 0.125) !important; box-sizing: border-box; height: 22px;" scope="" data-ogsb="rgba(12, 100, 192, 0.125)"><br></td><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(109, 160, 255, 0.125) !important; box-sizing: border-box; height: 22px;" data-ogsb="rgba(12, 100, 192, 0.125)"><br></td><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(109, 160, 255, 0.125) !important; box-sizing: border-box; height: 22px;" data-ogsb="rgba(12, 100, 192, 0.125)"><br></td><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent rgb(12, 100, 192) rgb(12, 100, 192); background-color: rgba(109, 160, 255, 0.125) !important; box-sizing: border-box; height: 22px;" data-ogsb="rgba(12, 100, 192, 0.125)"><br></td></tr><tr><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) rgb(12, 100, 192) rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" scope="" data-ogsb="transparent"><br></td><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" data-ogsb="transparent"><br></td><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" colspan="2" data-ogsb="transparent"><br></td></tr></tbody></table>`;
        compareStylesTest(table, TableOperation.SplitHorizontally, expectedTable);
    });
});
