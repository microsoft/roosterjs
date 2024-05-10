import { hasSelectionInBlock } from '../../../lib/modelApi/selection/hasSelectionInBlock';
import { hasSelectionInBlockGroup } from '../../../lib/modelApi/selection/hasSelectionInBlockGroup';
import {
    ReadonlyContentModelBlock,
    ReadonlyContentModelDivider,
    ReadonlyContentModelEntity,
    ReadonlyContentModelTableCell,
} from 'roosterjs-content-model-types';

describe('hasSelectionInBlock', () => {
    it('Empty paragraph block', () => {
        const block: ReadonlyContentModelBlock = {
            blockType: 'Paragraph',
            segments: [],
            format: {},
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeFalse();
    });

    it('Paragraph block with selected segment', () => {
        const block: ReadonlyContentModelBlock = {
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
        const block: ReadonlyContentModelBlock = {
            blockType: 'Table',
            format: {},
            rows: [],
            widths: [],
            dataset: {},
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeFalse();
    });

    it('Table without selection', () => {
        const block: ReadonlyContentModelBlock = {
            blockType: 'Table',
            format: {},
            rows: [
                {
                    format: {},
                    height: 0,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            blocks: [],
                            format: {},
                            spanAbove: false,
                            spanLeft: false,
                            dataset: {},
                        },
                    ],
                },
            ],
            widths: [],
            dataset: {},
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeFalse();
    });

    it('Table with selected cell', () => {
        const block: ReadonlyContentModelBlock = {
            blockType: 'Table',
            format: {},
            rows: [
                {
                    format: {},
                    height: 0,
                    cells: [
                        {
                            blockGroupType: 'TableCell',
                            blocks: [],
                            format: {},
                            spanAbove: false,
                            spanLeft: false,
                            dataset: {},
                        },
                        {
                            blockGroupType: 'TableCell',
                            blocks: [],
                            format: {},
                            spanAbove: false,
                            spanLeft: false,
                            isSelected: true,
                            dataset: {},
                        },
                    ],
                },
            ],
            widths: [],
            dataset: {},
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeTrue();
    });

    it('Table with selected content', () => {
        const block: ReadonlyContentModelBlock = {
            blockType: 'Table',
            format: {},
            rows: [
                {
                    format: {},
                    height: 0,
                    cells: [
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
                            dataset: {},
                        },
                    ],
                },
            ],
            widths: [],
            dataset: {},
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeTrue();
    });

    it('Table cell with selected content', () => {
        const block: ReadonlyContentModelTableCell = {
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
            dataset: {},
        };

        const result = hasSelectionInBlockGroup(block);

        expect(result).toBeTrue();
    });

    it('Empty general block', () => {
        const block: ReadonlyContentModelBlock = {
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
        const block: ReadonlyContentModelBlock = {
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
        const block: ReadonlyContentModelDivider = {
            blockType: 'Divider',
            tagName: 'hr',
            format: {},
            isSelected: true,
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeTrue();
    });

    it('Entity has selection', () => {
        const block: ReadonlyContentModelEntity = {
            blockType: 'Entity',
            segmentType: 'Entity',
            format: {},
            isSelected: true,
            entityFormat: {
                entityType: 'entity',
                id: 'entity',
                isReadonly: false,
            },
            wrapper: null!,
        };

        const result = hasSelectionInBlock(block);

        expect(result).toBeTrue();
    });
});
