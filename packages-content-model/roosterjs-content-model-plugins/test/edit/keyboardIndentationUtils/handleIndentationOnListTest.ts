import { ContentModelDocument, ContentModelListItem } from 'roosterjs-content-model-types';
import { handleIndentationOnList } from '../../../lib/edit/keyboardIndentationUtils/handleIndentationOnList';

describe('handleIndentationOnList', () => {
    function runTest(
        model: ContentModelDocument,
        listItem: ContentModelListItem,
        rawEvent: KeyboardEvent,
        expectedReturnValue: boolean
    ) {
        // Act
        const result = handleIndentationOnList(model, listItem, rawEvent);

        // Assert
        expect(result).toBe(expectedReturnValue);
    }

    it('should return true when the cursor is at the start of the list item', () => {
        // Arrange
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
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
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        const listItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
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
            levels: [
                {
                    listType: 'OL',
                    format: {
                        listStyleType: 'decimal',
                    },
                    dataset: {
                        editingInfo: '{"orderedStyleType":1}',
                    },
                },
            ],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: true,
                format: {},
            },
            format: {},
        };
        const rawEvent = {
            key: 'Tab',
            shiftKey: false,
            preventDefault: () => {},
        } as KeyboardEvent;
        const expectedReturnValue = true;

        // Act
        runTest(model, listItem, rawEvent, expectedReturnValue);
    });

    it('Outdent - should return true when the cursor is at the start of the list item', () => {
        // Arrange
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
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
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        const listItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
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
            levels: [
                {
                    listType: 'OL',
                    format: {
                        listStyleType: 'decimal',
                    },
                    dataset: {
                        editingInfo: '{"orderedStyleType":1}',
                    },
                },
            ],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: true,
                format: {},
            },
            format: {},
        };
        const rawEvent = {
            key: 'Tab',
            shiftKey: true,
            preventDefault: () => {},
        } as KeyboardEvent;
        const expectedReturnValue = true;

        // Act
        runTest(model, listItem, rawEvent, expectedReturnValue);
    });

    it('should return true when the cursor is not at the start of the list item', () => {
        // Arrange
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
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
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        const listItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
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
            levels: [
                {
                    listType: 'OL',
                    format: {
                        listStyleType: 'decimal',
                    },
                    dataset: {
                        editingInfo: '{"orderedStyleType":1}',
                    },
                },
            ],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: true,
                format: {},
            },
            format: {},
        };
        const rawEvent = {
            key: 'Tab',
            shiftKey: false,
            preventDefault: () => {},
        } as KeyboardEvent;

        // Act
        runTest(model, listItem, rawEvent, true);
    });

    it('Alt + SHIFT + ARROW Right | should return true when the cursor is at the start of the list item', () => {
        // Arrange
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
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
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        const listItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
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
            levels: [
                {
                    listType: 'OL',
                    format: {
                        listStyleType: 'decimal',
                    },
                    dataset: {
                        editingInfo: '{"orderedStyleType":1}',
                    },
                },
            ],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: true,
                format: {},
            },
            format: {},
        };
        const rawEvent = {
            key: 'ArrowRight',
            shiftKey: true,
            altKey: true,
            preventDefault: () => {},
        } as KeyboardEvent;

        // Act
        runTest(model, listItem, rawEvent, true);
    });

    it('Alt + SHIFT + ARROW RIGHT | Outdent - should return true when the cursor is at the start of the list item', () => {
        // Arrange
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
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
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        const listItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
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
            levels: [
                {
                    listType: 'OL',
                    format: {
                        listStyleType: 'decimal',
                    },
                    dataset: {
                        editingInfo: '{"orderedStyleType":1}',
                    },
                },
            ],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: true,
                format: {},
            },
            format: {},
        };
        const rawEvent = {
            key: 'ArrowLeft',
            shiftKey: true,
            altKey: true,
            preventDefault: () => {},
        } as KeyboardEvent;
        const expectedReturnValue = true;

        // Act
        runTest(model, listItem, rawEvent, expectedReturnValue);
    });

    it('Alt + SHIFT + ARROW LEFT | should false true when the cursor is not at the start of the list item', () => {
        // Arrange
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
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
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                listStyleType: 'decimal',
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":1}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
            ],
            format: {},
        };
        const listItem: ContentModelListItem = {
            blockType: 'BlockGroup',
            blockGroupType: 'ListItem',
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
            levels: [
                {
                    listType: 'OL',
                    format: {
                        listStyleType: 'decimal',
                    },
                    dataset: {
                        editingInfo: '{"orderedStyleType":1}',
                    },
                },
            ],
            formatHolder: {
                segmentType: 'SelectionMarker',
                isSelected: true,
                format: {},
            },
            format: {},
        };
        const rawEvent = {
            key: 'ArrowRight',
            shiftKey: true,
            altKey: true,
            preventDefault: () => {},
        } as KeyboardEvent;

        // Act
        runTest(model, listItem, rawEvent, false);
    });
});
