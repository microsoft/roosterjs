import { ContentModelDocument } from 'roosterjs-content-model-types';
import { setModelDirection } from '../../../lib/modelApi/block/setModelDirection';

describe('setModelDirection', () => {
    function runTest(
        model: ContentModelDocument,
        direction: 'ltr' | 'rtl',
        expectedModel: ContentModelDocument,
        expectedResult: boolean
    ) {
        const result = setModelDirection(model, direction);

        expect(result).toBe(expectedResult);
        expect(model).toEqual(expectedModel);
    }

    it('set direction for paragraph', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {
                            marginLeft: '10px',
                            paddingRight: '20px',
                        },
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            'rtl',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {
                            direction: 'rtl',
                            marginRight: '10px',
                            paddingLeft: '20px',
                        },
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            true
        );
    });

    it('set direction for divider', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Divider',
                        format: {},
                        isSelected: true,
                        tagName: 'hr',
                    },
                ],
            },
            'rtl',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Divider',
                        format: {
                            direction: 'rtl',
                        },
                        isSelected: true,
                        tagName: 'hr',
                    },
                ],
            },
            true
        );
    });

    it('set direction for list item', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        format: {},
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                        levels: [
                            {
                                listType: 'OL',
                                dataset: {},
                                format: {},
                            },
                        ],
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [],
                                format: {},
                            },
                            {
                                blockType: 'Paragraph',
                                segments: [],
                                format: {},
                            },
                        ],
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        format: {},
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                        levels: [
                            {
                                listType: 'OL',
                                dataset: {},
                                format: {},
                            },
                        ],
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'SelectionMarker',
                                        format: {},
                                        isSelected: true,
                                    },
                                ],
                                format: {},
                            },
                        ],
                    },
                ],
            },
            'rtl',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        format: {},
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                        levels: [
                            {
                                listType: 'OL',
                                dataset: {},
                                format: {
                                    direction: 'rtl',
                                },
                            },
                        ],
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [],
                                format: { direction: 'rtl' },
                            },
                            {
                                blockType: 'Paragraph',
                                segments: [],
                                format: { direction: 'rtl' },
                            },
                        ],
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        format: {},
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                        levels: [
                            {
                                listType: 'OL',
                                dataset: {},
                                format: {
                                    direction: 'rtl',
                                },
                            },
                        ],
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'SelectionMarker',
                                        format: {},
                                        isSelected: true,
                                    },
                                ],
                                format: { direction: 'rtl' },
                            },
                        ],
                    },
                ],
            },
            true
        );
    });
});
