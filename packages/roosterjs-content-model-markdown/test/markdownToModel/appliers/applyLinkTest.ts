import { applyLink } from '../../../lib/markdownToModel/appliers/applyLink';
import { ContentModelText } from 'roosterjs-content-model-types';
import { createText } from 'roosterjs-content-model-dom';

describe('applyLink', () => {
    function runTest(text: string, url: string, expectedSegment: ContentModelText) {
        const textSegment = createText(text);
        const result = applyLink(textSegment, text, url);
        expect(result).toEqual(expectedSegment);
    }

    it('should apply link to text segment', () => {
        const linkSegment = createText('link');
        linkSegment.link = {
            dataset: {},
            format: {
                href: 'https://www.example.com',
                underline: true,
            },
        };
        runTest('link', 'https://www.example.com', linkSegment);
    });

    it('should apply link to text segment with space in text', () => {
        const linkSegmentWith = createText('link with space');
        linkSegmentWith.link = {
            dataset: {},
            format: {
                href: 'https://www.example.com',
                underline: true,
            },
        };
        runTest('link with space', 'https://www.example.com', linkSegmentWith);
    });
});
