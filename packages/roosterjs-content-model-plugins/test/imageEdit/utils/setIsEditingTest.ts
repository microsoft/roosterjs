import { createImage, createParagraph } from 'roosterjs-content-model-dom';
import { ImageAndParagraph } from '../../../lib/imageEdit/types/ImageAndParagraph';
import { setIsEditing } from '../../../lib/imageEdit/utils/setIsEditing';

describe('setIsEditing', () => {
    function runTest(isEditing: boolean) {
        const paragraph = createParagraph();
        const image = createImage('test');
        paragraph.segments.push(image);
        const imageAndParagraph: ImageAndParagraph = { paragraph, image };
        setIsEditing(imageAndParagraph, isEditing);
        expect((image.format as any).isEditing).toBe(isEditing);
    }

    it('setIsEditing true', () => {
        runTest(true);
    });

    it('setIsEditing false', () => {
        runTest(false);
    });
});
