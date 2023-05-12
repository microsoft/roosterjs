import * as normalizeTable from '../../../lib/modelApi/table/normalizeTable';
import setTableCellShade from '../../../lib/publicApi/table/setTableCellShade';
import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('setTableCellShade', () => {
    let editor: IContentModelEditor;
    let setContentModel: jasmine.Spy<IContentModelEditor['setContentModel']>;
    let createContentModel: jasmine.Spy<IContentModelEditor['createContentModel']>;

    beforeEach(() => {
        setContentModel = jasmine.createSpy('setContentModel');
        createContentModel = jasmine.createSpy('createContentModel');

        spyOn(normalizeTable, 'normalizeTable');

        editor = ({
            focus: () => {},
            addUndoSnapshot: (callback: Function) => callback(),
            setContentModel,
            createContentModel,
        } as any) as IContentModelEditor;
    });

    function runTest(
        table: ContentModelTable,
        expectedTable: ContentModelTable | null,
        colorValue: string | null = 'red'
    ) {
        const model = createContentModelDocument();
        model.blocks.push(table);

        createContentModel.and.returnValue(model);

        setTableCellShade(editor, colorValue);

        if (expectedTable) {
            expect(setContentModel).toHaveBeenCalledTimes(1);
            expect(setContentModel).toHaveBeenCalledWith(
                {
                    blockGroupType: 'Document',
                    blocks: [expectedTable],
                },
                { onNodeCreated: undefined }
            );
        } else {
            expect(setContentModel).not.toHaveBeenCalled();
        }
    }
    it('Empty table', () => {
        runTest(
            {
                blockType: 'Table',
                rows: [],
                format: {},
                widths: [0],
                dataset: {},
            },
            null
        );
    });

    it('Table without selection', () => {
        runTest(
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {},
                widths: [0],
                dataset: {},
            },
            null
        );
    });

    it('Table with table cell selection', () => {
        runTest(
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                isSelected: true,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                isSelected: true,
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {},
                widths: [0],
                dataset: {},
            },
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {
                                    backgroundColor: 'red',
                                    textColor: '#000000',
                                },
                                dataset: {
                                    editingInfo: '{"bgColorOverride":true}',
                                },
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {
                                    backgroundColor: 'red',
                                    textColor: '#000000',
                                },
                                dataset: {
                                    editingInfo: '{"bgColorOverride":true}',
                                },
                                isSelected: true,
                            },
                        ],
                    },
                ],
                format: {},
                widths: [0],
                dataset: {},
            }
        );
    });

    it('Table with table content selection', () => {
        runTest(
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [
                                            {
                                                segmentType: 'SelectionMarker',
                                                isSelected: true,
                                                format: {},
                                            },
                                        ],
                                        format: {},
                                    },
                                ],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {},
                widths: [0],
                dataset: {},
            },
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [
                                    {
                                        blockType: 'Paragraph',
                                        segments: [
                                            {
                                                segmentType: 'SelectionMarker',
                                                isSelected: true,
                                                format: {},
                                            },
                                        ],
                                        format: {},
                                    },
                                ],
                                spanAbove: false,
                                spanLeft: false,
                                format: {
                                    backgroundColor: 'red',
                                    textColor: '#000000',
                                },
                                dataset: {
                                    editingInfo: '{"bgColorOverride":true}',
                                },
                            },
                        ],
                    },
                ],
                format: {},
                widths: [0],
                dataset: {},
            }
        );
    });

    it('Table with nested table', () => {
        runTest(
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [
                                    {
                                        blockType: 'Table',
                                        format: {},
                                        rows: [
                                            {
                                                format: {},
                                                height: 0,
                                                cells: [
                                                    {
                                                        blockGroupType: 'TableCell',
                                                        spanAbove: false,
                                                        spanLeft: false,
                                                        format: {},
                                                        blocks: [],
                                                        dataset: {},
                                                    },
                                                ],
                                            },
                                        ],
                                        widths: [0],
                                        dataset: {},
                                    },
                                ],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                isSelected: true,
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {},
                widths: [0],
                dataset: {},
            },
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [
                                    {
                                        blockType: 'Table',
                                        format: {},
                                        rows: [
                                            {
                                                format: {},
                                                height: 0,
                                                cells: [
                                                    {
                                                        blockGroupType: 'TableCell',
                                                        spanAbove: false,
                                                        spanLeft: false,
                                                        format: {},
                                                        blocks: [],
                                                        dataset: {},
                                                    },
                                                ],
                                            },
                                        ],
                                        widths: [0],
                                        dataset: {},
                                    },
                                ],
                                spanAbove: false,
                                spanLeft: false,
                                format: {
                                    backgroundColor: 'red',
                                    textColor: '#000000',
                                },
                                isSelected: true,
                                dataset: {
                                    editingInfo: '{"bgColorOverride":true}',
                                },
                            },
                        ],
                    },
                ],
                format: {},
                widths: [0],
                dataset: {},
            }
        );
    });

    it('Set to no color', () => {
        runTest(
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {
                                    backgroundColor: 'red',
                                    textColor: 'green',
                                    direction: 'rtl',
                                },
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {
                                    backgroundColor: 'red',
                                    textColor: 'green',
                                    direction: 'rtl',
                                },
                                dataset: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
                format: {},
                widths: [0],
                dataset: {},
            },
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {
                                    backgroundColor: 'red',
                                    textColor: 'green',
                                    direction: 'rtl',
                                },
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: { direction: 'rtl' },
                                dataset: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
                format: {},
                widths: [0],
                dataset: {},
            },
            null
        );
    });
});
