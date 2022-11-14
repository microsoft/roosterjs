import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { mergeTableRow } from '../../../lib/modelApi/table/mergeTableRow';
import { TableOperation } from 'roosterjs-editor-types';

describe('mergeTableRow', () => {
    it('empty table', () => {
        const table = createTable(0);

        mergeTableRow(table, TableOperation.MergeAbove);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [],
            widths: [],
            heights: [],
            dataset: {},
        });

        mergeTableRow(table, TableOperation.MergeBelow);

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

        mergeTableRow(table, TableOperation.MergeAbove);

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

        mergeTableRow(table, TableOperation.MergeBelow);

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
        const table = createTable(4);
        const cells = [
            createTableCell(false, false, false, { backgroundColor: '1' }),
            createTableCell(false, false, false, { backgroundColor: '2' }),
            createTableCell(false, false, false, { backgroundColor: '3' }),
            createTableCell(false, false, false, { backgroundColor: '4' }),
            createTableCell(false, false, false, { backgroundColor: '5' }),
            createTableCell(false, false, false, { backgroundColor: '6' }),
            createTableCell(false, false, false, { backgroundColor: '7' }),
            createTableCell(false, false, false, { backgroundColor: '8' }),
        ];

        table.cells[0].push(cells[0], cells[1]);
        table.cells[1].push(cells[2], cells[3]);
        table.cells[2].push(cells[4], cells[5]);
        table.cells[3].push(cells[6], cells[7]);

        cells[2].isSelected = true;
        cells[4].isSelected = true;

        mergeTableRow(table, TableOperation.MergeAbove);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[2], cells[3]],
                [cells[4], cells[5]],
                [cells[6], cells[7]],
            ],
            widths: [],
            heights: [],
            dataset: {},
        });

        expect(cells.map(c => c.spanLeft)).toEqual([
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
        ]);
        expect(cells.map(c => c.spanAbove)).toEqual([
            false,
            false,
            true,
            false,
            false,
            false,
            false,
            false,
        ]);

        mergeTableRow(table, TableOperation.MergeBelow);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[2], cells[3]],
                [cells[4], cells[5]],
                [cells[6], cells[7]],
            ],
            widths: [],
            heights: [],
            dataset: {},
        });

        expect(cells.map(c => c.spanLeft)).toEqual([
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
        ]);
        expect(cells.map(c => c.spanAbove)).toEqual([
            false,
            false,
            true,
            false,
            false,
            false,
            true,
            false,
        ]);
    });

    it('table with column selection', () => {
        const table = createTable(4);
        const cells = [
            createTableCell(false, false, false, { backgroundColor: '1' }),
            createTableCell(false, false, false, { backgroundColor: '2' }),
            createTableCell(false, false, false, { backgroundColor: '3' }),
            createTableCell(false, false, false, { backgroundColor: '4' }),
            createTableCell(false, false, false, { backgroundColor: '5' }),
            createTableCell(false, false, false, { backgroundColor: '6' }),
            createTableCell(false, false, false, { backgroundColor: '7' }),
            createTableCell(false, false, false, { backgroundColor: '8' }),
        ];

        table.cells[0].push(cells[0], cells[1]);
        table.cells[1].push(cells[2], cells[3]);
        table.cells[2].push(cells[4], cells[5]);
        table.cells[3].push(cells[6], cells[7]);

        cells[2].isSelected = true;
        cells[3].isSelected = true;

        mergeTableRow(table, TableOperation.MergeAbove);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[2], cells[3]],
                [cells[4], cells[5]],
                [cells[6], cells[7]],
            ],
            widths: [],
            heights: [],
            dataset: {},
        });

        expect(cells.map(c => c.spanLeft)).toEqual([
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
        ]);
        expect(cells.map(c => c.spanAbove)).toEqual([
            false,
            false,
            true,
            true,
            false,
            false,
            false,
            false,
        ]);

        cells[2].isSelected = false;
        cells[3].isSelected = false;
        cells[4].isSelected = true;
        cells[5].isSelected = true;

        mergeTableRow(table, TableOperation.MergeBelow);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[2], cells[3]],
                [cells[4], cells[5]],
                [cells[6], cells[7]],
            ],
            widths: [],
            heights: [],
            dataset: {},
        });

        expect(cells.map(c => c.spanLeft)).toEqual([
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
        ]);
        expect(cells.map(c => c.spanAbove)).toEqual([
            false,
            false,
            true,
            true,
            false,
            false,
            true,
            true,
        ]);
    });

    it('table with column selection, still can merge', () => {
        const table = createTable(4);
        const cells = [
            createTableCell(false, false, false, { backgroundColor: '1' }),
            createTableCell(false, false, false, { backgroundColor: '2' }),
            createTableCell(false, false, false, { backgroundColor: '3' }),
            createTableCell(false, false, false, { backgroundColor: '4' }),
            createTableCell(false, false, false, { backgroundColor: '5' }),
            createTableCell(false, true, false, { backgroundColor: '6' }),
            createTableCell(false, false, false, { backgroundColor: '7' }),
            createTableCell(false, false, false, { backgroundColor: '8' }),
        ];

        table.cells[0].push(cells[0], cells[1]);
        table.cells[1].push(cells[2], cells[3]);
        table.cells[2].push(cells[4], cells[5]);
        table.cells[3].push(cells[6], cells[7]);

        cells[2].isSelected = true;
        cells[3].isSelected = true;

        mergeTableRow(table, TableOperation.MergeAbove);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[2], cells[3]],
                [cells[4], cells[5]],
                [cells[6], cells[7]],
            ],
            widths: [],
            heights: [],
            dataset: {},
        });

        expect(cells.map(c => c.spanLeft)).toEqual([
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
        ]);
        expect(cells.map(c => c.spanAbove)).toEqual([
            false,
            false,
            true,
            true,
            false,
            true,
            false,
            false,
        ]);

        cells[2].isSelected = false;
        cells[3].isSelected = false;
        cells[4].isSelected = true;
        cells[5].isSelected = true;

        mergeTableRow(table, TableOperation.MergeBelow);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[2], cells[3]],
                [cells[4], cells[5]],
                [cells[6], cells[7]],
            ],
            widths: [],
            heights: [],
            dataset: {},
        });

        expect(cells.map(c => c.spanLeft)).toEqual([
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
        ]);
        expect(cells.map(c => c.spanAbove)).toEqual([
            false,
            false,
            true,
            true,
            false,
            true,
            true,
            true,
        ]);
    });
});
