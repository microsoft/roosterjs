import { ContentModelSegmentFormat, ContentModelText } from 'roosterjs-content-model-types';
import { splitTextSegment } from '../../lib/pluginUtils/splitTextSegment';

describe('splitTextSegment', () => {
    function runTest(
        text: string,
        start: number,
        expectedResult: ContentModelText,
        end?: number | undefined,
        format?: ContentModelSegmentFormat | undefined
    ) {
        const result = splitTextSegment(text, start, end, format);
        expect(result).toEqual(expectedResult);
    }

    it('splitTextSegment with end', () => {
        runTest('test', 0, { text: 'te', format: {}, segmentType: 'Text' }, 2, undefined);
    });

    it('splitTextSegment without end', () => {
        runTest('test', 2, { text: 'st', format: {}, segmentType: 'Text' });
    });

    it('splitTextSegment with format', () => {
        runTest('test', 0, { text: 'te', format: { italic: true }, segmentType: 'Text' }, 2, {
            italic: true,
        });
    });
});
