import { ContentModelDocument, ContentModelTable } from 'roosterjs-content-model-types';
import { handleTabOnTable } from '../../../lib/edit/tabUtils/handleTabOnTable';

describe('handleTabOnTable', () => {
    function runTest(
        model: ContentModelDocument,
        rawEvent: KeyboardEvent,
        expectedReturnValue: boolean
    ) {
        // Act
        const result = handleTabOnTable(model, rawEvent);

        // Assert
        expect(result).toBe(expectedReturnValue);
    }

    it('Indent - whole selected table', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            height: 22,
                            format: {},
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                            ],
                        },
                        {
                            height: 22,
                            format: {},
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                            ],
                        },
                        {
                            height: 22,
                            format: {},
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                            ],
                        },
                    ],
                    format: {
                        id: 'table_0',
                        marginLeft: '40px',
                    },
                    widths: [120, 120, 120],
                    dataset: {},
                },
            ],
            format: {},
        };
        const rawEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: false,
        });
        const tableBefore = model.blocks[0] as ContentModelTable;
        const marginLeft = tableBefore.format.marginLeft;
        runTest(model, rawEvent, true);
        const tableAfter = model.blocks[0] as ContentModelTable;
        expect(parseInt(tableAfter.format.marginLeft)).toBeGreaterThan(parseInt(marginLeft));
    });

    it('Outdent - whole selected table', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            height: 22,
                            format: {},
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                            ],
                        },
                        {
                            height: 22,
                            format: {},
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                            ],
                        },
                        {
                            height: 22,
                            format: {},
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                            ],
                        },
                    ],
                    format: {
                        id: 'table_0',
                        marginLeft: '40px',
                    },
                    widths: [120, 120, 120],
                    dataset: {},
                },
            ],
            format: {},
        };
        const rawEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
        });
        const tableBefore = model.blocks[0] as ContentModelTable;
        const marginLeft = tableBefore.format.marginLeft;
        runTest(model, rawEvent, true);
        const tableAfter = model.blocks[0] as ContentModelTable;
        expect(parseInt(tableAfter.format.marginLeft)).toBeLessThan(parseInt(marginLeft));
    });

    it('No Indent - partially selected table', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            height: 22,
                            format: {},
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                            ],
                        },
                        {
                            height: 22,
                            format: {},
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                    isSelected: true,
                                },
                            ],
                        },
                        {
                            height: 22,
                            format: {},
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {
                        id: 'table_0',
                        marginLeft: '40px',
                    },
                    widths: [120, 120, 120],
                    dataset: {},
                },
            ],
            format: {},
        };
        const rawEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: false,
        });
        runTest(model, rawEvent, false);
    });

    it('No Indent - no selected table', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Table',
                    rows: [
                        {
                            height: 22,
                            format: {},
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            height: 22,
                            format: {},
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                        {
                            height: 22,
                            format: {},
                            cells: [
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                                {
                                    spanAbove: false,
                                    spanLeft: false,
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'Br',
                                                    format: {},
                                                },
                                            ],
                                            format: {},
                                        },
                                    ],
                                    format: {},
                                    dataset: {},
                                },
                            ],
                        },
                    ],
                    format: {
                        id: 'table_0',
                        marginLeft: '40px',
                    },
                    widths: [120, 120, 120],
                    dataset: {},
                },
            ],
            format: {},
        };
        const rawEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: false,
        });
        runTest(model, rawEvent, false);
    });
});
