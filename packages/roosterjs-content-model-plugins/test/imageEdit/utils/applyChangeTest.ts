import { applyChange } from '../../../lib/imageEdit/utils/applyChange';
import { ChangeSource, createImage } from 'roosterjs-content-model-dom';
import type { IEditor, ImageMetadataFormat, PluginEventType } from 'roosterjs-content-model-types';

const IMG_SRC =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAALUlEQVQ4EWNgYGD4T2U8lAz8TyZACzKEl8k0Dz0OhpKBaGGB7hVi+QgvD0oDATe/bqDDw39VAAAAAElFTkSuQmCC';
const WIDTH = 20;
const HEIGHT = 10;
const IMAGE_EDIT_EDITINFO_NAME = 'editingInfo';
const contentModelImage = createImage(IMG_SRC);

describe('applyChange', () => {
    let img: HTMLImageElement;
    let editor: IEditor;
    let triggerEvent: jasmine.Spy;

    beforeEach(async () => {
        img = await loadImage(IMG_SRC);
        document.body.appendChild(img);
        triggerEvent = jasmine.createSpy('triggerEvent');
        editor = <IEditor>(<any>{
            triggerEvent: (type: PluginEventType, obj: any) => {
                triggerEvent();
                return {
                    eventType: type,
                    ...obj,
                };
            },
        });
    });

    afterEach(() => {
        img?.parentNode?.removeChild(img);
    });

    it('Write back with no change', async () => {
        const editInfo = getEditInfoFromImage(img);

        applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, false);

        expect(triggerEvent).not.toHaveBeenCalled();
        expect(img.outerHTML).toBe(`<img src="${IMG_SRC}">`);
    });

    it('Write back with resize only', async () => {
        const editInfo = getEditInfoFromImage(img);
        editInfo.widthPx = 100;
        applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, true);

        expect(triggerEvent).not.toHaveBeenCalled();
        expect(img.outerHTML).toBe(`<img src="${IMG_SRC}">`);
    });

    it('Write back with rotate only', async () => {
        const editInfo = getEditInfoFromImage(img);
        editInfo.angleRad = Math.PI / 2;
        applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, false);
        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAUCAYAAAC07qxWAAAAHklEQVQokWNgYGD4TySmpUJ0MKpwVCHxCqmfHvFhAGECbqCLnXlEAAAAAElFTkSuQmCC';

        const metadata: ImageMetadataFormat = JSON.parse(contentModelImage.dataset['editingInfo']);
        expect(metadata).toEqual({
            src: IMG_SRC,
            widthPx: WIDTH,
            heightPx: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 1.5707963267948966,
        });
        expect(contentModelImage.format.width).toBe(WIDTH + 'px');
        expect(contentModelImage.format.height).toBe(HEIGHT + 'px');
        expect(contentModelImage.src).toBe(newSrc);
        expect(triggerEvent).toHaveBeenCalled();
    });

    it('Write back with crop only', async () => {
        const editInfo = getEditInfoFromImage(img);
        editInfo.leftPercent = 0.1;
        editInfo.rightPercent = 0.2;
        editInfo.topPercent = 0.3;
        editInfo.bottomPercent = 0.4;
        applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, false);
        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAAM0lEQVQoke3MMQ0AQAzDQPMMnm6lUYIlkOfwylhLtxrAkjwzEQCuKu9uBIC726lueMOPHt2420Esv/tNAAAAAElFTkSuQmCC';

        expect(triggerEvent).toHaveBeenCalled();
        const metadata: ImageMetadataFormat = JSON.parse(contentModelImage.dataset['editingInfo']);
        expect(metadata).toEqual({
            src: IMG_SRC,
            widthPx: WIDTH,
            heightPx: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            leftPercent: 0.1,
            rightPercent: 0.2,
            topPercent: 0.3,
            bottomPercent: 0.6,
            angleRad: 0,
        });
        expect(contentModelImage.format.width).toBe(WIDTH + 'px');
        expect(contentModelImage.format.height).toBe(HEIGHT + 'px');
        expect(contentModelImage.src).toBe(newSrc);
    });

    it('Write back with rotate and crop', async () => {
        const editInfo = getEditInfoFromImage(img);
        editInfo.leftPercent = 0.1;
        editInfo.rightPercent = 0.2;
        editInfo.topPercent = 0.3;
        editInfo.bottomPercent = 0.4;
        editInfo.angleRad = Math.PI / 4;
        applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, false);
        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAlElEQVQ4je3MsQ3DIBBG4eszH5MgOiqgxAPReRcGAN0CfyqncAQckMJFXvukj6idJqLY+dNpIoJSCtban8CaiGCMQc4ZKSV477fgD8jMAIBSyhb8BV6twk3wqtY6BQ/BFThKwDvsnDu6KjNHkTgLA3gWHEL4w3L4WIDPLroAnwBeQ3QCloNCeB4cwOtgA94Hb3ATfAMzcgdiCyJ6YgAAAABJRU5ErkJggg==';

        expect(triggerEvent).toHaveBeenCalled();
        const metadata: ImageMetadataFormat = JSON.parse(contentModelImage.dataset['editingInfo']);
        expect(metadata).toEqual({
            src: IMG_SRC,
            widthPx: WIDTH,
            heightPx: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            leftPercent: 0.1,
            rightPercent: 0.2,
            topPercent: 0.3,
            bottomPercent: 0.4,
            angleRad: 0.7853981633974483,
        });
        expect(contentModelImage.format.width).toBe(21 + 'px');
        expect(contentModelImage.format.height).toBe(21 + 'px');
        expect(contentModelImage.src).toBe(newSrc);
    });

    it('Write back with triggerEvent', async () => {
        const editInfo = getEditInfoFromImage(img);
        editInfo.angleRad = Math.PI / 2;

        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAlElEQVQ4je3MsQ3DIBBG4eszH5MgOiqgxAPReRcGAN0CfyqncAQckMJFXvukj6idJqLY+dNpIoJSCtban8CaiGCMQc4ZKSV477fgD8jMAIBSyhb8BV6twk3wqtY6BQ/BFThKwDvsnDu6KjNHkTgLA3gWHEL4w3L4WIDPLroAnwBeQ3QCloNCeB4cwOtgA94Hb3ATfAMzcgdiCyJ6YgAAAABJRU5ErkJggg==';
        editor.triggerEvent = <any>(() => {
            return { newSrc };
        });
        applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, false);

        const metadata: ImageMetadataFormat = JSON.parse(contentModelImage.dataset['editingInfo']);
        expect(metadata).toEqual({
            src: IMG_SRC,
            widthPx: WIDTH,
            heightPx: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 1.5707963267948966,
        });
        expect(contentModelImage.format.width).toBe(HEIGHT + 'px');
        expect(contentModelImage.format.height).toBe(WIDTH + 'px');
        expect(contentModelImage.src).toBe(newSrc);
    });

    it('Resize then rotate', async () => {
        let editInfo = getEditInfoFromImage(img);
        editInfo.widthPx = editInfo.widthPx * 2;
        applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, true);

        const src2 = img.src;
        await reloadImage(img, IMG_SRC);

        editInfo = getEditInfoFromImage(img);
        editInfo.angleRad = Math.PI / 4;
        applyChange(editor, img, contentModelImage, editInfo, src2, true);

        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAr0lEQVRYhe3WsQ3EMAhAUYbwKO6PCVzTMkPWsOfwau5vANKcpeji49IEUvAlKpon0QDwuw0AqrI3awMA+Ywr6AhxBa0gLiANYgq6AjEBqZBSiiCiGahqkN67iIgwsx/oCJm5gRBRVrmBmDlAAQpQgAIUoAAF6AkgInoGaIwhrTVJKfmCJiTnvPy3zUBE9A8iAPC+C3MCLU7zDXndiTmBPCFXQKYQDeQCWYFcIbOqQXa9oOLAmolKrgAAAABJRU5ErkJggg==';

        const metadata: ImageMetadataFormat = JSON.parse(contentModelImage.dataset['editingInfo']);
        expect(metadata).toEqual({
            src: IMG_SRC,
            widthPx: WIDTH * 2,
            heightPx: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 0.7853981633974483,
        });
        expect(contentModelImage.format.width).toBe(35 + 'px');
        expect(contentModelImage.format.height).toBe(35 + 'px');
        expect(contentModelImage.src).toBe(newSrc);
    });

    it('Rotate then resize', async () => {
        let editInfo = getEditInfoFromImage(img);
        editInfo.angleRad = Math.PI / 4;
        applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, true);

        const src2 = img.src;
        await reloadImage(img, IMG_SRC);

        editInfo = getEditInfoFromImage(img);
        editInfo.widthPx = editInfo.widthPx * 2;
        applyChange(editor, img, contentModelImage, editInfo, src2, true);

        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAr0lEQVRYhe3WsQ3EMAhAUYbwKO6PCVzTMkPWsOfwau5vANKcpeji49IEUvAlKpon0QDwuw0AqrI3awMA+Ywr6AhxBa0gLiANYgq6AjEBqZBSiiCiGahqkN67iIgwsx/oCJm5gRBRVrmBmDlAAQpQgAIUoAAF6AkgInoGaIwhrTVJKfmCJiTnvPy3zUBE9A8iAPC+C3MCLU7zDXndiTmBPCFXQKYQDeQCWYFcIbOqQXa9oOLAmolKrgAAAABJRU5ErkJggg==';

        const metadata: ImageMetadataFormat = JSON.parse(contentModelImage.dataset['editingInfo']);
        expect(metadata).toEqual({
            src: IMG_SRC,
            widthPx: WIDTH * 2,
            heightPx: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 0.7853981633974483,
        });
        expect(contentModelImage.format.width).toBe(35 + 'px');
        expect(contentModelImage.format.height).toBe(35 + 'px');
        expect(contentModelImage.src).toBe(newSrc);
    });

    it('Resize then crop', async () => {
        let editInfo = getEditInfoFromImage(img);
        editInfo.widthPx *= 2;
        applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, true);

        const src2 = img.src;
        await reloadImage(img, IMG_SRC);

        editInfo = getEditInfoFromImage(img);
        editInfo.leftPercent = 0.5;
        applyChange(editor, img, contentModelImage, editInfo, src2, true);

        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAKCAYAAADGmhxQAAAANklEQVQ4jWNgYGD4P8jxgDtgiDvwP53A/fv3/8+fP/9/QkLCfwUFhVEHjjpw6GSSQeCAoe1AAHLr3T/ZgBiqAAAAAElFTkSuQmCC';

        const metadata: ImageMetadataFormat = JSON.parse(contentModelImage.dataset['editingInfo']);
        expect(metadata).toEqual({
            src: IMG_SRC,
            widthPx: WIDTH * 2,
            heightPx: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            leftPercent: 0.5,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 0,
        });
        expect(contentModelImage.format.width).toBe(WIDTH * 2 + 'px');
        expect(contentModelImage.format.height).toBe(HEIGHT + 'px');
        expect(contentModelImage.src).toBe(newSrc);
    });

    it('Crop then resize', async () => {
        let editInfo = getEditInfoFromImage(img);
        editInfo.leftPercent = 0.5;
        applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, false);

        const src2 = img.src;
        await reloadImage(img, IMG_SRC);

        editInfo = getEditInfoFromImage(img);
        editInfo.widthPx *= 2;
        applyChange(editor, img, contentModelImage, editInfo, src2, true);

        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAAJElEQVQokWNgYGD4T2U82A38TwbYv3//fwcHh1EDh0wsU9tAAARXbqAwJ+7KAAAAAElFTkSuQmCC';

        const metadata: ImageMetadataFormat = JSON.parse(contentModelImage.dataset['editingInfo']);
        expect(metadata).toEqual({
            src: IMG_SRC,
            widthPx: WIDTH * 2,
            heightPx: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            leftPercent: 0.5,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 0,
        });
        expect(contentModelImage.format.width).toBe(WIDTH * 2 + 'px');
        expect(contentModelImage.format.height).toBe(HEIGHT + 'px');
        expect(contentModelImage.src).toBe(newSrc);
    });

    it('Rotate then crop', async () => {
        let editInfo = getEditInfoFromImage(img);
        editInfo.angleRad = Math.PI / 4;
        applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, false);

        const src2 = img.src;
        await reloadImage(img, IMG_SRC);

        editInfo = getEditInfoFromImage(img);
        editInfo.leftPercent = 0.5;
        applyChange(editor, img, contentModelImage, editInfo, src2, false);

        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAjklEQVQ4je3Ruw2AMAwE0KvDBhnKO3gGZwzYiQmy0tEAisIvEJec5Mq6J1kGrmMAxpv96xgArtMPkzRV3cB+mKRxjQtcgl6wqWptdsH7UzzhsSy8gKcf9oVFxBfOOTOlxBCCD7yBMcYabIansiAiTyABzE/oAT45uQaHFvQAe4At8CfwDu4Cz2AXsIQvwQVKZ3Xg8vYu8QAAAABJRU5ErkJggg==';

        const metadata: ImageMetadataFormat = JSON.parse(contentModelImage.dataset['editingInfo']);
        expect(metadata).toEqual({
            src: IMG_SRC,
            widthPx: WIDTH,
            heightPx: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            leftPercent: 0.5,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 0.7853981633974483,
        });
        expect(contentModelImage.format.width).toBe(21 + 'px');
        expect(contentModelImage.format.height).toBe(21 + 'px');
        expect(contentModelImage.src).toBe(newSrc);
    });

    it('Crop then rotate', async () => {
        let editInfo = getEditInfoFromImage(img);
        editInfo.leftPercent = 0.5;
        applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, false);

        const src2 = img.src;
        await reloadImage(img, IMG_SRC);

        editInfo = getEditInfoFromImage(img);
        editInfo.angleRad = Math.PI / 4;
        applyChange(editor, img, contentModelImage, editInfo, src2, false);

        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAjklEQVQ4je3Ruw2AMAwE0KvDBhnKO3gGZwzYiQmy0tEAisIvEJec5Mq6J1kGrmMAxpv96xgArtMPkzRV3cB+mKRxjQtcgl6wqWptdsH7UzzhsSy8gKcf9oVFxBfOOTOlxBCCD7yBMcYabIansiAiTyABzE/oAT45uQaHFvQAe4At8CfwDu4Cz2AXsIQvwQVKZ3Xg8vYu8QAAAABJRU5ErkJggg==';

        const metadata: ImageMetadataFormat = JSON.parse(contentModelImage.dataset['editingInfo']);
        expect(metadata).toEqual({
            src: IMG_SRC,
            widthPx: WIDTH,
            heightPx: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            leftPercent: 0.5,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 0.7853981633974483,
        });
        expect(contentModelImage.format.width).toBe(21 + 'px');
        expect(contentModelImage.format.height).toBe(21 + 'px');
        expect(contentModelImage.src).toBe(newSrc);
    });

    it('trigger Content Change', async () => {
        let editInfo = getEditInfoFromImage(img);
        applyChange(editor, img, contentModelImage, editInfo, IMG_SRC, false, undefined);
        const triggerEventSpy = spyOn(editor, 'triggerEvent');
        expect(triggerEventSpy).toHaveBeenCalled();
        expect(triggerEventSpy).toHaveBeenCalledWith('contentChanged', {
            source: ChangeSource.ImageResize,
        });
    });
});

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>(resolve => {
        const img = document.createElement('img');
        const load = () => {
            img.onload = null;
            img.onerror = null;
            resolve(img);
        };
        img.onload = load;
        img.onerror = load;
        img.src = src;
    });
}

function reloadImage(img: HTMLImageElement, src: string): Promise<void> {
    return new Promise<void>(resolve => {
        const load = () => {
            img.onload = null;
            img.onerror = null;
            resolve();
        };
        img.onload = load;
        img.onerror = load;
        img.src = src;
    });
}

function getEditInfoFromImage(img: HTMLImageElement) {
    return {
        src: img.getAttribute('src') || '',
        widthPx: img.clientWidth,
        heightPx: img.clientHeight,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        leftPercent: 0,
        rightPercent: 0,
        topPercent: 0,
        bottomPercent: 0,
        angleRad: 0,
    };
}
