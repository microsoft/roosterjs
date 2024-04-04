import { createLinkAfterSpace } from '../../../lib/autoFormat/link/createLinkAfterSpace';
import {
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
