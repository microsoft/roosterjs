import { createDOMHelper } from '../../../lib/editor/core/DOMHelperImpl';
import { DOMHelper, DOMSelection, ParsedTable } from 'roosterjs-content-model-types';
import {
    TableCellCoordinateWithCell,
    createTableRanges,
    findCoordinate,
    findLastedCoInMergedCell,
    findTableCellElement,
    parseTableCells,
} from '../../../lib/publicApi/domUtils/tableCellUtils';

describe('parseTableCells', () => {
    function runTest(html: string, expectedResult: string[][]) {
        const div = document.createElement('div');
        div.innerHTML = html;

        const table = div.firstChild as HTMLTableElement;

        const result = parseTableCells(table);
        const idResult = result.map(row => row.map(td => (typeof td == 'object' ? td.id : td)));

        expect(idResult).toEqual(expectedResult);
    }

    it('empty table', () => {
        runTest('<table></table>', []);
    });

    it('1*1 table', () => {
        runTest('<table><tr><td id="td1"></td></tr></table>', [['td1']]);
    });

    it('2*2 table', () => {
        runTest(
            '<table><tr><td id="td1"></td><td id="td2"></td></tr><tr><td id="td3"></td><td id="td4"></td></tr></table>',
            [
                ['td1', 'td2'],
                ['td3', 'td4'],
            ]
        );
    });

    it('table with merged row', () => {
        runTest(
            '<table><tr><td id="td1" rowspan=2></td><td id="td2"></td></tr><tr><td id="td4"></td></tr></table>',
            [
                ['td1', 'td2'],
                ['spanTop', 'td4'],
            ]
        );
    });

    it('table with merged col', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td></tr><tr><td id="td3"></td><td id="td4"></td></tr></table>',
            [
                ['td1', 'spanLeft'],
                ['td3', 'td4'],
            ]
        );
    });

    it('table with all merged cell', () => {
        runTest('<table><tr><td id="td1" colspan=2 rowspan=2></td></tr><tr></tr></table>', [
            ['td1', 'spanLeft'],
            ['spanTop', 'spanBoth'],
        ]);
    });

    it('table with variant lengths columns', () => {
        runTest(
            '<table><tr><td id="td1"></td><td id="td2"></td></tr><tr><td id="td3"></td><td id="td4"></td><td id="td5"></td></tr></table>',
            [
                ['td1', 'td2'],
                ['td3', 'td4', 'td5'],
            ]
        );
    });

    it('table with complex merged cells', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td><td id="td3" rowspan=2></td></tr><tr><td id="td4" rowspan=2></td><td id="td5"></td></tr><tr><td id="td8" colspan=2></td></tr></table>',
            [
                ['td1', 'spanLeft', 'td3'],
                ['td4', 'td5', 'spanTop'],
                ['spanTop', 'td8', 'spanLeft'],
            ]
        );
    });
});

describe('findTableCellElement', () => {
    const mockedTd1 = { id: 'TD1' } as any;
    const mockedTd2 = { id: 'TD2' } as any;
    const mockedTd3 = { id: 'TD3' } as any;
    const mockedTd4 = { id: 'TD4' } as any;
    const mockedTd5 = { id: 'TD5' } as any;

    function runTest(
        parsedTable: ParsedTable,
        row: number,
        col: number,
        expectedResult: TableCellCoordinateWithCell | null
    ) {
        const result = findTableCellElement(parsedTable, { row, col });

        expect(result).toEqual(expectedResult);
    }

    it('Null', () => {
        runTest([], 0, 0, null);
    });

    it('Simple table', () => {
        const parsedTable: ParsedTable = [
            [mockedTd1, mockedTd2],
            [mockedTd3, mockedTd4],
        ];
        runTest(parsedTable, 0, 0, { cell: mockedTd1, row: 0, col: 0 });
        runTest(parsedTable, 0, 1, { cell: mockedTd2, row: 0, col: 1 });
        runTest(parsedTable, 0, 2, null);
        runTest(parsedTable, 1, 0, { cell: mockedTd3, row: 1, col: 0 });
        runTest(parsedTable, 2, 0, null);
        runTest(parsedTable, 2, 2, null);
    });

    it('Complex table', () => {
        const parsedTable: ParsedTable = [
            [mockedTd1, mockedTd2, 'spanLeft'],
            ['spanTop', mockedTd3, mockedTd4],
            [mockedTd5, 'spanLeft', 'spanTop'],
        ];

        runTest(parsedTable, 0, 0, { cell: mockedTd1, row: 0, col: 0 });
        runTest(parsedTable, 0, 1, { cell: mockedTd2, row: 0, col: 1 });
        runTest(parsedTable, 0, 2, { cell: mockedTd2, row: 0, col: 1 });
        runTest(parsedTable, 0, 3, null);
        runTest(parsedTable, 1, 0, { cell: mockedTd1, row: 0, col: 0 });
        runTest(parsedTable, 1, 1, { cell: mockedTd3, row: 1, col: 1 });
        runTest(parsedTable, 1, 2, { cell: mockedTd4, row: 1, col: 2 });
        runTest(parsedTable, 1, 3, null);
        runTest(parsedTable, 2, 0, { cell: mockedTd5, row: 2, col: 0 });
        runTest(parsedTable, 2, 1, { cell: mockedTd5, row: 2, col: 0 });
        runTest(parsedTable, 2, 2, { cell: mockedTd4, row: 1, col: 2 });
        runTest(parsedTable, 2, 3, null);
        runTest(parsedTable, 3, 0, null);
        runTest(parsedTable, 3, 1, null);
        runTest(parsedTable, 3, 2, null);
        runTest(parsedTable, 3, 3, null);
    });

    it('span both', () => {
        const parsedTable: ParsedTable = [
            [mockedTd1, 'spanLeft'],
            ['spanTop', 'spanBoth'],
        ];

        runTest(parsedTable, 0, 0, { cell: mockedTd1, row: 0, col: 0 });
        runTest(parsedTable, 0, 1, { cell: mockedTd1, row: 0, col: 0 });
        runTest(parsedTable, 0, 2, null);
        runTest(parsedTable, 1, 0, { cell: mockedTd1, row: 0, col: 0 });
        runTest(parsedTable, 1, 1, { cell: mockedTd1, row: 0, col: 0 });
        runTest(parsedTable, 1, 2, null);
        runTest(parsedTable, 2, 0, null);
        runTest(parsedTable, 2, 1, null);
        runTest(parsedTable, 2, 2, null);
    });
});

describe('findLastedCoInMergedCell', () => {
    const mockedTd1 = { id: 'TD1' } as any;
    const mockedTd2 = { id: 'TD2' } as any;
    const mockedTd3 = { id: 'TD3' } as any;
    const mockedTd4 = { id: 'TD4' } as any;
    const mockedTd5 = { id: 'TD5' } as any;

    function runTest(parsedTable: ParsedTable, row: number, col: number, expectedResult: any) {
        const result = findLastedCoInMergedCell(parsedTable, { row, col });

        expect(result).toEqual(expectedResult);
    }

    it('Null', () => {
        runTest([], 0, 0, null);
    });

    it('Simple table', () => {
        const parsedTable: ParsedTable = [
            [mockedTd1, mockedTd2],
            [mockedTd3, mockedTd4],
        ];
        runTest(parsedTable, 0, 0, { row: 0, col: 0 });
        runTest(parsedTable, 0, 1, { row: 0, col: 1 });
        runTest(parsedTable, 0, 2, null);
        runTest(parsedTable, 1, 0, { row: 1, col: 0 });
        runTest(parsedTable, 2, 0, null);
        runTest(parsedTable, 2, 2, null);
    });

    it('Complex table', () => {
        const parsedTable: ParsedTable = [
            [mockedTd1, mockedTd2, 'spanLeft'],
            ['spanTop', mockedTd3, mockedTd4],
            [mockedTd5, 'spanLeft', 'spanTop'],
        ];

        runTest(parsedTable, 0, 0, { row: 1, col: 0 });
        runTest(parsedTable, 0, 1, { row: 0, col: 2 });
        runTest(parsedTable, 0, 2, { row: 0, col: 2 });
        runTest(parsedTable, 0, 3, null);
        runTest(parsedTable, 1, 0, { row: 1, col: 0 });
        runTest(parsedTable, 1, 1, { row: 1, col: 1 });
        runTest(parsedTable, 1, 2, { row: 2, col: 2 });
        runTest(parsedTable, 1, 3, null);
        runTest(parsedTable, 2, 0, { row: 2, col: 1 });
        runTest(parsedTable, 2, 1, { row: 2, col: 1 });
        runTest(parsedTable, 2, 2, { row: 2, col: 2 });
        runTest(parsedTable, 2, 3, null);
        runTest(parsedTable, 3, 0, null);
        runTest(parsedTable, 3, 1, null);
        runTest(parsedTable, 3, 2, null);
        runTest(parsedTable, 3, 3, null);
    });

    it('span both', () => {
        const parsedTable: ParsedTable = [
            [mockedTd1, 'spanLeft'],
            ['spanTop', 'spanBoth'],
        ];

        runTest(parsedTable, 0, 0, { row: 1, col: 1 });
        runTest(parsedTable, 0, 1, { row: 1, col: 1 });
        runTest(parsedTable, 0, 2, null);
        runTest(parsedTable, 1, 0, { row: 1, col: 1 });
        runTest(parsedTable, 1, 1, { row: 1, col: 1 });
        runTest(parsedTable, 1, 2, null);
        runTest(parsedTable, 2, 0, null);
        runTest(parsedTable, 2, 1, null);
        runTest(parsedTable, 2, 2, null);
    });
});

describe('findCoordinate', () => {
    let domHelper: DOMHelper;
    let root: HTMLElement;

    beforeEach(() => {
        root = document.createElement('div');
        domHelper = createDOMHelper(root);
    });

    it('Empty table', () => {
        const table: ParsedTable = [];
        const text = document.createTextNode('test');

        root.appendChild(text);

        const result = findCoordinate(table, text, domHelper);

        expect(result).toBeNull();
    });

    it('Table contains node', () => {
        const container = document.createElement('div') as any;
        root.appendChild(container);

        const table: ParsedTable = [[container]];
        const text = document.createTextNode('test');

        container.appendChild(text);

        const result = findCoordinate(table, text, domHelper);

        expect(result).toEqual({ row: 0, col: 0 });
    });

    it('Table contains node indirectly', () => {
        const container = document.createElement('div') as any;
        root.appendChild(container);

        const table: ParsedTable = [[container]];
        const span = document.createElement('span');
        const text = document.createTextNode('test');

        span.appendChild(text);
        container.appendChild(span);

        const result = findCoordinate(table, text, domHelper);

        expect(result).toEqual({ row: 0, col: 0 });
    });

    it('Table contains node on second row', () => {
        const container = document.createElement('div') as any;
        root.appendChild(container);

        const table: ParsedTable = [[], ['spanLeft', container]];
        const span = document.createElement('span');
        const text = document.createTextNode('test');

        span.appendChild(text);
        container.appendChild(span);

        const result = findCoordinate(table, text, domHelper);

        expect(result).toEqual({ row: 1, col: 1 });
    });
});

describe('createTableRanges', () => {
    function runTest(
        html: string,
        firstRow: number,
        firstColumn: number,
        lastRow: number,
        lastColumn: number,
        expectedIds: (string | null)[]
    ) {
        const div = document.createElement('div');
        div.innerHTML = html;
        const table = div.firstChild as HTMLTableElement;

        const selection: DOMSelection = {
            type: 'table',
            table: table,
            firstColumn,
            firstRow,
            lastColumn,
            lastRow,
        };

        const result = createTableRanges(selection);
        const idResult = result.map(range => {
            const startContainer = range.startContainer.childNodes[range.startOffset];
            const endContainer = range.endContainer.childNodes[range.endOffset - 1];

            return startContainer == endContainer ? (startContainer as HTMLElement).id : null;
        });

        expect(idResult).toEqual(expectedIds);
    }

    it('empty table', () => {
        runTest('<table></table>', 0, 0, 0, 0, []);
    });

    it('1*1 table, no selection', () => {
        runTest('<table><tr><td id="td1"></td></tr></table>', -1, -1, -1, -1, []);
    });

    it('1*1 table, has selection', () => {
        runTest('<table><tr><td id="td1"></td></tr></table>', 0, 0, 0, 0, ['td1']);
    });

    it('2*2 table, has sub selection', () => {
        runTest(
            '<table><tr><td id="td1"></td><td id="td2"></td></tr><tr><td id="td3"></td><td id="td4"></td></tr></table>',
            0,
            1,
            1,
            1,
            ['td2', 'td4']
        );
    });

    it('table with merged row - 1', () => {
        runTest(
            '<table><tr><td id="td1" rowspan=2></td><td id="td2"></td></tr><tr><td id="td4"></td></tr></table>',
            0,
            0,
            1,
            0,
            ['td1']
        );
    });

    it('table with merged row - 2', () => {
        runTest(
            '<table><tr><td id="td1" rowspan=2></td><td id="td2"></td></tr><tr><td id="td4"></td></tr></table>',
            0,
            1,
            1,
            1,
            ['td2', 'td4']
        );
    });

    it('table with merged col - 1', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td></tr><tr><td id="td3"></td><td id="td4"></td></tr></table>',
            0,
            0,
            0,
            1,
            ['td1']
        );
    });

    it('table with merged col - 2', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td></tr><tr><td id="td3"></td><td id="td4"></td></tr></table>',
            1,
            0,
            1,
            1,
            ['td3', 'td4']
        );
    });

    it('table with all merged cell - 1', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2 rowspan=2></td></tr><tr></tr></table>',
            0,
            0,
            0,
            0,
            ['td1']
        );
    });

    it('table with all merged cell - 2', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2 rowspan=2></td></tr><tr></tr></table>',
            1,
            1,
            1,
            1,
            []
        );
    });

    it('table with variant lengths columns', () => {
        runTest(
            '<table><tr><td id="td1"></td><td id="td2"></td></tr><tr><td id="td3"></td><td id="td4"></td><td id="td5"></td></tr></table>',
            0,
            1,
            1,
            2,
            ['td2', 'td4', 'td5']
        );
    });

    it('table with complex merged cells - 1', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td><td id="td3" rowspan=2></td></tr><tr><td id="td4" rowspan=2></td><td id="td5"></td></tr><tr><td id="td8" colspan=2></td></tr></table>',
            0,
            0,
            0,
            2,
            ['td1', 'td3']
        );
    });

    it('table with complex merged cells - 2', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td><td id="td3" rowspan=2></td></tr><tr><td id="td4" rowspan=2></td><td id="td5"></td></tr><tr><td id="td8" colspan=2></td></tr></table>',
            1,
            0,
            1,
            2,
            ['td4', 'td5']
        );
    });

    it('table with complex merged cells - 3', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td><td id="td3" rowspan=2></td></tr><tr><td id="td4" rowspan=2></td><td id="td5"></td></tr><tr><td id="td8" colspan=2></td></tr></table>',
            1,
            1,
            2,
            2,
            ['td5', 'td8']
        );
    });

    it('table with complex merged cells - 4', () => {
        runTest(
            '<table><tr><td id="td1" colspan=2></td><td id="td3" rowspan=2></td></tr><tr><td id="td4" rowspan=2></td><td id="td5"></td></tr><tr><td id="td8" colspan=2></td></tr></table>',
            0,
            0,
            2,
            2,
            ['td1', 'td3', 'td4', 'td5', 'td8']
        );
    });
});
