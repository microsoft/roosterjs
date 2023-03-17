import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { ContentModelTableCellFormat } from '../../../lib/publicTypes/format/ContentModelTableCellFormat';
import { ContentModelTableFormat } from '../../../lib/publicTypes/format/ContentModelTableFormat';
import { createTable as originalCreateTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell as originalCreateTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { splitTableCellHorizontally } from '../../../lib/modelApi/table/splitTableCellHorizontally';

const mockedCachedElement = {} as any;

function createTable(rowCount: number, format?: ContentModelTableFormat): ContentModelTable {
    const table = originalCreateTable(rowCount, format);

    table.cachedElement = mockedCachedElement;

    return table;
}

function createTableCell(
    spanLeftOrColSpan?: boolean | number,
    spanAboveOrRowSpan?: boolean | number,
    isHeader?: boolean,
    format?: ContentModelTableCellFormat
) {
    const cell = originalCreateTableCell(spanLeftOrColSpan, spanAboveOrRowSpan, isHeader, format);

    cell.cachedElement = mockedCachedElement;

    return cell;
}

describe('splitTableCellHorizontally', () => {
    it('empty table', () => {
        const table = createTable(0);

        splitTableCellHorizontally(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [],
            widths: [],
            heights: [],
            dataset: {},
            cachedElement: mockedCachedElement,
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
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[1]],
                [cells[2], cells[3]],
            ],
            widths: [],
            heights: [],
            dataset: {},
            cachedElement: mockedCachedElement,
        });

        expect(cells.map(c => c.spanLeft)).toEqual([false, false, false, false]);
        expect(cells.map(c => c.spanAbove)).toEqual([false, false, false, false]);
        expect(cells[0].cachedElement).toBe(mockedCachedElement);
        expect(cells[1].cachedElement).toBe(mockedCachedElement);
        expect(cells[2].cachedElement).toBe(mockedCachedElement);
        expect(cells[3].cachedElement).toBe(mockedCachedElement);
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

        splitTableCellHorizontally(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[0], cells[1]],
                [cells[2], { ...cells[2], spanLeft: true }, cells[3]],
            ],
            widths: [50, 50, 100],
            heights: [200, 200],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
        expect(cells[0].cachedElement).toBeUndefined();
        expect(cells[1].cachedElement).toBe(mockedCachedElement);
        expect(cells[2].cachedElement).toBeUndefined();
        expect(cells[3].cachedElement).toBe(mockedCachedElement);
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

        splitTableCellHorizontally(table);

        expect(table).toEqual({
            blockType: 'Table',
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
            widths: [50, 50, 50, 50],
            heights: [200, 200],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
        expect(cells[0].cachedElement).toBeUndefined();
        expect(cells[1].cachedElement).toBeUndefined();
        expect(cells[2].cachedElement).toBeUndefined();
        expect(cells[3].cachedElement).toBeUndefined();
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

        splitTableCellHorizontally(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[0], cells[1]],
                [cells[2], cells[2], cells[3]],
            ],
            widths: [50, 50, 100],
            heights: [200, 200],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
        expect(cells[0].cachedElement).toBeUndefined();
        expect(cells[1].cachedElement).toBe(mockedCachedElement);
        expect(cells[2].cachedElement).toBeUndefined();
        expect(cells[3].cachedElement).toBe(mockedCachedElement);
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

        splitTableCellHorizontally(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[0], cells[1], cells[1]],
                [cells[2], cells[2], cells[3], cells[3]],
            ],
            widths: [50, 50, 50, 50],
            heights: [200, 200],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
        expect(cells[0].cachedElement).toBeUndefined();
        expect(cells[1].cachedElement).toBeUndefined();
        expect(cells[2].cachedElement).toBeUndefined();
        expect(cells[3].cachedElement).toBeUndefined();
    });

    it('Split with min width', () => {
        const table = createTable(2);
        const cells = [
            createTableCell(false, false, false, { backgroundColor: '1' }),
            createTableCell(false, false, false, { backgroundColor: '2' }),
            createTableCell(false, false, false, { backgroundColor: '3' }),
            createTableCell(false, false, false, { backgroundColor: '4' }),
        ];

        table.cells[0].push(cells[0], cells[1]);
        table.cells[1].push(cells[2], cells[3]);
        table.widths = [100, 50];
        table.heights = [200, 200];

        cells[0].isSelected = true;
        cells[1].isSelected = true;
        cells[2].isSelected = true;
        cells[3].isSelected = true;

        splitTableCellHorizontally(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            cells: [
                [cells[0], cells[0], cells[1], cells[1]],
                [cells[2], cells[2], cells[3], cells[3]],
            ],
            widths: [50, 50, 30, 30],
            heights: [200, 200],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
        expect(cells[0].cachedElement).toBeUndefined();
        expect(cells[1].cachedElement).toBeUndefined();
        expect(cells[2].cachedElement).toBeUndefined();
        expect(cells[3].cachedElement).toBeUndefined();
    });
});
