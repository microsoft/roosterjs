import { transformOrdinals } from '../../../lib/autoFormat/numbers/transformOrdinals';
import {
    ContentModelParagraph,
    ContentModelText,
    FormatContentModelContext,
} from 'roosterjs-content-model-types';

describe('transformOrdinals', () => {
    function runTest(
        previousSegment: ContentModelText,
        paragraph: ContentModelParagraph,
        context: FormatContentModelContext,
        expectedResult: boolean
    ) {
        const result = transformOrdinals(previousSegment, paragraph, context);
        expect(result).toBe(expectedResult);
    }

    it('with no numbers', () => {
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

    it('with 1st', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: '1st',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, true);
    });

    it('with 2nd', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: '2nd',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, true);
    });

    it('with 3rd', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: '3rd',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, true);
    });

    it('with 4th', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: '4th',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, true);
    });

    it('with 21th', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: '21th',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, true);
    });

    it('with 2th', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: '2th',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
    });

    it('with first', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'first',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
    });

    it('word and th', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: '12-month',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
    });

    it('word and rd', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: '13-rd',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
    });

    it('word and nd', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: '14-second',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
    });

    it('large number', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: '145th',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, true);
    });

    it('link - 1st', () => {
        const link: ContentModelText = {
            segmentType: 'Text',
            text: '1',
            link: {
                dataset: {},
                format: {
                    href: 'http://www.bing.com',
                },
            },
            format: {},
        };
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'st',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [link, segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, true);
    });

    it('link - 2nd', () => {
        const link: ContentModelText = {
            segmentType: 'Text',
            text: '2',
            link: {
                dataset: {},
                format: {
                    href: 'http://www.bing.com',
                },
            },
            format: {},
        };
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'nd',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [link, segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, true);
    });

    it('link - 3rd', () => {
        const link: ContentModelText = {
            segmentType: 'Text',
            text: '3',
            link: {
                dataset: {},
                format: {
                    href: 'http://www.bing.com',
                },
            },
            format: {},
        };
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'rd',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [link, segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, true);
    });

    it('link - 4th', () => {
        const link: ContentModelText = {
            segmentType: 'Text',
            text: '4',
            link: {
                dataset: {},
                format: {
                    href: 'http://www.bing.com',
                },
            },
            format: {},
        };
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'th',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [link, segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, true);
    });

    it('link - 123th', () => {
        const link: ContentModelText = {
            segmentType: 'Text',
            text: '123',
            link: {
                dataset: {},
                format: {
                    href: 'http://www.bing.com',
                },
            },
            format: {},
        };
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'th',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [link, segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, true);
    });

    it('link - 3th', () => {
        const link: ContentModelText = {
            segmentType: 'Text',
            text: '3',
            link: {
                dataset: {},
                format: {
                    href: 'http://www.bing.com',
                },
            },
            format: {},
        };
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'th',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [link, segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
    });
    it('link - 24e5th', () => {
        const link: ContentModelText = {
            segmentType: 'Text',
            text: '24e5',
            link: {
                dataset: {},
                format: {
                    href: 'http://www.bing.com',
                },
            },
            format: {},
        };
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'th',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [link, segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
    });
});
