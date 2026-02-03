import { applyTableFormat } from '../../../lib/modelApi/editing/applyTableFormat';
import { TableBorderFormat } from '../../../lib/constants/TableBorderFormat';
import {
    ContentModelTable,
    ContentModelTableCell,
    ContentModelTableRow,
    ReadonlyContentModelTable,
    TableMetadataFormat,
} from 'roosterjs-content-model-types';

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
        const table: ReadonlyContentModelTable = createTable(3, 4);

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
                tableBorderFormat: TableBorderFormat.FirstColumnHeaderExternal,
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
                tableBorderFormat: TableBorderFormat.NoHeaderBorders,
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
                tableBorderFormat: TableBorderFormat.NoSideBorders,
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
                tableBorderFormat: TableBorderFormat.EspecialType1,
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
                tableBorderFormat: TableBorderFormat.EspecialType2,
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
                tableBorderFormat: TableBorderFormat.EspecialType3,
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
                tableBorderFormat: TableBorderFormat.Clear,
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

        applyTableFormat(table as ReadonlyContentModelTable, {
            bgColorEven: 'green',
        });

        expect(table.rows[0].cells[0].format.backgroundColor).toBe('green');
        expect(table.rows[0].cells[0].dataset.editingInfo).toBeUndefined();

        table.rows[0].cells[0].dataset.editingInfo = '{"bgColorOverride":true}';

        applyTableFormat(table as ReadonlyContentModelTable, {
            bgColorEven: 'blue',
        });

        expect(table.rows[0].cells[0].format.backgroundColor).toBe('blue');
        expect(table.rows[0].cells[0].dataset.editingInfo).toBe('{}');

        table.rows[0].cells[0].dataset.editingInfo = '{"bgColorOverride":true}';

        applyTableFormat(
            table as ReadonlyContentModelTable,
            {
                bgColorEven: 'yellow',
            },
            true
        );

        expect(table.rows[0].cells[0].format.backgroundColor).toBe('blue');
        expect(table.rows[0].cells[0].dataset.editingInfo).toBe('{"bgColorOverride":true}');
    });

    it('Has borderOverride', () => {
        const table = createTable(1, 1);
        table.rows[0].cells[0].format.borderLeft = '1px solid red';

        // Try to apply green
        applyTableFormat(table as ReadonlyContentModelTable, {
            topBorderColor: 'green',
        });

        // Should apply green
        expect(table.rows[0].cells[0].format.borderTop).toBe('1px solid green');
        expect(table.rows[0].cells[0].dataset.editingInfo).toBeUndefined();

        table.rows[0].cells[0].dataset.editingInfo = '{"borderOverride":true}';

        // Try to apply blue
        applyTableFormat(table as ReadonlyContentModelTable, {
            topBorderColor: 'blue',
        });

        // Should not apply blue
        expect(table.rows[0].cells[0].format.borderTop).toBe('1px solid green');
        expect(table.rows[0].cells[0].dataset.editingInfo).toBe('{"borderOverride":true}');
    });

    it('Adaptive text color', () => {
        const table = createTable(1, 1);

        const format: TableMetadataFormat = {
            topBorderColor: '#000000',
            bottomBorderColor: '#000000',
            verticalBorderColor: '#000000',
            hasHeaderRow: false,
            hasFirstColumn: false,
            hasBandedRows: false,
            hasBandedColumns: false,
            bgColorEven: null,
            bgColorOdd: '#00000020',
            headerRowColor: '#000000',
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: null,
        };

        // Try to apply default format black
        applyTableFormat(table as ReadonlyContentModelTable, format);

        //apply HeaderRowColor
        applyTableFormat(table as ReadonlyContentModelTable, { ...format, hasHeaderRow: true });

        //expect HeaderRowColor text color to be applied
        table.rows[0].cells[0].blocks.forEach(block => {
            if (block.blockType == 'Paragraph') {
                expect(block.segmentFormat?.textColor).toBe('#ffffff');
                block.segments.forEach(segment => {
                    expect(segment.format?.textColor).toBe('#ffffff');
                });
            }
        });
    });

    it(' Should not set adaptive text color', () => {
        const table = createTable(1, 1);
        table.rows[0].cells[0].blocks.forEach(block => {
            if (block.blockType == 'Paragraph') {
                block.segmentFormat = {
                    textColor: '#ABABAB',
                };
                block.segments.forEach(segment => {
                    segment.format = {
                        textColor: '#ABABAB',
                    };
                });
            }
        });

        const format: TableMetadataFormat = {
            topBorderColor: '#000000',
            bottomBorderColor: '#000000',
            verticalBorderColor: '#000000',
            hasHeaderRow: false,
            hasFirstColumn: false,
            hasBandedRows: false,
            hasBandedColumns: false,
            bgColorEven: null,
            bgColorOdd: '#00000020',
            headerRowColor: '#000000',
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: null,
        };

        // Try to apply default format black
        applyTableFormat(table as ReadonlyContentModelTable, format);

        //apply HeaderRowColor
        applyTableFormat(table as ReadonlyContentModelTable, { ...format, hasHeaderRow: true });

        //expect HeaderRowColor text color to be applied
        table.rows[0].cells[0].blocks.forEach(block => {
            if (block.blockType == 'Paragraph') {
                expect(block.segmentFormat?.textColor).toBe('#ABABAB');
                block.segments.forEach(segment => {
                    expect(segment.format?.textColor).toBe('#ABABAB');
                });
            }
        });
    });

    it('Remove adaptive text color', () => {
        const table = createTable(1, 1);

        const format: TableMetadataFormat = {
            topBorderColor: '#000000',
            bottomBorderColor: '#000000',
            verticalBorderColor: '#000000',
            hasHeaderRow: false,
            hasFirstColumn: false,
            hasBandedRows: false,
            hasBandedColumns: false,
            bgColorEven: null,
            bgColorOdd: '#00000020',
            headerRowColor: '#000000',
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: null,
        };

        // Try to apply default format black
        applyTableFormat(table as ReadonlyContentModelTable, format);

        //apply HeaderRowColor
        applyTableFormat(table as ReadonlyContentModelTable, { ...format, hasHeaderRow: true });

        //Toggle HeaderRowColor
        applyTableFormat(table as ReadonlyContentModelTable, { ...format, hasHeaderRow: false });

        //expect HeaderRowColor text color to be applied
        table.rows[0].cells[0].blocks.forEach(block => {
            if (block.blockType == 'Paragraph') {
                expect(block.segmentFormat?.textColor).toBe(undefined);
                block.segments.forEach(segment => {
                    expect(segment.format?.textColor).toBe(undefined);
                });
            }
        });
    });

    it('Apply first column', () => {
        const table = createTable(1, 1);

        const format: TableMetadataFormat = {
            topBorderColor: '#000000',
            bottomBorderColor: '#000000',
            verticalBorderColor: '#000000',
            hasHeaderRow: false,
            hasFirstColumn: true,
            hasBandedRows: false,
            hasBandedColumns: false,
            bgColorEven: null,
            bgColorOdd: '#00000020',
            headerRowColor: '#000000',
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: null,
        };

        // Try to apply default format black
        applyTableFormat(table as ReadonlyContentModelTable, format);

        //apply FirstColumn
        applyTableFormat(table as ReadonlyContentModelTable, { ...format, hasFirstColumn: true });

        table.rows.forEach(row => {
            row.cells.forEach((cell, index) => {
                if (index == 0) {
                    cell.blocks.forEach(block => {
                        if (block.blockType == 'Paragraph') {
                            block.segments.forEach(segment => {
                                expect(segment.format.fontWeight).toEqual('bold');
                            });
                        }
                    });
                }
            });
        });
    });

    it('Remove first column', () => {
        const table = createTable(1, 1);

        const format: TableMetadataFormat = {
            topBorderColor: '#000000',
            bottomBorderColor: '#000000',
            verticalBorderColor: '#000000',
            hasHeaderRow: false,
            hasFirstColumn: true,
            hasBandedRows: false,
            hasBandedColumns: false,
            bgColorEven: null,
            bgColorOdd: '#00000020',
            headerRowColor: '#000000',
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: null,
        };

        // Try to apply default format black
        applyTableFormat(table as ReadonlyContentModelTable, format);

        //apply FirstColumn
        applyTableFormat(table as ReadonlyContentModelTable, { ...format, hasFirstColumn: true });

        //apply FirstColumn
        applyTableFormat(table as ReadonlyContentModelTable, { ...format, hasFirstColumn: false });

        table.rows.forEach(row => {
            row.cells.forEach((cell, index) => {
                if (index == 0) {
                    cell.blocks.forEach(block => {
                        if (block.blockType == 'Paragraph') {
                            block.segments.forEach(segment => {
                                expect(segment.format.fontWeight).not.toEqual('bold');
                            });
                        }
                    });
                }
            });
        });
    });

    it('Apply format with segments with bold', () => {
        const table = createTable(1, 1);
        table.rows.forEach(row => {
            row.cells.forEach((cell, index) => {
                if (index == 0) {
                    cell.blocks.forEach(block => {
                        if (block.blockType == 'Paragraph') {
                            block.segments.forEach(segment => {
                                segment.format.fontWeight = 'bold';
                            });
                        }
                    });
                }
            });
        });

        const format: TableMetadataFormat = {
            topBorderColor: '#000000',
            bottomBorderColor: '#000000',
            verticalBorderColor: '#000000',
            hasHeaderRow: false,
            hasFirstColumn: true,
            hasBandedRows: false,
            hasBandedColumns: false,
            bgColorEven: null,
            bgColorOdd: '#00000020',
            headerRowColor: '#000000',
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: null,
        };

        // Try to apply default format black
        applyTableFormat(table as ReadonlyContentModelTable, format);

        table.rows.forEach(row => {
            row.cells.forEach((cell, index) => {
                if (index == 0) {
                    cell.blocks.forEach(block => {
                        if (block.blockType == 'Paragraph') {
                            block.segments.forEach(segment => {
                                expect(segment.format.fontWeight).toEqual('bold');
                            });
                        }
                    });
                }
            });
        });
    });
});
