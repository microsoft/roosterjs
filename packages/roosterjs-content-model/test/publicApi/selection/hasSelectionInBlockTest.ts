import hasSelectionInBlock from '../../../lib/publicApi/selection/hasSelectionInBlock';
import hasSelectionInBlockGroup from '../../../lib/publicApi/selection/hasSelectionInBlockGroup';
import { ContentModelBlock } from '../../../lib/publicTypes/block/ContentModelBlock';
import { ContentModelHR } from '../../../lib/publicTypes/block/ContentModelHR';
import { ContentModelTableCell } from '../../../lib/publicTypes/block/group/ContentModelTableCell';

describe('hasSelectionInBlock', () => {
    it('Empty paragraph block', () => {
        const block: ContentModelBlock = {
            blockType: 'Paragraph',
            segments: [],
            format: {},
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
                    format: {},
                },
                {
                    segmentType: 'Br',
                    format: {},
                    isSelected: true,
                },
            ],
            format: {},
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
                        blockGroupType: 'TableCell',
                        blocks: [],
                        format: {},
                        spanAbove: false,
                        spanLeft: false,
                    },
                    {
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
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Br',
                                        isSelected: true,
                                        format: {},
                                    },
                                ],
                                format: {},
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
        const block: ContentModelTableCell = {
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
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        };

        const result = hasSelectionInBlockGroup(block);

        expect(result).toBeTrue();
    });

    it('Empty general block', () => {
        const block: ContentModelBlock = {
            blockType: 'BlockGroup',
            blockGroupType: 'General',
            element: null!,
            blocks: [],
            format: {},
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
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeTrue();
    });

    it('HR has selection', () => {
        const block: ContentModelHR = {
            blockType: 'HR',
            format: {},
            isSelected: true,
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeTrue();
    });
});
