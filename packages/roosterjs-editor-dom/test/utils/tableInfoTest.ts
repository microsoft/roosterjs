import VTable from '../../lib/table/VTable';
import { deleteTableInfo, getTableFormatInfo, saveTableInfo } from '../../lib/utils/tableInfo';
import { TableFormat } from 'roosterjs-editor-types';

const TABLE_STYLE_INFO = 'roosterTableInfo';
const format: TableFormat = {
    bgColor: null,
    topBorderColor: '#0C64C0',
    bottomBorderColor: '#0C64C0',
    verticalBorderColor: '#0C64C0',
    bandedRows: true,
    bgColorEven: '#0C64C020',
    bgColorOdd: null,
    bandedColumns: false,
    bgColumnColorEven: null,
    bgColumnColorOdd: null,
    headerRow: false,
    headerRowColor: null,
    firstColumn: false,
    tableBorderFormat: null,
};

const expectedTableInfo =
    '{"bgColor":null,"topBorderColor":"#0C64C0","bottomBorderColor":"#0C64C0","verticalBorderColor":"#0C64C0","bandedRows":true,"bgColorEven":"#0C64C020","bgColorOdd":null,"bandedColumns":false,"bgColumnColorEven":null,"bgColumnColorOdd":null,"headerRow":false,"headerRowColor":null,"firstColumn":false,"tableBorderFormat":null}';

const expectedPastedTable: Partial<TableFormat> = {
    bandedColumns: false,
    bandedRows: false,
    bgColorEven: null,
    bgColorOdd: undefined,
    bgColumnColorEven: null,
    bgColumnColorOdd: undefined,
    bottomBorderColor: undefined,
    firstColumn: false,
    headerRow: true,
    headerRowColor: 'rgba(12, 100, 192, 0.125)',
    topBorderColor: undefined,
    verticalBorderColor: undefined,
};
function createTable(format: TableFormat) {
    let div = document.createElement('div');
    document.body.appendChild(div);
    const id = 'id1';
    div.innerHTML = '<table id=id1><tr><td></td></tr><tr><td></td></tr> <tr><td></td></tr></table>';
    let node = document.getElementById(id) as HTMLTableElement;
    let vTable = new VTable(node);
    vTable.applyFormat(format);
    return node;
}

function removeTable() {
    const table = document.getElementById('id1');
    table.parentNode.removeChild(table);
}

describe('saveTableInfo', () => {
    it('should save table info', () => {
        const table = createTable(format);
        saveTableInfo(table, format);
        expect(table.dataset[TABLE_STYLE_INFO]).toBe(expectedTableInfo);
        removeTable();
    });
});

describe('deleteTableInfo', () => {
    it('should save table info', () => {
        const table = createTable(format);
        saveTableInfo(table, format);
        deleteTableInfo(table);
        expect(table.dataset[TABLE_STYLE_INFO]).toBe(undefined);
        removeTable();
    });
});

describe('getTableFormatInfo', () => {
    it('should return the info of a table ', () => {
        const table = createTable(format);
        saveTableInfo(table, format);
        const tableInfo = getTableFormatInfo(table);
        expect(tableInfo).toEqual(JSON.parse(expectedTableInfo) as TableFormat);
        removeTable();
    });
});

describe('getTableFormatInfo', () => {
    it('should return the info that was from getPastedTableStyle ', () => {
        const table = createTable(format);
        const tableInfo = getTableFormatInfo(table);
        expect(tableInfo).toEqual(expectedPastedTable);
        removeTable();
    });
});
