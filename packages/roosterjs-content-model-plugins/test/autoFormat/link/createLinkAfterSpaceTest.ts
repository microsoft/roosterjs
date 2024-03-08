import { ContentModelDocument } from 'roosterjs-content-model-types';
import { createLinkAfterSpace } from '../../../lib/autoFormat/link/createLinkAfterSpace';

describe('createLinkAfterSpace', () => {
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
                });
                expect(result).toBe(expectedResult);
            });

        createLinkAfterSpace({
            focus: () => {},
            formatContentModel: formatWithContentModelSpy,
        } as any);

        expect(formatWithContentModelSpy).toHaveBeenCalled();
        expect(input).toEqual(expectedModel);
    }

    it('no selected segments', () => {
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
            format: {},
        };
        runTest(input, input, false);
    });

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
                            text: '',
                            format: {},
                        },
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

        runTest(input, input, false);
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
                        },
                        {
                            segmentType: 'Text',
                            text: 'www.bing.com',
                            format: {},
                            link: {
                                format: {
                                    underline: true,
                                    href: 'www.bing.com',
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
});
