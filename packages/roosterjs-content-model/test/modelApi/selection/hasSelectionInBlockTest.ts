import { ContentModelBlock } from '../../../lib/publicTypes/block/ContentModelBlock';
import { hasSelectionInBlock } from '../../../lib/modelApi/selection/hasSelectionInBlock';

describe('hasSelectionInBlock', () => {
    it('Empty paragraph block', () => {
        const block: ContentModelBlock = {
            blockType: 'Paragraph',
            segments: [],
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeFalse();
    });

    it('Paragraph block with selected segment', () => {
        const block: ContentModelBlock = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Br',
                },
                {
                    segmentType: 'Br',
                    isSelected: true,
                },
            ],
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeTrue();
    });

    it('Empty table', () => {
        const block: ContentModelBlock = {
            blockType: 'Table',
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
            blockType: 'Table',
            format: {},
            cells: [
                [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'TableCell',
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
            blockType: 'Table',
            format: {},
            cells: [
                [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'TableCell',
                        blocks: [],
                        format: {},
                        spanAbove: false,
                        spanLeft: false,
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'TableCell',
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
            blockType: 'Table',
            format: {},
            cells: [
                [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Br',
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
            blockType: 'BlockGroup',
            blockGroupType: 'TableCell',
            format: {},
            spanAbove: false,
            spanLeft: false,
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
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
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            element: null!,
            blocks: [],
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeFalse();
    });

    it('General block with selected paragraph', () => {
        const block: ContentModelBlock = {
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            element: null!,
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Br',
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
