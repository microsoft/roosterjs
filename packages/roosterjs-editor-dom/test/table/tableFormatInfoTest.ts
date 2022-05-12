import VTable from '../../lib/table/VTable';
import { getTableFormatInfo, saveTableInfo } from '../../lib/table/tableFormatInfo';
import { TableFormat } from 'roosterjs-editor-types';

const TABLE_STYLE_INFO = 'editingInfo';
const format: TableFormat = {
    topBorderColor: '#0C64C0',
    bottomBorderColor: '#0C64C0',
    verticalBorderColor: '#0C64C0',
    bgColorEven: '#0C64C020',
    bgColorOdd: null,
    headerRowColor: null,
    tableBorderFormat: 0,
    hasHeaderRow: false,
    hasFirstColumn: false,
    hasBandedRows: false,
    hasBandedColumns: false,
    keepCellShade: false,
};

const expectedTableInfo =
    '{"topBorderColor":"#0C64C0","bottomBorderColor":"#0C64C0","verticalBorderColor":"#0C64C0","bgColorEven":"#0C64C020","bgColorOdd":null,"headerRowColor":null,"tableBorderFormat":0, "hasHeaderRow": false, "hasFirstColumn": false, "hasBandedRows": false, "hasBandedColumns": false, "keepCellShade": false}';

function createTable(format: TableFormat) {
    let div = document.createElement('div');
    document.body.appendChild(div);
    const id = 'id1';
    div.innerHTML = '<table id=id1><tr><td></td></tr><tr><td></td></tr> <tr><td></td></tr></table>';
    let node = document.getElementById(id) as HTMLTableElement;
    let vTable = new VTable(node);
    vTable.applyFormat(format);
    vTable.writeBack();
    return node;
}

function removeTable() {
    const table = document.getElementById('id1');
    table.parentNode.removeChild(table);
}

describe('getTableFormatInfo', () => {
    it('should return the info of a table ', () => {
        const table = createTable(format);
        const tableInfo = getTableFormatInfo(table);
        expect(tableInfo).toEqual(JSON.parse(expectedTableInfo) as Required<TableFormat>);
        removeTable();
    });
});

describe('saveTableInfo', () => {
    it('should return the info of a table ', () => {
        const table = createTable(format);
        saveTableInfo(table, format);
        expect(JSON.parse(table?.dataset[TABLE_STYLE_INFO])).toEqual(JSON.parse(expectedTableInfo));
        removeTable();
    });
});
