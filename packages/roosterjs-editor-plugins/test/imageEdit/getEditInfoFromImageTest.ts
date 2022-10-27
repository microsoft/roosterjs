import ImageEditInfo from '../../lib/plugins/ImageEdit/types/ImageEditInfo';
import { getEditInfoFromImage } from '../../lib/plugins/ImageEdit/editInfoUtils/editInfo';

const IMG_SRC =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAALUlEQVQ4EWNgYGD4T2U8lAz8TyZACzKEl8k0Dz0OhpKBaGGB7hVi+QgvD0oDATe/bqDDw39VAAAAAElFTkSuQmCC';
const WIDTH = 20;
const HEIGHT = 10;
const IMAGE_EDIT_EDITINFO_NAME = 'editingInfo';

describe('getEditInfoFromImage', () => {
    it('getEditInfoFromImage() returns the edit info of the empty image', () => {
        const img = document.createElement('img');
        const editInfo = getEditInfoFromImage(img);

        expect(editInfo).toEqual({
            src: '',
            widthPx: 0,
            heightPx: 0,
            naturalWidth: 0,
            naturalHeight: 0,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 0,
        });
    });

    it('getEditInfoFromImage() returns the edit info of an image', async () => {
        const img = await loadImage(IMG_SRC);
        const editInfo = getEditInfoFromImage(img);

        expect(editInfo).toEqual({
            src: IMG_SRC,
            widthPx: 0,
            heightPx: 0,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 0,
        });
    });

    it('getEditInfoFromImage() returns the edit info of an image which already has edit info', async () => {
        const img = await loadImage(IMG_SRC);
        const expectedEditInfo: ImageEditInfo = {
            src: IMG_SRC,
            widthPx: 100,
            heightPx: 100,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            leftPercent: 0.1,
            rightPercent: 0.2,
            topPercent: 0.3,
            bottomPercent: 0.4,
            angleRad: 0.5,
        };
        img.dataset[IMAGE_EDIT_EDITINFO_NAME] = JSON.stringify(expectedEditInfo);
        const editInfo = getEditInfoFromImage(img);

        expect(editInfo).toEqual(expectedEditInfo);
    });

    it('getEditInfoFromImage() returns the edit info of an image which already has invalid edit info', async () => {
        const img = await loadImage(IMG_SRC);
        const expectedEditInfo: ImageEditInfo = <any>{
            src: IMG_SRC,
            widthPx: <any>'a',
            heightPx: 100,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            rightPercent: 0.2,
            topPercent: 0.3,
            bottomPercent: 0.4,
            angleRad: 0.5,
        };
        img.dataset[IMAGE_EDIT_EDITINFO_NAME] = JSON.stringify(expectedEditInfo);
        const editInfo = getEditInfoFromImage(img);

        expect(editInfo).toEqual({
            src: IMG_SRC,
            widthPx: 0,
            heightPx: 0,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 0,
        });
    });
});

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>(resolve => {
        const img = document.createElement('img');
        const result = () => {
            img.onload = null;
            img.onerror = null;
            resolve(img);
        };
        img.onload = result;
        img.onerror = result;
        img.src = src;
    });
}
