import { ContentModelDocument } from 'roosterjs-content-model-types';
import { setModelListStartNumber } from '../../../lib/modelApi/list/setModelListStartNumber';

describe('setModelListStartNumber', () => {
    const mockedCachedElement = 'CACHE' as any;

    function runTest(model: ContentModelDocument, value: number, expected: boolean) {
        // Act
        const actual = setModelListStartNumber(model, value);

        // Assert
        expect(actual).toBe(expected);
    }

    it('set start number to 1', () => {
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
                            ],
                            format: {},
                            cachedElement: mockedCachedElement,
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
                            cachedElement: mockedCachedElement,
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                    cachedElement: mockedCachedElement,
                },
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
                            cachedElement: mockedCachedElement,
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
                            cachedElement: mockedCachedElement,
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {},
                    },
                    format: {},
                    cachedElement: mockedCachedElement,
                },
            ],
            format: {},
        };

        runTest(model, 1, true);
    });

    it('no list', () => {
        // Arrange
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

        runTest(model, 1, false);
    });
});
