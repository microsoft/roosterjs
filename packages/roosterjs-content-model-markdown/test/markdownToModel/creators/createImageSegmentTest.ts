import { ContentModelImage } from 'roosterjs-content-model-types';
import { createImage } from 'roosterjs-content-model-dom';
import { createImageSegment } from '../../../lib/markdownToModel/creators/createImageSegment';

describe('createImageSegment', () => {
    function runTest(text: string, url: string, imageSegment: ContentModelImage) {
        const result = createImageSegment(text, url);
        expect(result).toEqual(imageSegment);
    }

    it('should return image segment', () => {
        const imageSegment = createImage('https://www.example.com/image');
        imageSegment.alt = 'image';
        runTest('image', 'https://www.example.com/image', imageSegment);
    });

    it('should return image segment | longer text segment', () => {
        const imageSegment = createImage('https://www.example.com/image');
        imageSegment.alt = 'image of a dog';
        runTest('image of a dog', 'https://www.example.com/image', imageSegment);
    });
});
