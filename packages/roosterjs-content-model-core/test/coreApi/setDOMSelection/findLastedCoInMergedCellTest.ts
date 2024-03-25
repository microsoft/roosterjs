import { findLastedCoInMergedCell } from '../../../lib/coreApi/setDOMSelection/findLastedCoInMergedCell';
import type { ParsedTable } from 'roosterjs-content-model-types';

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
