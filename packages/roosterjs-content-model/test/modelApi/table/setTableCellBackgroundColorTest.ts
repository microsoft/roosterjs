import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { ContentModelSegmentType } from '../../../lib/publicTypes/enum/SegmentType';
import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { setTableCellBackgroundColor } from '../../../lib/modelApi/table/setTableCellBackgroundColor';

describe('setTableCellBackgroundColor', () => {
    it('Empty table', () => {
        const table: ContentModelTable = {
            blockType: ContentModelBlockType.Table,
            cells: [],
            format: {},
        };

        setTableCellBackgroundColor(table, 'red');

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            cells: [],
            format: {},
        });
    });

    it('Table without selection', () => {
        const table: ContentModelTable = {
            blockType: ContentModelBlockType.Table,
            cells: [
                [
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [],
                        spanAbove: false,
                        spanLeft: false,
                        format: {},
                    },
                ],
            ],
            format: {},
        };

        setTableCellBackgroundColor(table, 'red');

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            cells: [
                [
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [],
                        spanAbove: false,
                        spanLeft: false,
                        format: {},
                    },
                ],
            ],
            format: {},
        });
    });

    it('Table with table cell selection', () => {
        const table: ContentModelTable = {
            blockType: ContentModelBlockType.Table,
            cells: [
                [
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [],
                        spanAbove: false,
                        spanLeft: false,
                        format: {},
                    },
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [],
                        spanAbove: false,
                        spanLeft: false,
                        format: {},
                        isSelected: true,
                    },
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [],
                        spanAbove: false,
                        spanLeft: false,
                        format: {},
                        isSelected: true,
                    },
                ],
            ],
            format: {},
        };

        setTableCellBackgroundColor(table, 'red');

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            cells: [
                [
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [],
                        spanAbove: false,
                        spanLeft: false,
                        format: {},
                    },
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [],
                        spanAbove: false,
                        spanLeft: false,
                        format: {
                            backgroundColor: 'red',
                            metadata: { bgColorOverride: true },
                        },
                        isSelected: true,
                    },
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [],
                        spanAbove: false,
                        spanLeft: false,
                        format: {
                            backgroundColor: 'red',
                            metadata: { bgColorOverride: true },
                        },
                        isSelected: true,
                    },
                ],
            ],
            format: {},
        });
    });

    it('Table with table content selection', () => {
        const table: ContentModelTable = {
            blockType: ContentModelBlockType.Table,
            cells: [
                [
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [],
                        spanAbove: false,
                        spanLeft: false,
                        format: {},
                    },
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [
                            {
                                blockType: ContentModelBlockType.Paragraph,
                                segments: [
                                    {
                                        segmentType: ContentModelSegmentType.SelectionMarker,
                                        isSelected: true,
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
        };

        setTableCellBackgroundColor(table, 'red');

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            cells: [
                [
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [],
                        spanAbove: false,
                        spanLeft: false,
                        format: {},
                    },
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [
                            {
                                blockType: ContentModelBlockType.Paragraph,
                                segments: [
                                    {
                                        segmentType: ContentModelSegmentType.SelectionMarker,
                                        isSelected: true,
                                    },
                                ],
                            },
                        ],
                        spanAbove: false,
                        spanLeft: false,
                        format: {
                            backgroundColor: 'red',
                            metadata: { bgColorOverride: true },
                        },
                    },
                ],
            ],
            format: {},
        });
    });

    it('Table with nested table', () => {
        const table: ContentModelTable = {
            blockType: ContentModelBlockType.Table,
            cells: [
                [
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [
                            {
                                blockType: ContentModelBlockType.Table,
                                format: {},
                                cells: [
                                    [
                                        {
                                            blockType: ContentModelBlockType.BlockGroup,
                                            blockGroupType: ContentModelBlockGroupType.TableCell,
                                            spanAbove: false,
                                            spanLeft: false,
                                            format: {},
                                            blocks: [],
                                        },
                                    ],
                                ],
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
        };

        setTableCellBackgroundColor(table, 'red');

        expect(table).toEqual({
            blockType: ContentModelBlockType.Table,
            cells: [
                [
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [
                            {
                                blockType: ContentModelBlockType.Table,
                                format: {},
                                cells: [
                                    [
                                        {
                                            blockType: ContentModelBlockType.BlockGroup,
                                            blockGroupType: ContentModelBlockGroupType.TableCell,
                                            spanAbove: false,
                                            spanLeft: false,
                                            format: {},
                                            blocks: [],
                                        },
                                    ],
                                ],
                            },
                        ],
                        spanAbove: false,
                        spanLeft: false,
                        format: { backgroundColor: 'red', metadata: { bgColorOverride: true } },
                        isSelected: true,
                    },
                ],
            ],
            format: {},
        });
    });
});
