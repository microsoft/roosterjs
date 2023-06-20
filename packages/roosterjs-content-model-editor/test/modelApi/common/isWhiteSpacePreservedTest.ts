import { ContentModelParagraph } from '../../../lib/publicTypes/block/ContentModelParagraph';
import { isWhiteSpacePreserved } from '../../../lib/modelApi/common/isWhiteSpacePreserved';

describe('isWhiteSpacePreserved', () => {
    function runTest(style: string | undefined, expected: boolean) {
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            format: {},
            segments: [],
        };

        if (style) {
            paragraph.format.whiteSpace = style;
        }

        const result = isWhiteSpacePreserved(paragraph);
        expect(result).toBe(expected);
    }

    it('isWhiteSpacePreserved', () => {
        runTest(undefined, false);
        runTest('normal', false);
        runTest('nowrap', false);
        runTest('pre', true);
        runTest('pre-wrap', true);
        runTest('pre-line', false);
        runTest('break-spaces', true);
    });
});
