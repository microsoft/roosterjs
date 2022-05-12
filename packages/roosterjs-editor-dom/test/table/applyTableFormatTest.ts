import applyTableFormat from '../../lib/table/applyTableFormat';
import VTable from '../../lib/table/VTable';
import { itChromeOnly } from '../DomTestHelper';
import { TableFormat } from 'roosterjs-editor-types';

const format: Required<TableFormat> = {
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

describe('applyTableFormat', () => {
    let table =
        '<table id="id1" cellspacing="0" cellpadding="1" data-editing-info="{&quot;topBorderColor&quot;:&quot;#ABABAB&quot;,&quot;bottomBorderColor&quot;:&quot;#ABABAB&quot;,&quot;verticalBorderColor&quot;:&quot;#ABABAB&quot;,&quot;hasHeaderRow&quot;:false,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:false,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#ABABAB20&quot;,&quot;headerRowColor&quot;:&quot;#ABABAB&quot;,&quot;tableBorderFormat&quot;:0&quot;,&quot;keepCellShade&quot;:false}" style="border-collapse: collapse;"><tbody><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr></tbody></table>';
    let expectedTableChrome =
        '<table id="id1" cellspacing="0" cellpadding="1" data-editing-info="{&quot;topBorderColor&quot;:&quot;#0C64C0&quot;,&quot;bottomBorderColor&quot;:&quot;#0C64C0&quot;,&quot;verticalBorderColor&quot;:&quot;#0C64C0&quot;,&quot;hasHeaderRow&quot;:false,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:false,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:&quot;#0C64C020&quot;,&quot;bgColorOdd&quot;:null,&quot;headerRowColor&quot;:null,&quot;tableBorderFormat&quot;:0,&quot;keepCellShade&quot;:false}" style="border-collapse: collapse;"><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: transparent;" scope=""><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: transparent;"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: transparent;"><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: transparent;"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: transparent;"><br></td></tr></table>';

    let div = document.createElement('div');
    document.body.appendChild(div);
    const id = 'id1';
    div.innerHTML = table;
    let node = document.getElementById(id) as HTMLTableElement;
    let vTable = new VTable(node);
    vTable.applyFormat(format);
    applyTableFormat(node, vTable.cells, format);
    vTable.writeBack();
    itChromeOnly('should return a styled table CHROME', () => {
        expect(div.innerHTML).toBe(expectedTableChrome);
    });
    document.body.removeChild(div);
});
