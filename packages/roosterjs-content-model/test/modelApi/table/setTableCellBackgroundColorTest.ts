import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { setTableCellBackgroundColor } from '../../../lib/modelApi/table/setTableCellBackgroundColor';

describe('setTableCellBackgroundColor', () => {
    it('Empty table', () => {
        const table: ContentModelTable = {
            blockType: 'Table',
            cells: [],
            format: {},
            widths: [0],
            heights: [0],
            dataset: {},
        };

        setTableCellBackgroundColor(table, 'red');

        expect(table).toEqual({
            blockType: 'Table',
            cells: [],
            format: {},
            widths: [0],
            heights: [0],
            dataset: {},
        });
    });

    it('Table without selection', () => {
        const table: ContentModelTable = {
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
        };

        setTableCellBackgroundColor(table, 'red');

        expect(table).toEqual({
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
        });
    });

    it('Table with table cell selection', () => {
        const table: ContentModelTable = {
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
        };

        setTableCellBackgroundColor(table, 'red');

        expect(table).toEqual({
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
        });
    });

    it('Table with table content selection', () => {
        const table: ContentModelTable = {
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
        };

        setTableCellBackgroundColor(table, 'red');

        expect(table).toEqual({
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
        });
    });

    it('Table with nested table', () => {
        const table: ContentModelTable = {
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
        };

        setTableCellBackgroundColor(table, 'red');

        expect(table).toEqual({
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
                        format: { backgroundColor: 'red' },
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
        });
    });
});
