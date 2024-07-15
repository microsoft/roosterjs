import { keyboardListTrigger } from '../../../lib/autoFormat/list/keyboardListTrigger';
import {
    ContentModelDocument,
    ContentModelParagraph,
    FormatContentModelContext,
} from 'roosterjs-content-model-types';

describe('keyboardListTrigger', () => {
    function runTest(
        model: ContentModelDocument,
        paragraph: ContentModelParagraph,
        context: FormatContentModelContext,
        expectedResult: boolean,
        shouldSearchForBullet: boolean = true,
        shouldSearchForNumbering: boolean = true,
        expectedContext?: any
    ) {
        const result = keyboardListTrigger(
            model,
            paragraph,
            context,
            shouldSearchForBullet,
            shouldSearchForNumbering
        );
        expect(result).toBe(expectedResult);
        if (expectedContext) {
            expect(context).toEqual(expectedContext);
        }
    }

    it('trigger numbering list', () => {
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: '1)',
                    format: {},
                },
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
            ],
            format: {},
        };
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [paragraph],
                format: {},
            },
            paragraph,
            { canUndoByBackspace: true } as any,
            true /* expectedResult */,
            undefined /* shouldSearchForBullet */,
            undefined /* shouldSearchForNumbering */,
            {
                canUndoByBackspace: true,
                announceData: {
                    defaultStrings: 'announceListItemNumbering',
                    formatStrings: ['1'],
                },
            }
        );
    });

    it('trigger continued numbering list', () => {
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: '2)',
                    format: {},
                },
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
        };
        runTest(
            {
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
                                        text: ' test',
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
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3,"unorderedStyleType":1}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {
                            listStyleType: '"1) "',
                        },
                    },
                    paragraph,
                ],
                format: {},
            },
            paragraph,
            { canUndoByBackspace: true } as any,
            true,
            undefined /* shouldSearchForBullet */,
            undefined /* shouldSearchForNumbering */,
            {
                canUndoByBackspace: true,
                announceData: { defaultStrings: 'announceListItemNumbering', formatStrings: ['2'] },
            }
        );
    });

    it('should not trigger numbering list', () => {
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'a1)',
                    format: {},
                },
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
            ],
            format: {},
        };
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [paragraph],
                format: {},
            },
            paragraph,
            { canUndoByBackspace: true } as any,
            false,
            undefined /* shouldSearchForBullet */,
            undefined /* shouldSearchForNumbering */,
            { canUndoByBackspace: true }
        );
    });

    it('should trigger bullet list', () => {
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: '*',
                    format: {},
                },
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
            ],
            format: {},
        };
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [paragraph],
                format: {},
            },
            paragraph,
            { canUndoByBackspace: true } as any,
            true,
            undefined /* shouldSearchForBullet */,
            undefined /* shouldSearchForNumbering */,
            {
                canUndoByBackspace: true,
                announceData: { defaultStrings: 'announceListItemBullet' },
            }
        );
    });

    it('should not trigger bullet list', () => {
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'a*',
                    format: {},
                },
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
            ],
            format: {},
        };
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [paragraph],
                format: {},
            },
            paragraph,
            {} as any,
            false,
            undefined,
            undefined,
            {}
        );
    });

    it('trigger continued numbering list between lists', () => {
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: '3)',
                    format: {},
                },
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
            ],
            format: {},
        };
        runTest(
            {
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
                                format: {},
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {
                            listStyleType: '"1) "',
                        },
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
                                ],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {},
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {
                            listStyleType: '"2) "',
                        },
                    },
                    paragraph,
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
                                    startNumberOverride: 1,
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":10}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {
                            listStyleType: '"A) "',
                        },
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
                                ],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {},
                                dataset: {
                                    editingInfo: '{"orderedStyleType":10}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {
                            listStyleType: '"B) "',
                        },
                    },
                ],
                format: {},
            },
            paragraph,
            { canUndoByBackspace: true } as any,
            true,
            undefined /* shouldSearchForBullet */,
            undefined /* shouldSearchForNumbering */,
            {
                canUndoByBackspace: true,
                announceData: {
                    defaultStrings: 'announceListItemNumbering',
                    formatStrings: ['3'],
                },
            }
        );
    });

    it('trigger a new numbering list after a numbering list', () => {
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [
                {
                    segmentType: 'Text',
                    text: 'A)',
                    format: {},
                },
                {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
            ],
            format: {},
        };
        runTest(
            {
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
                                format: {},
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {
                            listStyleType: '"1) "',
                        },
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
                                ],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {},
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {},
                        },
                        format: {
                            listStyleType: '"2) "',
                        },
                    },
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
                    paragraph,
                ],
                format: {},
            },
            paragraph,
            { canUndoByBackspace: true } as any,
            true,
            undefined /* shouldSearchForBullet */,
            undefined /* shouldSearchForNumbering */,
            {
                canUndoByBackspace: true,
                announceData: { defaultStrings: 'announceListItemNumbering', formatStrings: ['A'] },
            }
        );
    });
});
