import getTableFormatInfo from '../../lib/utils/getFormatTableInfo';
import VTable from '../../lib/table/VTable';
import { TableFormat } from 'roosterjs-editor-types';

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

function createTable(format: TableFormat) {
    let div = document.createElement('div');
    document.body.appendChild(div);
    const id = 'id1';
    div.innerHTML = '<table id=id1><tr><td></td></tr><tr><td></td></tr> <tr><td></td></tr></table>';
    let node = document.getElementById(id) as HTMLTableElement;
    let vTable = new VTable(node);
    vTable.applyFormatAndStyle(format);
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
        expect(tableInfo).toEqual(JSON.parse(expectedTableInfo) as TableFormat);
        removeTable();
    });
});
