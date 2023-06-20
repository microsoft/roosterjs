import { ContentModelTableCell } from '../../../lib/publicTypes/group/ContentModelTableCell';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { mergeTableCells } from '../../../lib/modelApi/table/mergeTableCells';

describe('mergeTableCells', () => {
    it('empty table', () => {
        const table = createTable(0);

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {},
        });
    });

    it('table without selection', () => {
        const table = createTable(2);
        const cells = [
            createTableCell(false, false, false, { backgroundColor: '1' }),
            createTableCell(false, false, false, { backgroundColor: '2' }),
            createTableCell(false, false, false, { backgroundColor: '3' }),
            createTableCell(false, false, false, { backgroundColor: '4' }),
        ];

        table.rows[1].cells.push(cells[2], cells[3]);
        table.rows[0].cells.push(cells[0], cells[1]);

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    format: {},
                    height: 0,
                    cells: [cells[0], cells[1]],
                },
                {
                    format: {},
                    height: 0,
                    cells: [cells[2], cells[3]],
                },
            ],
            widths: [],
            dataset: {},
        });

        expect(cells.map(c => c.spanLeft)).toEqual([false, false, false, false]);
        expect(cells.map(c => c.spanAbove)).toEqual([false, false, false, false]);
    });

    it('table with single cell selection', () => {
        const table = createTable(2);
        const cells = [
            createTableCell(false, false, false, { backgroundColor: '1' }),
            createTableCell(false, false, false, { backgroundColor: '2' }),
            createTableCell(false, false, false, { backgroundColor: '3' }),
            createTableCell(false, false, false, { backgroundColor: '4' }),
        ];

        cells[0].isSelected = true;

        table.rows[0].cells.push(cells[0], cells[1]);
        table.rows[1].cells.push(cells[2], cells[3]);

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    format: {},
                    height: 0,
                    cells: [cells[0], cells[1]],
                },
                {
                    format: {},
                    height: 0,
                    cells: [cells[2], cells[3]],
                },
            ],
            widths: [],
            dataset: {},
        });

        expect(cells.map(c => c.spanLeft)).toEqual([false, false, false, false]);
        expect(cells.map(c => c.spanAbove)).toEqual([false, false, false, false]);
    });

    it('table with row selection', () => {
        const table = createTable(2);

        const cells = [
            createTableCell(false, false, false, { backgroundColor: '1' }),
            createTableCell(false, false, false, { backgroundColor: '2' }),
            createTableCell(false, false, false, { backgroundColor: '3' }),
            createTableCell(false, false, false, { backgroundColor: '4' }),
        ];

        table.rows[0].cells.push(cells[0], cells[1]);
        table.rows[1].cells.push(cells[2], cells[3]);

        cells[0].isSelected = true;
        cells[1].isSelected = true;

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    format: {},
                    height: 0,
                    cells: [cells[0], cells[1]],
                },
                {
                    format: {},
                    height: 0,
                    cells: [cells[2], cells[3]],
                },
            ],
            widths: [],
            dataset: {},
        });

        expect(cells.map(c => c.spanLeft)).toEqual([false, true, false, false]);
        expect(cells.map(c => c.spanAbove)).toEqual([false, false, false, false]);
    });

    it('table with column selection', () => {
        const table = createTable(2);

        const cells = [
            createTableCell(false, false, false, { backgroundColor: '1' }),
            createTableCell(false, false, false, { backgroundColor: '2' }),
            createTableCell(false, false, false, { backgroundColor: '3' }),
            createTableCell(false, false, false, { backgroundColor: '4' }),
        ];

        table.rows[0].cells.push(cells[0], cells[1]);
        table.rows[1].cells.push(cells[2], cells[3]);

        cells[0].isSelected = true;
        cells[2].isSelected = true;

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                { format: {}, height: 0, cells: [cells[0], cells[1]] },
                { format: {}, height: 0, cells: [cells[2], cells[3]] },
            ],
            widths: [],
            dataset: {},
        });

        expect(cells.map(c => c.spanLeft)).toEqual([false, false, false, false]);
        expect(cells.map(c => c.spanAbove)).toEqual([false, false, true, false]);
    });

    it('table with both selection', () => {
        const table = createTable(2);

        const cells = [
            createTableCell(false, false, false, { backgroundColor: '1' }),
            createTableCell(false, false, false, { backgroundColor: '2' }),
            createTableCell(false, false, false, { backgroundColor: '3' }),
            createTableCell(false, false, false, { backgroundColor: '4' }),
        ];

        table.rows[0].cells.push(cells[0], cells[1]);
        table.rows[1].cells.push(cells[2], cells[3]);

        cells[0].isSelected = true;
        cells[3].isSelected = true;

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                { format: {}, height: 0, cells: [cells[0], cells[1]] },
                { format: {}, height: 0, cells: [cells[2], cells[3]] },
            ],
            widths: [],
            dataset: {},
        });

        expect(cells.map(c => c.spanLeft)).toEqual([false, true, false, true]);
        expect(cells.map(c => c.spanAbove)).toEqual([false, false, true, true]);
    });

    it('table with both selection and cached elements', () => {
        const table = createTable(3);
        const cells: ContentModelTableCell[] = [];

        for (let i = 0; i < 9; i++) {
            const cell = createTableCell(false, false, false, { backgroundColor: i.toString() });

            cell.cachedElement = {} as any;
            cells.push(cell);
        }

        table.rows[0].cells.push(cells[0], cells[1], cells[2]);
        table.rows[1].cells.push(cells[3], cells[4], cells[5]);
        table.rows[2].cells.push(cells[6], cells[7], cells[8]);
        table.cachedElement = {} as any;

        cells[0].isSelected = true;
        cells[4].isSelected = true;

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                { format: {}, height: 0, cells: [cells[0], cells[1], cells[2]] },
                { format: {}, height: 0, cells: [cells[3], cells[4], cells[5]] },
                { format: {}, height: 0, cells: [cells[6], cells[7], cells[8]] },
            ],
            widths: [],
            dataset: {},
            cachedElement: {} as any,
        });

        expect(cells.map(c => c.cachedElement)).toEqual([
            undefined,
            undefined,
            {} as any,
            undefined,
            undefined,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
        ]);
    });

    it('table cells that cannot be merged - 1', () => {
        const table = createTable(2);

        const cells = [
            createTableCell(false, false, false, { backgroundColor: '1' }),
            createTableCell(true, false, false, { backgroundColor: '2' }),
            createTableCell(false, false, false, { backgroundColor: '3' }),
            createTableCell(false, false, false, { backgroundColor: '4' }),
        ];

        table.rows[0].cells.push(cells[0], cells[1]);
        table.rows[1].cells.push(cells[2], cells[3]);

        cells[0].isSelected = true;
        cells[2].isSelected = true;

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                { format: {}, height: 0, cells: [cells[0], cells[1]] },
                { format: {}, height: 0, cells: [cells[2], cells[3]] },
            ],
            widths: [],
            dataset: {},
        });

        expect(cells.map(c => c.spanLeft)).toEqual([false, true, false, false]);
        expect(cells.map(c => c.spanAbove)).toEqual([false, false, false, false]);
    });

    it('table cells that cannot be merged - 2', () => {
        const table = createTable(2);

        const cells = [
            createTableCell(false, false, false, { backgroundColor: '1' }),
            createTableCell(false, false, false, { backgroundColor: '2' }),
            createTableCell(false, true, false, { backgroundColor: '3' }),
            createTableCell(false, false, false, { backgroundColor: '4' }),
        ];

        table.rows[0].cells.push(cells[0], cells[1]);
        table.rows[1].cells.push(cells[2], cells[3]);

        cells[0].isSelected = true;
        cells[1].isSelected = true;

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                { format: {}, height: 0, cells: [cells[0], cells[1]] },
                { format: {}, height: 0, cells: [cells[2], cells[3]] },
            ],
            widths: [],
            dataset: {},
        });

        expect(cells.map(c => c.spanLeft)).toEqual([false, false, false, false]);
        expect(cells.map(c => c.spanAbove)).toEqual([false, false, true, false]);
    });

    it('table cells with existing spans that can be merged - 2', () => {
        const table = createTable(2);

        const cells = [
            createTableCell(false, false, false, { backgroundColor: '1' }),
            createTableCell(false, false, false, { backgroundColor: '2' }),
            createTableCell(false, true, false, { backgroundColor: '3' }),
            createTableCell(false, false, false, { backgroundColor: '4' }),
        ];

        table.rows[0].cells.push(cells[0], cells[1]);
        table.rows[1].cells.push(cells[2], cells[3]);

        cells[0].isSelected = true;
        cells[3].isSelected = true;

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                { format: {}, height: 0, cells: [cells[0], cells[1]] },
                { format: {}, height: 0, cells: [cells[2], cells[3]] },
            ],
            widths: [],
            dataset: {},
        });

        expect(cells.map(c => c.spanLeft)).toEqual([false, true, false, true]);
        expect(cells.map(c => c.spanAbove)).toEqual([false, false, true, true]);
    });
});
