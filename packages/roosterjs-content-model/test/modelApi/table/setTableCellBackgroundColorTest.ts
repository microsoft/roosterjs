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
        };

        setTableCellBackgroundColor(table, 'red');

        expect(table).toEqual({
            blockType: 'Table',
            cells: [],
            format: {},
            widths: [0],
            heights: [0],
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
                    },
                ],
            ],
            format: {},
            widths: [0],
            heights: [0],
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
                    },
                ],
            ],
            format: {},
            widths: [0],
            heights: [0],
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [],
                        spanAbove: false,
                        spanLeft: false,
                        format: {},
                        isSelected: true,
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [],
                        spanAbove: false,
                        spanLeft: false,
                        format: {},
                        isSelected: true,
                    },
                ],
            ],
            format: {},
            widths: [0],
            heights: [0],
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
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [],
                        spanAbove: false,
                        spanLeft: false,
                        format: {
                            backgroundColor: 'red',
                            bgColorOverride: true,
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
                            bgColorOverride: true,
                        },
                        isSelected: true,
                    },
                ],
            ],
            format: {},
            widths: [0],
            heights: [0],
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
                            },
                        ],
                        spanAbove: false,
                        spanLeft: false,
                        format: {},
                    },
                ],
            ],
            format: {},
            widths: [0],
            heights: [0],
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
                            },
                        ],
                        spanAbove: false,
                        spanLeft: false,
                        format: {
                            backgroundColor: 'red',
                            bgColorOverride: true,
                        },
                    },
                ],
            ],
            format: {},
            widths: [0],
            heights: [0],
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
                                        },
                                    ],
                                ],
                                widths: [0],
                                heights: [0],
                            },
                        ],
                        spanAbove: false,
                        spanLeft: false,
                        format: {},
                        isSelected: true,
                    },
                ],
            ],
            format: {},
            widths: [0],
            heights: [0],
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
                                        },
                                    ],
                                ],
                                widths: [0],
                                heights: [0],
                            },
                        ],
                        spanAbove: false,
                        spanLeft: false,
                        format: { backgroundColor: 'red', bgColorOverride: true },
                        isSelected: true,
                    },
                ],
            ],
            format: {},
            widths: [0],
            heights: [0],
        });
    });
});
