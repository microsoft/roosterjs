import * as normalizeTable from '../../../lib/modelApi/table/normalizeTable';
import setTableCellShade from '../../../lib/publicApi/table/setTableCellShade';
import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { IExperimentalContentModelEditor } from '../../../lib/publicTypes/IExperimentalContentModelEditor';

describe('setTableCellShade', () => {
    let editor: IExperimentalContentModelEditor;
    let setContentModel: jasmine.Spy<IExperimentalContentModelEditor['setContentModel']>;
    let createContentModel: jasmine.Spy<IExperimentalContentModelEditor['createContentModel']>;

    beforeEach(() => {
        setContentModel = jasmine.createSpy('setContentModel');
        createContentModel = jasmine.createSpy('createContentModel');

        spyOn(normalizeTable, 'normalizeTable');

        editor = ({
            focus: () => {},
            addUndoSnapshot: (callback: Function) => callback(),
            setContentModel,
            createContentModel,
        } as any) as IExperimentalContentModelEditor;
    });

    function runTest(table: ContentModelTable, expectedTable: ContentModelTable | null) {
        const model = createContentModelDocument();
        model.blocks.push(table);

        createContentModel.and.returnValue(model);

        setTableCellShade(editor, 'red');

        if (expectedTable) {
            expect(setContentModel).toHaveBeenCalledTimes(1);
            expect(setContentModel).toHaveBeenCalledWith({
                blockGroupType: 'Document',
                blocks: [expectedTable],
            });
        } else {
            expect(setContentModel).not.toHaveBeenCalled();
        }
    }
    it('Empty table', () => {
        runTest(
            {
                blockType: 'Table',
                cells: [],
                format: {},
                widths: [0],
                heights: [0],
                dataset: {},
            },
            null
        );
    });

    it('Table without selection', () => {
        runTest(
            {
                blockType: 'Table',
                cells: [
                    [
                        {
                            blockGroupType: 'TableCell',
                            blocks: [],
                            spanAbove: false,
                            spanLeft: false,
                            format: {},
                            dataset: {},
                        },
                    ],
                ],
                format: {},
                widths: [0],
                heights: [0],
                dataset: {},
            },
            null
        );
    });

    it('Table with table cell selection', () => {
        runTest(
            {
                blockType: 'Table',
                cells: [
                    [
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
                ],
                format: {},
                widths: [0],
                heights: [0],
                dataset: {},
            },
            {
                blockType: 'Table',
                cells: [
                    [
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
                ],
                format: {},
                widths: [0],
                heights: [0],
                dataset: {},
            }
        );
    });

    it('Table with table content selection', () => {
        runTest(
            {
                blockType: 'Table',
                cells: [
                    [
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
                ],
                format: {},
                widths: [0],
                heights: [0],
                dataset: {},
            },
            {
                blockType: 'Table',
                cells: [
                    [
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
                ],
                format: {},
                widths: [0],
                heights: [0],
                dataset: {},
            }
        );
    });

    it('Table with nested table', () => {
        runTest(
            {
                blockType: 'Table',
                cells: [
                    [
                        {
                            blockGroupType: 'TableCell',
                            blocks: [
                                {
                                    blockType: 'Table',
                                    format: {},
                                    cells: [
                                        [
                                            {
                                                blockGroupType: 'TableCell',
                                                spanAbove: false,
                                                spanLeft: false,
                                                format: {},
                                                blocks: [],
                                                dataset: {},
                                            },
                                        ],
                                    ],
                                    widths: [0],
                                    heights: [0],
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
                ],
                format: {},
                widths: [0],
                heights: [0],
                dataset: {},
            },
            {
                blockType: 'Table',
                cells: [
                    [
                        {
                            blockGroupType: 'TableCell',
                            blocks: [
                                {
                                    blockType: 'Table',
                                    format: {},
                                    cells: [
                                        [
                                            {
                                                blockGroupType: 'TableCell',
                                                spanAbove: false,
                                                spanLeft: false,
                                                format: {},
                                                blocks: [],
                                                dataset: {},
                                            },
                                        ],
                                    ],
                                    widths: [0],
                                    heights: [0],
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
                ],
                format: {},
                widths: [0],
                heights: [0],
                dataset: {},
            }
        );
    });
});
