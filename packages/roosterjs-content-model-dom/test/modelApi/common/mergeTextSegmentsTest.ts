import { createParagraph } from '../../../lib/modelApi/creators/createParagraph';
import { mergeTextSegments } from '../../../lib/modelApi/common/mergeTextSegments';
import type { ContentModelSegment, ContentModelParagraph } from 'roosterjs-content-model-types';

describe('mergeTextSegments', () => {
    function runTest(input: ContentModelSegment[], expectedResult: ContentModelSegment[]) {
        const paragraph = createParagraph();

        paragraph.segments = input;

        mergeTextSegments(paragraph);

        const expectedParagraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
            segments: expectedResult,
        };

        expect(paragraph).toEqual(expectedParagraph);
    }

    it('Empty paragraph', () => {
        runTest([], []);
    });

    it('Single text segment', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: {},
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: {},
                },
            ]
        );
    });

    it('Two text segments, same format', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abcdef',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ]
        );
    });

    it('Two text segments, same format, with space - 1', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: ' abc ',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: ' def ',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: ' abc  def ',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ]
        );
    });

    it('Two text segments, same format, with space - 2', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: ' def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ]
        );
    });

    it('Two text segments, different format - 1', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt', italic: true },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt', italic: true },
                },
            ]
        );
    });

    it('Two text segments, different format - 2', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos' },
                },
            ]
        );
    });

    it('Two text segments, different format - 3', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '14pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '14pt' },
                },
            ]
        );
    });

    it('Two text segments, one has link', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    link: {
                        dataset: {},
                        format: {},
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    link: {
                        dataset: {},
                        format: {},
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ]
        );
    });

    it('Two text segments, both have same link', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    link: {
                        dataset: {},
                        format: {},
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    link: {
                        dataset: {},
                        format: {},
                    },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abcdef',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    link: {
                        dataset: {},
                        format: {},
                    },
                },
            ]
        );
    });

    it('Two text segments, both have different link', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    link: {
                        dataset: {},
                        format: { href: 'url1' },
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    link: {
                        dataset: {},
                        format: { href: 'url2' },
                    },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    link: {
                        dataset: {},
                        format: { href: 'url1' },
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    link: {
                        dataset: {},
                        format: { href: 'url2' },
                    },
                },
            ]
        );
    });

    it('Two text segments, one has code', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    code: {
                        format: {},
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    code: {
                        format: {},
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ]
        );
    });

    it('Two text segments, both have same code', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    code: {
                        format: {},
                    },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    code: {
                        format: {},
                    },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abcdef',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                    code: {
                        format: {},
                    },
                },
            ]
        );
    });

    it('Two text segments around selection marker', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ]
        );
    });

    it('Two text segments after selection marker', () => {
        runTest(
            [
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                },
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            [
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                },
                {
                    segmentType: 'Text',
                    text: 'abcdef',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ]
        );
    });

    it('Two text segments before selection marker', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abcdef',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'SelectionMarker',
                    format: {},
                },
            ]
        );
    });

    it('Three text segments with same format', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'ghi',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abcdefghi',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
            ]
        );
    });

    it('Two pairs - 1', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'ghi',
                    format: { fontFamily: 'Aptos', fontSize: '14pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'jkl',
                    format: { fontFamily: 'Aptos', fontSize: '14pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abcdef',
                    format: { fontFamily: 'Aptos', fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'ghijkl',
                    format: { fontFamily: 'Aptos', fontSize: '14pt' },
                },
            ]
        );
    });

    it('Two pairs - 2', () => {
        runTest(
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontSize: '14pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'ghi',
                    format: { fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'jkl',
                    format: { fontSize: '14pt' },
                },
            ],
            [
                {
                    segmentType: 'Text',
                    text: 'abc',
                    format: { fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'def',
                    format: { fontSize: '14pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'ghi',
                    format: { fontSize: '12pt' },
                },
                {
                    segmentType: 'Text',
                    text: 'jkl',
                    format: { fontSize: '14pt' },
                },
            ]
        );
    });
});
