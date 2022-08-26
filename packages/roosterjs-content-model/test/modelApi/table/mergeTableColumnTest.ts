import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { mergeTableColumn } from '../../../lib/modelApi/table/mergeTableColumn';
import { TableOperation } from 'roosterjs-editor-types';

describe('mergeTableColumn', () => {
    it('empty table', () => {
        const table = createTable(0);

        mergeTableColumn(table, TableOperation.MergeLeft);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [],
            widths: [],
            heights: [],
        });

        mergeTableColumn(table, TableOperation.MergeRight);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [],
            widths: [],
            heights: [],
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

        mergeTableColumn(table, TableOperation.MergeLeft);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[2], cells[3]],
            ],
            widths: [],
            heights: [],
        });

        expect(cells.map(c => c.spanLeft)).toEqual([false, false, false, false]);
        expect(cells.map(c => c.spanAbove)).toEqual([false, false, false, false]);

        mergeTableColumn(table, TableOperation.MergeRight);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[2], cells[3]],
            ],
            widths: [],
            heights: [],
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
            createTableCell(false, false, false, { backgroundColor: '5' }),
            createTableCell(false, false, false, { backgroundColor: '6' }),
            createTableCell(false, false, false, { backgroundColor: '7' }),
            createTableCell(false, false, false, { backgroundColor: '8' }),
        ];

        table.cells[0].push(cells[0], cells[1], cells[2], cells[3]);
        table.cells[1].push(cells[4], cells[5], cells[6], cells[7]);

        cells[1].isSelected = true;
        cells[2].isSelected = true;

        mergeTableColumn(table, TableOperation.MergeLeft);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cells[0], cells[1], cells[2], cells[3]],
                [cells[4], cells[5], cells[6], cells[7]],
            ],
            widths: [],
            heights: [],
        });

        expect(cells.map(c => c.spanLeft)).toEqual([
            false,
            true,
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
            false,
            false,
            false,
            false,
            false,
            false,
        ]);

        mergeTableColumn(table, TableOperation.MergeRight);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cells[0], cells[1], cells[2], cells[3]],
                [cells[4], cells[5], cells[6], cells[7]],
            ],
            widths: [],
            heights: [],
        });

        expect(cells.map(c => c.spanLeft)).toEqual([
            false,
            true,
            false,
            true,
            false,
            false,
            false,
            false,
        ]);
        expect(cells.map(c => c.spanAbove)).toEqual([
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
        ]);
    });

    it('table with column selection', () => {
        const table = createTable(2);
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

        table.cells[0].push(cells[0], cells[1], cells[2], cells[3]);
        table.cells[1].push(cells[4], cells[5], cells[6], cells[7]);

        cells[1].isSelected = true;
        cells[5].isSelected = true;

        mergeTableColumn(table, TableOperation.MergeLeft);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cells[0], cells[1], cells[2], cells[3]],
                [cells[4], cells[5], cells[6], cells[7]],
            ],
            widths: [],
            heights: [],
        });

        expect(cells.map(c => c.spanLeft)).toEqual([
            false,
            true,
            false,
            false,
            false,
            true,
            false,
            false,
        ]);
        expect(cells.map(c => c.spanAbove)).toEqual([
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
        ]);

        cells[1].isSelected = false;
        cells[5].isSelected = false;
        cells[2].isSelected = true;
        cells[6].isSelected = true;

        mergeTableColumn(table, TableOperation.MergeRight);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cells[0], cells[1], cells[2], cells[3]],
                [cells[4], cells[5], cells[6], cells[7]],
            ],
            widths: [],
            heights: [],
        });

        expect(cells.map(c => c.spanLeft)).toEqual([
            false,
            true,
            false,
            true,
            false,
            true,
            false,
            true,
        ]);
        expect(cells.map(c => c.spanAbove)).toEqual([
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
        ]);
    });

    it('table with column selection, still can merge', () => {
        const table = createTable(2);
        const cells = [
            createTableCell(false, false, false, { backgroundColor: '1' }),
            createTableCell(false, false, false, { backgroundColor: '2' }),
            createTableCell(false, false, false, { backgroundColor: '3' }),
            createTableCell(false, false, false, { backgroundColor: '4' }),
            createTableCell(false, false, false, { backgroundColor: '5' }),
            createTableCell(false, false, false, { backgroundColor: '6' }),
            createTableCell(true, false, false, { backgroundColor: '7' }),
            createTableCell(false, false, false, { backgroundColor: '8' }),
        ];

        table.cells[0].push(cells[0], cells[1], cells[2], cells[3]);
        table.cells[1].push(cells[4], cells[5], cells[6], cells[7]);

        cells[1].isSelected = true;
        cells[5].isSelected = true;

        mergeTableColumn(table, TableOperation.MergeLeft);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cells[0], cells[1], cells[2], cells[3]],
                [cells[4], cells[5], cells[6], cells[7]],
            ],
            widths: [],
            heights: [],
        });

        expect(cells.map(c => c.spanLeft)).toEqual([
            false,
            true,
            false,
            false,
            false,
            true,
            true,
            false,
        ]);
        expect(cells.map(c => c.spanAbove)).toEqual([
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
        ]);

        cells[1].isSelected = false;
        cells[5].isSelected = false;
        cells[2].isSelected = true;
        cells[6].isSelected = true;

        mergeTableColumn(table, TableOperation.MergeRight);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cells[0], cells[1], cells[2], cells[3]],
                [cells[4], cells[5], cells[6], cells[7]],
            ],
            widths: [],
            heights: [],
        });

        expect(cells.map(c => c.spanLeft)).toEqual([
            false,
            true,
            false,
            true,
            false,
            true,
            true,
            true,
        ]);
        expect(cells.map(c => c.spanAbove)).toEqual([
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
        ]);
    });
});
