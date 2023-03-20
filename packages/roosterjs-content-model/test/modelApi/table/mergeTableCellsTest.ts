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
            cells: [],
            widths: [],
            heights: [],
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

        table.cells[0].push(cells[0], cells[1]);
        table.cells[1].push(cells[2], cells[3]);

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[2], cells[3]],
            ],
            widths: [],
            heights: [],
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

        table.cells[0].push(cells[0], cells[1]);
        table.cells[1].push(cells[2], cells[3]);

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[2], cells[3]],
            ],
            widths: [],
            heights: [],
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

        table.cells[0].push(cells[0], cells[1]);
        table.cells[1].push(cells[2], cells[3]);

        cells[0].isSelected = true;
        cells[1].isSelected = true;

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[2], cells[3]],
            ],
            widths: [],
            heights: [],
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

        table.cells[0].push(cells[0], cells[1]);
        table.cells[1].push(cells[2], cells[3]);

        cells[0].isSelected = true;
        cells[2].isSelected = true;

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[2], cells[3]],
            ],
            widths: [],
            heights: [],
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

        table.cells[0].push(cells[0], cells[1]);
        table.cells[1].push(cells[2], cells[3]);

        cells[0].isSelected = true;
        cells[3].isSelected = true;

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[2], cells[3]],
            ],
            widths: [],
            heights: [],
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

        table.cells[0].push(cells[0], cells[1], cells[2]);
        table.cells[1].push(cells[3], cells[4], cells[5]);
        table.cells[2].push(cells[6], cells[7], cells[8]);
        table.cachedElement = {} as any;

        cells[0].isSelected = true;
        cells[4].isSelected = true;

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[1], cells[2]],
                [cells[3], cells[4], cells[5]],
                [cells[6], cells[7], cells[8]],
            ],
            widths: [],
            heights: [],
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

        table.cells[0].push(cells[0], cells[1]);
        table.cells[1].push(cells[2], cells[3]);

        cells[0].isSelected = true;
        cells[2].isSelected = true;

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[2], cells[3]],
            ],
            widths: [],
            heights: [],
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

        table.cells[0].push(cells[0], cells[1]);
        table.cells[1].push(cells[2], cells[3]);

        cells[0].isSelected = true;
        cells[1].isSelected = true;

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[2], cells[3]],
            ],
            widths: [],
            heights: [],
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

        table.cells[0].push(cells[0], cells[1]);
        table.cells[1].push(cells[2], cells[3]);

        cells[0].isSelected = true;
        cells[3].isSelected = true;

        mergeTableCells(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[2], cells[3]],
            ],
            widths: [],
            heights: [],
            dataset: {},
        });

        expect(cells.map(c => c.spanLeft)).toEqual([false, true, false, true]);
        expect(cells.map(c => c.spanAbove)).toEqual([false, false, true, true]);
    });
});
