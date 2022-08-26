import { applyTableFormat } from '../../../lib/modelApi/table/applyTableFormat';
import { combineBorderValue } from '../../../lib/domUtils/borderValues';
import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { ContentModelTableCell } from '../../../lib/publicTypes/block/group/ContentModelTableCell';
import { TableBorderFormat } from 'roosterjs-editor-types';
import { TableMetadataFormat } from '../../../lib/publicTypes/format/formatParts/TableMetadataFormat';

const T = 'transparent';

describe('applyTableFormat', () => {
    function createCell(): ContentModelTableCell {
        return {
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.TableCell,
            blocks: [],
            isHeader: false,
            spanAbove: false,
            spanLeft: false,
            format: {},
        };
    }

    function createRow(count: number): ContentModelTableCell[] {
        const cells: ContentModelTableCell[] = [];

        for (let i = 0; i < count; i++) {
            cells.push(createCell());
        }

        return cells;
    }

    function createCells(row: number, column: number): ContentModelTableCell[][] {
        const cells: ContentModelTableCell[][] = [];

        for (let i = 0; i < row; i++) {
            cells.push(createRow(column));
        }

        return cells;
    }

    function createTable(row: number, column: number): ContentModelTable {
        return {
            blockType: ContentModelBlockType.Table,
            cells: createCells(row, column),
            format: {},
            widths: [0],
            heights: [0],
        };
    }

    function runTest(
        format: TableMetadataFormat | undefined,
        exportedBackgroundColors: string[][],
        expectedBorderColors: string[][][]
    ) {
        const table = createTable(3, 4);

        applyTableFormat(table, format);

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 4; col++) {
                expect(table.cells[row][col].format.backgroundColor).toBe(
                    exportedBackgroundColors[row][col],
                    `BackgroundColor Row=${row} Col=${col}`
                );

                expect(table.cells[row][col].format.borderColor).toEqual(
                    combineBorderValue(expectedBorderColors[row][col], ''),
                    `BorderColor Row=${row} Col=${col}`
                );
            }
        }
    }

    it('Empty format', () => {
        const B = '#ABABAB';
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
        const B = '#ABABAB';
        runTest(
            {
                topBorderColor: B,
                bottomBorderColor: B,
                verticalBorderColor: B,
                hasBandedRows: false,
                bgColorEven: T,
                bgColorOdd: T,
                hasBandedColumns: false,
                hasHeaderRow: false,
                headerRowColor: null,
                hasFirstColumn: false,
                tableBorderFormat: TableBorderFormat.FIRST_COLUMN_HEADER_EXTERNAL,
            },
            [
                [T, T, T, T],
                [T, T, T, T],
                [T, T, T, T],
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
        const B = '#ABABAB';
        runTest(
            {
                topBorderColor: B,
                bottomBorderColor: B,
                verticalBorderColor: B,
                hasBandedRows: false,
                bgColorEven: T,
                bgColorOdd: T,
                hasBandedColumns: false,
                hasHeaderRow: false,
                headerRowColor: null,
                hasFirstColumn: false,
                tableBorderFormat: TableBorderFormat.NO_HEADER_BORDERS,
            },
            [
                [T, T, T, T],
                [T, T, T, T],
                [T, T, T, T],
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
        const B = '#ABABAB';
        const B2 = '#ABABAB20';
        runTest(
            {
                topBorderColor: B,
                bottomBorderColor: B,
                verticalBorderColor: B,
                hasBandedRows: true,
                bgColorEven: T,
                bgColorOdd: B2,
                hasBandedColumns: false,
                hasHeaderRow: false,
                headerRowColor: null,
                hasFirstColumn: false,
                tableBorderFormat: TableBorderFormat.NO_SIDE_BORDERS,
            },
            [
                [T, T, T, T],
                [B2, B2, B2, B2],
                [T, T, T, T],
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
        const B = '#ABABAB';
        runTest(
            {
                topBorderColor: B,
                bottomBorderColor: B,
                verticalBorderColor: B,
                hasBandedRows: false,
                bgColorEven: T,
                bgColorOdd: T,
                hasBandedColumns: false,
                hasHeaderRow: false,
                headerRowColor: null,
                hasFirstColumn: false,
                tableBorderFormat: TableBorderFormat.ESPECIAL_TYPE_1,
            },
            [
                [T, T, T, T],
                [T, T, T, T],
                [T, T, T, T],
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
        const B = '#ABABAB';
        runTest(
            {
                topBorderColor: B,
                bottomBorderColor: B,
                verticalBorderColor: B,
                hasBandedRows: false,
                bgColorEven: T,
                bgColorOdd: T,
                hasBandedColumns: false,
                hasHeaderRow: false,
                headerRowColor: null,
                hasFirstColumn: false,
                tableBorderFormat: TableBorderFormat.ESPECIAL_TYPE_2,
            },
            [
                [T, T, T, T],
                [T, T, T, T],
                [T, T, T, T],
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
        const B = '#ABABAB';
        runTest(
            {
                topBorderColor: B,
                bottomBorderColor: B,
                verticalBorderColor: B,
                hasBandedRows: false,
                bgColorEven: T,
                bgColorOdd: T,
                hasBandedColumns: false,
                hasHeaderRow: false,
                headerRowColor: null,
                hasFirstColumn: false,
                tableBorderFormat: TableBorderFormat.ESPECIAL_TYPE_3,
            },
            [
                [T, T, T, T],
                [T, T, T, T],
                [T, T, T, T],
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
        const B = '#ABABAB';
        runTest(
            {
                topBorderColor: B,
                bottomBorderColor: B,
                verticalBorderColor: B,
                hasBandedRows: false,
                bgColorEven: T,
                bgColorOdd: T,
                hasBandedColumns: false,
                hasHeaderRow: false,
                headerRowColor: null,
                hasFirstColumn: false,
                tableBorderFormat: TableBorderFormat.CLEAR,
            },
            [
                [T, T, T, T],
                [T, T, T, T],
                [T, T, T, T],
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
});
