import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { ContentModelTableCellFormat } from '../../../lib/publicTypes/format/ContentModelTableCellFormat';
import { ContentModelTableFormat } from '../../../lib/publicTypes/format/ContentModelTableFormat';
import { createTable as originalCreateTable } from '../../../lib/modelApi/creators/createTable';
import { createTableCell as originalCreateTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { splitTableCellVertically } from '../../../lib/modelApi/table/splitTableCellVertically';

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
describe('splitTableCellVertically', () => {
    it('empty table', () => {
        const table = createTable(0);

        splitTableCellVertically(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
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

        table.rows[0].cells.push(cells[0], cells[1]);
        table.rows[1].cells.push(cells[2], cells[3]);

        splitTableCellVertically(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    cells: [cells[0], cells[1]],
                    format: {},
                    height: 0,
                },
                {
                    cells: [cells[2], cells[3]],
                    format: {},
                    height: 0,
                },
            ],
            widths: [],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
        expect(cells[0].cachedElement).toBe(mockedCachedElement);
        expect(cells[1].cachedElement).toBe(mockedCachedElement);
        expect(cells[2].cachedElement).toBe(mockedCachedElement);
        expect(cells[3].cachedElement).toBe(mockedCachedElement);

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

        table.rows[0].cells.push(cells[0], cells[1]);
        table.rows[1].cells.push(cells[2], cells[3]);
        table.widths = [100, 100];
        table.rows[0].height = 200;
        table.rows[1].height = 200;

        cells[0].isSelected = true;

        splitTableCellVertically(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    cells: [cells[0], cells[1]],
                    format: {},
                    height: 100,
                },
                {
                    cells: [cells[0], { ...cells[1], spanAbove: true }],
                    format: {},
                    height: 100,
                },
                {
                    cells: [cells[2], cells[3]],
                    format: {},
                    height: 200,
                },
            ],
            widths: [100, 100],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
        expect(cells[0].cachedElement).toBeUndefined();
        expect(cells[1].cachedElement).toBeUndefined();
        expect(cells[2].cachedElement).toBe(mockedCachedElement);
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

        table.rows[0].cells.push(cells[0], cells[1]);
        table.rows[1].cells.push(cells[2], cells[3]);
        table.widths = [100, 100];
        table.rows[0].height = 200;
        table.rows[1].height = 200;

        cells[0].isSelected = true;
        cells[1].isSelected = true;

        splitTableCellVertically(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    cells: [cells[0], cells[1]],
                    format: {},
                    height: 100,
                },
                {
                    cells: [cells[0], cells[1]],
                    format: {},
                    height: 100,
                },
                {
                    cells: [cells[2], cells[3]],
                    format: {},
                    height: 200,
                },
            ],
            widths: [100, 100],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
        expect(cells[0].cachedElement).toBeUndefined();
        expect(cells[1].cachedElement).toBeUndefined();
        expect(cells[2].cachedElement).toBe(mockedCachedElement);
        expect(cells[3].cachedElement).toBe(mockedCachedElement);
    });

    it('column selection', () => {
        const table = createTable(2);
        const cells = [
            createTableCell(false, false, false, { backgroundColor: '1' }),
            createTableCell(false, false, false, { backgroundColor: '2' }),
            createTableCell(false, false, false, { backgroundColor: '3' }),
            createTableCell(false, false, false, { backgroundColor: '4' }),
        ];

        table.rows[0].cells.push(cells[0], cells[1]);
        table.rows[1].cells.push(cells[2], cells[3]);
        table.widths = [100, 100];
        table.rows[0].height = 200;
        table.rows[1].height = 200;

        cells[0].isSelected = true;
        cells[2].isSelected = true;

        splitTableCellVertically(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    cells: [cells[0], cells[1]],
                    format: {},
                    height: 100,
                },
                {
                    cells: [cells[0], { ...cells[1], spanAbove: true }],
                    format: {},
                    height: 100,
                },
                {
                    cells: [cells[2], cells[3]],
                    format: {},
                    height: 100,
                },
                {
                    cells: [cells[2], { ...cells[3], spanAbove: true }],
                    format: {},
                    height: 100,
                },
            ],
            widths: [100, 100],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
        expect(cells[0].cachedElement).toBeUndefined();
        expect(cells[1].cachedElement).toBeUndefined();
        expect(cells[2].cachedElement).toBeUndefined();
        expect(cells[3].cachedElement).toBeUndefined();
    });

    it('all selection', () => {
        const table = createTable(2);
        const cells = [
            createTableCell(false, false, false, { backgroundColor: '1' }),
            createTableCell(false, false, false, { backgroundColor: '2' }),
            createTableCell(false, false, false, { backgroundColor: '3' }),
            createTableCell(false, false, false, { backgroundColor: '4' }),
        ];

        table.rows[0].cells.push(cells[0], cells[1]);
        table.rows[1].cells.push(cells[2], cells[3]);
        table.widths = [100, 100];
        table.rows[0].height = 200;
        table.rows[1].height = 200;

        cells[0].isSelected = true;
        cells[1].isSelected = true;
        cells[2].isSelected = true;
        cells[3].isSelected = true;

        splitTableCellVertically(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                {
                    cells: [cells[0], cells[1]],
                    format: {},
                    height: 100,
                },
                {
                    cells: [cells[0], cells[1]],
                    format: {},
                    height: 100,
                },
                {
                    cells: [cells[2], cells[3]],
                    format: {},
                    height: 100,
                },
                {
                    cells: [cells[2], cells[3]],
                    format: {},
                    height: 100,
                },
            ],
            widths: [100, 100],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
        expect(cells[0].cachedElement).toBeUndefined();
        expect(cells[1].cachedElement).toBeUndefined();
        expect(cells[2].cachedElement).toBeUndefined();
        expect(cells[3].cachedElement).toBeUndefined();
    });

    it('split with min height', () => {
        const table = createTable(2);
        const cells = [
            createTableCell(false, false, false, { backgroundColor: '1' }),
            createTableCell(false, false, false, { backgroundColor: '2' }),
            createTableCell(false, false, false, { backgroundColor: '3' }),
            createTableCell(false, false, false, { backgroundColor: '4' }),
        ];

        table.rows[0].cells.push(cells[0], cells[1]);
        table.rows[1].cells.push(cells[2], cells[3]);
        table.widths = [100, 100];
        table.rows[0].height = 10;
        table.rows[1].height = 50;

        cells[0].isSelected = true;
        cells[1].isSelected = true;
        cells[2].isSelected = true;
        cells[3].isSelected = true;

        splitTableCellVertically(table);

        expect(table).toEqual({
            blockType: 'Table',
            format: {},
            rows: [
                { cells: [cells[0], cells[1]], format: {}, height: 22 },
                { cells: [cells[0], cells[1]], format: {}, height: 22 },
                { cells: [cells[2], cells[3]], format: {}, height: 25 },
                { cells: [cells[2], cells[3]], format: {}, height: 25 },
            ],
            widths: [100, 100],
            dataset: {},
            cachedElement: mockedCachedElement,
        });
        expect(cells[0].cachedElement).toBeUndefined();
        expect(cells[1].cachedElement).toBeUndefined();
        expect(cells[2].cachedElement).toBeUndefined();
        expect(cells[3].cachedElement).toBeUndefined();
    });

    it('keep background color', () => {
        const table = createTable(2);
        const cells = [
            createTableCell(false, false, false, { backgroundColor: '1' }),
            createTableCell(false, false, false, { backgroundColor: '2' }),
            createTableCell(false, false, false, { backgroundColor: '3' }),
            createTableCell(false, false, false, { backgroundColor: '4' }),
        ];

        cells[0].dataset = { editingInfo: '{"bgColorOverride":true}' };

        table.rows[0].cells.push(cells[0], cells[1]);
        table.rows[1].cells.push(cells[2], cells[3]);
        table.widths = [100, 100];
        table.rows[0].height = 200;
        table.rows[1].height = 200;

        cells[0].isSelected = true;

        splitTableCellVertically(table);

        expect(table.rows[1].cells[0].dataset).toEqual({ editingInfo: '{"bgColorOverride":true}' });
        expect(table.rows[1].cells[0].format).toEqual({ backgroundColor: '1' });
    });
});
