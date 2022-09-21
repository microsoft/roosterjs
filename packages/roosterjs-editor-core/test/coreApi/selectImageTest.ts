import createEditorCore from './createMockEditorCore';
import { EditorCore, SelectionRangeTypes } from 'roosterjs-editor-types';
import { selectImage } from '../../lib/coreApi/selectImage';

describe('selectImage |', () => {
    let div: HTMLDivElement;
    let image: HTMLImageElement | null;
    let core: EditorCore | null;

    beforeEach(() => {
        document.body.innerHTML = '';
        div = document.createElement('div');
        div.innerHTML = '<img/>';

        image = div.querySelector('img');
        document.body.appendChild(div);
        core = createEditorCore(div!, {});
    });

    afterEach(() => {
        document.body.removeChild(div);
        let style = document.getElementById('imageSelected1');
        if (style) {
            document.head.removeChild(style);
        }
        div.parentElement?.removeChild(div);
        core = null;
    });

    it('selectImage', () => {
        const selectedInfo = selectImage(core, image);
        const range = new Range();
        range.selectNode(image!);

        expect(selectedInfo).toEqual({
            type: SelectionRangeTypes.ImageSelection,
            ranges: [range],
            image: image,
            areAllCollapsed: range.collapsed,
        });
    });
});
