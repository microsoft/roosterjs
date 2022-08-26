import { ContentModelBlock } from '../../../lib/publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroupType } from '../../../lib/publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../../lib/publicTypes/enum/BlockType';
import { ContentModelSegmentType } from '../../../lib/publicTypes/enum/SegmentType';
import { hasSelectionInBlock } from '../../../lib/modelApi/selection/hasSelectionInBlock';

describe('hasSelectionInBlock', () => {
    it('Empty paragraph block', () => {
        const block: ContentModelBlock = {
            blockType: ContentModelBlockType.Paragraph,
            segments: [],
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeFalse();
    });

    it('Paragraph block with selected segment', () => {
        const block: ContentModelBlock = {
            blockType: ContentModelBlockType.Paragraph,
            segments: [
                {
                    segmentType: ContentModelSegmentType.Br,
                },
                {
                    segmentType: ContentModelSegmentType.Br,
                    isSelected: true,
                },
            ],
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeTrue();
    });

    it('Empty table', () => {
        const block: ContentModelBlock = {
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [],
            widths: [],
            heights: [],
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeFalse();
    });

    it('Table without selection', () => {
        const block: ContentModelBlock = {
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [],
                        format: {},
                        spanAbove: false,
                        spanLeft: false,
                    },
                ],
            ],
            widths: [],
            heights: [],
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeFalse();
    });

    it('Table with selected cell', () => {
        const block: ContentModelBlock = {
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [],
                        format: {},
                        spanAbove: false,
                        spanLeft: false,
                    },
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [],
                        format: {},
                        spanAbove: false,
                        spanLeft: false,
                        isSelected: true,
                    },
                ],
            ],
            widths: [],
            heights: [],
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeTrue();
    });

    it('Table with selected content', () => {
        const block: ContentModelBlock = {
            blockType: ContentModelBlockType.Table,
            format: {},
            cells: [
                [
                    {
                        blockType: ContentModelBlockType.BlockGroup,
                        blockGroupType: ContentModelBlockGroupType.TableCell,
                        blocks: [
                            {
                                blockType: ContentModelBlockType.Paragraph,
                                segments: [
                                    {
                                        segmentType: ContentModelSegmentType.Br,
                                        isSelected: true,
                                    },
                                ],
                            },
                        ],
                        format: {},
                        spanAbove: false,
                        spanLeft: false,
                    },
                ],
            ],
            widths: [],
            heights: [],
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeTrue();
    });

    it('Table cell with selected content', () => {
        const block: ContentModelBlock = {
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.TableCell,
            format: {},
            spanAbove: false,
            spanLeft: false,
            blocks: [
                {
                    blockType: ContentModelBlockType.Paragraph,
                    segments: [
                        {
                            segmentType: ContentModelSegmentType.Br,
                            isSelected: true,
                        },
                    ],
                },
            ],
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeTrue();
    });

    it('Empty general block', () => {
        const block: ContentModelBlock = {
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.General,
            element: null!,
            blocks: [],
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeFalse();
    });

    it('General block with selected paragraph', () => {
        const block: ContentModelBlock = {
            blockType: ContentModelBlockType.BlockGroup,
            blockGroupType: ContentModelBlockGroupType.General,
            element: null!,
            blocks: [
                {
                    blockType: ContentModelBlockType.Paragraph,
                    segments: [
                        {
                            segmentType: ContentModelSegmentType.Br,
                            isSelected: true,
                        },
                    ],
                },
            ],
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeTrue();
    });
});
