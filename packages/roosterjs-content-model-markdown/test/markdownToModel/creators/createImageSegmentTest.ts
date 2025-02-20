import { ContentModelImage, ContentModelText } from 'roosterjs-content-model-types';
import { createImage, createText } from 'roosterjs-content-model-dom';
import { createImageSegment } from '../../../lib/markdownToModel/creators/createImageSegment';

describe('createImageSegment', () => {
    function runTest(textSegment: ContentModelText, imageSegment: ContentModelImage | undefined) {
        const result = createImageSegment(textSegment);
        expect(result).toEqual(imageSegment);
    }

    it('should return image segment', () => {
        const textSegment = createText('![image](https://www.example.com/image))');
        const imageSegment = createImage('https://www.example.com/image');
        imageSegment.alt = 'image';
        runTest(textSegment, imageSegment);
    });

    it('should return image segment | longer text segment', () => {
        const textSegment = createText('![image of a dog](https://www.example.com/image))');
        const imageSegment = createImage('https://www.example.com/image');
        imageSegment.alt = 'image of a dog';
        runTest(textSegment, imageSegment);
    });

    it('should not return image segment', () => {
        const textSegment = createText('[image](https://www.example.com/image))');
        runTest(textSegment, undefined);
    });
});
