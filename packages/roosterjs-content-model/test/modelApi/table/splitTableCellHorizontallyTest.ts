import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { splitTableCellHorizontally } from '../../../lib/modelApi/table/splitTableCellHorizontally';

describe('splitTableCellHorizontally', () => {
    it('empty table', () => {
        const table = createTable(0);

        splitTableCellHorizontally(table);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [],
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

        splitTableCellHorizontally(table);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[2], cells[3]],
            ],
        });

        expect(cells.map(c => c.spanLeft)).toEqual([false, false, false, false]);
        expect(cells.map(c => c.spanAbove)).toEqual([false, false, false, false]);
    });

    it('single cell selection', () => {
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

        splitTableCellHorizontally(table);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cells[0], cells[0], cells[1]],
                [cells[2], { ...cells[2], spanLeft: true }, cells[3]],
            ],
        });
    });

    it('row selection', () => {
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

        splitTableCellHorizontally(table);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cells[0], cells[0], cells[1], cells[1]],
                [
                    cells[2],
                    { ...cells[2], spanLeft: true },
                    cells[3],
                    { ...cells[3], spanLeft: true },
                ],
            ],
        });
    });

    it('column selection', () => {
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

        splitTableCellHorizontally(table);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cells[0], cells[0], cells[1]],
                [cells[2], cells[2], cells[3]],
            ],
        });
    });

    it('all selection', () => {
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
        cells[2].isSelected = true;
        cells[3].isSelected = true;

        splitTableCellHorizontally(table);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cells[0], cells[0], cells[1], cells[1]],
                [cells[2], cells[2], cells[3], cells[3]],
            ],
        });
    });
});
