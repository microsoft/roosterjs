import { applyLink } from '../../../lib/markdownToModel/appliers/applyLink';
import { ContentModelText } from 'roosterjs-content-model-types';
import { createText } from 'roosterjs-content-model-dom';

describe('applyLink', () => {
    function runTest(text: string, expectedSegment: ContentModelText) {
        const textSegment = createText(text);
        const result = applyLink(textSegment);
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
        runTest('[link](https://www.example.com)', linkSegment);
    });

    it('should not apply link to text segment with space in link', () => {
        const textSegment = createText('[link](https://www.example.com/with space)');
        runTest('[link](https://www.example.com/with space)', textSegment);
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
        runTest('[link with space](https://www.example.com)', linkSegmentWith);
    });
});
