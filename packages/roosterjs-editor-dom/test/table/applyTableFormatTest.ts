import applyTableFormat from '../../lib/table/applyTableFormat';
import VTable from '../../lib/table/VTable';
import { encode64, itChromeOnly } from '../DomTestHelper';
import { TableFormat } from 'roosterjs-editor-types';

const format: Required<TableFormat> = {
    topBorderColor: '#0C64C0',
    bottomBorderColor: '#0C64C0',
    verticalBorderColor: '#0C64C0',
    bgColorEven: '#0C64C020',
    bgColorOdd: null,
    headerRowColor: null,
    hasHeaderRow: false,
    hasFirstColumn: false,
    hasBandedRows: false,
    hasBandedColumns: false,
    tableBorderFormat: 0,
    keepCellShade: false,
};

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

describe('applyTableFormat', () => {
    const encodedDefaultFormat = encode64(JSON.stringify(DEFAULT_FORMAT));
    let table = `<table id="id1" cellspacing="0" cellpadding="1" data-editing-info="${encode64(
        encodedDefaultFormat
    )}" style="border-collapse: collapse;"><tbody><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr></tbody></table>`;
    let div = document.createElement('div');
    document.body.appendChild(div);
    const id = 'id1';
    div.innerHTML = table;
    let node = document.getElementById(id) as HTMLTableElement;
    let vTable = new VTable(node);
    vTable.applyFormat(format);
    applyTableFormat(node, vTable.cells, format);
    vTable.writeBack();
    const encodedFormat = encode64(JSON.stringify(vTable.formatInfo));
    let expectedTableChrome = `<table id="id1" cellspacing="0" cellpadding="1" data-editing-info="&quot;${encodedFormat}&quot;" style="border-collapse: collapse;"><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: transparent;" scope=""><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: transparent;"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: transparent;"><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: transparent;"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: transparent;"><br></td></tr></table>`;
    itChromeOnly('should return a styled table CHROME', () => {
        expect(div.innerHTML).toBe(expectedTableChrome);
    });
    document.body.removeChild(div);
});
