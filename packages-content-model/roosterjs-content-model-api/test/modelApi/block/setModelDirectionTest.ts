import { ContentModelDocument } from 'roosterjs-content-model-types';
import { setModelDirection } from '../../../lib/modelApi/block/setModelDirection';

describe('setModelDirection', () => {
    const width = '3px';
    const style = 'double';
    const color = '#AABBCC';
    const testBorderString = `${width} ${style} ${color}`;

    function runTest(
        model: ContentModelDocument,
        direction: 'ltr' | 'rtl',
        expectedModel: ContentModelDocument,
        expectedResult: boolean,
        tableTest?: boolean
    ) {
        const result = setModelDirection(model, direction);

        expect(result).toBe(expectedResult);

        if (tableTest && model.blocks[0].blockType == 'Table') {
            model.blocks[0].dataset = {};
        }
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

    xit('set direction for divider', () => {
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

    it('flip direction for table - LTR -> RTL', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                height: 0,
                                format: {},
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [],
                                        format: {
                                            borderRight: testBorderString,
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {
                                            editingInfo: '{"borderOverride":true}',
                                        },
                                        isSelected: true,
                                    },
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [],
                                        format: {
                                            borderLeft: testBorderString,
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {
                                            editingInfo: '{"borderOverride":true}',
                                        },
                                        isSelected: true,
                                    },
                                ],
                            },
                        ],
                        format: {},
                        widths: [],
                        dataset: {},
                    },
                ],
                format: {},
            },
            'rtl',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                height: 0,
                                format: {},
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [],
                                        format: {
                                            borderLeft: testBorderString,
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {
                                            editingInfo: '{"borderOverride":true}',
                                        },
                                        isSelected: true,
                                    },
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [],
                                        format: {
                                            borderRight: testBorderString,
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {
                                            editingInfo: '{"borderOverride":true}',
                                        },
                                        isSelected: true,
                                    },
                                ],
                            },
                        ],
                        format: {
                            direction: 'rtl',
                        },
                        widths: [],
                        dataset: {},
                    },
                ],
                format: {},
            },
            true,
            true
        );
    });

    it('flip direction for table - RTL -> LTR', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                height: 0,
                                format: {},
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [],
                                        format: {
                                            borderRight: testBorderString,
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {
                                            editingInfo: '{"borderOverride":true}',
                                        },
                                        isSelected: true,
                                    },
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [],
                                        format: {
                                            borderLeft: testBorderString,
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {
                                            editingInfo: '{"borderOverride":true}',
                                        },
                                        isSelected: true,
                                    },
                                ],
                            },
                        ],
                        format: {
                            direction: 'rtl',
                        },
                        widths: [],
                        dataset: {},
                    },
                ],
                format: {},
            },
            'ltr',
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                height: 0,
                                format: {},
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [],
                                        format: {
                                            borderLeft: testBorderString,
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {
                                            editingInfo: '{"borderOverride":true}',
                                        },
                                        isSelected: true,
                                    },
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [],
                                        format: {
                                            borderRight: testBorderString,
                                        },
                                        spanLeft: false,
                                        spanAbove: false,
                                        isHeader: false,
                                        dataset: {
                                            editingInfo: '{"borderOverride":true}',
                                        },
                                        isSelected: true,
                                    },
                                ],
                            },
                        ],
                        format: {
                            direction: 'ltr',
                        },
                        widths: [],
                        dataset: {},
                    },
                ],
                format: {},
            },
            true,
            true
        );
    });
});
