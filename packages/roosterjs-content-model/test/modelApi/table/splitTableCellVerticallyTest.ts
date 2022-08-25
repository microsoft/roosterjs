import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { createTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { splitTableCellVertically } from '../../../lib/modelApi/table/splitTableCellVertically';

describe('splitTableCellVertically', () => {
    it('empty table', () => {
        const table = createTable(0);

        splitTableCellVertically(table);

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

        splitTableCellVertically(table);

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
        table.widths = [100, 100];
        table.heights = [200, 200];

        cells[0].isSelected = true;

        splitTableCellVertically(table);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[0], { ...cells[1], spanAbove: true }],
                [cells[2], cells[3]],
            ],
            widths: [100, 100],
            heights: [100, 100, 200],
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
        table.widths = [100, 100];
        table.heights = [200, 200];

        cells[0].isSelected = true;
        cells[1].isSelected = true;

        splitTableCellVertically(table);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[0], cells[1]],
                [cells[2], cells[3]],
            ],
            widths: [100, 100],
            heights: [100, 100, 200],
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
        table.widths = [100, 100];
        table.heights = [200, 200];

        cells[0].isSelected = true;
        cells[2].isSelected = true;

        splitTableCellVertically(table);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[0], { ...cells[1], spanAbove: true }],
                [cells[2], cells[3]],
                [cells[2], { ...cells[3], spanAbove: true }],
            ],
            widths: [100, 100],
            heights: [100, 100, 100, 100],
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
        table.widths = [100, 100];
        table.heights = [200, 200];

        cells[0].isSelected = true;
        cells[1].isSelected = true;
        cells[2].isSelected = true;
        cells[3].isSelected = true;

        splitTableCellVertically(table);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[0], cells[1]],
                [cells[2], cells[3]],
                [cells[2], cells[3]],
            ],
            widths: [100, 100],
            heights: [100, 100, 100, 100],
        });
    });

    it('split with min height', () => {
        const table = createTable(2);
        const cells = [
            createTableCell(false, false, false, { backgroundColor: '1' }),
            createTableCell(false, false, false, { backgroundColor: '2' }),
            createTableCell(false, false, false, { backgroundColor: '3' }),
            createTableCell(false, false, false, { backgroundColor: '4' }),
        ];

        table.cells[0].push(cells[0], cells[1]);
        table.cells[1].push(cells[2], cells[3]);
        table.widths = [100, 100];
        table.heights = [10, 50];

        cells[0].isSelected = true;
        cells[1].isSelected = true;
        cells[2].isSelected = true;
        cells[3].isSelected = true;

        splitTableCellVertically(table);

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[0], cells[1]],
                [cells[2], cells[3]],
                [cells[2], cells[3]],
            ],
            widths: [100, 100],
            heights: [22, 22, 25, 25],
        });
    });
});
