import pasteTable from '../../lib/table/pasteTable';
import { NodePosition } from 'roosterjs-editor-types';

const ID = 'id1';
const TABLE123 =
    '<table id=' +
    ID +
    "><tr><td id='pivotCell' >1</td><td>2</td><td>3</td></tr><tr><td>4</td><td >5</td><td>6</td></tr><tr><td>7</td><td>8</td><td>9</td></tr></table>";
/*
    |1|2|3|
    |4|5|6|
    |7|8|9|
    */
const TABLEABC =
    "<table id=id2><tr><td style='color:red' >a</td><td>b</td><td>c</td></tr><tr><td>d</td><td >e</td><td>f</td></tr><tr><td>g</td><td>h</td><td>i</td></tr></table>";
/*
    |a|b|c|
    |d|e|f|
    |g|h|i|
    */

describe('PasteTable', () => {
    let div = document.createElement('div');
    let copyBase = document.createElement('div');
    let node: HTMLElement;

    beforeEach(() => {});

    afterEach(() => {
        document.body.removeChild(div);
    });

    function runTest(
        editorTable: string,
        clipboardTable: string,
        pivotRow: number,
        pivotCol: number
    ) {
        div.innerHTML = editorTable;
        copyBase.innerHTML = clipboardTable;
        document.body.appendChild(div);
        node = document.getElementById(ID) as HTMLElement;
        pasteTable(
            node.firstChild?.childNodes[pivotRow].childNodes[pivotCol] as HTMLTableCellElement,
            copyBase.firstChild! as HTMLTableElement,
            ({
                node: node.firstChild?.childNodes[pivotRow].childNodes[pivotCol],
            } as unknown) as NodePosition,
            new Range()
        );
    }

    it('Paste table | Same size', () => {
        runTest(TABLE123, TABLEABC, 0, 0);
        expect(node.childNodes.length).toEqual(3);
        expect(node.childNodes[0].childNodes.length).toEqual(3);
    });

    it('Paste table | 3X3 to 5X5', () => {
        runTest(TABLE123, TABLEABC, 2, 2);
        expect(node.childNodes.length).toEqual(5);
        expect(node.childNodes[0].childNodes.length).toEqual(5);
    });

    it('Paste table | copy styles', () => {
        runTest(TABLE123, TABLEABC, 0, 0);
        const pivotCell = document.getElementById('pivotCell') as HTMLTableCellElement;
        expect(pivotCell.style.color).toEqual('red');
    });
});
