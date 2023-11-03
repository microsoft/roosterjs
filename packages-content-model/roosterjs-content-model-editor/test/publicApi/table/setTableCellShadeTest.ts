import * as normalizeTable from '../../../lib/modelApi/table/normalizeTable';
import setTableCellShade from '../../../lib/publicApi/table/setTableCellShade';
import { ContentModelTable } from 'roosterjs-content-model-types';
import { createContentModelDocument } from 'roosterjs-content-model-dom';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import {
    ContentModelFormatter,
    FormatWithContentModelOptions,
} from '../../../lib/publicTypes/parameter/FormatWithContentModelContext';

describe('setTableCellShade', () => {
    let editor: IContentModelEditor;

    beforeEach(() => {
        spyOn(normalizeTable, 'normalizeTable');

        editor = ({
            focus: () => {},
        } as any) as IContentModelEditor;
    });

    function runTest(
        table: ContentModelTable,
        expectedTable: ContentModelTable | null,
        colorValue: string | null = 'red'
    ) {
        const model = createContentModelDocument();
        model.blocks.push(table);

        let formatResult: boolean | undefined;

        const formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
                    formatResult = callback(model, {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                    });
                }
            );

        editor.formatContentModel = formatContentModel;

        setTableCellShade(editor, colorValue);

        expect(formatContentModel).toHaveBeenCalledTimes(1);
        expect(formatResult).toBe(!!expectedTable);

        if (expectedTable) {
            expect(model).toEqual({
                blockGroupType: 'Document',
                blocks: [expectedTable],
            });
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
