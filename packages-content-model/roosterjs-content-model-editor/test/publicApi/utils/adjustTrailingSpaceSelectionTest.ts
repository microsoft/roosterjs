import { adjustTrailingSpaceSelection } from '../../../lib/publicApi/utils/adjustTrailingSpaceSelection';
import { ContentModelParagraph, ContentModelSegment } from 'roosterjs-content-model-types';

describe('adjustTrailingSpaceSelection', () => {
    function runTest(
        segment: ContentModelSegment,
        paragraph: ContentModelParagraph,
        result: [ContentModelSegment | null, ContentModelParagraph | null]
    ) {
        const adjustedResult = adjustTrailingSpaceSelection(segment, paragraph);
        expect(adjustedResult).toEqual(result);
    }

    describe('Adjust trailing space -', () => {
        it('No trailing space', () => {
            const segment: ContentModelSegment = {
                segmentType: 'Text',
                text: 'test',
                format: {},
            };
            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    segment,
                ],
                format: {},
            };
            const result: [ContentModelSegment | null, ContentModelParagraph | null] = [
                segment,
                paragraph,
            ];
            runTest(segment, paragraph, result);
        });

        it('With trailing space', () => {
            const segment: ContentModelSegment = {
                segmentType: 'Text',
                text: 'test.     ',
                format: {},
            };
            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [segment],
                format: {},
            };
            const result: [ContentModelSegment | null, ContentModelParagraph | null] = [
                {
                    segmentType: 'Text',
                    text: 'test.',
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test.',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: '     ',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ];
            runTest(segment, paragraph, result);
        });

        it('Formatted text with trailing space', () => {
            const segment: ContentModelSegment = {
                segmentType: 'Text',
                text: 'test.',
                format: { underline: true },
            };
            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text: 'test.',
                        format: { underline: true },
                    },
                    {
                        segmentType: 'Text',
                        text: '     ',
                        format: {},
                    },
                ],
                format: {},
            };
            const result: [ContentModelSegment | null, ContentModelParagraph | null] = [
                segment,
                paragraph,
            ];
            runTest(segment, paragraph, result);
        });

        it('Formatted trailing space segment', () => {
            const segment: ContentModelSegment = {
                segmentType: 'Text',
                text: '     ',
                format: {},
            };
            const paragraph: ContentModelParagraph = {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'Text',
                        text: 'test.',
                        format: { underline: true, fontWeight: 'bold' },
                    },
                    {
                        segmentType: 'Text',
                        text: '     ',
                        format: {},
                    },
                ],
                format: {},
            };
            const result: [ContentModelSegment | null, ContentModelParagraph | null] = [
                {
                    segmentType: 'Text',
                    text: '     ',
                    format: {},
                },
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test.',
                            format: { underline: true, fontWeight: 'bold' },
                        },
                        segment,
                    ],
                    format: {},
                },
            ];
            runTest(segment, paragraph, result);
        });
    });
});
