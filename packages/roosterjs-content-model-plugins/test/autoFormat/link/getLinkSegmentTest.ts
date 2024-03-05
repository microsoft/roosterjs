import getLinkSegment from '../../../lib/autoFormat/link/getLinkSegment';
import { ContentModelDocument, ContentModelText } from 'roosterjs-content-model-types';

describe('getLinkSegment', () => {
    function runTest(model: ContentModelDocument, link: ContentModelText | undefined) {
        const result = getLinkSegment(model);
        expect(result).toEqual(link);
    }

    it('no selected segments', () => {
        const model: ContentModelDocument = {
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
        runTest(model, undefined);
    });

    it('no link segment', () => {
        const model: ContentModelDocument = {
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
        runTest(model, undefined);
    });

    it('link segment starting with WWW', () => {
        const model: ContentModelDocument = {
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
        runTest(model, {
            segmentType: 'Text',
            text: 'www.bing.com',
            format: {},
        });
    });

    it('link segment starting with hyperlink', () => {
        const model: ContentModelDocument = {
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
        runTest(model, {
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
        });
    });

    it('link segment starting with text and hyperlink', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'bing',
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
        runTest(model, {
            segmentType: 'Text',
            text: 'bing',
            format: {},
            link: {
                format: {
                    href: 'www.bing.com',
                    underline: true,
                },
                dataset: {},
            },
        });
    });
});
