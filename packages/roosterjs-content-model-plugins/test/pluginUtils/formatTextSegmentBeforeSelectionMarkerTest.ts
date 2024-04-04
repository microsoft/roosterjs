import { createLinkAfterSpace } from '../../lib/autoFormat/link/createLinkAfterSpace';
import { formatTextSegmentBeforeSelectionMarker } from '../../lib/pluginUtils/formatTextSegmentBeforeSelectionMarker';
import { keyboardListTrigger } from '../../lib/autoFormat/list/keyboardListTrigger';
import { transformHyphen } from '../../lib/autoFormat/hyphen/transformHyphen';
import {
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelText,
    FormatContentModelContext,
} from 'roosterjs-content-model-types';

describe('formatTextSegmentBeforeSelectionMarker', () => {
    function runTest(
        input: ContentModelDocument,
        callback: (
            model: ContentModelDocument,
            previousSegment: ContentModelText,
            paragraph: ContentModelParagraph,
            context: FormatContentModelContext
        ) => boolean,
        expectedModel: ContentModelDocument,
        expectedResult: boolean
    ) {
        const formatWithContentModelSpy = jasmine
            .createSpy('formatWithContentModel')
            .and.callFake((callback, options) => {
                const result = callback(input, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                    canUndoByBackspace: true,
                });
                expect(result).toBe(expectedResult);
            });

        formatTextSegmentBeforeSelectionMarker(
            {
                focus: () => {},
                formatContentModel: formatWithContentModelSpy,
            } as any,
            callback
        );

        expect(formatWithContentModelSpy).toHaveBeenCalled();
        expect(input).toEqual(expectedModel);
    }

    it('no selection marker', () => {
        const input: ContentModelDocument = {
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
                    ],
                    format: {},
                },
            ],
        };
        runTest(input, () => true, input, false);
    });

    it('no previous segment', () => {
        const input: ContentModelDocument = {
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
                    ],
                    format: {},
                },
            ],
        };
        runTest(input, () => true, input, false);
    });

    it('previous segment is not text', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Image',
                            src: 'test',
                            format: {},
                            dataset: {},
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
        };
        runTest(input, () => true, input, false);
    });

    it('format segment', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'first',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'second',
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
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'first',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'second',
                            format: {
                                textColor: 'red',
                            },
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
        };
        runTest(
            input,
            (_model, previousSegment) => {
                previousSegment.format = { textColor: 'red' };
                return true;
            },
            expectedModel,
            true
        );
    });
});

describe('formatTextSegmentBeforeSelectionMarker - keyboardListTrigger', () => {
    function runTest(
        input: ContentModelDocument,
        expectedModel: ContentModelDocument,
        expectedResult: boolean,
        autoBullet: boolean = true,
        autoNumbering: boolean = true
    ) {
        const formatWithContentModelSpy = jasmine
            .createSpy('formatWithContentModel')
            .and.callFake((callback, options) => {
                const result = callback(input, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                    canUndoByBackspace: true,
                });
                expect(result).toBe(expectedResult);
            });

        formatTextSegmentBeforeSelectionMarker(
            {
                focus: () => {},
                formatContentModel: formatWithContentModelSpy,
            } as any,
            (model, _previousSegment, paragraph, context) => {
                return keyboardListTrigger(model, paragraph, context, autoBullet, autoNumbering);
            }
        );

        expect(formatWithContentModelSpy).toHaveBeenCalled();
        expect(input).toEqual(expectedModel);
    }

    it('trigger numbering list', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
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
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
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
                                { segmentType: 'Br', format: {} },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {
                                startNumberOverride: 1,
                                direction: undefined,
                                textAlign: undefined,
                                marginBottom: undefined,
                                marginTop: undefined,
                            },
                            dataset: {
                                editingInfo: '{"orderedStyleType":3}',
                            },
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: false,
                        format: {
                            fontFamily: undefined,
                            fontSize: undefined,
                            textColor: undefined,
                        },
                    },
                    format: {},
                },
            ],
            format: {},
        };
        runTest(input, expectedModel, true);
    });

    it('trigger continued numbering list', () => {
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
                    {
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
                    },
                ],
                format: {},
            },
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
                                        segmentType: 'Br',
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
                                    startNumberOverride: 2,
                                    direction: undefined,
                                    textAlign: undefined,
                                    marginBottom: undefined,
                                    marginTop: undefined,
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: undefined,
                                fontSize: undefined,
                                textColor: undefined,
                            },
                        },
                        format: {},
                    },
                ],
                format: {},
            },
            true
        );
    });

    it('should not trigger numbering list', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
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
                    },
                ],
                format: {},
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
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
                    },
                ],
                format: {},
            },
            false,
            true,
            false
        );
    });

    it('should trigger bullet list', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
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
                    },
                ],
                format: {},
            },
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
                        levels: [
                            {
                                listType: 'UL',
                                format: {
                                    startNumberOverride: 1,
                                    direction: undefined,
                                    textAlign: undefined,
                                    marginBottom: undefined,
                                    marginTop: undefined,
                                },
                                dataset: {
                                    editingInfo: '{"unorderedStyleType":1}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: undefined,
                                fontSize: undefined,
                                textColor: undefined,
                            },
                        },
                        format: {},
                    },
                ],
                format: {},
            },
            true
        );
    });

    it('should not trigger bullet list', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
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
                    },
                ],
                format: {},
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
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
                    },
                ],
                format: {},
            },
            false,
            false,
            true
        );
    });

    it('trigger continued numbering list between lists', () => {
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
                                        segmentType: 'Br',
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
                                    startNumberOverride: 3,
                                    direction: undefined,
                                    textAlign: undefined,
                                    marginBottom: undefined,
                                    marginTop: undefined,
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":3}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: undefined,
                                fontSize: undefined,
                                textColor: undefined,
                            },
                        },
                        format: {},
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
            true
        );
    });

    it('trigger a new numbering list after a numbering list', () => {
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
                    {
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
                    },
                ],
                format: {},
            },
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
                                        segmentType: 'Br',
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
                                    direction: undefined,
                                    textAlign: undefined,
                                    marginBottom: undefined,
                                    marginTop: undefined,
                                },
                                dataset: {
                                    editingInfo: '{"orderedStyleType":10}',
                                },
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: false,
                            format: {
                                fontFamily: undefined,
                                fontSize: undefined,
                                textColor: undefined,
                            },
                        },
                        format: {},
                    },
                ],
                format: {},
            },
            true
        );
    });
});

describe('formatTextSegmentBeforeSelectionMarker - createLinkAfterSpace', () => {
    function runTest(
        input: ContentModelDocument,
        expectedModel: ContentModelDocument,
        expectedResult: boolean
    ) {
        const formatWithContentModelSpy = jasmine
            .createSpy('formatWithContentModel')
            .and.callFake((callback, options) => {
                const result = callback(input, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                    canUndoByBackspace: true,
                });
                expect(result).toBe(expectedResult);
            });

        formatTextSegmentBeforeSelectionMarker(
            {
                focus: () => {},
                formatContentModel: formatWithContentModelSpy,
            } as any,
            (_model, previousSegment, paragraph, context) => {
                return createLinkAfterSpace(previousSegment, paragraph, context);
            }
        );

        expect(formatWithContentModelSpy).toHaveBeenCalled();
        expect(input).toEqual(expectedModel);
    }

    it('no link segment', () => {
        const input: ContentModelDocument = {
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

        runTest(input, input, false);
    });

    it('link segment with WWW', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'www.bing.com',
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

        const expected: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'www.bing.com',
                            format: {},
                            isSelected: undefined,
                            link: {
                                format: {
                                    href: 'http://www.bing.com',
                                    underline: true,
                                },
                                dataset: {},
                            },
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
        runTest(input, expected, true);
    });

    it('link segment with hyperlink', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'www.bing.com',
                            format: {},
                            link: {
                                format: {
                                    href: 'www.bing.com',
                                    underline: true,
                                },
                                dataset: {},
                            },
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

        runTest(input, input, true);
    });

    it('link with text', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'this is the link www.bing.com',
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
        const expected: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'this is the link ',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'Text',
                            text: 'www.bing.com',
                            format: {},
                            isSelected: undefined,
                            link: {
                                format: {
                                    underline: true,
                                    href: 'http://www.bing.com',
                                },
                                dataset: {},
                            },
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

        runTest(input, expected, true);
    });

    it('link before text', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'www.bing.com this is the link',
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
        runTest(input, input, false);
    });

    it('link after link', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'www.bing.com',
                            format: {},
                            link: {
                                format: {
                                    href: 'www.bing.com',
                                    underline: true,
                                },
                                dataset: {},
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: ' www.bing.com',
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
        const expected: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'www.bing.com',
                            format: {},
                            link: {
                                format: {
                                    href: 'www.bing.com',
                                    underline: true,
                                },
                                dataset: {},
                            },
                        },
                        {
                            segmentType: 'Text',
                            text: ' ',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'Text',
                            text: 'www.bing.com',
                            format: {},
                            isSelected: undefined,
                            link: {
                                format: {
                                    href: 'http://www.bing.com',
                                    underline: true,
                                },
                                dataset: {},
                            },
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
        runTest(input, expected, true);
    });
});

describe('formatTextSegmentBeforeSelectionMarker - transformHyphen', () => {
    function runTest(
        input: ContentModelDocument,
        expectedModel: ContentModelDocument,
        expectedResult: boolean
    ) {
        const formatWithContentModelSpy = jasmine
            .createSpy('formatWithContentModel')
            .and.callFake((callback, options) => {
                const result = callback(input, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                    canUndoByBackspace: true,
                });
                expect(result).toBe(expectedResult);
            });

        formatTextSegmentBeforeSelectionMarker(
            {
                focus: () => {},
                formatContentModel: formatWithContentModelSpy,
            } as any,
            (_model, previousSegment, paragraph, context) => {
                return transformHyphen(previousSegment, paragraph, context);
            }
        );

        expect(formatWithContentModelSpy).toHaveBeenCalled();
        expect(input).toEqual(expectedModel);
    }

    it('No hyphen', () => {
        const input: ContentModelDocument = {
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
        runTest(input, input, false);
    });

    it('with hyphen', () => {
        const text = 'test--test';
        spyOn(text, 'split').and.returnValue(['test--test ']);
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: text,
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

        const expected: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test—tes',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'Text',
                            text: 't',
                            format: {},
                            isSelected: undefined,
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
        runTest(input, expected, true);
    });

    it('with hyphen and left space', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test-- test',
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

        runTest(input, input, false);
    });

    it('with hyphen and left space', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test --test',
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

        runTest(input, input, false);
    });

    it('with hyphen between spaces', () => {
        const text = 'test -- test';
        spyOn(text, 'split').and.returnValue(['test', '--', 'test']);
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test -- test',
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

        const expected: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test ',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'Text',
                            text: '—',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'Text',
                            text: ' test',
                            format: {},
                            isSelected: undefined,
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
        runTest(input, expected, true);
    });

    it('with hyphen and multiple words', () => {
        const text = 'testing test--test';
        spyOn(text, 'split').and.returnValue(['testing', 'test--test ']);
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: text,
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

        const expected: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'testing ',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'Text',
                            text: 'test—tes',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'Text',
                            text: 't',
                            format: {},
                            isSelected: undefined,
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
        runTest(input, expected, true);
    });
});
