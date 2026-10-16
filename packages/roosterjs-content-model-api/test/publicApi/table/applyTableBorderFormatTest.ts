import * as normalizeTable from 'roosterjs-content-model-dom/lib/modelApi/editing/normalizeTable';
import { applyTableBorderFormat } from '../../../lib/publicApi/table/applyTableBorderFormat';
import { createContentModelDocument } from 'roosterjs-content-model-dom';
import { createTable, createTableCell } from 'roosterjs-content-model-dom';
import { IEditor } from 'roosterjs-content-model-types';
import {
    Border,
    BorderOperations,
    ContentModelTable,
    ContentModelTableCell,
    ContentModelFormatter,
    FormatContentModelOptions,
} from 'roosterjs-content-model-types';

describe('applyTableBorderFormat', () => {
    let editor: IEditor;
    const width = '3px';
    const style = 'double';
    const color = '#AABBCC';
    const testBorder: Border = { width: width, style: style, color: color };
    const testBorderString = `${width} ${style} ${color}`;

    function createTestTable(
        rows: number,
        columns: number,
        format?: ContentModelTableCell['format']
    ) {
        // Create a table with all cells selected except the first and last row and column
        const table: ContentModelTable = createTable(rows);
        for (let i = 0; i < rows; i++) {
            const row = table.rows[i];
            for (let j = 0; j < columns; j++) {
                const cell = createTableCell(false, false, false, format);
                if (i != 0 && j != 0 && i != rows - 1 && j != columns - 1) {
                    cell.isSelected = true;
                }
                row.cells.push(cell);
            }
        }
        return table;
    }

    beforeEach(() => {
        spyOn(normalizeTable, 'normalizeTable');

        editor = ({} as any) as IEditor;
        editor.getDocument = () => document;
    });

    function runTest(
        table: ContentModelTable,
        expectedTable: ContentModelTable,
        border: Border,
        operation: BorderOperations
    ) {
        const model = createContentModelDocument();
        model.blocks.push(table);

        let formatResult: boolean | undefined;

        const formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                formatResult = callback(model, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                });
            });

        editor.formatContentModel = formatContentModel;

        applyTableBorderFormat(editor, border, operation);

        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBeTrue();
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [expectedTable],
        });
    }
    describe('toggle borders', () => {
        const operations: BorderOperations[] = [
            'allBorders',
            'outsideBorders',
            'insideBorders',
            'topBorders',
            'bottomBorders',
            'leftBorders',
            'rightBorders',
        ];
        const positions = ['borderTop', 'borderBottom', 'borderLeft', 'borderRight'] as const;
        const originalBorder = '1px solid red';

        function applyToTable(
            table: ContentModelTable,
            operation: BorderOperations,
            border: Border = testBorder
        ) {
            const model = createContentModelDocument();
            model.blocks.push(table);
            editor.formatContentModel = jasmine
                .createSpy('formatContentModel')
                .and.callFake((callback: ContentModelFormatter) =>
                    callback(model, { newEntities: [], deletedEntities: [], newImages: [] })
                );
            applyTableBorderFormat(editor, border, operation);
        }

        function copyTable(table: ContentModelTable): ContentModelTable {
            return JSON.parse(JSON.stringify(table));
        }

        operations.forEach(operation => {
            [false, true].forEach(isRtl => {
                // Single cell, row, column, and grids with and without inner cells.
                [
                    [3, 3],
                    [3, 5],
                    [5, 3],
                    [4, 4],
                    [4, 5],
                    [5, 5],
                ].forEach(([rows, columns]) => {
                    it(`${operation}, ${rows - 2}x${
                        columns - 2
                    }, RTL=${isRtl}: toggle off and on`, () => {
                        const table = createTestTable(rows, columns, {
                            borderTop: originalBorder,
                            borderBottom: originalBorder,
                            borderLeft: originalBorder,
                            borderRight: originalBorder,
                        });
                        table.format.direction = isRtl ? 'rtl' : 'ltr';
                        applyToTable(table, operation);

                        const appliedTable = copyTable(table);
                        const clearedTable = copyTable(table);

                        clearedTable.rows.forEach(row =>
                            row.cells.forEach(cell =>
                                positions.forEach(pos => {
                                    if (cell.format[pos] == testBorderString) {
                                        cell.format[pos] = '';
                                    }
                                })
                            )
                        );

                        // Untargeted borders and metadata must stay unchanged, while shared
                        // borders on cells outside the selection must also be cleared.
                        runTest(table, clearedTable, testBorder, operation);
                        runTest(table, appliedTable, testBorder, operation);
                    });
                });
            });

            it(`${operation}: apply to the whole selection when one targeted border differs`, () => {
                const table = createTestTable(5, 5);
                applyToTable(table, operation);
                const expectedTable = copyTable(table);
                const cell =
                    table.rows[operation == 'bottomBorders' ? 3 : 1].cells[
                        operation == 'rightBorders' ? 3 : 1
                    ];
                const position = positions.filter(pos => cell.format[pos] == testBorderString)[0];

                expect(position).toBeDefined();
                cell.format[position] = originalBorder;
                runTest(table, expectedTable, testBorder, operation);
            });
        });

        it('ignores adjacent unselected cells when deciding whether to remove borders', () => {
            const table = createTestTable(3, 3, { borderTop: testBorderString });
            const expectedTable = copyTable(table);
            expectedTable.rows[1].cells[1].format.borderTop = '';
            expectedTable.rows[0].cells[1].format.borderBottom = '';
            expectedTable.rows[1].cells[1].dataset.editingInfo = '{"borderOverride":true}';
            expectedTable.rows[0].cells[1].dataset.editingInfo = '{"borderOverride":true}';

            runTest(table, expectedTable, testBorder, 'topBorders');
        });

        it('matches borders with equivalent hex and RGB colors', () => {
            const table = createTestTable(3, 3);
            applyToTable(table, 'outsideBorders');
            const expectedTable = copyTable(table);

            table.rows.forEach((row, rowIndex) =>
                row.cells.forEach((cell, colIndex) =>
                    positions.forEach(pos => {
                        if (cell.format[pos] == testBorderString) {
                            cell.format[pos] = '3px double rgb(170, 187, 204)';
                            expectedTable.rows[rowIndex].cells[colIndex].format[pos] = '';
                        }
                    })
                )
            );

            runTest(table, expectedTable, testBorder, 'outsideBorders');
        });

        it('does not access the document when all targeted borders match exactly', () => {
            const table = createTestTable(5, 5);
            applyToTable(table, 'allBorders');
            const getDocument = spyOn(editor, 'getDocument').and.callThrough();

            applyToTable(table, 'allBorders');

            expect(getDocument).not.toHaveBeenCalled();
            expect(table.rows[1].cells[1].format.borderTop).toBe('');
        });

        it('matches repeated equivalent borders', () => {
            const rgbBorder = '3px double rgb(170, 187, 204)';
            const table = createTestTable(5, 5, {
                borderTop: rgbBorder,
                borderBottom: rgbBorder,
                borderLeft: rgbBorder,
                borderRight: rgbBorder,
            });

            applyToTable(table, 'allBorders');

            expect(table.rows[1].cells[1].format.borderTop).toBe('');
            expect(table.rows[3].cells[3].format.borderBottom).toBe('');
        });

        it('stops comparing at the first mismatch', () => {
            const table = createTestTable(5, 5, { borderTop: originalBorder });

            applyToTable(table, 'allBorders');

            expect(table.rows[3].cells[3].format.borderBottom).toBe(testBorderString);
        });

        it('uses table border defaults when toggling', () => {
            const table = createTestTable(3, 3);
            table.format.borderTop = testBorderString;
            applyToTable(table, 'topBorders', {});
            const expectedTable = copyTable(table);
            expectedTable.rows[1].cells[1].format.borderTop = '';
            expectedTable.rows[0].cells[1].format.borderBottom = '';

            runTest(table, expectedTable, {}, 'topBorders');
        });

        it('noBorders keeps borders removed when applied repeatedly', () => {
            const table = createTestTable(4, 4);
            applyToTable(table, 'noBorders');
            runTest(table, copyTable(table), testBorder, 'noBorders');
        });
    });

    it('All Borders', () => {
        runTest(
            createTestTable(4, 4),
            {
                blockType: 'Table',
                dataset: {},
                format: {},
                rows: [
                    {
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                dataset: {},
                                format: {},
                                isHeader: false,
                                spanAbove: false,
                                spanLeft: false,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                format: {
                                    borderBottom: testBorderString,
                                },
                                isHeader: false,
                                spanAbove: false,
                                spanLeft: false,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                format: {
                                    borderBottom: testBorderString,
                                },
                                isHeader: false,
                                spanAbove: false,
                                spanLeft: false,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                dataset: {},
                                format: {},
                                isHeader: false,
                                spanAbove: false,
                                spanLeft: false,
                            },
                        ],
                        format: {},
                        height: 0,
                    },
                    {
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                format: {
                                    borderRight: testBorderString,
                                },
                                isHeader: false,
                                spanAbove: false,
                                spanLeft: false,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                format: {
                                    borderBottom: testBorderString,
                                    borderLeft: testBorderString,
                                    borderRight: testBorderString,
                                    borderTop: testBorderString,
                                },
                                isHeader: false,
                                isSelected: true,
                                spanAbove: false,
                                spanLeft: false,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                format: {
                                    borderBottom: testBorderString,
                                    borderLeft: testBorderString,
                                    borderRight: testBorderString,
                                    borderTop: testBorderString,
                                },
                                isHeader: false,
                                isSelected: true,
                                spanAbove: false,
                                spanLeft: false,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                format: {
                                    borderLeft: testBorderString,
                                },
                                isHeader: false,
                                spanAbove: false,
                                spanLeft: false,
                            },
                        ],
                        format: {},
                        height: 0,
                    },
                    {
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                format: {
                                    borderRight: testBorderString,
                                },
                                isHeader: false,
                                spanAbove: false,
                                spanLeft: false,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                format: {
                                    borderBottom: testBorderString,
                                    borderLeft: testBorderString,
                                    borderRight: testBorderString,
                                    borderTop: testBorderString,
                                },
                                isHeader: false,
                                isSelected: true,
                                spanAbove: false,
                                spanLeft: false,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                format: {
                                    borderBottom: testBorderString,
                                    borderLeft: testBorderString,
                                    borderRight: testBorderString,
                                    borderTop: testBorderString,
                                },
                                isHeader: false,
                                isSelected: true,
                                spanAbove: false,
                                spanLeft: false,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                format: {
                                    borderLeft: testBorderString,
                                },
                                isHeader: false,
                                spanAbove: false,
                                spanLeft: false,
                            },
                        ],
                        format: {},
                        height: 0,
                    },
                    {
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                dataset: {},
                                format: {},
                                isHeader: false,
                                spanAbove: false,
                                spanLeft: false,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                format: {
                                    borderTop: testBorderString,
                                },
                                isHeader: false,
                                spanAbove: false,
                                spanLeft: false,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                format: {
                                    borderTop: testBorderString,
                                },
                                isHeader: false,
                                spanAbove: false,
                                spanLeft: false,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                dataset: {},
                                format: {},
                                isHeader: false,
                                spanAbove: false,
                                spanLeft: false,
                            },
                        ],
                        format: {},
                        height: 0,
                    },
                ],
                widths: [],
            },
            testBorder,
            'allBorders'
        );
    });
    it('No Borders', () => {
        runTest(
            createTestTable(4, 4, {
                borderTop: testBorderString,
                borderBottom: testBorderString,
                borderLeft: testBorderString,
                borderRight: testBorderString,
            }),
            {
                blockType: 'Table',
                rows: [
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: testBorderString,
                                    borderBottom: testBorderString,
                                    borderLeft: testBorderString,
                                    borderRight: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: testBorderString,
                                    borderBottom: '',
                                    borderLeft: testBorderString,
                                    borderRight: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: testBorderString,
                                    borderBottom: '',
                                    borderLeft: testBorderString,
                                    borderRight: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: testBorderString,
                                    borderBottom: testBorderString,
                                    borderLeft: testBorderString,
                                    borderRight: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: testBorderString,
                                    borderBottom: testBorderString,
                                    borderLeft: testBorderString,
                                    borderRight: '',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: '',
                                    borderBottom: '',
                                    borderLeft: '',
                                    borderRight: '',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: '',
                                    borderBottom: '',
                                    borderLeft: '',
                                    borderRight: '',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: testBorderString,
                                    borderBottom: testBorderString,
                                    borderLeft: '',
                                    borderRight: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: testBorderString,
                                    borderBottom: testBorderString,
                                    borderLeft: testBorderString,
                                    borderRight: '',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: '',
                                    borderBottom: '',
                                    borderLeft: '',
                                    borderRight: '',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: '',
                                    borderBottom: '',
                                    borderLeft: '',
                                    borderRight: '',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: testBorderString,
                                    borderBottom: testBorderString,
                                    borderLeft: '',
                                    borderRight: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: testBorderString,
                                    borderBottom: testBorderString,
                                    borderLeft: testBorderString,
                                    borderRight: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: '',
                                    borderBottom: testBorderString,
                                    borderLeft: testBorderString,
                                    borderRight: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: '',
                                    borderBottom: testBorderString,
                                    borderLeft: testBorderString,
                                    borderRight: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: testBorderString,
                                    borderBottom: testBorderString,
                                    borderLeft: testBorderString,
                                    borderRight: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {},
                widths: [],
                dataset: {},
            },
            testBorder,
            'noBorders'
        );
    });
    it('Top Borders', () => {
        runTest(
            createTestTable(3, 3),
            {
                blockType: 'Table',
                rows: [
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderBottom: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {},
                widths: [],
                dataset: {},
            },
            testBorder,
            'topBorders'
        );
    });
    it('Bottom Borders', () => {
        runTest(
            createTestTable(3, 3),
            {
                blockType: 'Table',
                rows: [
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderBottom: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {},
                widths: [],
                dataset: {},
            },
            testBorder,
            'bottomBorders'
        );
    });
    it('Left Borders', () => {
        runTest(
            createTestTable(3, 3),
            {
                blockType: 'Table',
                rows: [
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderRight: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderLeft: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {},
                widths: [],
                dataset: {},
            },
            testBorder,
            'leftBorders'
        );
    });
    it('Right Borders', () => {
        runTest(
            createTestTable(3, 3),
            {
                blockType: 'Table',
                rows: [
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderRight: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderLeft: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {},
                widths: [],
                dataset: {},
            },
            testBorder,
            'rightBorders'
        );
    });
    it('Outside Borders', () => {
        runTest(
            createTestTable(4, 4),
            {
                blockType: 'Table',
                rows: [
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderBottom: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderBottom: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderRight: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderLeft: testBorderString,
                                    borderTop: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderRight: testBorderString,
                                    borderTop: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderLeft: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderRight: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderLeft: testBorderString,
                                    borderBottom: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderRight: testBorderString,
                                    borderBottom: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderLeft: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {},
                widths: [],
                dataset: {},
            },
            testBorder,
            'outsideBorders'
        );
    });
    it('Inside Borders', () => {
        runTest(
            createTestTable(4, 4),
            {
                blockType: 'Table',
                rows: [
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderBottom: testBorderString,
                                    borderRight: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderBottom: testBorderString,
                                    borderLeft: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: testBorderString,
                                    borderRight: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    borderTop: testBorderString,
                                    borderLeft: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {},
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {},
                widths: [],
                dataset: {},
            },
            testBorder,
            'insideBorders'
        );
    });

    it('RTL - Right Borders', () => {
        const testTable = createTestTable(3, 3, { direction: 'rtl' });
        testTable.format.direction = 'rtl';
        runTest(
            testTable,
            {
                blockType: 'Table',
                rows: [
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    direction: 'rtl',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    direction: 'rtl',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    direction: 'rtl',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    direction: 'rtl',
                                    borderLeft: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    direction: 'rtl',

                                    borderRight: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    direction: 'rtl',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    direction: 'rtl',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    direction: 'rtl',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    direction: 'rtl',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {
                    direction: 'rtl',
                },
                widths: [],
                dataset: {},
            },
            testBorder,
            'rightBorders'
        );
    });
    it('RTL - Left Borders', () => {
        const testTable = createTestTable(3, 3, { direction: 'rtl' });
        testTable.format.direction = 'rtl';
        runTest(
            testTable,
            {
                blockType: 'Table',
                rows: [
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    direction: 'rtl',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    direction: 'rtl',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    direction: 'rtl',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    direction: 'rtl',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    direction: 'rtl',

                                    borderLeft: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    direction: 'rtl',
                                    borderRight: testBorderString,
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {
                                    editingInfo: '{"borderOverride":true}',
                                },
                            },
                        ],
                    },
                    {
                        height: 0,
                        format: {},
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    direction: 'rtl',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    direction: 'rtl',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                format: {
                                    direction: 'rtl',
                                },
                                spanLeft: false,
                                spanAbove: false,
                                isHeader: false,
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {
                    direction: 'rtl',
                },
                widths: [],
                dataset: {},
            },
            testBorder,
            'leftBorders'
        );
    });
});
