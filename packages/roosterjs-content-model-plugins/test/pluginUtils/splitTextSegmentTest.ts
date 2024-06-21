import { ContentModelParagraph, ContentModelText } from 'roosterjs-content-model-types';
import { splitTextSegment } from 'roosterjs-content-model-api';

describe('splitTextSegment', () => {
    function runTest(
        textSegment: ContentModelText,
        parent: ContentModelParagraph,
        start: number,
        end: number,
        expectedResult: ContentModelText
    ) {
        const result = splitTextSegment(textSegment, parent, start, end);
        expect(result).toEqual(expectedResult);
    }

    it('splitTextSegment', () => {
        const textSegment: ContentModelText = {
            text: 'test test',
            format: {},
            segmentType: 'Text',
        };
        const parent: ContentModelParagraph = {
            segments: [textSegment],
            blockType: 'Paragraph',
            format: {},
        };
        runTest(textSegment, parent, 0, 2, {
            text: 'te',
            format: {},
            segmentType: 'Text',
            isSelected: undefined,
        });
    });

    it('splitTextSegment with selection', () => {
        const textSegment: ContentModelText = {
            text: 'test test',
            format: {},
            segmentType: 'Text',
            isSelected: true,
        };
        const parent: ContentModelParagraph = {
            segments: [textSegment],
            blockType: 'Paragraph',
            format: {},
        };
        runTest(textSegment, parent, 0, 2, {
            text: 'te',
            format: {},
            segmentType: 'Text',
            isSelected: true,
        });
    });

    it('splitTextSegment with decorators', () => {
        const textSegment: ContentModelText = {
            text: 'test test',
            format: {},
            segmentType: 'Text',
            isSelected: true,
            link: {
                format: {
                    href: 'test',
                },
                dataset: {},
            },
            code: {
                format: {
                    fontFamily: 'Consolas',
                },
            },
        };
        const parent: ContentModelParagraph = {
            segments: [textSegment],
            blockType: 'Paragraph',
            format: {},
        };
        runTest(textSegment, parent, 0, 2, {
            text: 'te',
            format: {},
            segmentType: 'Text',
            isSelected: true,
            link: {
                format: {
                    href: 'test',
                },
                dataset: {},
            },
            code: {
                format: {
                    fontFamily: 'Consolas',
                },
            },
        });
    });
});
