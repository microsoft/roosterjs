import { createLinkAfterSpace } from '../../../lib/autoFormat/link/createLinkAfterSpace';
import { formatTextSegmentBeforeSelectionMarker } from 'roosterjs-content-model-api';
import {
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelText,
    FormatContentModelContext,
} from 'roosterjs-content-model-types';

describe('createLinkAfterSpace', () => {
    function runTest(
        previousSegment: ContentModelText,
        paragraph: ContentModelParagraph,
        context: FormatContentModelContext,
        expectedResult: boolean
    ) {
        const result = createLinkAfterSpace(previousSegment, paragraph, context);
        expect(result).toBe(expectedResult);
    }

    it('with link', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'test http://bing.com',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, true);
    });

    it('No link', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
    });

    it('with  text after link ', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'http://bing.com test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
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
            (_model, previousSegment, paragraph, _markerFormat, context) => {
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
