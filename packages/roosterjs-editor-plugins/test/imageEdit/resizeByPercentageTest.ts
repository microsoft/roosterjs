import * as TestHelper from '../TestHelper';
import applyChange from '../../lib/plugins/ImageEdit/editInfoUtils/applyChange';
import getTargetSizeByPercentage from '../../lib/plugins/ImageEdit/editInfoUtils/getTargetSizeByPercentage';
import ImageEditInfo from '../../lib/plugins/ImageEdit/types/ImageEditInfo';
import resizeByPercentage from '../../lib/plugins/ImageEdit/api/resizeByPercentage';
import { IEditor } from 'roosterjs-editor-types';
import { ImageEdit } from '../../lib/ImageEdit';

const IMG_SRC =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAALUlEQVQ4EWNgYGD4T2U8lAz8TyZACzKEl8k0Dz0OhpKBaGGB7hVi+QgvD0oDATe/bqDDw39VAAAAAElFTkSuQmCC';
const IMG_ID = 'IMAGE_TEST';
const IMAGE_EDIT_EDITINFO_NAME = 'editingInfo';
const expectedEditInfo: ImageEditInfo = {
    src: IMG_SRC,
    widthPx: 100,
    heightPx: 100,
    naturalWidth: 100,
    naturalHeight: 100,
    leftPercent: 0,
    rightPercent: 0,
    topPercent: 0,
    bottomPercent: 0,
    angleRad: 0,
};

describe('resizeByPercentage', () => {
    let editor: IEditor;
    const TEST_ID = 'imageEditTest';
    let plugin: ImageEdit;
    let spyOnIsDisposed: jasmine.Spy;
    let spyContains: jasmine.Spy;
    beforeEach(() => {
        plugin = new ImageEdit();
        editor = TestHelper.initEditor(TEST_ID, [plugin]);
        spyOnIsDisposed = spyOn(editor, 'isDisposed');
        spyContains = spyOn(editor, 'contains');
    });

    afterEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement.removeChild(element);
        }
        editor.dispose();
    });

    function runTest(
        image: HTMLImageElement,
        percentage: number,
        expectedWidth: number,
        expectedHeight: number
    ) {
        spyOnIsDisposed.and.returnValue(false);
        spyContains.and.returnValue(true);
        spyOn(editor, 'addUndoSnapshot').and.callFake(() => {
            const targetSize = getTargetSizeByPercentage(expectedEditInfo, percentage);
            expectedEditInfo.widthPx = Math.max(10, targetSize.width);
            expectedEditInfo.heightPx = Math.max(10, targetSize.height);
            applyChange(editor, image, expectedEditInfo, '', true);
        });
        resizeByPercentage(editor, image, percentage, 10, 10);
        const img = document.getElementById(IMG_ID) as HTMLImageElement;
        editor.select(img);
        expect(img.width).toBe(expectedWidth);
        expect(img.height).toBe(expectedHeight);
    }

    it('resize image by 1', () => {
        const imgString = createImage();
        editor.setContent(imgString);
        const img = document.getElementById(IMG_ID) as HTMLImageElement;
        img.width = 100;
        img.height = 100;
        img.dataset[IMAGE_EDIT_EDITINFO_NAME] = JSON.stringify(expectedEditInfo);
        runTest(img, 1, 100, 100);
    });

    it('resize image by 0.5', () => {
        const imgString = createImage();
        editor.setContent(imgString);
        const img = document.getElementById(IMG_ID) as HTMLImageElement;
        img.width = 100;
        img.height = 100;
        img.dataset[IMAGE_EDIT_EDITINFO_NAME] = JSON.stringify(expectedEditInfo);
        runTest(img, 0.5, 50, 50);
    });

    it('resize image by 0.25', () => {
        const imgString = createImage();
        editor.setContent(imgString);
        const img = document.getElementById(IMG_ID) as HTMLImageElement;
        img.width = 100;
        img.height = 100;
        img.dataset[IMAGE_EDIT_EDITINFO_NAME] = JSON.stringify(expectedEditInfo);
        runTest(img, 0.25, 25, 25);
    });

    it('resize image by 0.05 - test minimum width', () => {
        const imgString = createImage();
        editor.setContent(imgString);
        const img = document.getElementById(IMG_ID) as HTMLImageElement;
        img.width = 100;
        img.height = 100;
        img.dataset[IMAGE_EDIT_EDITINFO_NAME] = JSON.stringify(expectedEditInfo);
        runTest(img, 0.05, 10, 10);
    });
});

function createImage() {
    return `<img id="${IMG_ID}" src="${IMG_SRC}"/>`;
}
