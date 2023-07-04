import { adjustWordSelection } from '../../../lib/modelApi/selection/adjustWordSelection';
import {
    ContentModelBlock,
    ContentModelDocument,
    ContentModelSegment,
} from 'roosterjs-content-model-types';

const defaultMarker: ContentModelSegment = {
    segmentType: 'SelectionMarker',
    format: {},
    isSelected: true,
};

describe('adjustWordSelection', () => {
    function runTest(
        model: ContentModelDocument,
        result: ContentModelSegment[],
        modelResult: ContentModelDocument
    ) {
        const adjustedResult = adjustWordSelection(model, defaultMarker);
        expect(adjustedResult).toEqual(result);
        expect(model).toEqual(modelResult);
        expect(adjustedResult).toContain(defaultMarker);
    }

    describe('Apply format -', () => {
        it('Adjust No Words', () => {
            //'|'
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [defaultMarker],
                    },
                ],
            };
            runTest(model, [defaultMarker], {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [defaultMarker],
                    },
                ],
            });
        });

        it('Adjust Spaces', () => {
            //'    |    '
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: '    ',
                                format: {},
                            },
                            defaultMarker,
                            {
                                segmentType: 'Text',
                                text: '    ',
                                format: {},
                            },
                        ],
                    },
                ],
            };
            runTest(model, [defaultMarker], {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: '    ',
                                format: {},
                            },
                            defaultMarker,
                            {
                                segmentType: 'Text',
                                text: '    ',
                                format: {},
                            },
                        ],
                    },
                ],
            });
        });

        it('Adjust Single Word - Before', () => {
            //'|Word'
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            defaultMarker,
                            {
                                segmentType: 'Text',
                                text: 'Word',
                                format: {},
                            },
                        ],
                    },
                ],
            };
            runTest(model, [defaultMarker], {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            defaultMarker,
                            {
                                segmentType: 'Text',
                                text: 'Word',
                                format: {},
                            },
                        ],
                    },
                ],
            });
        });

        it('Adjust Single Word - Middle', () => {
            //'Wo|rd'
            const result: ContentModelSegment[] = [
                {
                    segmentType: 'Text',
                    text: 'Wo',
                    format: {},
                },
                defaultMarker,
                {
                    segmentType: 'Text',
                    text: 'rd',
                    format: {},
                },
            ];
            runTest(
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: result,
                        },
                    ],
                },
                result,
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: result,
                        },
                    ],
                }
            );
        });

        it('Adjust Single Word - After', () => {
            //'Word|'
            const model: ContentModelDocument = {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Word',
                                format: {},
                            },
                            defaultMarker,
                        ],
                    },
                ],
            };
            runTest(model, [defaultMarker], {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'Word',
                                format: {},
                            },
                            defaultMarker,
                        ],
                    },
                ],
            });
        });

        it('Adjust Multiple Words', () => {
            //'Subject Ve|rb Object'
            const result: ContentModelSegment[] = [
                {
                    segmentType: 'Text',
                    text: 'Ve',
                    format: {},
                },
                defaultMarker,
                {
                    segmentType: 'Text',
                    text: 'rb',
                    format: {},
                },
            ];
            runTest(
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'Subject Ve',
                                    format: {},
                                },
                                defaultMarker,
                                {
                                    segmentType: 'Text',
                                    text: 'rb Object',
                                    format: {},
                                },
                            ],
                        },
                    ],
                },
                result,
                {
                    blockGroupType: 'Document',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            format: {},
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'Subject ',
                                    format: {},
                                },
                                {
                                    segmentType: 'Text',
                                    text: 'Ve',
                                    format: {},
                                },
                                defaultMarker,
                                {
                                    segmentType: 'Text',
                                    text: 'rb',
                                    format: {},
                                },
                                {
                                    segmentType: 'Text',
                                    text: ' Object',
                                    format: {},
                                },
                            ],
                        },
                    ],
                }
            );
        });
    });
});
