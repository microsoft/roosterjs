import { formatTextSegmentBeforeSelectionMarker } from 'roosterjs-content-model-api';
import { getPromoteLink, promoteLink } from '../../../lib/modelApi/link/promoteLink';
import {
    AutoLinkOptions,
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelText,
    PromotedLink,
} from 'roosterjs-content-model-types';

describe('promoteLink', () => {
    function runTest(
        previousSegment: ContentModelText,
        paragraph: ContentModelParagraph,
        expectedResult: ContentModelText | null
    ) {
        const result = promoteLink(previousSegment, paragraph, {
            autoLink: true,
            autoMailto: true,
            autoTel: true,
        });
        expect(result).toEqual(expectedResult);
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
        runTest(segment, paragraph, {
            segmentType: 'Text',
            text: 'http://bing.com',
            isSelected: undefined,
            format: {},
            link: {
                format: {
                    href: 'http://bing.com',
                    underline: true,
                },
                dataset: {},
            },
        });
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
        runTest(segment, paragraph, null);
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
        runTest(segment, paragraph, null);
    });

    it('with  link segment after link ', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'http://bing.com',
            format: {},
            link: {
                format: {
                    href: 'http://www.bing.com',
                    underline: true,
                },
                dataset: {},
            },
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, null);
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
            (_model, previousSegment, paragraph, _markerFormat) => {
                return !!promoteLink(previousSegment, paragraph, {
                    autoLink: true,
                    autoMailto: true,
                    autoTel: true,
                });
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

    it('telephone link', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'tel:9999-9999',
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
                            text: 'tel:9999-9999',
                            format: {},
                            link: {
                                format: {
                                    href: 'tel:9999-9999',
                                    underline: true,
                                },
                                dataset: {},
                            },
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

    it('telephone link with +', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'tel:+9999-9999',
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
                            text: 'tel:+9999-9999',
                            format: {},
                            link: {
                                format: {
                                    href: 'tel:+9999-9999',
                                    underline: true,
                                },
                                dataset: {},
                            },
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

    it('telephone link with T', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Tel:9999-9999',
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
                            text: 'Tel:9999-9999',
                            format: {},
                            link: {
                                format: {
                                    href: 'tel:9999-9999',
                                    underline: true,
                                },
                                dataset: {},
                            },
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

    it('mailto link', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'mailto:test',
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
                            text: 'mailto:test',
                            format: {},
                            link: {
                                format: {
                                    href: 'mailto:test',
                                    underline: true,
                                },
                                dataset: {},
                            },
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

    it('mailto link with M', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'Mailto:test',
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
                            text: 'Mailto:test',
                            format: {},
                            link: {
                                format: {
                                    href: 'mailto:test',
                                    underline: true,
                                },
                                dataset: {},
                            },
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

    it('telephone link with space', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'tel: 9999-9999',
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
                            text: 'tel: 9999-9999',
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
        runTest(input, expected, false);
    });

    it('mailto link with space', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'mailto: 9999-9999',
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
                            text: 'mailto: 9999-9999',
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
        runTest(input, expected, false);
    });

    it('telephone link spelled wrong', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'tels:9999-9999',
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
                            text: 'tels:9999-9999',
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
        runTest(input, expected, false);
    });

    it('mailto link spelled wrong', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'mailTo:9999-9999',
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
                            text: 'mailTo:9999-9999',
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
        runTest(input, expected, false);
    });
});

describe('getPromoteLink', () => {
    function runTest(
        text: string,
        autoLinkOptions: AutoLinkOptions,
        expectedResult: PromotedLink | undefined
    ) {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: text,
            format: {},
        };

        const result = getPromoteLink(segment, autoLinkOptions);
        expect(result).toEqual(expectedResult);
    }

    it('with http link', () => {
        runTest(
            'test http://bing.com',
            { autoLink: true, autoMailto: true, autoTel: true },
            { label: 'http://bing.com', href: 'http://bing.com' }
        );
    });

    it('with https link', () => {
        runTest(
            'test https://bing.com',
            { autoLink: true, autoMailto: true, autoTel: true },
            { label: 'https://bing.com', href: 'https://bing.com' }
        );
    });

    it('with www link', () => {
        runTest(
            'test www.bing.com',
            { autoLink: true, autoMailto: true, autoTel: true },
            { label: 'www.bing.com', href: 'http://www.bing.com' }
        );
    });

    it('with mailto link', () => {
        runTest(
            'test mailto:test@example.com',
            { autoLink: true, autoMailto: true, autoTel: true },
            { label: 'mailto:test@example.com', href: 'mailto:test@example.com' }
        );
    });

    it('with tel link', () => {
        runTest(
            'test tel:123-456-7890',
            { autoLink: true, autoMailto: true, autoTel: true },
            { label: 'tel:123-456-7890', href: 'tel:123-456-7890' }
        );
    });

    it('with Tel link (uppercase)', () => {
        runTest(
            'test Tel:123-456-7890',
            { autoLink: true, autoMailto: true, autoTel: true },
            { label: 'Tel:123-456-7890', href: 'tel:123-456-7890' }
        );
    });

    it('with Mailto link (uppercase)', () => {
        runTest(
            'test Mailto:test@example.com',
            { autoLink: true, autoMailto: true, autoTel: true },
            { label: 'Mailto:test@example.com', href: 'Mailto:test@example.com' }
        );
    });

    it('no link in text', () => {
        runTest('just plain text', { autoLink: true, autoMailto: true, autoTel: true }, undefined);
    });

    it('link in middle of text', () => {
        runTest(
            'http://bing.com followed by text',
            { autoLink: true, autoMailto: true, autoTel: true },
            undefined
        );
    });

    it('only link text', () => {
        runTest(
            'http://bing.com',
            { autoLink: true, autoMailto: true, autoTel: true },
            { label: 'http://bing.com', href: 'http://bing.com' }
        );
    });

    it('autoLink disabled', () => {
        runTest(
            'test http://bing.com',
            { autoLink: false, autoMailto: true, autoTel: true },
            undefined
        );
    });

    it('autoMailto disabled', () => {
        runTest(
            'test mailto:testdisabled@example.com',
            { autoLink: true, autoMailto: false, autoTel: true },
            undefined
        );
    });

    it('autoTel disabled', () => {
        runTest(
            'test tel:123-456-7890',
            { autoLink: true, autoMailto: true, autoTel: false },
            undefined
        );
    });

    it('empty text', () => {
        runTest('', { autoLink: true, autoMailto: true, autoTel: true }, undefined);
    });

    it('only spaces', () => {
        runTest('   ', { autoLink: true, autoMailto: true, autoTel: true }, undefined);
    });

    it('tel with space (should not match)', () => {
        runTest(
            'test tel: 123-456-7890',
            { autoLink: true, autoMailto: true, autoTel: true },
            undefined
        );
    });

    it('mailto with space (should not match)', () => {
        runTest(
            'test mailto: test@example.com',
            { autoLink: true, autoMailto: true, autoTel: true },
            undefined
        );
    });

    it('invalid tel format', () => {
        runTest(
            'test tels:123-456-7890',
            { autoLink: true, autoMailto: true, autoTel: true },
            undefined
        );
    });
});
