import { applyTableFormat } from '../../../lib/modelApi/table/applyTableFormat';
import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { ContentModelTableCell } from '../../../lib/publicTypes/group/ContentModelTableCell';
import { ContentModelTableRow } from '../../../lib/publicTypes/block/ContentModelTableRow';
import { TableBorderFormat } from 'roosterjs-editor-types';
import { TableMetadataFormat } from '../../../lib/publicTypes/format/formatParts/TableMetadataFormat';

describe('applyTableFormat', () => {
    function createCell(): ContentModelTableCell {
        return {
            blockGroupType: 'TableCell',
            blocks: [],
            isHeader: false,
            spanAbove: false,
            spanLeft: false,
            format: {},
            dataset: {},
            cachedElement: {} as any,
        };
    }

    function createRow(count: number): ContentModelTableRow {
        const row: ContentModelTableRow = { format: {}, height: 0, cells: [] };

        for (let i = 0; i < count; i++) {
            row.cells.push(createCell());
        }

        return row;
    }

    function createRows(row: number, column: number): ContentModelTableRow[] {
        const rows: ContentModelTableRow[] = [];

        for (let i = 0; i < row; i++) {
            rows.push(createRow(column));
        }

        return rows;
    }

    function createTable(row: number, column: number): ContentModelTable {
        return {
            blockType: 'Table',
            rows: createRows(row, column),
            format: {},
            widths: [0],
            dataset: {},
            cachedElement: {} as any,
        };
    }

    function runTest(
        format: TableMetadataFormat | undefined,
        exportedBackgroundColors: string[][],
        expectedBorders: string[][][]
    ) {
        const table = createTable(3, 4);

        applyTableFormat(table, format);

        expect(table.cachedElement).toBeUndefined();

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 4; col++) {
                const cell = table.rows[row].cells[col];
                expect(cell.format.backgroundColor).toBe(
                    exportedBackgroundColors[row][col],
                    `BackgroundColor Row=${row} Col=${col}`
                );

                const { borderTop, borderRight, borderLeft, borderBottom } = cell.format;
                const borders = expectedBorders[row][col];

                expect(borderTop).toBe(borders[0]);
                expect(borderRight).toBe(borders[1]);
                expect(borderBottom).toBe(borders[2]);
                expect(borderLeft).toBe(borders[3]);

                expect(cell.cachedElement).toBeUndefined();
            }
        }
    }

    it('Empty format', () => {
        const B = '1px solid #ABABAB';
        const U = (undefined as any) as string;
        runTest(
            undefined,
            [
                [U, U, U, U],
                [U, U, U, U],
                [U, U, U, U],
            ],
            [
                [
                    [B, B, B, B],
                    [B, B, B, B],
                    [B, B, B, B],
                    [B, B, B, B],
                ],
                [
                    [B, B, B, B],
                    [B, B, B, B],
                    [B, B, B, B],
                    [B, B, B, B],
                ],
                [
                    [B, B, B, B],
                    [B, B, B, B],
                    [B, B, B, B],
                    [B, B, B, B],
                ],
            ]
        );
    });

    it('FIRST_COLUMN_HEADER_EXTERNAL', () => {
        const BorderColor = '#ABABAB';
        const B = '1px solid ' + BorderColor;
        const TC = 'transparent';
        const T = '1px none';

        runTest(
            {
                topBorderColor: BorderColor,
                bottomBorderColor: BorderColor,
                verticalBorderColor: BorderColor,
                hasBandedRows: false,
                bgColorEven: TC,
                bgColorOdd: TC,
                hasBandedColumns: false,
                hasHeaderRow: false,
                headerRowColor: null,
                hasFirstColumn: false,
                tableBorderFormat: TableBorderFormat.FIRST_COLUMN_HEADER_EXTERNAL,
            },
            [
                [TC, TC, TC, TC],
                [TC, TC, TC, TC],
                [TC, TC, TC, TC],
            ],
            [
                [
                    [B, T, B, B],
                    [B, T, B, T],
                    [B, T, B, T],
                    [B, B, B, T],
                ],
                [
                    [T, B, T, B],
                    [T, T, T, T],
                    [T, T, T, T],
                    [T, B, T, T],
                ],
                [
                    [T, B, B, B],
                    [T, T, B, T],
                    [T, T, B, T],
                    [T, B, B, T],
                ],
            ]
        );
    });

    it('NO_HEADER_BORDERS', () => {
        const BorderColor = '#ABABAB';
        const B = '1px solid ' + BorderColor;
        const TC = 'transparent';
        const T = '1px none';

        runTest(
            {
                topBorderColor: BorderColor,
                bottomBorderColor: BorderColor,
                verticalBorderColor: BorderColor,
                hasBandedRows: false,
                bgColorEven: TC,
                bgColorOdd: TC,
                hasBandedColumns: false,
                hasHeaderRow: false,
                headerRowColor: null,
                hasFirstColumn: false,
                tableBorderFormat: TableBorderFormat.NO_HEADER_BORDERS,
            },
            [
                [TC, TC, TC, TC],
                [TC, TC, TC, TC],
                [TC, TC, TC, TC],
            ],
            [
                [
                    [T, T, B, T],
                    [T, T, B, T],
                    [T, T, B, T],
                    [T, T, B, T],
                ],
                [
                    [B, B, B, T],
                    [B, B, B, B],
                    [B, B, B, B],
                    [B, T, B, B],
                ],
                [
                    [B, B, B, T],
                    [B, B, B, B],
                    [B, B, B, B],
                    [B, T, B, B],
                ],
            ]
        );
    });

    it('NO_SIDE_BORDERS', () => {
        const BC = '#ABABAB';
        const BC2 = '#ABABAB20';
        const B = '1px solid ' + BC;
        const TC = 'transparent';
        const T = '1px none';

        runTest(
            {
                topBorderColor: BC,
                bottomBorderColor: BC,
                verticalBorderColor: BC,
                hasBandedRows: true,
                bgColorEven: TC,
                bgColorOdd: BC2,
                hasBandedColumns: false,
                hasHeaderRow: false,
                headerRowColor: null,
                hasFirstColumn: false,
                tableBorderFormat: TableBorderFormat.NO_SIDE_BORDERS,
            },
            [
                [TC, TC, TC, TC],
                [BC2, BC2, BC2, BC2],
                [TC, TC, TC, TC],
            ],
            [
                [
                    [B, B, B, T],
                    [B, B, B, B],
                    [B, B, B, B],
                    [B, T, B, B],
                ],
                [
                    [B, B, B, T],
                    [B, B, B, B],
                    [B, B, B, B],
                    [B, T, B, B],
                ],
                [
                    [B, B, B, T],
                    [B, B, B, B],
                    [B, B, B, B],
                    [B, T, B, B],
                ],
            ]
        );
    });

    it('ESPECIAL_TYPE_1', () => {
        const BorderColor = '#ABABAB';
        const B = '1px solid ' + BorderColor;
        const TC = 'transparent';
        const T = '1px none';

        runTest(
            {
                topBorderColor: BorderColor,
                bottomBorderColor: BorderColor,
                verticalBorderColor: BorderColor,
                hasBandedRows: false,
                bgColorEven: TC,
                bgColorOdd: TC,
                hasBandedColumns: false,
                hasHeaderRow: false,
                headerRowColor: null,
                hasFirstColumn: false,
                tableBorderFormat: TableBorderFormat.ESPECIAL_TYPE_1,
            },
            [
                [TC, TC, TC, TC],
                [TC, TC, TC, TC],
                [TC, TC, TC, TC],
            ],
            [
                [
                    [B, T, B, B],
                    [B, T, B, T],
                    [B, T, B, T],
                    [B, T, B, T],
                ],
                [
                    [T, B, T, B],
                    [B, B, B, B],
                    [B, B, B, B],
                    [B, B, B, B],
                ],
                [
                    [T, B, T, B],
                    [B, B, B, B],
                    [B, B, B, B],
                    [B, B, B, B],
                ],
            ]
        );
    });

    it('ESPECIAL_TYPE_2', () => {
        const BorderColor = '#ABABAB';
        const B = '1px solid ' + BorderColor;
        const TC = 'transparent';
        const T = '1px none';

        runTest(
            {
                topBorderColor: BorderColor,
                bottomBorderColor: BorderColor,
                verticalBorderColor: BorderColor,
                hasBandedRows: false,
                bgColorEven: TC,
                bgColorOdd: TC,
                hasBandedColumns: false,
                hasHeaderRow: false,
                headerRowColor: null,
                hasFirstColumn: false,
                tableBorderFormat: TableBorderFormat.ESPECIAL_TYPE_2,
            },
            [
                [TC, TC, TC, TC],
                [TC, TC, TC, TC],
                [TC, TC, TC, TC],
            ],
            [
                [
                    [B, T, B, B],
                    [B, T, B, T],
                    [B, T, B, T],
                    [B, T, B, T],
                ],
                [
                    [T, B, T, B],
                    [T, T, T, T],
                    [T, T, T, T],
                    [T, T, T, T],
                ],
                [
                    [T, B, T, B],
                    [T, T, T, T],
                    [T, T, T, T],
                    [T, T, T, T],
                ],
            ]
        );
    });

    it('ESPECIAL_TYPE_3', () => {
        const BorderColor = '#ABABAB';
        const B = '1px solid ' + BorderColor;
        const TC = 'transparent';
        const T = '1px none';

        runTest(
            {
                topBorderColor: BorderColor,
                bottomBorderColor: BorderColor,
                verticalBorderColor: BorderColor,
                hasBandedRows: false,
                bgColorEven: TC,
                bgColorOdd: TC,
                hasBandedColumns: false,
                hasHeaderRow: false,
                headerRowColor: null,
                hasFirstColumn: false,
                tableBorderFormat: TableBorderFormat.ESPECIAL_TYPE_3,
            },
            [
                [TC, TC, TC, TC],
                [TC, TC, TC, TC],
                [TC, TC, TC, TC],
            ],
            [
                [
                    [T, T, B, T],
                    [T, T, B, T],
                    [T, T, B, T],
                    [T, T, B, T],
                ],
                [
                    [T, B, T, T],
                    [T, T, T, T],
                    [T, T, T, T],
                    [T, T, T, T],
                ],
                [
                    [T, B, T, T],
                    [T, T, T, T],
                    [T, T, T, T],
                    [T, T, T, T],
                ],
            ]
        );
    });

    it('CLEAR', () => {
        const BorderColor = '#ABABAB';
        const TC = 'transparent';
        const T = '1px none';

        runTest(
            {
                topBorderColor: BorderColor,
                bottomBorderColor: BorderColor,
                verticalBorderColor: BorderColor,
                hasBandedRows: false,
                bgColorEven: TC,
                bgColorOdd: TC,
                hasBandedColumns: false,
                hasHeaderRow: false,
                headerRowColor: null,
                hasFirstColumn: false,
                tableBorderFormat: TableBorderFormat.CLEAR,
            },
            [
                [TC, TC, TC, TC],
                [TC, TC, TC, TC],
                [TC, TC, TC, TC],
            ],
            [
                [
                    [T, T, T, T],
                    [T, T, T, T],
                    [T, T, T, T],
                    [T, T, T, T],
                ],
                [
                    [T, T, T, T],
                    [T, T, T, T],
                    [T, T, T, T],
                    [T, T, T, T],
                ],
                [
                    [T, T, T, T],
                    [T, T, T, T],
                    [T, T, T, T],
                    [T, T, T, T],
                ],
            ]
        );
    });

    it('Has bgColorOverride', () => {
        const table = createTable(1, 1);
        table.rows[0].cells[0].format.backgroundColor = 'red';

        applyTableFormat(table, {
            bgColorEven: 'green',
        });

        expect(table.rows[0].cells[0].format.backgroundColor).toBe('green');
        expect(table.rows[0].cells[0].dataset.editingInfo).toBeUndefined();

        table.rows[0].cells[0].dataset.editingInfo = '{"bgColorOverride":true}';

        applyTableFormat(table, {
            bgColorEven: 'blue',
        });

        expect(table.rows[0].cells[0].format.backgroundColor).toBe('blue');
        expect(table.rows[0].cells[0].dataset.editingInfo).toBe('{}');

        table.rows[0].cells[0].dataset.editingInfo = '{"bgColorOverride":true}';

        applyTableFormat(
            table,
            {
                bgColorEven: 'yellow',
            },
            true
        );

        expect(table.rows[0].cells[0].format.backgroundColor).toBe('blue');
        expect(table.rows[0].cells[0].dataset.editingInfo).toBe('{"bgColorOverride":true}');
    });
});
