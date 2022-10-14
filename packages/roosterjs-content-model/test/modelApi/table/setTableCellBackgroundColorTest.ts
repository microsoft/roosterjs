import { createTableCell } from '../../../lib/modelApi/creators/createTableCell';
import { setTableCellBackgroundColor } from '../../../lib/modelApi/table/setTableCellBackgroundColor';

describe('setTableCellBackgroundColor', () => {
    it('Set to null', () => {
        const cell = createTableCell(1, 1, false, {
            backgroundColor: 'red',
        });

        setTableCellBackgroundColor(cell, null);

        expect(cell).toEqual({
            blockGroupType: 'TableCell',
            format: {},
            isHeader: false,
            spanAbove: false,
            spanLeft: false,
            dataset: {},
            blocks: [],
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

        setTableCellBackgroundColor(cell, '#ffffff');

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

        setTableCellBackgroundColor(cell, '#ffffff', true);

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
                                format: {},
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

        setTableCellBackgroundColor(cell, '#000000');

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
                                format: {},
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

        setTableCellBackgroundColor(cell, 'rgb(0,0,0)');

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
