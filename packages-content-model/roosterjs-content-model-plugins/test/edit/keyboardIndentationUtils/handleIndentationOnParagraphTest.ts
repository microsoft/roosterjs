import { handleIndentationOnParagraph } from '../../../lib/edit/keyboardIndentationUtils/handleIndentationOnParagraph';
import {
    ContentModelDocument,
    ContentModelParagraph,
    RangeSelection,
} from 'roosterjs-content-model-types';

describe('handleIndentationOnParagraph', () => {
    function runTest(
        model: ContentModelDocument,
        paragraph: ContentModelParagraph,
        rawEvent: KeyboardEvent,
        selection: RangeSelection,
        expectedReturnValue: boolean
    ) {
        // Act
        const result = handleIndentationOnParagraph(model, paragraph, rawEvent);

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
        const selection = {
            type: 'range',
            range: {
                collapsed: true,
            },
        } as RangeSelection;
        runTest(model, paragraph, rawEvent, selection, true);
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
        const selection = {
            type: 'range',
            range: {
                collapsed: true,
            },
        } as RangeSelection;
        runTest(model, paragraph, rawEvent, selection, false);
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
        const selection = {
            type: 'range',
            range: {
                collapsed: true,
            },
        } as RangeSelection;
        runTest(model, paragraph, rawEvent, selection, true);
    });

    it('Outdent - collapsed range should return true when cursor is at the start', () => {
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
        const selection = {
            type: 'range',
            range: {
                collapsed: true,
            },
        } as RangeSelection;
        runTest(model, paragraph, rawEvent, selection, true);
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
        const selection = {
            type: 'range',
            range: {
                collapsed: true,
            },
        } as RangeSelection;
        runTest(model, paragraph, rawEvent, selection, true);
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
        const selection = {
            type: 'range',
            range: {
                collapsed: true,
            },
        } as RangeSelection;
        runTest(model, paragraph, rawEvent, selection, false);
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
        const selection = {
            type: 'range',
            range: {
                collapsed: true,
            },
        } as RangeSelection;
        runTest(model, paragraph, rawEvent, selection, true);
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
        const selection = {
            type: 'range',
            range: {
                collapsed: true,
            },
        } as RangeSelection;
        runTest(model, paragraph, rawEvent, selection, true);
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
        const selection = {
            type: 'range',
            range: {
                collapsed: false,
            },
        } as RangeSelection;
        runTest(model, paragraph, rawEvent, selection, true);
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
        const selection = {
            type: 'range',
            range: {
                collapsed: false,
            },
        } as RangeSelection;
        runTest(model, paragraph, rawEvent, selection, true);
    });
});
