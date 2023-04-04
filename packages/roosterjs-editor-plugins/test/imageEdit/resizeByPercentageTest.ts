import * as TestHelper from '../TestHelper';
import ImageEditInfo from '../../lib/plugins/ImageEdit/types/ImageEditInfo';
import resizeByPercentage from '../../lib/plugins/ImageEdit/api/resizeByPercentage';
import { getEditInfoFromImage } from '../../lib/plugins/ImageEdit/editInfoUtils/editInfo';
import { IEditor } from 'roosterjs-editor-types';
import { ImageEdit } from '../../lib/ImageEdit';

const IMG_SRC =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAALUlEQVQ4EWNgYGD4T2U8lAz8TyZACzKEl8k0Dz0OhpKBaGGB7hVi+QgvD0oDATe/bqDDw39VAAAAAElFTkSuQmCC';
const WIDTH = 20;
const HEIGHT = 10;
const IMAGE_EDIT_EDITINFO_NAME = 'editingInfo';

describe('resizeByPercentage', () => {
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

    async function runTest(percentage: number, expectedWidth: number, expectedHeight: number) {
        const img = await loadImage(IMG_SRC);
        const editInfo: ImageEditInfo = {
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
        img.dataset[IMAGE_EDIT_EDITINFO_NAME] = JSON.stringify(editInfo);
        resizeByPercentage(editor, img, 0.5, 10, 10);
        const resizedEditInfo = getEditInfoFromImage(img);
        expect(resizedEditInfo.widthPx).toBe(expectedWidth);
        expect(resizedEditInfo.heightPx).toBe(expectedHeight);
    }

    it('resize image by 1', () => {
        runTest(1, 100, 100);
    });

    it('resize image by 0.5', () => {
        runTest(0.5, 50, 50);
    });

    it('resize image by 0.25', () => {
        runTest(0.25, 25, 25);
    });

    it('resize image by 0.05 - test minimum width', () => {
        runTest(0.05, 10, 10);
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
