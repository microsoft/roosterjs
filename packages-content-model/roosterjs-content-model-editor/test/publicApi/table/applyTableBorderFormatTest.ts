import * as normalizeTable from '../../../lib/modelApi/table/normalizeTable';
import applyTableBorderFormat from '../../../lib/publicApi/table/applyTableBorderFormat';
import { Border } from '../../../lib/publicTypes/interface/Border';
import { BorderOperations } from '../../../lib/publicTypes/enum/BorderOperations';
import { ContentModelTable, ContentModelTableCell } from 'roosterjs-content-model-types';
import { createContentModelDocument } from 'roosterjs-content-model-dom';
import { createTable, createTableCell } from 'roosterjs-content-model-dom';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('applyTableBorderFormat', () => {
    let editor: IContentModelEditor;
    let setContentModel: jasmine.Spy<IContentModelEditor['setContentModel']>;
    let createContentModel: jasmine.Spy<IContentModelEditor['createContentModel']>;
    let triggerPluginEvent: jasmine.Spy;
    let getVisibleViewport: jasmine.Spy;
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
        setContentModel = jasmine.createSpy('setContentModel');
        createContentModel = jasmine.createSpy('createContentModel');
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        getVisibleViewport = jasmine.createSpy('getVisibleViewport');

        spyOn(normalizeTable, 'normalizeTable');

        editor = ({
            focus: () => {},
            addUndoSnapshot: (callback: Function) => callback(),
            setContentModel,
            createContentModel,
            isDarkMode: () => false,
            triggerPluginEvent,
            getVisibleViewport,
        } as any) as IContentModelEditor;
    });

    function runTest(
        table: ContentModelTable,
        expectedTable: ContentModelTable | null,
        border: Border,
        operation: BorderOperations
    ) {
        const model = createContentModelDocument();
        model.blocks.push(table);

        createContentModel.and.returnValue(model);

        applyTableBorderFormat(editor, border, operation);

        console.log('>>', operation, table);
        if (expectedTable) {
            expect(setContentModel).toHaveBeenCalledTimes(1);
            expect(setContentModel).toHaveBeenCalledWith(
                {
                    blockGroupType: 'Document',
                    blocks: [expectedTable],
                },
                undefined,
                undefined
            );
        } else {
            expect(setContentModel).not.toHaveBeenCalled();
        }
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
            'AllBorders'
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
            'NoBorders'
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
            'TopBorders'
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
            'BottomBorders'
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
            'LeftBorders'
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
            'RightBorders'
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
            'OutsideBorders'
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
            'InsideBorders'
        );
    });
});
