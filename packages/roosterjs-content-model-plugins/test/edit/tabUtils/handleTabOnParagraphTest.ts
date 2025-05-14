import { handleTabOnParagraph } from '../../../lib/edit/tabUtils/handleTabOnParagraph';
import {
    ContentModelDocument,
    ContentModelParagraph,
    RangeSelection,
} from 'roosterjs-content-model-types';

describe('handleTabOnParagraph', () => {
    function runTest(
        model: ContentModelDocument,
        paragraph: ContentModelParagraph,
        rawEvent: KeyboardEvent,
        expectedReturnValue: boolean
    ) {
        // Act
        const result = handleTabOnParagraph(model, paragraph, rawEvent);

        // Assert
        expect(result).toBe(expectedReturnValue);
    }

    it('Indent - collapsed range should return true when cursor is at the end', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        const paragraph = model.blocks[0] as ContentModelParagraph;
        const rawEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: false,
        });

        runTest(model, paragraph, rawEvent, true);
    });

    it('Outdent - collapsed range should return false when cursor is at the end', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        const paragraph = model.blocks[0] as ContentModelParagraph;
        const rawEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
        });

        runTest(model, paragraph, rawEvent, false);
    });

    it('Indent - collapsed range should return true when cursor is at the start', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        const paragraph = model.blocks[0] as ContentModelParagraph;
        const rawEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: false,
        });
        runTest(model, paragraph, rawEvent, true);
    });

    it('Outdent - collapsed range should return false when cursor is at the start', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        const paragraph = model.blocks[0] as ContentModelParagraph;
        const rawEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
        });

        runTest(model, paragraph, rawEvent, false);
    });

    it('Outdent - collapsed range should return true when cursor is at the start and exist indentation', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '    ',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        const paragraph = model.blocks[0] as ContentModelParagraph;
        const rawEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
        });

        runTest(model, paragraph, rawEvent, true);
    });

    it('Indent - collapsed range should return true when cursor is at the middle', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'te',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'st',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        const paragraph = model.blocks[0] as ContentModelParagraph;
        const rawEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: false,
        });

        runTest(model, paragraph, rawEvent, true);
    });

    it('Outdent - collapsed range should return true when cursor is at the middle', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'te',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'st',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        const paragraph = model.blocks[0] as ContentModelParagraph;
        const rawEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
        });

        runTest(model, paragraph, rawEvent, false);
    });

    it('Outdent - Intended - collapsed range should return true when cursor is at the end', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: '    ',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        const paragraph = model.blocks[0] as ContentModelParagraph;
        const rawEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
        });

        runTest(model, paragraph, rawEvent, true);
    });

    it('Outdent - Intended - collapsed range should return true when cursor is at the middle', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'te',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: '    ',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'st',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        const paragraph = model.blocks[0] as ContentModelParagraph;
        const rawEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
        });

        runTest(model, paragraph, rawEvent, true);
    });

    it('Indent - expanded range should return true', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '123',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: '456',
                            format: {},
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            text: '789',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        const paragraph = model.blocks[0] as ContentModelParagraph;
        const rawEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: false,
        });

        runTest(model, paragraph, rawEvent, true);
    });

    it('outdent - expanded range should return true', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '123',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: '456',
                            format: {},
                            isSelected: true,
                        },
                        {
                            segmentType: 'Text',
                            text: '789',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        const paragraph = model.blocks[0] as ContentModelParagraph;
        const rawEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            shiftKey: true,
        });

        runTest(model, paragraph, rawEvent, true);
    });
});
