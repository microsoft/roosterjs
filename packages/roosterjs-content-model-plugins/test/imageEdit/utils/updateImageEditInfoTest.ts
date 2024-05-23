import { createImage } from 'roosterjs-content-model-dom';
import { updateImageEditInfo } from '../../../lib/imageEdit/utils/updateImageEditInfo';

describe('updateImageEditInfo', () => {
    it('get image edit info', () => {
        const image = document.createElement('img');
        const contentModelImage = createImage('test');
        const result = updateImageEditInfo(contentModelImage, image, {
            widthPx: 10,
            heightPx: 10,
        });
        expect(result).toEqual({
            widthPx: 10,
            heightPx: 10,
        });
    });
});
