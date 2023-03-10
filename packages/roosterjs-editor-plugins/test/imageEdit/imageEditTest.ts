import * as TestHelper from '../TestHelper';
import ImageEditInfo from '../../lib/plugins/ImageEdit/types/ImageEditInfo';
import { ImageEdit } from '../../lib/ImageEdit';
import { IEditor, ImageEditOperation, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import {
    getEditInfoFromImage,
    saveEditInfo,
} from '../../lib/plugins/ImageEdit/editInfoUtils/editInfo';

describe('ImageEdit | rotate and flip', () => {
    let editor: IEditor;
    const TEST_ID = 'imageEditTest';
    let plugin: ImageEdit;
    beforeEach(() => {
        plugin = new ImageEdit();
        editor = TestHelper.initEditor(TEST_ID, [plugin]);
    });

    afterEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement.removeChild(element);
        }
        editor.dispose();
    });

    function runRotateTest(angle: number, editInfo?: ImageEditInfo) {
        const IMG_ID = 'IMAGE_ID';
        const content = `<img id="${IMG_ID}" src='test'/>`;
        editor.setContent(content);
        const image = document.getElementById(IMG_ID) as HTMLImageElement;
        if (editInfo) {
            saveEditInfo(image, editInfo);
        }
        plugin.rotateImage(image, angle);
        const metadata = getEditInfoFromImage(image);
        if (metadata?.angleRad !== undefined) {
            expect(metadata.angleRad).toBe((editInfo?.angleRad || 0) + angle);
        }
        editor.setContent('');
    }

    function runFlipTest(editInfo?: ImageEditInfo) {
        const IMG_ID = 'IMAGE_ID';
        const content = `<img id="${IMG_ID}" src='test'/>`;
        editor.setContent(content);
        const image = document.getElementById(IMG_ID) as HTMLImageElement;
        if (editInfo) {
            saveEditInfo(image, editInfo);
        }
        plugin.flipImage(image);
        const metadata = getEditInfoFromImage(image);
        if (metadata?.angleRad !== undefined) {
            expect(metadata.flippedImage).toBe(!editInfo?.flippedImage);
        }
        editor.setContent('');
    }
    it('rotateImage', () => {
        runRotateTest(30);
    });

    it('rotateImage a image that was rotated', () => {
        const editInfo = {
            src: 'teste',
            widthPx: 10,
            heightPx: 10,
            naturalWidth: 10,
            naturalHeight: 10,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 20,
        };
        runRotateTest(50, editInfo);
    });

    it('flipImage', () => {
        const editInfo = {
            src: 'teste',
            widthPx: 10,
            heightPx: 10,
            naturalWidth: 10,
            naturalHeight: 10,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 20,
            flippedImage: false,
        };
        runFlipTest(editInfo);
    });

    it('unflipImage', () => {
        const editInfo = {
            src: 'teste',
            widthPx: 10,
            heightPx: 10,
            naturalWidth: 10,
            naturalHeight: 10,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 20,
            flippedImage: true,
        };
        runFlipTest(editInfo);
    });

    it('start image editing', () => {
        const IMG_ID = 'IMAGE_ID';
        const content = `<img id="${IMG_ID}" src='test'/>`;
        editor.setContent(content);
        const image = document.getElementById(IMG_ID) as HTMLImageElement;
        editor.focus();
        editor.select(image);
        plugin.setEditingImage(image, ImageEditOperation.Resize);
        expect(editor.getContent()).toBe(
            '<span style="vertical-align: bottom;"><img id="IMAGE_ID" src="test"></span>'
        );
    });
});

describe('ImageEdit | plugin events', () => {
    let editor: IEditor;
    const TEST_ID = 'imageEditTest';
    let plugin: ImageEdit;
    let setEditingImageSpy: jasmine.Spy;

    beforeEach(() => {
        plugin = new ImageEdit();
        editor = TestHelper.initEditor(TEST_ID, [plugin]);
        setEditingImageSpy = spyOn(plugin, 'setEditingImage');
    });

    afterEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement.removeChild(element);
        }
        editor.dispose();
    });

    const keyDown = (key: string): PluginEvent => {
        return {
            eventType: PluginEventType.KeyDown,
            rawEvent: <KeyboardEvent>{
                key: key,
                preventDefault: () => {},
                stopPropagation: () => {},
            },
        };
    };

    const mouseDown = (target: HTMLElement, keyNumber: number) => {
        const rect = target.getBoundingClientRect();
        const event = new MouseEvent('mousedown', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: rect.left,
            clientY: rect.top,
            shiftKey: false,
            button: keyNumber,
        });
        target.dispatchEvent(event);
    };

    it('image selection quit editing', () => {
        const IMG_ID = 'IMAGE_ID';
        const SPAN_ID = 'SPAN_ID';
        const content = `<img id="${IMG_ID}" src='test'/><span id="${SPAN_ID}" ></span>`;
        editor.setContent(content);
        const image = document.getElementById(IMG_ID) as HTMLImageElement;
        editor.focus();
        editor.select(image);
        expect(setEditingImageSpy).toHaveBeenCalled();
        expect(setEditingImageSpy).toHaveBeenCalledWith(
            image as any,
            ImageEditOperation.ResizeAndRotate as any
        );
    });

    it('mousedown quit editing', () => {
        const IMG_ID = 'IMAGE_ID';
        const SPAN_ID = 'SPAN_ID';
        const content = `<img id="${IMG_ID}" src='test'/><span id="${SPAN_ID}" ></span>`;
        editor.setContent(content);
        const image = document.getElementById(IMG_ID) as HTMLImageElement;
        const span = document.getElementById(SPAN_ID) as HTMLImageElement;
        editor.focus();
        editor.select(image);
        mouseDown(span, 0);
        expect(setEditingImageSpy).toHaveBeenCalled();
        expect(setEditingImageSpy).toHaveBeenCalledWith(null);
    });

    it('keydown quit editing', () => {
        const IMG_ID = 'IMAGE_ID';
        const content = `<img id="${IMG_ID}" src='test'/>`;
        editor.setContent(content);
        const image = document.getElementById(IMG_ID) as HTMLImageElement;
        editor.focus();
        editor.select(image);
        plugin.onPluginEvent(keyDown('A'));
        expect(setEditingImageSpy).toHaveBeenCalled();
        expect(setEditingImageSpy).toHaveBeenCalledWith(null);
    });
});
