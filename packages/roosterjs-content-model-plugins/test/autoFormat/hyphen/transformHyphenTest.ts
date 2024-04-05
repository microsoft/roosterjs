import { transformHyphen } from '../../../lib/autoFormat/hyphen/transformHyphen';
import {
    ContentModelParagraph,
    ContentModelText,
    FormatContentModelContext,
} from 'roosterjs-content-model-types';

describe('transformHyphen', () => {
    function runTest(
        previousSegment: ContentModelText,
        paragraph: ContentModelParagraph,
        context: FormatContentModelContext,
        expectedResult: boolean
    ) {
        const result = transformHyphen(previousSegment, paragraph, context);
        expect(result).toBe(expectedResult);
    }

    it('with hyphen', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'test--test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, true);
    });

    it('No hyphen', () => {
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

    it('with hyphen between spaces', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'test -- test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, true);
    });

    it('with hyphen at the end', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'test--',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
    });
    it('with hyphen at the start', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: '--test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
    });

    it('with hyphen and space right', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'test-- test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
    });

    it('with hyphen and space left', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'test --test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
    });

    it('with hyphen and more text', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'testing hyphen test test--test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, true);
    });

    it('text after dashes', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'test--test testing hyphen test',
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
