import * as TestHelper from '../TestHelper';
import ImageEditInfo from '../../lib/plugins/ImageEdit/types/ImageEditInfo';
import {
    getEditInfoFromImage,
    saveEditInfo,
} from '../../lib/plugins/ImageEdit/editInfoUtils/editInfo';
import { ImageEdit } from '../../lib/ImageEdit';
import { IEditor } from 'roosterjs-editor-types';

describe('ImageEdit |', () => {
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
});
