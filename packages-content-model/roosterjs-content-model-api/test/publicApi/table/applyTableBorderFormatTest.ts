import * as normalizeTable from 'roosterjs-content-model-core/lib/publicApi/table/normalizeTable';
import applyTableBorderFormat from '../../../lib/publicApi/table/applyTableBorderFormat';
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
        const table = createTable(rows);
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
