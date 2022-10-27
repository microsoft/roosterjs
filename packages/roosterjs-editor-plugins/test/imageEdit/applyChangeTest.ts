import applyChange from '../../lib/plugins/ImageEdit/editInfoUtils/applyChange';
import { getEditInfoFromImage } from '../../lib/plugins/ImageEdit/editInfoUtils/editInfo';
import { IEditor, PluginEventType } from 'roosterjs-editor-types';

const IMG_SRC =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAALUlEQVQ4EWNgYGD4T2U8lAz8TyZACzKEl8k0Dz0OhpKBaGGB7hVi+QgvD0oDATe/bqDDw39VAAAAAElFTkSuQmCC';
const WIDTH = 20;
const HEIGHT = 10;
const IMAGE_EDIT_EDITINFO_NAME = 'editingInfo';

// Temporarily disable these tests since they fail on Linux/MacOS
xdescribe('applyChange', () => {
    let img: HTMLImageElement;
    let editor: IEditor;
    let triggerPluginEvent: jasmine.Spy;

    beforeEach(async () => {
        img = await loadImage(IMG_SRC);
        document.body.appendChild(img);
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        editor = <IEditor>(<any>{
            triggerPluginEvent: (type: PluginEventType, obj: any) => {
                triggerPluginEvent();
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
        const result = applyChange(editor, img, editInfo, IMG_SRC, false);

        expect(result).toBeFalse();
        expect(triggerPluginEvent).not.toHaveBeenCalled();
        expect(img.outerHTML).toBe(
            `<img src="${IMG_SRC}" style="height:initial; max-width:100% ">`
        );
    });

    it('Write back with resize only', async () => {
        const editInfo = getEditInfoFromImage(img);
        editInfo.widthPx = 100;
        const result = applyChange(editor, img, editInfo, IMG_SRC, true);

        expect(result).toBeTrue();
        expect(triggerPluginEvent).not.toHaveBeenCalled();
        expect(img.outerHTML).toBe(
            `<img src="${IMG_SRC}" style="width: 100px; height: ${HEIGHT}px;" width="100" height="${HEIGHT}">`
        );
    });

    it('Write back with rotate only', async () => {
        const editInfo = getEditInfoFromImage(img);
        editInfo.angleRad = Math.PI / 2;
        const result = applyChange(editor, img, editInfo, IMG_SRC, false);
        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAUCAYAAAC07qxWAAAAHklEQVQokWNgYGD4TySmpUJ0MKpwVCHxCqmfHvFhAGECbqCLnXlEAAAAAElFTkSuQmCC';

        expect(result).toBeTrue();
        expect(triggerPluginEvent).toHaveBeenCalled();
        expect(JSON.parse(img.dataset[IMAGE_EDIT_EDITINFO_NAME])).toEqual({
            src: IMG_SRC,
            width: WIDTH,
            height: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            angle: 1.5707963267948966,
        });
        expect(img.width).toBe(HEIGHT);
        expect(img.height).toBe(WIDTH);
        expect(img.src).toBe(newSrc);
    });

    it('Write back with crop only', async () => {
        const editInfo = getEditInfoFromImage(img);
        editInfo.leftPercent = 0.1;
        editInfo.rightPercent = 0.2;
        editInfo.topPercent = 0.3;
        editInfo.bottomPercent = 0.4;
        const result = applyChange(editor, img, editInfo, IMG_SRC, false);
        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAAM0lEQVQoke3MMQ0AQAzDQPMMnm6lUYIlkOfwylhLtxrAkjwzEQCuKu9uBIC726lueMOPHt2420Esv/tNAAAAAElFTkSuQmCC';

        expect(result).toBeTrue();
        expect(triggerPluginEvent).toHaveBeenCalled();
        expect(JSON.parse(img.dataset[IMAGE_EDIT_EDITINFO_NAME])).toEqual({
            src: IMG_SRC,
            width: WIDTH,
            height: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            left: 0.1,
            right: 0.2,
            top: 0.3,
            bottom: 0.4,
            angle: 0,
        });
        expect(img.width).toBe(WIDTH);
        expect(img.height).toBe(HEIGHT);
        expect(img.src).toBe(newSrc);
    });

    it('Write back with rotate and crop', async () => {
        const editInfo = getEditInfoFromImage(img);
        editInfo.leftPercent = 0.1;
        editInfo.rightPercent = 0.2;
        editInfo.topPercent = 0.3;
        editInfo.bottomPercent = 0.4;
        editInfo.angleRad = Math.PI / 4;
        const result = applyChange(editor, img, editInfo, IMG_SRC, false);
        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAlElEQVQ4je3MsQ3DIBBG4eszH5MgOiqgxAPReRcGAN0CfyqncAQckMJFXvukj6idJqLY+dNpIoJSCtban8CaiGCMQc4ZKSV477fgD8jMAIBSyhb8BV6twk3wqtY6BQ/BFThKwDvsnDu6KjNHkTgLA3gWHEL4w3L4WIDPLroAnwBeQ3QCloNCeB4cwOtgA94Hb3ATfAMzcgdiCyJ6YgAAAABJRU5ErkJggg==';

        expect(result).toBeTrue();
        expect(triggerPluginEvent).toHaveBeenCalled();
        expect(JSON.parse(img.dataset[IMAGE_EDIT_EDITINFO_NAME])).toEqual({
            src: IMG_SRC,
            width: WIDTH,
            height: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            left: 0.1,
            right: 0.2,
            top: 0.3,
            bottom: 0.4,
            angle: 0.7853981633974483,
        });
        expect(img.width).toBe(21);
        expect(img.height).toBe(21);
        expect(img.src).toBe(newSrc);
    });

    it('Write back with triggerPluginEvent', async () => {
        const editInfo = getEditInfoFromImage(img);
        editInfo.angleRad = Math.PI / 2;

        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAlElEQVQ4je3MsQ3DIBBG4eszH5MgOiqgxAPReRcGAN0CfyqncAQckMJFXvukj6idJqLY+dNpIoJSCtban8CaiGCMQc4ZKSV477fgD8jMAIBSyhb8BV6twk3wqtY6BQ/BFThKwDvsnDu6KjNHkTgLA3gWHEL4w3L4WIDPLroAnwBeQ3QCloNCeB4cwOtgA94Hb3ATfAMzcgdiCyJ6YgAAAABJRU5ErkJggg==';
        editor.triggerPluginEvent = <any>(() => {
            return { newSrc };
        });
        const result = applyChange(editor, img, editInfo, IMG_SRC, false);

        expect(result).toBeTrue();
        expect(JSON.parse(img.dataset[IMAGE_EDIT_EDITINFO_NAME])).toEqual({
            src: IMG_SRC,
            width: WIDTH,
            height: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            angle: 1.5707963267948966,
        });
        expect(img.width).toBe(HEIGHT);
        expect(img.height).toBe(WIDTH);
        expect(img.src).toBe(newSrc);
    });

    it('Resize then rotate', async () => {
        let editInfo = getEditInfoFromImage(img);
        editInfo.widthPx = editInfo.widthPx * 2;
        applyChange(editor, img, editInfo, IMG_SRC, true);

        const src2 = img.src;
        await reloadImage(img, IMG_SRC);

        editInfo = getEditInfoFromImage(img);
        editInfo.angleRad = Math.PI / 4;
        const result = applyChange(editor, img, editInfo, src2, true);

        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAr0lEQVRYhe3WsQ3EMAhAUYbwKO6PCVzTMkPWsOfwau5vANKcpeji49IEUvAlKpon0QDwuw0AqrI3awMA+Ywr6AhxBa0gLiANYgq6AjEBqZBSiiCiGahqkN67iIgwsx/oCJm5gRBRVrmBmDlAAQpQgAIUoAAF6AkgInoGaIwhrTVJKfmCJiTnvPy3zUBE9A8iAPC+C3MCLU7zDXndiTmBPCFXQKYQDeQCWYFcIbOqQXa9oOLAmolKrgAAAABJRU5ErkJggg==';

        expect(result).toBeTrue();
        expect(JSON.parse(img.dataset[IMAGE_EDIT_EDITINFO_NAME])).toEqual({
            src: IMG_SRC,
            width: WIDTH * 2,
            height: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            angle: 0.7853981633974483,
        });
        expect(img.width).toBe(35);
        expect(img.height).toBe(35);
        expect(img.src).toBe(newSrc);
    });

    it('Rotate then resize', async () => {
        let editInfo = getEditInfoFromImage(img);
        editInfo.angleRad = Math.PI / 4;
        applyChange(editor, img, editInfo, IMG_SRC, true);

        const src2 = img.src;
        await reloadImage(img, IMG_SRC);

        editInfo = getEditInfoFromImage(img);
        editInfo.widthPx = editInfo.widthPx * 2;
        const result = applyChange(editor, img, editInfo, src2, true);

        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAr0lEQVRYhe3WsQ3EMAhAUYbwKO6PCVzTMkPWsOfwau5vANKcpeji49IEUvAlKpon0QDwuw0AqrI3awMA+Ywr6AhxBa0gLiANYgq6AjEBqZBSiiCiGahqkN67iIgwsx/oCJm5gRBRVrmBmDlAAQpQgAIUoAAF6AkgInoGaIwhrTVJKfmCJiTnvPy3zUBE9A8iAPC+C3MCLU7zDXndiTmBPCFXQKYQDeQCWYFcIbOqQXa9oOLAmolKrgAAAABJRU5ErkJggg==';

        expect(result).toBeTrue();
        expect(JSON.parse(img.dataset[IMAGE_EDIT_EDITINFO_NAME])).toEqual({
            src: IMG_SRC,
            width: WIDTH * 2,
            height: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            angle: 0.7853981633974483,
        });
        expect(img.width).toBe(35);
        expect(img.height).toBe(35);
        expect(img.src).toBe(newSrc);
    });

    it('Resize then crop', async () => {
        let editInfo = getEditInfoFromImage(img);
        editInfo.widthPx *= 2;
        applyChange(editor, img, editInfo, IMG_SRC, true);

        const src2 = img.src;
        await reloadImage(img, IMG_SRC);

        editInfo = getEditInfoFromImage(img);
        editInfo.leftPercent = 0.5;
        const result = applyChange(editor, img, editInfo, src2, true);

        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAKCAYAAADGmhxQAAAANklEQVQ4jWNgYGD4P8jxgDtgiDvwP53A/fv3/8+fP/9/QkLCfwUFhVEHjjpw6GSSQeCAoe1AAHLr3T/ZgBiqAAAAAElFTkSuQmCC';

        expect(result).toBeTrue();
        expect(JSON.parse(img.dataset[IMAGE_EDIT_EDITINFO_NAME])).toEqual({
            src: IMG_SRC,
            width: WIDTH * 2,
            height: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            left: 0.5,
            right: 0,
            top: 0,
            bottom: 0,
            angle: 0,
        });
        expect(img.width).toBe(WIDTH * 2);
        expect(img.height).toBe(HEIGHT);
        expect(img.src).toBe(newSrc);
    });

    it('Crop then resize', async () => {
        let editInfo = getEditInfoFromImage(img);
        editInfo.leftPercent = 0.5;
        applyChange(editor, img, editInfo, IMG_SRC, false);

        const src2 = img.src;
        await reloadImage(img, IMG_SRC);

        editInfo = getEditInfoFromImage(img);
        editInfo.widthPx *= 2;
        const result = applyChange(editor, img, editInfo, src2, true);

        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAAJElEQVQokWNgYGD4T2U82A38TwbYv3//fwcHh1EDh0wsU9tAAARXbqAwJ+7KAAAAAElFTkSuQmCC';

        expect(result).toBeTrue();
        expect(JSON.parse(img.dataset[IMAGE_EDIT_EDITINFO_NAME])).toEqual({
            src: IMG_SRC,
            width: WIDTH * 2,
            height: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            left: 0.5,
            right: 0,
            top: 0,
            bottom: 0,
            angle: 0,
        });
        expect(img.width).toBe(WIDTH * 2);
        expect(img.height).toBe(HEIGHT);
        expect(img.src).toBe(newSrc);
    });

    it('Rotate then crop', async () => {
        let editInfo = getEditInfoFromImage(img);
        editInfo.angleRad = Math.PI / 4;
        applyChange(editor, img, editInfo, IMG_SRC, false);

        const src2 = img.src;
        await reloadImage(img, IMG_SRC);

        editInfo = getEditInfoFromImage(img);
        editInfo.leftPercent = 0.5;
        const result = applyChange(editor, img, editInfo, src2, false);

        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAjklEQVQ4je3Ruw2AMAwE0KvDBhnKO3gGZwzYiQmy0tEAisIvEJec5Mq6J1kGrmMAxpv96xgArtMPkzRV3cB+mKRxjQtcgl6wqWptdsH7UzzhsSy8gKcf9oVFxBfOOTOlxBCCD7yBMcYabIansiAiTyABzE/oAT45uQaHFvQAe4At8CfwDu4Cz2AXsIQvwQVKZ3Xg8vYu8QAAAABJRU5ErkJggg==';

        expect(result).toBeTrue();
        expect(JSON.parse(img.dataset[IMAGE_EDIT_EDITINFO_NAME])).toEqual({
            src: IMG_SRC,
            width: WIDTH,
            height: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            left: 0.5,
            right: 0,
            top: 0,
            bottom: 0,
            angle: 0.7853981633974483,
        });
        expect(img.width).toBe(21);
        expect(img.height).toBe(21);
        expect(img.src).toBe(newSrc);
    });

    it('Crop then rotate', async () => {
        let editInfo = getEditInfoFromImage(img);
        editInfo.leftPercent = 0.5;
        applyChange(editor, img, editInfo, IMG_SRC, false);

        const src2 = img.src;
        await reloadImage(img, IMG_SRC);

        editInfo = getEditInfoFromImage(img);
        editInfo.angleRad = Math.PI / 4;
        const result = applyChange(editor, img, editInfo, src2, false);

        const newSrc =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAjklEQVQ4je3Ruw2AMAwE0KvDBhnKO3gGZwzYiQmy0tEAisIvEJec5Mq6J1kGrmMAxpv96xgArtMPkzRV3cB+mKRxjQtcgl6wqWptdsH7UzzhsSy8gKcf9oVFxBfOOTOlxBCCD7yBMcYabIansiAiTyABzE/oAT45uQaHFvQAe4At8CfwDu4Cz2AXsIQvwQVKZ3Xg8vYu8QAAAABJRU5ErkJggg==';

        expect(result).toBeTrue();
        expect(JSON.parse(img.dataset[IMAGE_EDIT_EDITINFO_NAME])).toEqual({
            src: IMG_SRC,
            width: WIDTH,
            height: HEIGHT,
            naturalWidth: WIDTH,
            naturalHeight: HEIGHT,
            left: 0.5,
            right: 0,
            top: 0,
            bottom: 0,
            angle: 0.7853981633974483,
        });
        expect(img.width).toBe(21);
        expect(img.height).toBe(21);
        expect(img.src).toBe(newSrc);
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

function reloadImage(img: HTMLImageElement, src: string): Promise<void> {
    return new Promise<void>(resolve => {
        const result = () => {
            img.onload = null;
            img.onerror = null;
            resolve();
        };
        img.onload = result;
        img.onerror = result;
        img.src = src;
    });
}
