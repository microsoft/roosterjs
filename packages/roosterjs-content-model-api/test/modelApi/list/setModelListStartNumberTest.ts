import { ContentModelDocument } from 'roosterjs-content-model-types';
import { setModelListStartNumber } from '../../../lib/modelApi/list/setModelListStartNumber';

describe('setModelListStartNumber', () => {
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
