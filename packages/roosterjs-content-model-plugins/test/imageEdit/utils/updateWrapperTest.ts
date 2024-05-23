import { createImageWrapper } from '../../../lib/imageEdit/utils/createImageWrapper';
import { ImageEditOptions } from '../../../lib/imageEdit/types/ImageEditOptions';
import { initEditor } from '../../TestHelper';
import { updateWrapper } from '../../../lib/imageEdit/utils/updateWrapper';

describe('updateWrapper', () => {
    const editor = initEditor('wrapper_test');
    const options: ImageEditOptions = {
        borderColor: '#DB626C',
        minWidth: 10,
        minHeight: 10,
        preserveRatio: true,
        disableRotate: false,
        disableSideResize: false,
        onSelectState: 'resizeAndRotate',
    };
    const editInfo = {
        src: 'test',
        widthPx: 20,
        heightPx: 20,
        naturalWidth: 10,
        naturalHeight: 10,
        leftPercent: 0,
        rightPercent: 0,
        topPercent: 0.1,
        bottomPercent: 0,
        angleRad: 0,
    };
    const htmlOptions = {
        borderColor: '#DB626C',
        rotateHandleBackColor: 'white',
        isSmallImage: false,
    };
    const image = document.createElement('img');
    const imageSpan = document.createElement('span');
    imageSpan.appendChild(image);
    document.body.appendChild(imageSpan);

    it('should update size', () => {
        const { wrapper, imageClone, resizers } = createImageWrapper(
            editor,
            image,
            imageSpan,
            options,
            editInfo,
            htmlOptions,
            'resize'
        );
        editInfo.heightPx = 12;
        updateWrapper(editInfo, options, image, imageClone, wrapper, resizers);

        expect(wrapper.style.margin).toBe('0px');
        expect(wrapper.style.transform).toBe(`rotate(0rad)`);

        expect(wrapper.style.width).toBe('20px');
        expect(wrapper.style.height).toBe('12px');

        expect(imageClone.style.width).toBe('20px');
        expect(imageClone.style.height).toBe('13.3333px');
        expect(imageClone.style.verticalAlign).toBe('bottom');
        expect(imageClone.style.position).toBe('absolute');
    });
});
