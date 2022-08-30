import VTable from '../../lib/table/VTable';
import { itFirefoxOnly } from '../DomTestHelper';
import { TableFormat, TableOperation, TableSelection } from 'roosterjs-editor-types';

describe('VTable.ctor', () => {
    function runTest(
        input: string,
        id: string,
        col: number,
        row: number,
        result: [boolean, boolean, boolean][][]
    ) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let node = document.getElementById(id) as HTMLTableElement;
        let vTable = new VTable(node);
        expect(vTable.col).toBe(col, 'col');
        expect(vTable.row).toBe(row, 'row');
        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result[i].length; j++) {
                let cell = vTable.cells[i][j];
                let td = result[i][j];
                expect(!!cell.td).toBe(td[0], `td[${i}][${j}]`);
                expect(!!cell.spanLeft).toBe(td[1], `spanLeft[${i}][${j}]`);
                expect(!!cell.spanAbove).toBe(td[2], `spanAbove[${i}][${j}]`);
            }
        }
        document.body.removeChild(div);
    }

    it('input=null', () => {
        let vTable = new VTable(null);
        expect(vTable.table).toBe(null);
    });

    it('A regular table', () => {
        runTest(
            '<table id=id1><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></table>',
            'id1',
            undefined,
            undefined,
            [
                [
                    [true, false, false],
                    [true, false, false],
                    [true, false, false],
                ],
                [
                    [true, false, false],
                    [true, false, false],
                    [true, false, false],
                ],
            ]
        );
        runTest(
            '<table><tr><td></td><td id=id1></td><td></td></tr><tr><td></td><td></td><td></td></tr></table>',
            'id1',
            1,
            0,
            [
                [
                    [true, false, false],
                    [true, false, false],
                    [true, false, false],
                ],
                [
                    [true, false, false],
                    [true, false, false],
                    [true, false, false],
                ],
            ]
        );
    });

    it('Single cell table', () => {
        runTest('<table><tr><td id=id1></td></tr></table>', 'id1', 0, 0, [[[true, false, false]]]);
    });

    it('Table with span-left on row 1', () => {
        runTest(
            '<table><tr><td colspan=2></td></tr><tr><td></td><td id=id1></td></tr></table>',
            'id1',
            1,
            1,
            [
                [
                    [true, false, false],
                    [false, true, false],
                ],
                [
                    [true, false, false],
                    [true, false, false],
                ],
            ]
        );
    });

    it('Table with span-left on row 2', () => {
        runTest(
            '<table><tr><td></td><td id=id1></td></tr><tr><td colspan=2></td></tr></table>',
            'id1',
            1,
            0,
            [
                [
                    [true, false, false],
                    [true, false, false],
                ],
                [
                    [true, false, false],
                    [false, true, false],
                ],
            ]
        );
    });

    it('Table with span-above on col 1', () => {
        runTest(
            '<table><tr><td rowspan=2></td><td></td></tr><tr><td id=id1></td></tr></table>',
            'id1',
            1,
            1,
            [
                [
                    [true, false, false],
                    [true, false, false],
                ],
                [
                    [false, false, true],
                    [true, false, false],
                ],
            ]
        );
    });

    it('Table with span-above on col 2', () => {
        runTest(
            '<table><tr><td></td><td rowspan=2></td></tr><tr><td id=id1></td></tr></table>',
            'id1',
            0,
            1,
            [
                [
                    [true, false, false],
                    [true, false, false],
                ],
                [
                    [true, false, false],
                    [false, false, true],
                ],
            ]
        );
    });

    it('Table with span-above and span-left on same td', () => {
        runTest(
            '<table><tr><td colspan=2 rowspan=2></td><td></td></tr><tr><td></td></tr><tr><td></td><td></td><td id=id1></td></tr></table>',
            'id1',
            2,
            2,
            [
                [
                    [true, false, false],
                    [false, true, false],
                    [true, false, false],
                ],
                [
                    [false, false, true],
                    [false, true, true],
                    [true, false, false],
                ],
                [
                    [true, false, false],
                    [true, false, false],
                    [true, false, false],
                ],
            ]
        );
    });

    it('Complex table', () => {
        runTest(
            '<table><tr><td rowspan=2></td><td colspan=2></td></tr><tr><td id=id1></td><td rowspan=2></td></tr><tr><td colspan=2></td></tr></table>',
            'id1',
            1,
            1,
            [
                [
                    [true, false, false],
                    [true, false, false],
                    [false, true, false],
                ],
                [
                    [false, false, true],
                    [true, false, false],
                    [true, false, false],
                ],
                [
                    [true, false, false],
                    [false, true, false],
                    [false, false, true],
                ],
            ]
        );
    });
});

describe('VTable.applyFormat', () => {
    function runTest(
        input: string,
        id: string,
        format: Partial<TableFormat>,
        expectedHtml: string
    ) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let node = document.getElementById(id) as HTMLTableElement;
        let vTable = new VTable(node);
        vTable.applyFormat(format);
        vTable.writeBack();
        const expectedDiv = document.createElement('div');
        expect(div.isEqualNode(expectedDiv));
        document.body.removeChild(div);
    }

    it('Null', () => {
        runTest(
            '<table id=id1><tr><td></td></tr></table>',
            'id1',
            null,
            '<table id="id1"><tr><td></td></tr></table>'
        );
    });

    it('Empty format', () => {
        runTest(
            '<table id=id1><tr><td></td></tr></table>',
            'id1',
            {},
            '<table id="id1" style="border-collapse: collapse;"><tr style="background-color: transparent;"><td style="border-width: 1px; border-style: solid; border-color: transparent;"></td></tr></table>'
        );
        runTest(
            '<table id=id1><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr></table>',
            'id1',
            {},
            '<table id="id1" style="border-collapse: collapse;"><tr style="background-color: transparent;"><td style="border-width: 1px; border-style: solid; border-color: transparent;"></td></tr><tr style="background-color: transparent;"><td style="border-width: 1px; border-style: solid; border-color: transparent;"></td></tr><tr style="background-color: transparent;"><td style="border-width: 1px; border-style: solid; border-color: transparent;"></td></tr></table>'
        );
    });

    it('Valid format', () => {
        runTest(
            '<table id=id1><tr><td></td></tr></table>',
            'id1',
            {
                bgColorEven: '#FF0000',
                bgColorOdd: '#0000FF',
                topBorderColor: '#00FF00',
                bottomBorderColor: '#00FFFF',
                verticalBorderColor: '#000000',
            },
            '<table id="id1" style="border-collapse: collapse;"><tr style="background-color: rgb(0, 0, 255);"><td style="border-width: 1px; border-style: solid; border-color: rgb(0, 255, 0) rgb(0, 0, 0) rgb(0, 255, 255);"></td></tr></table>'
        );
        runTest(
            '<table id=id1><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr></table>',
            'id1',
            {
                bgColorEven: '#FF0000',
                bgColorOdd: '#0000FF',
                topBorderColor: '#00FF00',
                bottomBorderColor: '#00FFFF',
                verticalBorderColor: '#000000',
            },
            '<table id="id1" style="border-collapse: collapse;"><tr style="background-color: rgb(0, 0, 255);"><td style="border-width: 1px; border-style: solid; border-color: rgb(0, 255, 0) rgb(0, 0, 0) rgb(0, 255, 255);"></td></tr><tr style="background-color: rgb(255, 0, 0);"><td style="border-width: 1px; border-style: solid; border-color: rgb(0, 255, 0) rgb(0, 0, 0) rgb(0, 255, 255);"></td></tr><tr style="background-color: rgb(0, 0, 255);"><td style="border-width: 1px; border-style: solid; border-color: rgb(0, 255, 0) rgb(0, 0, 0) rgb(0, 255, 255);"></td></tr></table>'
        );
    });

    it('Header Row', () => {
        runTest(
            '<table id=id1><tr><td></td></tr><tr><td></td></tr></table>',
            'id1',
            {
                bgColorEven: '#FF0000',
                bgColorOdd: '#0000FF',
                topBorderColor: '#0C64C0',
                bottomBorderColor: '#0C64C0',
                verticalBorderColor: '#0C64C0',
                hasHeaderRow: true,
                headerRowColor: '#0C64C0',
            },
            '<table id="id1" style="border-collapse: collapse;"><tr style="background-color: rgb(0, 0, 255);"><td style="  width: 100px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(12, 100, 192);"></td></tr><tr style="background-color: rgb(0, 0, 255);"><td style="width: 85.071px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); box-sizing: border-box; height: 21.1648px;"></td></tr></table>'
        );
    });

    it('First Column', () => {
        runTest(
            '<table id=id1><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr></table>',
            'id1',
            {
                bgColorEven: '#FF0000',
                bgColorOdd: '#0000FF',
                topBorderColor: '#0C64C0',
                bottomBorderColor: '#0C64C0',
                verticalBorderColor: '#0C64C0',
                hasFirstColumn: true,
            },
            '<table id="id1" style="border-collapse: collapse;"><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192);"></td></tr><tr style="background-color: rgb(0, 0, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: transparent rgb(12, 100, 192) rgb(12, 100, 192); background-color: transparent;"></td></tr><tr style="background-color: rgb(0, 0, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: transparent rgb(12, 100, 192); background-color: transparent;"></td></tr><tr style="background-color: rgb(0, 0, 255);"><td style="  width: 100px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgb(12, 100, 192);"></td></tr></table>'
        );
    });

    it('Banded Column', () => {
        runTest(
            '<table id=id1><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr></table>',
            'id1',
            {
                bgColorEven: '#FF0000',
                bgColorOdd: '#0000FF',
                topBorderColor: '#0C64C0',
                bottomBorderColor: '#0C64C0',
                verticalBorderColor: '#0C64C0',
                hasBandedColumns: true,
            },
            '<table id="id1" style="border-collapse: collapse;"><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(12, 100, 192, 0.125);"><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(12, 100, 192, 0.125);"><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(12, 100, 192, 0.125);"><br></td></tr></table>'
        );
    });

    it('Banded row', () => {
        runTest(
            '<table id=id1><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr></table>',
            'id1',
            {
                bgColorEven: '#0C64C020',
                bgColorOdd: null,
                topBorderColor: '#0C64C0',
                bottomBorderColor: '#0C64C0',
                verticalBorderColor: '#0C64C0',
                hasBandedRows: true,
            },
            '<table id="id1" style="border-collapse: collapse;"><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(12, 100, 192, 0.125);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(12, 100, 192, 0.125);"></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192);"><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(12, 100, 192, 0.125);"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(12, 100, 192); background-color: rgba(12, 100, 192, 0.125);"><br></td></tr></table>'
        );
    });
});

describe('VTable.edit', () => {
    let simpleTable =
        '<table><tr><td id="id1">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>';
    let complexTable =
        '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>';

    function runTest(
        input: string,
        id: string,
        operation: TableOperation,
        expectedHtml: string,
        selection?: TableSelection
    ) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let node = document.getElementById(id) as HTMLTableElement;
        let vTable = new VTable(node);
        vTable.selection = selection;
        vTable.edit(operation);
        vTable.writeBack();
        const expectedDiv = document.createElement('div');
        expectedDiv.innerHTML = expectedHtml;
        const expectedVTable = new VTable(expectedDiv.firstChild as HTMLTableElement);
        expectedVTable.writeBack();
        expect(div.innerHTML).toBe(expectedDiv.innerHTML);
        document.body.removeChild(div);
    }

    function runSimpleTableTestOnId1(
        operation: TableOperation,
        expectedHtml: string,
        selection?: TableSelection
    ) {
        runTest(simpleTable, 'id1', operation, expectedHtml, selection);
    }

    function runSimpleTableTestOnId2(operation: TableOperation, expectedHtml: string) {
        runTest(simpleTable, 'id2', operation, expectedHtml);
    }

    function runComplexTableTest(
        operation: TableOperation,
        expectedResults: string[],
        selection?: TableSelection
    ) {
        for (let i = 1; i <= 5; i++) {
            runTest(complexTable, 'id' + i, operation, expectedResults[i - 1], selection);
        }
    }

    it('Empty table', () => {
        runTest('', 'id1', TableOperation.InsertAbove, '');
    });

    it('Simple table, DeleteColumn', () => {
        runSimpleTableTestOnId1(
            TableOperation.DeleteColumn,
            '<table><tr><td>2</td></tr><tr><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId2(
            TableOperation.DeleteColumn,
            '<table><tr><td id="id1">1</td></tr><tr><td>3</td></tr></table>'
        );
    });

    it('Simple table, DeleteColumn with selection', () => {
        runSimpleTableTestOnId1(
            TableOperation.DeleteColumn,
            '<table><tr><td>2</td></tr><tr><td id="id2">4</td></tr></table>',
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 0, y: 1 } }
        );
    });

    it('Simple table, DeleteRow ', () => {
        runSimpleTableTestOnId1(
            TableOperation.DeleteRow,
            '<table><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId2(
            TableOperation.DeleteRow,
            '<table><tr><td id="id1">1</td><td>2</td></tr></table>'
        );
    });

    it('Simple table, DeleteRow with selection', () => {
        runSimpleTableTestOnId1(
            TableOperation.DeleteRow,
            '<table><tr><td>3</td><td id="id2">4</td></tr></table>',
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 1, y: 0 } }
        );
    });

    it('Simple table, DeleteTable', () => {
        runSimpleTableTestOnId1(TableOperation.DeleteTable, '');
        runSimpleTableTestOnId2(TableOperation.DeleteTable, '');
    });

    it('Simple table, InsertAbove', () => {
        runSimpleTableTestOnId1(
            TableOperation.InsertAbove,
            '<table><tr><td><br></td><td><br></td></tr><tr><td id="id1">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId2(
            TableOperation.InsertAbove,
            '<table><tr><td id="id1">1</td><td>2</td></tr><tr><td><br></td><td><br></td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
    });

    it('Simple table, InsertAbove with selection', () => {
        runSimpleTableTestOnId1(
            TableOperation.InsertAbove,
            '<table><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr><tr><td id="id1">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>',
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 0, y: 1 } }
        );
    });

    it('Simple table, InsertBelow', () => {
        runSimpleTableTestOnId1(
            TableOperation.InsertBelow,
            '<table><tr><td id="id1">1</td><td>2</td></tr><tr><td><br></td><td><br></td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId2(
            TableOperation.InsertBelow,
            '<table><tr><td id="id1">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr><tr><td><br></td><td><br></td></tr></table>'
        );
    });

    it('Simple table, InsertBelow with selection', () => {
        runSimpleTableTestOnId1(
            TableOperation.InsertBelow,
            '<table><tr><td id="id1">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr></table>',
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 0, y: 1 } }
        );
    });

    it('Simple table, InsertLeft', () => {
        runSimpleTableTestOnId1(
            TableOperation.InsertLeft,
            '<table><tr><td><br></td><td id="id1">1</td><td>2</td></tr><tr><td><br></td><td>3</td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId2(
            TableOperation.InsertLeft,
            '<table><tr><td id="id1">1</td><td><br></td><td>2</td></tr><tr><td>3</td><td><br></td><td id="id2">4</td></tr></table>'
        );
    });

    it('Simple table, InsertLeft with selection ', () => {
        runSimpleTableTestOnId1(
            TableOperation.InsertLeft,
            '<table><tr><td><br></td><td><br></td><td id="id1">1</td><td>2</td></tr><tr><td><br></td><td><br></td><td>3</td><td id="id2">4</td></tr></table>',
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 1, y: 0 } }
        );
    });

    it('Simple table, InsertRight', () => {
        runSimpleTableTestOnId1(
            TableOperation.InsertRight,
            '<table><tr><td id="id1">1</td><td><br></td><td>2</td></tr><tr><td>3</td><td><br></td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId2(
            TableOperation.InsertRight,
            '<table><tr><td id="id1">1</td><td>2</td><td><br></td></tr><tr><td>3</td><td id="id2">4</td><td><br></td></tr></table>'
        );
    });

    it('Simple table, InsertRight with selection', () => {
        runSimpleTableTestOnId1(
            TableOperation.InsertRight,
            '<table><tr><td id="id1">1</td><td>2</td><td><br></td><td><br></td></tr><tr><td>3</td><td id="id2">4</td><td><br></td><td><br></td></tr></table>',
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 1, y: 0 } }
        );
    });

    it('Simple table, MergeAbove', () => {
        runSimpleTableTestOnId1(
            TableOperation.MergeAbove,
            '<table><tr><td id="id1">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId2(
            TableOperation.MergeAbove,
            '<table><tr><td id="id1">1</td><td rowspan="2">2<br>4</td></tr><tr><td>3</td></tr></table>'
        );
    });

    it('Simple table, MergeBelow', () => {
        runSimpleTableTestOnId1(
            TableOperation.MergeBelow,
            '<table><tr><td id="id1" rowspan="2">1<br>3</td><td>2</td></tr><tr><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId2(
            TableOperation.MergeBelow,
            '<table><tr><td id="id1">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
    });

    it('Simple table, MergeLeft', () => {
        runSimpleTableTestOnId1(
            TableOperation.MergeLeft,
            '<table><tr><td id="id1">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId2(
            TableOperation.MergeLeft,
            '<table><tr><td id="id1">1</td><td>2</td></tr><tr><td colspan="2">3<br>4</td></tr></table>'
        );
    });

    it('Simple table, MergeRight', () => {
        runSimpleTableTestOnId1(
            TableOperation.MergeRight,
            '<table><tr><td id="id1" colspan="2">1<br>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId2(
            TableOperation.MergeRight,
            '<table><tr><td id="id1">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
    });

    it('Simple table, MergeCells', () => {
        runSimpleTableTestOnId1(
            TableOperation.MergeCells,
            '<table><tr><td id="id1" colspan="2">1<br>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>',
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 1, y: 0 } }
        );
    });

    it('Simple table, SplitHorizontally', () => {
        runSimpleTableTestOnId1(
            TableOperation.SplitHorizontally,
            '<table><tr><td id="id1">1</td><td><br></td><td>2</td></tr><tr><td colspan="2">3</td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId2(
            TableOperation.SplitHorizontally,
            '<table><tr><td id="id1">1</td><td colspan="2">2</td></tr><tr><td>3</td><td id="id2">4</td><td><br></td></tr></table>'
        );
    });

    it('Simple table, SplitVertically', () => {
        runSimpleTableTestOnId1(
            TableOperation.SplitVertically,
            '<table><tr><td id="id1">1</td><td rowspan="2">2</td></tr><tr><td><br></td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId2(
            TableOperation.SplitVertically,
            '<table><tr><td id="id1">1</td><td>2</td></tr><tr><td rowspan="2">3</td><td id="id2">4</td></tr><tr><td><br></td></tr></table>'
        );
    });

    itFirefoxOnly('Simple table, AlignCenter', () => {
        runSimpleTableTestOnId1(
            TableOperation.AlignCenter,
            '<table style="margin-left: auto; margin-right: auto;"><tr><td id="id1">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId2(
            TableOperation.AlignCenter,
            '<table style="margin-left: auto; margin-right: auto;"><tr><td id="id1">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
    });

    itFirefoxOnly('Simple table, AlignRight', () => {
        runSimpleTableTestOnId1(
            TableOperation.AlignRight,
            '<table style="margin-left: auto;"><tr><td id="id1">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId2(
            TableOperation.AlignRight,
            '<table style="margin-left: auto;"><tr><td id="id1">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
    });

    itFirefoxOnly('Simple table, AlignLeft', () => {
        runSimpleTableTestOnId1(
            TableOperation.AlignLeft,
            '<table style="margin-right: auto;"><tr><td id="id1">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId2(
            TableOperation.AlignLeft,
            '<table style="margin-right: auto;"><tr><td id="id1">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
    });

    itFirefoxOnly('Simple table, AlignCellCenter', () => {
        runSimpleTableTestOnId1(
            TableOperation.AlignCellCenter,
            '<table><tr><td id="id1" style="text-align: center;">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId1(
            TableOperation.AlignCellCenter,
            '<table><tr><td id="id1" style="text-align: center;">1</td><td>2</td></tr><tr><td style="text-align: center;">3</td><td id="id2">4</td></tr></table>',
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 0, y: 1 } }
        );
    });

    itFirefoxOnly('Simple table, AlignCellRight', () => {
        runSimpleTableTestOnId1(
            TableOperation.AlignCellRight,
            '<table><tr><td id="id1" style="text-align: right;">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId1(
            TableOperation.AlignCellRight,
            '<table><tr><td id="id1" style="text-align: right;">1</td><td>2</td></tr><tr><td style="text-align: right;">3</td><td id="id2">4</td></tr></table>',
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 0, y: 1 } }
        );
    });

    itFirefoxOnly('Simple table, AlignCellLeft', () => {
        runSimpleTableTestOnId1(
            TableOperation.AlignCellLeft,
            '<table><tr><td id="id1" style="text-align: left;">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId1(
            TableOperation.AlignCellLeft,
            '<table><tr><td id="id1" style="text-align: left;">1</td><td>2</td></tr><tr><td style="text-align: left;">3</td><td id="id2">4</td></tr></table>',
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 0, y: 1 } }
        );
    });

    itFirefoxOnly('Simple table, AlignCellTop', () => {
        runSimpleTableTestOnId1(
            TableOperation.AlignCellTop,
            '<table><tr><td id="id1" style="vertical-align: top;">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId1(
            TableOperation.AlignCellTop,
            '<table><tr><td id="id1" style="vertical-align: top;">1</td><td>2</td></tr><tr><td style="vertical-align: top;">3</td><td id="id2">4</td></tr></table>',
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 0, y: 1 } }
        );
    });

    itFirefoxOnly('Simple table, AlignCellMiddle', () => {
        runSimpleTableTestOnId1(
            TableOperation.AlignCellMiddle,
            '<table><tr><td id="id1" style="vertical-align: middle;">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId1(
            TableOperation.AlignCellMiddle,
            '<table><tr><td id="id1" style="vertical-align: middle;">1</td><td>2</td></tr><tr><td style="vertical-align: middle;">3</td><td id="id2">4</td></tr></table>',
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 0, y: 1 } }
        );
    });

    itFirefoxOnly('Simple table, AlignCellBottom', () => {
        runSimpleTableTestOnId1(
            TableOperation.AlignCellBottom,
            '<table><tr><td id="id1" style="vertical-align: bottom;">1</td><td>2</td></tr><tr><td>3</td><td id="id2">4</td></tr></table>'
        );
        runSimpleTableTestOnId1(
            TableOperation.AlignCellBottom,
            '<table><tr><td id="id1" style="vertical-align: bottom;">1</td><td>2</td></tr><tr><td style="vertical-align: bottom;">3</td><td id="id2">4</td></tr></table>',
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 0, y: 1 } }
        );
    });

    it('Complex table, DeleteColumn', () => {
        runComplexTableTest(TableOperation.DeleteColumn, [
            '<table><tr><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2">2</td></tr><tr><td id="id4" rowspan="2">4</td></tr><tr><td id="id5">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2">2</td></tr><tr><td id="id4" rowspan="2">4</td></tr><tr><td id="id5">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2">2</td></tr><tr><td id="id3">3</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5">5</td></tr></table>',
        ]);
    });

    it('Complex table, DeleteColumn with selection', () => {
        runComplexTableTest(
            TableOperation.DeleteColumn,
            [
                '<table><tr><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5">5</td></tr></table>',
                '<table><tr><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5">5</td></tr></table>',
                '<table><tr><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5">5</td></tr></table>',
                '<table><tr><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5">5</td></tr></table>',
                '<table><tr><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5">5</td></tr></table>',
            ],
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 0, y: 1 } }
        );
    });

    it('Complex table, DeleteRow', () => {
        runComplexTableTest(TableOperation.DeleteRow, [
            '<table><tr><td id="id1">1</td><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1">1</td><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id5" colspan="2">5</td><td id="id4">4</td></tr></table>',
            '<table><tr><td id="id1">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id5" colspan="2">5</td><td id="id4">4</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4">4</td></tr></table>',
        ]);
    });

    it('Complex table, DeleteRow with selection', () => {
        runComplexTableTest(
            TableOperation.DeleteRow,
            [
                '<table><tr><td id="id1">1</td><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1">1</td><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1">1</td><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1">1</td><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1">1</td><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            ],
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 1, y: 0 } }
        );
    });

    it('Complex table, DeleteTable', () => {
        runComplexTableTest(TableOperation.DeleteTable, ['', '', '', '', '']);
    });

    it('Complex table, InsertAbove', () => {
        runComplexTableTest(TableOperation.InsertAbove, [
            '<table><tr><td><br></td><td colspan="2"><br></td></tr><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td><br></td><td colspan="2"><br></td></tr><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="3">1</td><td id="id2" colspan="2">2</td></tr><tr><td><br></td><td><br></td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="3">1</td><td id="id2" colspan="2">2</td></tr><tr><td><br></td><td><br></td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="3">4</td></tr><tr><td colspan="2"><br></td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
        ]);
    });

    it('Complex table, InsertAbove with selection', () => {
        runComplexTableTest(
            TableOperation.InsertAbove,
            [
                '<table><tr><td><br></td><td colspan="2"><br></td></tr><tr><td><br></td><td colspan="2"><br></td></tr><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td><br></td><td colspan="2"><br></td></tr><tr><td><br></td><td colspan="2"><br></td></tr><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td><br></td><td colspan="2"><br></td></tr><tr><td><br></td><td colspan="2"><br></td></tr><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td><br></td><td colspan="2"><br></td></tr><tr><td><br></td><td colspan="2"><br></td></tr><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td><br></td><td colspan="2"><br></td></tr><tr><td><br></td><td colspan="2"><br></td></tr><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            ],
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 0, y: 1 } }
        );
    });

    it('Complex table, InsertBelow', () => {
        runComplexTableTest(TableOperation.InsertBelow, [
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="3">4</td></tr><tr><td><br></td><td><br></td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="3">1</td><td id="id2" colspan="2">2</td></tr><tr><td colspan="2"><br></td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="3">4</td></tr><tr><td><br></td><td><br></td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr><tr><td colspan="2"><br></td><td><br></td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr><tr><td colspan="2"><br></td><td><br></td></tr></table>',
        ]);
    });

    it('Complex table, InsertBelow with selection', () => {
        runComplexTableTest(
            TableOperation.InsertBelow,
            [
                '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="4">4</td></tr><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="4">4</td></tr><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="4">4</td></tr><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="4">4</td></tr><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="4">4</td></tr><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            ],
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 0, y: 1 } }
        );
    });

    it('Complex table, InsertLeft', () => {
        runComplexTableTest(TableOperation.InsertLeft, [
            '<table><tr><td rowspan="2"><br></td><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td><br></td><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td><br></td><td id="id2" colspan="2">2</td></tr><tr><td><br></td><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="3">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td><br></td><td id="id2" colspan="2">2</td></tr><tr><td><br></td><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="3">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="3">2</td></tr><tr><td id="id3">3</td><td rowspan="2"><br></td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td rowspan="2"><br></td><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td><br></td><td id="id5" colspan="2">5</td></tr></table>',
        ]);
    });

    it('Complex table, InsertLeft with selection', () => {
        runComplexTableTest(
            TableOperation.InsertLeft,
            [
                '<table><tr><td rowspan="2"><br></td><td rowspan="2"><br></td><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td><br></td><td><br></td><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td rowspan="2"><br></td><td rowspan="2"><br></td><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td><br></td><td><br></td><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td rowspan="2"><br></td><td rowspan="2"><br></td><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td><br></td><td><br></td><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td rowspan="2"><br></td><td rowspan="2"><br></td><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td><br></td><td><br></td><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td rowspan="2"><br></td><td rowspan="2"><br></td><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td><br></td><td><br></td><td id="id5" colspan="2">5</td></tr></table>',
            ],
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 1, y: 0 } }
        );
    });

    it('Complex table, InsertRight', () => {
        runComplexTableTest(TableOperation.InsertRight, [
            '<table><tr><td id="id1" rowspan="2">1</td><td rowspan="2"><br></td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="3">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td><td><br></td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td><td rowspan="2"><br></td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="3">2</td></tr><tr><td id="id3">3</td><td><br></td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td><td><br></td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td><td><br></td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td><td rowspan="2"><br></td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="3">2</td></tr><tr><td id="id3">3</td><td><br></td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td><td><br></td></tr></table>',
        ]);
    });

    it('Complex table, InsertRight with selection', () => {
        runComplexTableTest(
            TableOperation.InsertRight,
            [
                '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td><td><br></td><td><br></td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td><td rowspan="2"><br></td><td rowspan="2"><br></td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td><td><br></td><td><br></td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td><td rowspan="2"><br></td><td rowspan="2"><br></td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td><td><br></td><td><br></td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td><td rowspan="2"><br></td><td rowspan="2"><br></td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td><td><br></td><td><br></td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td><td rowspan="2"><br></td><td rowspan="2"><br></td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td><td><br></td><td><br></td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td><td rowspan="2"><br></td><td rowspan="2"><br></td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            ],
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 1, y: 0 } }
        );
    });

    it('Complex table, MergeAbove', () => {
        runComplexTableTest(TableOperation.MergeAbove, [
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
        ]);
    });

    it('Complex table, MergeBelow', () => {
        runComplexTableTest(TableOperation.MergeBelow, [
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
        ]);
    });

    it('Complex table, MergeLeft', () => {
        runComplexTableTest(TableOperation.MergeLeft, [
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
        ]);
    });

    it('Complex table, MergeRight', () => {
        runComplexTableTest(TableOperation.MergeRight, [
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
        ]);
    });

    it('Complex table, MergeCells', () => {
        runComplexTableTest(
            TableOperation.MergeCells,
            [
                '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            ],
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 1, y: 0 } }
        );
    });

    it('Complex table, SplitHorizontally', () => {
        runComplexTableTest(TableOperation.SplitHorizontally, [
            '<table><tr><td id="id1" rowspan="2">1</td><td rowspan="2"><br></td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="3">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2">2</td><td><br></td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="3">2</td></tr><tr><td id="id3">3</td><td><br></td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="3">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="3">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td><td rowspan="2"><br></td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5">5</td><td><br></td></tr></table>',
        ]);
    });

    it('Complex table, SplitVertically', () => {
        runComplexTableTest(TableOperation.SplitVertically, [
            '<table><tr><td id="id1">1</td><td id="id2" colspan="2">2</td></tr><tr><td><br></td><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="3">1</td><td id="id2" colspan="2">2</td></tr><tr><td colspan="2"><br></td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="3">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="3">4</td></tr><tr><td><br></td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4">4</td></tr><tr><td id="id5" colspan="2">5</td><td><br></td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="3">4</td></tr><tr><td id="id5" colspan="2">5</td></tr><tr><td colspan="2"><br></td></tr></table>',
        ]);
    });
    itFirefoxOnly('Complex table, AlignCenter', () => {
        runComplexTableTest(TableOperation.AlignCenter, [
            '<table style="margin-left: auto; margin-right: auto;"><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table style="margin-left: auto; margin-right: auto;"><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table style="margin-left: auto; margin-right: auto;"><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table style="margin-left: auto; margin-right: auto;"><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table style="margin-left: auto; margin-right: auto;"><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
        ]);
    });
    itFirefoxOnly('Complex table, AlignRight', () => {
        runComplexTableTest(TableOperation.AlignRight, [
            '<table style="margin-left: auto;"><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table style="margin-left: auto;"><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table style="margin-left: auto;"><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table style="margin-left: auto;"><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table style="margin-left: auto;"><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
        ]);
    });
    itFirefoxOnly('Complex table, AlignLeft', () => {
        runComplexTableTest(TableOperation.AlignLeft, [
            '<table style="margin-right: auto;"><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table style="margin-right: auto;"><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table style="margin-right: auto;"><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table style="margin-right: auto;"><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table style="margin-right: auto;"><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
        ]);
    });

    itFirefoxOnly('Complex table, AlignCellCenter', () => {
        runComplexTableTest(
            TableOperation.AlignCellCenter,
            [
                '<table><tr><td id="id1" rowspan="2" style="text-align: center;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2" style="text-align: center;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2" style="text-align: center;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2" style="text-align: center;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2" style="text-align: center;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            ],
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 0, y: 1 } }
        );
    });
    itFirefoxOnly('Complex table, AlignCellRight', () => {
        runComplexTableTest(TableOperation.AlignCellRight, [
            '<table><tr><td id="id1" rowspan="2" style="text-align: right;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2" style="text-align: right;">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3" style="text-align: right;">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2" style="text-align: right;">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2" style="text-align: right;">5</td></tr></table>',
        ]);
    });
    itFirefoxOnly('Complex table, AlignCellLeft', () => {
        runComplexTableTest(TableOperation.AlignCellLeft, [
            '<table><tr><td id="id1" rowspan="2" style="text-align: left;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2" style="text-align: left;">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3" style="text-align: left;">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2" style="text-align: left;">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            '<table><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2" style="text-align: left;">5</td></tr></table>',
        ]);
    });

    itFirefoxOnly('Complex table, AlignCellTop', () => {
        runComplexTableTest(
            TableOperation.AlignCellTop,
            [
                '<table><tr><td id="id1" rowspan="2" style="vertical-align: top;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2" style="vertical-align: top;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2" style="vertical-align: top;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2" style="vertical-align: top;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2" style="vertical-align: top;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            ],
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 0, y: 1 } }
        );
    });

    itFirefoxOnly('Complex table, AlignCellMiddle', () => {
        runComplexTableTest(
            TableOperation.AlignCellMiddle,
            [
                '<table><tr><td id="id1" rowspan="2" style="vertical-align: middle;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2" style="vertical-align: middle;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2" style="vertical-align: middle;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2" style="vertical-align: middle;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2" style="vertical-align: middle;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            ],
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 0, y: 1 } }
        );
    });

    itFirefoxOnly('Complex table, AlignCellBottom', () => {
        runComplexTableTest(
            TableOperation.AlignCellBottom,
            [
                '<table><tr><td id="id1" rowspan="2" style="vertical-align: bottom;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2" style="vertical-align: bottom;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2" style="vertical-align: bottom;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2" style="vertical-align: bottom;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
                '<table><tr><td id="id1" rowspan="2" style="vertical-align: bottom;">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>',
            ],
            { firstCell: { x: 0, y: 0 }, lastCell: { x: 0, y: 1 } }
        );
    });
});

describe('VTable.getCell', () => {
    function runTest(
        input: string,
        id: string,
        row: number,
        col: number,
        expectedId: string,
        expectedSpanLeft: boolean,
        expectedSpanAbove: boolean
    ) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let node = document.getElementById(id) as HTMLTableElement;
        let vTable = new VTable(node);
        let cell = vTable.getCell(row, col);
        let position = `Row=${row} Col=${col}`;
        if (expectedId === null) {
            expect(cell.td).toBeFalsy('Td, ' + position);
        } else {
            expect(cell.td.id).toBe(expectedId, 'Td, ' + position);
        }
        expect(!!cell.spanLeft).toBe(expectedSpanLeft, 'SpanLeft, ' + position);
        expect(!!cell.spanAbove).toBe(expectedSpanAbove, 'SpanAbove, ' + position);
        document.body.removeChild(div);
    }

    it('Null', () => {
        runTest('', 'id0', 0, 0, null, false, false);
    });

    it('Simple table', () => {
        let html =
            '<table id=id0><tr><td id=id1></td><td id=id2></td></tr><tr><td id=id3></td><td id=id4></td></tr></table>';
        runTest(html, 'id0', 0, 0, 'id1', false, false);
        runTest(html, 'id0', 0, 1, 'id2', false, false);
        runTest(html, 'id0', 0, 2, null, false, false);
        runTest(html, 'id0', 1, 0, 'id3', false, false);
        runTest(html, 'id0', 2, 0, null, false, false);
        runTest(html, 'id0', 2, 2, null, false, false);
    });
    it('Complex table', () => {
        let complexTable =
            '<table id=id0><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>';
        runTest(complexTable, 'id0', 0, 0, 'id1', false, false);
        runTest(complexTable, 'id0', 0, 1, 'id2', false, false);
        runTest(complexTable, 'id0', 0, 2, null, true, false);
        runTest(complexTable, 'id0', 0, 3, null, false, false);
        runTest(complexTable, 'id0', 1, 0, null, false, true);
        runTest(complexTable, 'id0', 1, 1, 'id3', false, false);
        runTest(complexTable, 'id0', 1, 2, 'id4', false, false);
        runTest(complexTable, 'id0', 1, 3, null, false, false);
        runTest(complexTable, 'id0', 2, 0, 'id5', false, false);
        runTest(complexTable, 'id0', 2, 1, null, true, false);
        runTest(complexTable, 'id0', 2, 2, null, false, true);
        runTest(complexTable, 'id0', 2, 3, null, false, false);
        runTest(complexTable, 'id0', 3, 0, null, false, false);
        runTest(complexTable, 'id0', 3, 1, null, false, false);
        runTest(complexTable, 'id0', 3, 2, null, false, false);
        runTest(complexTable, 'id0', 3, 3, null, false, false);
    });
});

describe('VTable.getCurrentTd', () => {
    function runTest(input: string, id: string, row: number, col: number, expectedId: string) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let node = document.getElementById(id) as HTMLTableElement;
        let vTable = new VTable(node);
        vTable.row = row;
        vTable.col = col;
        let td = vTable.getCurrentTd();
        if (expectedId === null) {
            expect(td).toBeFalsy();
        } else {
            expect(td.id).toBe(expectedId);
        }
        document.body.removeChild(div);
    }

    it('Null', () => {
        runTest('', 'id0', 0, 0, null);
    });

    it('Simple table', () => {
        let html =
            '<table id=id0><tr><td id=id1></td><td id=id2></td></tr><tr><td id=id3></td><td id=id4></td></tr></table>';
        runTest(html, 'id0', 0, 0, 'id1');
        runTest(html, 'id0', 0, 1, 'id2');
        runTest(html, 'id0', 0, 2, 'id2');
        runTest(html, 'id0', 1, 0, 'id3');
        runTest(html, 'id0', 2, 0, 'id3');
        runTest(html, 'id0', 2, 2, 'id4');
    });
    it('Complex table', () => {
        let complexTable =
            '<table id=id0><tr><td id="id1" rowspan="2">1</td><td id="id2" colspan="2">2</td></tr><tr><td id="id3">3</td><td id="id4" rowspan="2">4</td></tr><tr><td id="id5" colspan="2">5</td></tr></table>';
        runTest(complexTable, 'id0', 0, 0, 'id1');
        runTest(complexTable, 'id0', 0, 1, 'id2');
        runTest(complexTable, 'id0', 0, 2, 'id2');
        runTest(complexTable, 'id0', 0, 3, 'id2');
        runTest(complexTable, 'id0', 1, 0, 'id1');
        runTest(complexTable, 'id0', 1, 1, 'id3');
        runTest(complexTable, 'id0', 1, 2, 'id4');
        runTest(complexTable, 'id0', 1, 3, 'id4');
        runTest(complexTable, 'id0', 2, 0, 'id5');
        runTest(complexTable, 'id0', 2, 1, 'id5');
        runTest(complexTable, 'id0', 2, 2, 'id4');
        runTest(complexTable, 'id0', 2, 3, 'id4');
        runTest(complexTable, 'id0', 3, 0, 'id5');
        runTest(complexTable, 'id0', 3, 1, 'id5');
        runTest(complexTable, 'id0', 3, 2, 'id4');
        runTest(complexTable, 'id0', 3, 3, 'id4');
    });
});
