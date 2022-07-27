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

    function compareStylesTest(table: string, format: TableFormat, expectedTable: string) {
        editor.setContent(table);
        const target = document.getElementById(TEST_ELEMENT_ID) as HTMLTableElement;
        spyOn(editor, 'getElementAtCursor').and.returnValue(target);
        formatTable(editor, format);
        editor.runAsync(() => {
            expect(editor.getContent()).toBe(expectedTable);
        });
    }

    it('formatTable | default', () => {
        runTest(DEFAULT_FORMAT);
    });

    it('formatTable | no table', () => {
        runTestWithNoTable(DEFAULT_FORMAT);
    });

    TestHelper.itChromeOnly('formatTable | One row and add Header Row', () => {
        const table = `<table id="${TEST_ELEMENT_ID}" cellspacing="0" cellpadding="1" data-editing-info="{&quot;topBorderColor&quot;:&quot;#ABABAB&quot;,&quot;bottomBorderColor&quot;:&quot;#ABABAB&quot;,&quot;verticalBorderColor&quot;:&quot;#ABABAB&quot;,&quot;hasHeaderRow&quot;:false,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:false,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#ABABAB20&quot;,&quot;headerRowColor&quot;:&quot;#ABABAB&quot;,&quot;tableBorderFormat&quot;:0,&quot;keepCellShade&quot;:false}" style="border-collapse: collapse;"><tbody><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(255, 255, 255, 0) !important;" scope="" data-ogsb="transparent"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(255, 255, 255, 0) !important;" scope="" data-ogsb="transparent"><br></td></tr></tbody></table>`;
        const DEFAULT_FORMAT: Required<TableFormat> = {
            topBorderColor: '#ABABAB',
            bottomBorderColor: '#ABABAB',
            verticalBorderColor: '#ABABAB',
            hasHeaderRow: true,
            hasFirstColumn: false,
            hasBandedRows: false,
            hasBandedColumns: false,
            bgColorEven: null,
            bgColorOdd: '#ABABAB20',
            headerRowColor: '#ABABAB',
            tableBorderFormat: 0,
            keepCellShade: false,
        };
        const expected = `<table id="${TEST_ELEMENT_ID}" cellspacing="0" cellpadding="1" data-editing-info="{&quot;topBorderColor&quot;:&quot;#ABABAB&quot;,&quot;bottomBorderColor&quot;:&quot;#ABABAB&quot;,&quot;verticalBorderColor&quot;:&quot;#ABABAB&quot;,&quot;hasHeaderRow&quot;:true,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:false,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#ABABAB20&quot;,&quot;headerRowColor&quot;:&quot;#ABABAB&quot;,&quot;tableBorderFormat&quot;:0,&quot;keepCellShade&quot;:true}" style="border-collapse: collapse;"><tbody><tr><th style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(106, 106, 106) !important;" scope="row" data-ogsb="rgb(171, 171, 171)"><br></th><th style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(106, 106, 106) !important;" scope="row" data-ogsb="rgb(171, 171, 171)"><br></th></tr></tbody></table>`;
        compareStylesTest(table, DEFAULT_FORMAT, expected);
    });

    TestHelper.itChromeOnly('formatTable | Change format of styled table with header', () => {
        const table = `<table id="${TEST_ELEMENT_ID}" cellspacing="0" cellpadding="1" data-editing-info="{&quot;topBorderColor&quot;:&quot;#0C64C0&quot;,&quot;bottomBorderColor&quot;:&quot;#0C64C0&quot;,&quot;verticalBorderColor&quot;:&quot;#0C64C0&quot;,&quot;hasHeaderRow&quot;:true,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:false,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#0C64C020&quot;,&quot;headerRowColor&quot;:&quot;#0C64C0&quot;,&quot;tableBorderFormat&quot;:0,&quot;keepCellShade&quot;:true}" style="border-collapse: collapse;"><tbody><tr><th style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(109, 160, 255) !important;" scope="row" data-ogsb="rgb(12, 100, 192)"><br></th><th style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(109, 160, 255) !important;" scope="row" data-ogsb="rgb(12, 100, 192)"><br></th><th style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(109, 160, 255) !important;" scope="row" data-ogsb="rgb(12, 100, 192)"><br></th></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important;" scope="" data-ogsb="transparent"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important;" data-ogsb="transparent"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important;" data-ogsb="transparent"><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important;" scope="" data-ogsb="transparent"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important;" data-ogsb="transparent"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important;" data-ogsb="transparent"><br></td></tr></tbody></table>`;
        const format: Required<TableFormat> = {
            bgColorEven: null,
            bgColorOdd: '#0C64C020',
            bottomBorderColor: '#0C64C0',
            hasBandedColumns: false,
            hasBandedRows: false,
            hasFirstColumn: false,
            hasHeaderRow: false,
            headerRowColor: '#0C64C0',
            keepCellShade: false,
            tableBorderFormat: 0,
            topBorderColor: '#0C64C0',
            verticalBorderColor: null,
        };
        const expected = `<table id="${TEST_ELEMENT_ID}" cellspacing="0" cellpadding="1" data-editing-info="{&quot;topBorderColor&quot;:&quot;#0C64C0&quot;,&quot;bottomBorderColor&quot;:&quot;#0C64C0&quot;,&quot;verticalBorderColor&quot;:null,&quot;hasHeaderRow&quot;:false,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:false,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#0C64C020&quot;,&quot;headerRowColor&quot;:&quot;#0C64C0&quot;,&quot;tableBorderFormat&quot;:0,&quot;keepCellShade&quot;:false}" style="border-collapse: collapse;"><tbody><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important;" scope="" data-ogsb="transparent"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important;" scope="" data-ogsb="transparent"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important;" scope="" data-ogsb="transparent"><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important;" scope="" data-ogsb="transparent"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important;" data-ogsb="transparent"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important;" data-ogsb="transparent"><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important;" scope="" data-ogsb="transparent"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important;" data-ogsb="transparent"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important;" data-ogsb="transparent"><br></td></tr></tbody></table>`;
        compareStylesTest(table, format, expected);
    });

    TestHelper.itChromeOnly('formatTable | First column in one column table', () => {
        const table = `<table id="${TEST_ELEMENT_ID}" cellspacing="0" cellpadding="1" data-editing-info="{&quot;topBorderColor&quot;:&quot;#ABABAB&quot;,&quot;bottomBorderColor&quot;:&quot;#ABABAB&quot;,&quot;verticalBorderColor&quot;:&quot;#ABABAB&quot;,&quot;hasHeaderRow&quot;:false,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:false,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#ABABAB20&quot;,&quot;headerRowColor&quot;:&quot;#ABABAB&quot;,&quot;tableBorderFormat&quot;:0,&quot;keepCellShade&quot;:false}" style="border-collapse: collapse;"><tbody><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(255, 255, 255, 0) !important;" scope="" data-ogsb="transparent"><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(255, 255, 255, 0) !important;" scope="" data-ogsb="transparent"><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(255, 255, 255, 0) !important;" scope="" data-ogsb="transparent"><br></td></tr></tbody></table>`;
        const format: Required<TableFormat> = {
            bgColorEven: null,
            bgColorOdd: '#ABABAB20',
            bottomBorderColor: '#ABABAB',
            hasBandedColumns: false,
            hasBandedRows: false,
            hasFirstColumn: true,
            hasHeaderRow: false,
            headerRowColor: '#ABABAB',
            keepCellShade: true,
            tableBorderFormat: 0,
            topBorderColor: '#ABABAB',
            verticalBorderColor: '#ABABAB',
        };
        const expected = `<table id="${TEST_ELEMENT_ID}" cellspacing="0" cellpadding="1" data-editing-info="{&quot;topBorderColor&quot;:&quot;#ABABAB&quot;,&quot;bottomBorderColor&quot;:&quot;#ABABAB&quot;,&quot;verticalBorderColor&quot;:&quot;#ABABAB&quot;,&quot;hasHeaderRow&quot;:false,&quot;hasFirstColumn&quot;:true,&quot;hasBandedRows&quot;:false,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#ABABAB20&quot;,&quot;headerRowColor&quot;:&quot;#ABABAB&quot;,&quot;tableBorderFormat&quot;:0,&quot;keepCellShade&quot;:true}" style="border-collapse: collapse;"><tbody><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(255, 255, 255, 0) !important;" scope="" data-ogsb="transparent"><br></td></tr><tr><th style="width: 120px; border-width: 1px; border-style: solid; border-color: transparent rgb(171, 171, 171); background-color: rgba(255, 255, 255, 0) !important;" scope="col" data-ogsb="transparent"><br></th></tr><tr><th style="width: 120px; border-width: 1px; border-style: solid; border-color: transparent rgb(171, 171, 171) rgb(171, 171, 171); background-color: rgba(255, 255, 255, 0) !important;" scope="col" data-ogsb="transparent"><br></th></tr></tbody></table>`;
        compareStylesTest(table, format, expected);
    });

    TestHelper.itChromeOnly('formatTable | Styling table with merged cells', () => {
        const table = `<table id="${TEST_ELEMENT_ID}" cellspacing="0" cellpadding="1" data-editing-info="{&quot;topBorderColor&quot;:&quot;#0C64C0&quot;,&quot;bottomBorderColor&quot;:&quot;#0C64C0&quot;,&quot;verticalBorderColor&quot;:&quot;#0C64C0&quot;,&quot;hasHeaderRow&quot;:true,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:false,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#0C64C020&quot;,&quot;headerRowColor&quot;:&quot;#0C64C0&quot;,&quot;tableBorderFormat&quot;:0,&quot;keepCellShade&quot;:true}" style="border-collapse: collapse; box-sizing: border-box; width: 370px; height: 67px;"><tbody><tr><th style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(109, 160, 255) !important; box-sizing: border-box; height: 22px;" scope="row" rowspan="2" data-ogsb="rgb(12, 100, 192)"><br><br></th><th style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(109, 160, 255) !important; box-sizing: border-box; height: 22px;" scope="row" data-ogsb="rgb(12, 100, 192)"><br></th><th style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(109, 160, 255) !important; box-sizing: border-box; height: 22px;" scope="row" data-ogsb="rgb(12, 100, 192)"><br></th></tr><tr><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" data-ogsb="transparent"><br></td><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" data-ogsb="transparent"><br></td></tr><tr><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" scope="" data-ogsb="transparent"><br></td><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" data-ogsb="transparent"><br></td><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" data-ogsb="transparent"><br></td></tr></tbody></table>`;
        const format: Required<TableFormat> = {
            bgColorEven: null,
            bgColorOdd: '#0C64C020',
            bottomBorderColor: '#0C64C0',
            hasBandedColumns: false,
            hasBandedRows: false,
            hasFirstColumn: false,
            hasHeaderRow: false,
            headerRowColor: '#0C64C0',
            keepCellShade: false,
            tableBorderFormat: 0,
            topBorderColor: '#0C64C0',
            verticalBorderColor: null,
        };
        const expected = `<table id="${TEST_ELEMENT_ID}" cellspacing="0" cellpadding="1" data-editing-info="{&quot;topBorderColor&quot;:&quot;#0C64C0&quot;,&quot;bottomBorderColor&quot;:&quot;#0C64C0&quot;,&quot;verticalBorderColor&quot;:null,&quot;hasHeaderRow&quot;:false,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:false,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#0C64C020&quot;,&quot;headerRowColor&quot;:&quot;#0C64C0&quot;,&quot;tableBorderFormat&quot;:0,&quot;keepCellShade&quot;:false}" style="border-collapse: collapse; box-sizing: border-box; width: 370px; height: 67px;"><tbody><tr><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" scope="" rowspan="2" data-ogsb="transparent"><br><br></td><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" scope="" data-ogsb="transparent"><br></td><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" scope="" data-ogsb="transparent"><br></td></tr><tr><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" data-ogsb="transparent"><br></td><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" data-ogsb="transparent"><br></td></tr><tr><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" scope="" data-ogsb="transparent"><br></td><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" data-ogsb="transparent"><br></td><td style="width: 123px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192) transparent; background-color: rgba(255, 255, 255, 0) !important; box-sizing: border-box; height: 22px;" data-ogsb="transparent"><br></td></tr></tbody></table>`;
        compareStylesTest(table, format, expected);
    });
});
