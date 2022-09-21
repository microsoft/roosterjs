import { selectImage } from '../../lib/coreApi/selectImage';
import { SelectionRangeTypes } from 'roosterjs-editor-types';

describe('selectImage |', () => {
    let div: HTMLDivElement;
    let image: HTMLImageElement | null;

    beforeEach(() => {
        document.body.innerHTML = '';
        div = document.createElement('div');
        div.innerHTML = '<img/>';

        image = div.querySelector('img');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        let style = document.getElementById('imageSelected1');
        if (style) {
            document.head.removeChild(style);
        }
        div.parentElement?.removeChild(div);
    });

    it('selectImage', () => {
        const selectedInfo = selectImage(image);
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
