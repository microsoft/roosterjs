import getEditInfoFromImage from '../../lib/plugins/ImageEdit/editInfoUtils/getEditInfoFromImage';

const IMG_SRC =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAALUlEQVQ4EWNgYGD4T2U8lAz8TyZACzKEl8k0Dz0OhpKBaGGB7hVi+QgvD0oDATe/bqDDw39VAAAAAElFTkSuQmCC';
const WIDTH = 20;
const HEIGHT = 10;
const IMAGE_EDIT_EDITINFO_NAME = 'roosterEditInfo';

describe('getEditInfoFromImage', () => {
    it('getEditInfoFromImage() returns the edit info of the empty image', () => {
        const img = document.createElement('img');
        const editInfo = getEditInfoFromImage(img);

        expect(editInfo).toEqual({
            src: '',
            width: 0,
            height: 0,
            naturalWidth: 0,
            naturalHeight: 0,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            angle: 0,
        });
    });

    it('getEditInfoFromImage() returns the edit info of an image', async () => {
        const img = await loadImage(IMG_SRC);
        const editInfo = getEditInfoFromImage(img);

        expect(editInfo).toEqual({
            src: IMG_SRC,
            width: 0,
            height: 0,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            angle: 0,
        });
    });

    it('getEditInfoFromImage() returns the edit info of an image which already has edit info', async () => {
        const img = await loadImage(IMG_SRC);
        const expectedEditInfo = {
            src: IMG_SRC,
            width: 100,
            height: 100,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            left: 0.1,
            right: 0.2,
            top: 0.3,
            bottom: 0.4,
            angle: 0.5,
        };
        img.dataset[IMAGE_EDIT_EDITINFO_NAME] = JSON.stringify(expectedEditInfo);
        const editInfo = getEditInfoFromImage(img);

        expect(editInfo).toEqual(expectedEditInfo);
    });

    it('getEditInfoFromImage() returns the edit info of an image which already has invalid edit info', async () => {
        const img = await loadImage(IMG_SRC);
        const expectedEditInfo = {
            src: IMG_SRC,
            width: 'a',
            height: 100,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            right: 0.2,
            top: 0.3,
            bottom: 0.4,
            angle: 0.5,
        };
        img.dataset[IMAGE_EDIT_EDITINFO_NAME] = JSON.stringify(expectedEditInfo);
        const editInfo = getEditInfoFromImage(img);

        expect(editInfo).toEqual({
            src: IMG_SRC,
            width: 0,
            height: 0,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            angle: 0,
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
