import * as TestHelper from '../TestHelper';
import ImageEditInfo from '../../lib/plugins/ImageEdit/types/ImageEditInfo';
import resetImage from '../../lib/plugins/ImageEdit/api/resetImage';
import { IEditor } from 'roosterjs-editor-types';
import { ImageEdit } from '../../lib/ImageEdit';

const EDIT_INFO = 'editingInfo';

describe('resetImage', () => {
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

    function runTest(element: HTMLImageElement) {
        resetImage(editor, element);
        expect(element.style.width).toBe('');
        expect(element.style.height).toBe('');
        expect(element.style.maxWidth).toBe('100%');
        expect(element.width).toBe(0);
        expect(element.height).toBe(0);
        expect(element.dataset[EDIT_INFO]).toBeUndefined();
    }

    it('reset Image', () => {
        const image = document.createElement('img');
        image.style.width = '100px';
        image.style.height = '100px';
        const editInfo: ImageEditInfo = {
            naturalWidth: 100,
            naturalHeight: 100,
            leftPercent: 0,
            topPercent: 0,
            rightPercent: 0,
            bottomPercent: 0,
            src: 'test',
            widthPx: 100,
            heightPx: 100,
            angleRad: 0,
        };
        image.dataset[EDIT_INFO] = JSON.stringify(editInfo);
        editor.insertNode(image);
        runTest(image);
    });
});
