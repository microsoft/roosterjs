import { Preset } from './allPresets';

export const simpleList: Preset = {
    buttonName: 'Simple List',
    id: 'sList',
    content: {
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
                                text: 'First',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'UL',
                        format: {
                            listStyleType: 'disc',
                        },
                        dataset: {
                            editingInfo: '{"unorderedStyleType":1}',
                        },
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'Second',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'UL',
                        format: {
                            listStyleType: 'disc',
                        },
                        dataset: {
                            editingInfo: '{"unorderedStyleType":1}',
                        },
                    },
                    {
                        listType: 'UL',
                        format: {
                            listStyleType: 'circle',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'Third',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'UL',
                        format: {
                            listStyleType: 'disc',
                        },
                        dataset: {
                            editingInfo: '{"unorderedStyleType":1}',
                        },
                    },
                    {
                        listType: 'UL',
                        format: {
                            listStyleType: 'circle',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                    {
                        listType: 'UL',
                        format: {
                            listStyleType: 'square',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'Fourth',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'UL',
                        format: {
                            listStyleType: 'disc',
                        },
                        dataset: {
                            editingInfo: '{"unorderedStyleType":1}',
                        },
                    },
                    {
                        listType: 'UL',
                        format: {
                            listStyleType: 'circle',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                    {
                        listType: 'UL',
                        format: {
                            listStyleType: 'square',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                    {
                        listType: 'UL',
                        format: {
                            listStyleType: 'disc',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'Fifth',
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
                        listType: 'UL',
                        format: {
                            listStyleType: 'disc',
                        },
                        dataset: {
                            editingInfo: '{"unorderedStyleType":1}',
                        },
                    },
                    {
                        listType: 'UL',
                        format: {
                            listStyleType: 'circle',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                    {
                        listType: 'UL',
                        format: {
                            listStyleType: 'square',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                    {
                        listType: 'UL',
                        format: {
                            listStyleType: 'disc',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                    {
                        listType: 'UL',
                        format: {
                            listStyleType: 'circle',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
                    format: {},
                },
                format: {},
            },
        ],
        format: {},
    },
};

export const numberedList: Preset = {
    buttonName: 'Numbered List',
    id: 'nList',
    content: {
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
                                text: 'One',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'One',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-alpha',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'Two',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-alpha',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'Three',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-alpha',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'One',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-alpha',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-roman',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'Two',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-alpha',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-roman',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'Three',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-alpha',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-roman',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'One',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-alpha',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-roman',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'decimal',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'Two',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-alpha',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-roman',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'decimal',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'Three',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-alpha',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-roman',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'decimal',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'Two',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'One',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-alpha',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'One',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-alpha',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-roman',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'Two',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-alpha',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-roman',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'Two',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                    {
                        listType: 'OL',
                        format: {
                            listStyleType: 'lower-alpha',
                        },
                        dataset: {
                            editingInfo: '{"applyListStyleFromLevel":true}',
                        },
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
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
                                text: 'Three',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: false,
                    format: {},
                },
                format: {},
            },
            {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    {
                        segmentType: 'Br',
                        format: {},
                    },
                ],
                format: {},
            },
        ],
        format: {},
    },
};
