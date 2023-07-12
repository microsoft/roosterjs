import { adjustTrailingSpaceSelection } from '../../../lib/publicApi/utils/adjustTrailingSpaceSelection';
import { ContentModelParagraph, ContentModelSegment } from 'roosterjs-content-model-types';

describe('adjustTrailingSpaceSelection', () => {
    function runTest(
        segmentAndParagraphs: [ContentModelSegment, ContentModelParagraph | null][],
        result: [ContentModelSegment | null, ContentModelParagraph | null][]
    ) {
        const adjustedResult = adjustTrailingSpaceSelection(segmentAndParagraphs);
        expect(adjustedResult).toEqual(result);
    }

    describe('Adjust trailing space -', () => {
        it('No trailing space', () => {
            const segment: ContentModelSegment = {
                format: { underline: true },
                isSelected: true,
                segmentType: 'Text',
                text: 'test',
            };
            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [segment],
                format: {},
            };
            const segmentAndParagraphs: [ContentModelSegment, ContentModelParagraph | null][] = [
                [segment, paragraph],
            ];
            const result: [ContentModelSegment, ContentModelParagraph | null][] = [
                [segment, paragraph],
            ];
            runTest(segmentAndParagraphs, result);
        });

        it('With trailing space', () => {
            const segmentAndParagraphs: [ContentModelSegment, ContentModelParagraph | null][] = [
                [
                    {
                        segmentType: 'Text',
                        text: 'test.      ',
                        format: {
                            underline: true,
                        },
                        isSelected: true,
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test.',
                                format: {
                                    underline: true,
                                },
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                text: '      ',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
            ];
            const result: [ContentModelSegment | null, ContentModelParagraph | null][] = [
                [
                    {
                        segmentType: 'Text',
                        text: 'test.',
                        format: {
                            underline: true,
                        },
                        isSelected: true,
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test.',
                                format: {
                                    underline: true,
                                },
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                text: '      ',
                                format: {},
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
            ];
            runTest(segmentAndParagraphs, result);
        });

        it('Only trailing space selected', () => {
            const segmentAndParagraphs: [
                ContentModelSegment | null,
                ContentModelParagraph | null
            ][] = [
                [
                    {
                        segmentType: 'Text',
                        text: '    ',
                        format: {
                            underline: true,
                        },
                        isSelected: true,
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test. ',
                                format: {},
                            },
                            {
                                segmentType: 'Text',
                                text: '    ',
                                format: {
                                    underline: true,
                                },
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
            ];
            const result: [ContentModelSegment | null, ContentModelParagraph | null][] = [
                [
                    {
                        segmentType: 'Text',
                        text: '    ',
                        format: {
                            underline: true,
                        },
                        isSelected: true,
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test. ',
                                format: {},
                            },
                            {
                                segmentType: 'Text',
                                text: '    ',
                                format: {
                                    underline: true,
                                },
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
            ];
            runTest(segmentAndParagraphs, result);
        });

        it('Space between two words', () => {
            const segmentAndParagraphs: [
                ContentModelSegment | null,
                ContentModelParagraph | null
            ][] = [
                [
                    {
                        segmentType: 'Text',
                        text: 'aaaaa   bbbbb',
                        format: {
                            underline: true,
                        },
                        isSelected: true,
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'aaaaa   bbbbb',
                                format: {
                                    underline: true,
                                },
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
            ];
            const result: [ContentModelSegment | null, ContentModelParagraph | null][] = [
                [
                    {
                        segmentType: 'Text',
                        text: 'aaaaa   bbbbb',
                        format: {
                            underline: true,
                        },
                        isSelected: true,
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'aaaaa   bbbbb',
                                format: {
                                    underline: true,
                                },
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
            ];
            runTest(segmentAndParagraphs, result);
        });

        it('Multiline selection', () => {
            const segmentAndParagraphs: [
                ContentModelSegment | null,
                ContentModelParagraph | null
            ][] = [
                [
                    {
                        segmentType: 'Text',
                        text: 'test.       ',
                        format: {
                            underline: true,
                        },
                        isSelected: true,
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test.       ',
                                format: {
                                    underline: true,
                                },
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
                [
                    {
                        segmentType: 'Text',
                        text: 'multi. line.     ',
                        format: {
                            underline: true,
                        },
                        isSelected: true,
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'multi. line.     ',
                                format: {
                                    underline: true,
                                },
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
            ];
            const result: [ContentModelSegment | null, ContentModelParagraph | null][] = [
                [
                    {
                        segmentType: 'Text',
                        text: 'test.',
                        format: {
                            underline: true,
                        },
                        isSelected: true,
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test.',
                                format: {
                                    underline: true,
                                },
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                text: '       ',
                                format: {
                                    underline: true,
                                },
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
                [
                    {
                        segmentType: 'Text',
                        text: 'multi. line.',
                        format: {
                            underline: true,
                        },
                        isSelected: true,
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'multi. line.',
                                format: {
                                    underline: true,
                                },
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                text: '     ',
                                format: {
                                    underline: true,
                                },
                                isSelected: true,
                            },
                        ],
                        format: {},
                    },
                ],
            ];
            runTest(segmentAndParagraphs, result);
        });
    });
});
