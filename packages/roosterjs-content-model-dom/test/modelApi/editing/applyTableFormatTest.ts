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
                [BC2, BC2, BC2, BC2],
                [TC, TC, TC, TC],
                [BC2, BC2, BC2, BC2],
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

    it('Apply headerRowCustomStyles', () => {
        const table = createTable(2, 2);

        const format: TableMetadataFormat = {
            topBorderColor: '#000000',
            bottomBorderColor: '#000000',
            verticalBorderColor: '#000000',
            hasHeaderRow: true,
            hasFirstColumn: false,
            hasBandedRows: false,
            hasBandedColumns: false,
            bgColorEven: null,
            bgColorOdd: '#00000020',
            headerRowColor: '#000000',
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: null,
            headerRowCustomStyles: {
                fontWeight: 'normal',
                italic: true,
                textAlign: 'center',
                borderBottomColor: 'red',
            },
        };

        applyTableFormat(table as ReadonlyContentModelTable, format);

        // Check header row cells have custom styles applied
        table.rows[0].cells.forEach(cell => {
            expect(cell.format.fontWeight).toBe('normal');
            expect(cell.format.textAlign).toBe('center');
            expect(cell.format.borderBottom).toBe('1px solid red');
            cell.blocks.forEach(block => {
                if (block.blockType == 'Paragraph') {
                    block.segments.forEach(segment => {
                        expect(segment.format.italic).toBe(true);
                    });
                }
            });
        });

        // Check non-header row cells don't have custom styles
        table.rows[1].cells.forEach(cell => {
            expect(cell.format.fontWeight).not.toBe('normal');
            expect(cell.format.textAlign).not.toBe('center');
        });
    });

    it('Apply firstColumnCustomStyles', () => {
        const table = createTable(2, 2);

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
            firstColumnCustomStyles: {
                fontWeight: 'bold',
                italic: true,
                textAlign: 'end',
                borderRightColor: 'blue',
                backgroundColor: 'lightgray',
            },
        };

        applyTableFormat(table as ReadonlyContentModelTable, format);

        // Check first column cells have custom styles applied
        table.rows.forEach(row => {
            const firstCell = row.cells[0];
            expect(firstCell.format.textAlign).toBe('end');
            expect(firstCell.format.borderRight).toBe('1px solid blue');
            expect(firstCell.format.backgroundColor).toBe('lightgray');
            firstCell.blocks.forEach(block => {
                if (block.blockType == 'Paragraph') {
                    block.segments.forEach(segment => {
                        expect(segment.format.fontWeight).toBe('bold');
                        expect(segment.format.italic).toBe(true);
                    });
                }
            });
        });

        // Check non-first column cells don't have custom styles
        table.rows.forEach(row => {
            const secondCell = row.cells[1];
            expect(secondCell.format.textAlign).not.toBe('end');
            expect(secondCell.format.backgroundColor).not.toBe('lightgray');
        });
    });

    it('Apply both headerRowCustomStyles and firstColumnCustomStyles', () => {
        const table = createTable(2, 2);

        const format: TableMetadataFormat = {
            topBorderColor: '#000000',
            bottomBorderColor: '#000000',
            verticalBorderColor: '#000000',
            hasHeaderRow: true,
            hasFirstColumn: true,
            hasBandedRows: false,
            hasBandedColumns: false,
            bgColorEven: null,
            bgColorOdd: '#00000020',
            headerRowColor: '#000000',
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: null,
            headerRowCustomStyles: {
                fontWeight: 'bold',
                textAlign: 'center',
            },
            firstColumnCustomStyles: {
                fontWeight: 'bold',
                textAlign: 'end',
                backgroundColor: 'lightblue',
            },
        };

        applyTableFormat(table as ReadonlyContentModelTable, format);

        // Check header row (row 0) has header styles
        expect(table.rows[0].cells[0].isHeader).toBe(true);
        expect(table.rows[0].cells[1].isHeader).toBe(true);
        expect(table.rows[0].cells[0].format.fontWeight).toBe('bold');
        expect(table.rows[0].cells[1].format.fontWeight).toBe('bold');

        // Check first column cells have first column styles
        expect(table.rows[0].cells[0].format.backgroundColor).toBe('#000000');
        expect(table.rows[1].cells[0].format.backgroundColor).toBe('lightblue');
        expect(table.rows[1].cells[0].format.textAlign).toBe('end');
    });

    it('Remove headerRowCustomStyles when hasHeaderRow is false', () => {
        const table = createTable(2, 2);

        const formatWithHeader: TableMetadataFormat = {
            topBorderColor: '#000000',
            bottomBorderColor: '#000000',
            verticalBorderColor: '#000000',
            hasHeaderRow: true,
            hasFirstColumn: false,
            hasBandedRows: false,
            hasBandedColumns: false,
            bgColorEven: null,
            bgColorOdd: '#00000020',
            headerRowColor: '#000000',
            tableBorderFormat: TableBorderFormat.Default,
            verticalAlign: null,
            headerRowCustomStyles: {
                fontWeight: 'bold',
                italic: true,
            },
        };

        applyTableFormat(table as ReadonlyContentModelTable, formatWithHeader);

        // Verify header row has custom styles
        expect(table.rows[0].cells[0].format.fontWeight).toBe('bold');
        expect(table.rows[0].cells[0].isHeader).toBe(true);

        // Now apply format without header row
        const formatWithoutHeader: TableMetadataFormat = {
            ...formatWithHeader,
            hasHeaderRow: false,
        };

        applyTableFormat(table as ReadonlyContentModelTable, formatWithoutHeader);

        // Verify header styles are removed
        expect(table.rows[0].cells[0].isHeader).toBe(false);
    });

    it('Remove firstColumnCustomStyles when hasFirstColumn is false', () => {
        const table = createTable(2, 2);

        const formatWithFirstColumn: TableMetadataFormat = {
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
            firstColumnCustomStyles: {
                fontWeight: 'bold',
                textAlign: 'start',
            },
        };

        applyTableFormat(table as ReadonlyContentModelTable, formatWithFirstColumn);

        // Verify first column has custom styles
        expect(table.rows[0].cells[0].format.textAlign).toBe('start');
        table.rows[0].cells[0].blocks.forEach(block => {
            if (block.blockType == 'Paragraph') {
                block.segments.forEach(segment => {
                    expect(segment.format.fontWeight).toBe('bold');
                });
            }
        });

        // Now apply format without first column
        const formatWithoutFirstColumn: TableMetadataFormat = {
            ...formatWithFirstColumn,
            hasFirstColumn: false,
        };

        applyTableFormat(table as ReadonlyContentModelTable, formatWithoutFirstColumn);

        // Verify first column styles are removed
        table.rows[0].cells[0].blocks.forEach(block => {
            if (block.blockType == 'Paragraph') {
                block.segments.forEach(segment => {
                    expect(segment.format.fontWeight).not.toBe('bold');
                });
            }
        });
    });

    describe('Banded rows and columns background color logic', () => {
        it('should apply bgColorOdd to odd rows when hasBandedRows is true (no header)', () => {
            const table = createTable(4, 2);
            const bgColorOdd = '#FF0000';
            const bgColorEven = '#00FF00';

            applyTableFormat(table as ReadonlyContentModelTable, {
                topBorderColor: '#ABABAB',
                bottomBorderColor: '#ABABAB',
                verticalBorderColor: '#ABABAB',
                hasHeaderRow: false,
                hasFirstColumn: false,
                hasBandedRows: true,
                hasBandedColumns: false,
                bgColorEven: bgColorEven,
                bgColorOdd: bgColorOdd,
                headerRowColor: '#ABABAB',
                tableBorderFormat: TableBorderFormat.Default,
                verticalAlign: null,
            });

            // With hasHeaderRow: false, bandedRowMod = 1
            // Row 0: rowIndex % 2 != 1 => 0 != 1 => true => bgColorOdd
            // Row 1: rowIndex % 2 != 1 => 0 != 1 => false => bgColorEven
            // Row 2: rowIndex % 2 != 1 => 0 != 1 => true => bgColorOdd
            // Row 3: rowIndex % 2 != 1 => 1 != 1 => false => bgColorEven
            expect(table.rows[0].cells[0].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[0].cells[1].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[1].cells[0].format.backgroundColor).toBe(bgColorEven);
            expect(table.rows[1].cells[1].format.backgroundColor).toBe(bgColorEven);
            expect(table.rows[2].cells[0].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[2].cells[1].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[3].cells[0].format.backgroundColor).toBe(bgColorEven);
            expect(table.rows[3].cells[1].format.backgroundColor).toBe(bgColorEven);
        });

        it('should apply bgColorOdd starting from row 1 when hasBandedRows and hasHeaderRow are true', () => {
            const table = createTable(4, 2);
            const bgColorOdd = '#FF0000';
            const bgColorEven = '#00FF00';

            applyTableFormat(table as ReadonlyContentModelTable, {
                topBorderColor: '#ABABAB',
                bottomBorderColor: '#ABABAB',
                verticalBorderColor: '#ABABAB',
                hasHeaderRow: true,
                hasFirstColumn: false,
                hasBandedRows: true,
                hasBandedColumns: false,
                bgColorEven: bgColorEven,
                bgColorOdd: bgColorOdd,
                headerRowColor: '#ABABAB',
                tableBorderFormat: TableBorderFormat.Default,
                verticalAlign: null,
            });

            // With hasHeaderRow: true, bandedRowMod = 0
            // Row 0: is header row, gets headerRowColor (#ABABAB)
            // Row 1: rowIndex % 2 != 0 => 1 != 0 => true => bgColorOdd
            // Row 2: rowIndex % 2 != 0 => 0 != 0 => false => bgColorEven
            // Row 3: rowIndex % 2 != 0 => 1 != 0 => true => bgColorOdd
            expect(table.rows[0].cells[0].format.backgroundColor).toBe('#ABABAB'); // header row
            expect(table.rows[1].cells[0].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[1].cells[1].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[2].cells[0].format.backgroundColor).toBe(bgColorEven);
            expect(table.rows[2].cells[1].format.backgroundColor).toBe(bgColorEven);
            expect(table.rows[3].cells[0].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[3].cells[1].format.backgroundColor).toBe(bgColorOdd);
        });

        it('should apply bgColorOdd to odd columns when hasBandedColumns is true (no first column)', () => {
            const table = createTable(2, 4);
            const bgColorOdd = '#FF0000';
            const bgColorEven = '#00FF00';

            applyTableFormat(table as ReadonlyContentModelTable, {
                topBorderColor: '#ABABAB',
                bottomBorderColor: '#ABABAB',
                verticalBorderColor: '#ABABAB',
                hasHeaderRow: false,
                hasFirstColumn: false,
                hasBandedRows: false,
                hasBandedColumns: true,
                bgColorEven: bgColorEven,
                bgColorOdd: bgColorOdd,
                headerRowColor: '#ABABAB',
                tableBorderFormat: TableBorderFormat.Default,
                verticalAlign: null,
            });

            // With hasFirstColumn: false, bandedColumnMod = 1
            // Col 0: colIndex % 2 != 1 => 0 != 1 => true => bgColorOdd
            // Col 1: colIndex % 2 != 1 => 1 != 1 => false => bgColorEven
            // Col 2: colIndex % 2 != 1 => 0 != 1 => true => bgColorOdd
            // Col 3: colIndex % 2 != 1 => 1 != 1 => false => bgColorEven
            expect(table.rows[0].cells[0].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[0].cells[1].format.backgroundColor).toBe(bgColorEven);
            expect(table.rows[0].cells[2].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[0].cells[3].format.backgroundColor).toBe(bgColorEven);
            expect(table.rows[1].cells[0].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[1].cells[1].format.backgroundColor).toBe(bgColorEven);
            expect(table.rows[1].cells[2].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[1].cells[3].format.backgroundColor).toBe(bgColorEven);
        });

        it('should apply bgColorOdd starting from col 1 when hasBandedColumns and hasFirstColumn are true', () => {
            const table = createTable(2, 4);
            const bgColorOdd = '#FF0000';
            const bgColorEven = '#00FF00';

            applyTableFormat(table as ReadonlyContentModelTable, {
                topBorderColor: '#ABABAB',
                bottomBorderColor: '#ABABAB',
                verticalBorderColor: '#ABABAB',
                hasHeaderRow: false,
                hasFirstColumn: true,
                hasBandedRows: false,
                hasBandedColumns: true,
                bgColorEven: bgColorEven,
                bgColorOdd: bgColorOdd,
                headerRowColor: '#ABABAB',
                tableBorderFormat: TableBorderFormat.Default,
                verticalAlign: null,
            });

            // With hasFirstColumn: true, bandedColumnMod = 0
            // Col 0: colIndex % 2 != 0 => 0 != 0 => false => bgColorEven
            // Col 1: colIndex % 2 != 0 => 1 != 0 => true => bgColorOdd
            // Col 2: colIndex % 2 != 0 => 0 != 0 => false => bgColorEven
            // Col 3: colIndex % 2 != 0 => 1 != 0 => true => bgColorOdd
            expect(table.rows[0].cells[0].format.backgroundColor).toBe(bgColorEven);
            expect(table.rows[0].cells[1].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[0].cells[2].format.backgroundColor).toBe(bgColorEven);
            expect(table.rows[0].cells[3].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[1].cells[0].format.backgroundColor).toBe(bgColorEven);
            expect(table.rows[1].cells[1].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[1].cells[2].format.backgroundColor).toBe(bgColorEven);
            expect(table.rows[1].cells[3].format.backgroundColor).toBe(bgColorOdd);
        });

        it('should combine banded rows and columns (bgColorOdd if either condition is true)', () => {
            const table = createTable(3, 3);
            const bgColorOdd = '#FF0000';
            const bgColorEven = '#00FF00';

            applyTableFormat(table as ReadonlyContentModelTable, {
                topBorderColor: '#ABABAB',
                bottomBorderColor: '#ABABAB',
                verticalBorderColor: '#ABABAB',
                hasHeaderRow: false,
                hasFirstColumn: false,
                hasBandedRows: true,
                hasBandedColumns: true,
                bgColorEven: bgColorEven,
                bgColorOdd: bgColorOdd,
                headerRowColor: '#ABABAB',
                tableBorderFormat: TableBorderFormat.Default,
                verticalAlign: null,
            });

            // With hasHeaderRow: false, bandedRowMod = 1
            // With hasFirstColumn: false, bandedColumnMod = 1
            // Cell gets bgColorOdd if (colIndex % 2 != 1) OR (rowIndex % 2 != 1)
            //
            // Row 0: rowIndex % 2 != 1 => true
            //   Col 0: (0 % 2 != 1) || true => true => bgColorOdd
            //   Col 1: (1 % 2 != 1) || true => true => bgColorOdd
            //   Col 2: (0 % 2 != 1) || true => true => bgColorOdd
            // Row 1: rowIndex % 2 != 1 => false
            //   Col 0: true || false => true => bgColorOdd
            //   Col 1: false || false => false => bgColorEven
            //   Col 2: true || false => true => bgColorOdd
            // Row 2: rowIndex % 2 != 1 => true
            //   Col 0: true || true => true => bgColorOdd
            //   Col 1: false || true => true => bgColorOdd
            //   Col 2: true || true => true => bgColorOdd
            expect(table.rows[0].cells[0].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[0].cells[1].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[0].cells[2].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[1].cells[0].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[1].cells[1].format.backgroundColor).toBe(bgColorEven);
            expect(table.rows[1].cells[2].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[2].cells[0].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[2].cells[1].format.backgroundColor).toBe(bgColorOdd);
            expect(table.rows[2].cells[2].format.backgroundColor).toBe(bgColorOdd);
        });

        it('should use bgColorEven as default when neither banded rows nor columns', () => {
            const table = createTable(2, 2);
            const bgColorOdd = '#FF0000';
            const bgColorEven = '#00FF00';

            applyTableFormat(table as ReadonlyContentModelTable, {
                topBorderColor: '#ABABAB',
                bottomBorderColor: '#ABABAB',
                verticalBorderColor: '#ABABAB',
                hasHeaderRow: false,
                hasFirstColumn: false,
                hasBandedRows: false,
                hasBandedColumns: false,
                bgColorEven: bgColorEven,
                bgColorOdd: bgColorOdd,
                headerRowColor: '#ABABAB',
                tableBorderFormat: TableBorderFormat.Default,
                verticalAlign: null,
            });

            // When hasBandedRows and hasBandedColumns are both false, bgColorEven is used
            expect(table.rows[0].cells[0].format.backgroundColor).toBe(bgColorEven);
            expect(table.rows[0].cells[1].format.backgroundColor).toBe(bgColorEven);
            expect(table.rows[1].cells[0].format.backgroundColor).toBe(bgColorEven);
            expect(table.rows[1].cells[1].format.backgroundColor).toBe(bgColorEven);
        });
    });
});
