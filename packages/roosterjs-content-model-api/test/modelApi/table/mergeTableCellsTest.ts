import { ContentModelTableCell } from 'roosterjs-content-model-types';
import { createTable, createTableCell } from 'roosterjs-content-model-dom';
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

    it('preserves the borders that delimit the merged area', () => {
        const table = createTable(2);
        const cells = [
            createTableCell(false, false, false, {
                borderTop: '1px solid top',
                borderRight: '1px solid internal-right',
                borderBottom: '1px solid internal-bottom',
                borderLeft: '1px solid left',
            }),
            createTableCell(false, false, false, {
                borderTop: '1px solid top',
                borderRight: '2px dashed right',
            }),
            createTableCell(false, false, false, {
                borderBottom: '3px double bottom',
                borderLeft: '1px solid left',
            }),
            createTableCell(false, false, false, {
                borderRight: '2px dashed right',
                borderBottom: '3px double bottom',
            }),
        ];

        table.rows[0].cells.push(cells[0], cells[1]);
        table.rows[1].cells.push(cells[2], cells[3]);
        cells[0].isSelected = true;
        cells[3].isSelected = true;

        mergeTableCells(table);

        expect(cells[0].format).toEqual({
            borderTop: '1px solid top',
            borderRight: '2px dashed right',
            borderBottom: '3px double bottom',
            borderLeft: '1px solid left',
        });
        expect(cells.map(c => c.spanLeft)).toEqual([false, true, false, true]);
        expect(cells.map(c => c.spanAbove)).toEqual([false, false, true, true]);
    });

    it('does not retain internal borders when the merged outer edges have no borders', () => {
        const table = createTable(2);
        const cells = [
            createTableCell(false, false, false, {
                borderRight: '1px solid internal-right',
                borderBottom: '1px solid internal-bottom',
            }),
            createTableCell(false, false, false, {}),
            createTableCell(false, false, false, {}),
            createTableCell(false, false, false, {}),
        ];

        table.rows[0].cells.push(cells[0], cells[1]);
        table.rows[1].cells.push(cells[2], cells[3]);
        cells[0].isSelected = true;
        cells[3].isSelected = true;

        mergeTableCells(table);

        expect(cells[0].format).toEqual({});
    });

    it('does not extend partial perimeter borders across the merged area', () => {
        const table = createTable(5);
        const cells = Array.from({ length: 25 }, () => createTableCell(false, false, false, {}));

        for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
            table.rows[rowIndex].cells.push(...cells.slice(rowIndex * 5, rowIndex * 5 + 5));
        }

        cells[5].format = { borderTop: '1px solid top', borderLeft: '1px solid left' };
        cells[6].format = { borderTop: '1px solid top', borderRight: '1px solid right' };
        cells[10].format = {
            borderBottom: '1px solid bottom',
            borderLeft: '1px solid left',
        };
        cells[11].format = {
            borderRight: '1px solid right',
            borderBottom: '1px solid bottom',
        };
        cells[5].isSelected = true;
        cells[12].isSelected = true;

        mergeTableCells(table);

        expect(cells[5].format).toEqual({ borderLeft: '1px solid left' });
        expect(cells[7].format).toEqual({});
        expect(cells[12].format).toEqual({});
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
