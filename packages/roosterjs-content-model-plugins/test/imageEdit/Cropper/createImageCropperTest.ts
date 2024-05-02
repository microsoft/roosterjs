import { createImageCropper } from '../../../lib/imageEdit/Cropper/createImageCropper';
import { DNDDirectionX, DnDDirectionY } from '../../../lib/imageEdit/types/DragAndDropContext';
import {
    CROP_HANDLE_SIZE,
    CROP_HANDLE_WIDTH,
    ROTATION,
    XS_CROP,
    YS_CROP,
} from '../../../lib/imageEdit/constants/constants';

describe('createImageCropper', () => {
    it('should create the croppers', () => {
        const croppers = createImageCropper(document);
        const overlayHTML = document.createElement('div');
        overlayHTML.setAttribute(
            'style',
            'position:absolute;background-color:rgb(0,0,0,0.5);pointer-events:none'
        );
        overlayHTML.className = 'r_cropO';
        const containerHTML = document.createElement('div');
        containerHTML.setAttribute('style', 'position:absolute;overflow:hidden;inset:0px;');
        containerHTML.className = 'r_cropC';
        XS_CROP.forEach(x =>
            YS_CROP.forEach(y => containerHTML.appendChild(createCropInternals(x, y)))
        );
        expect(croppers).toEqual([
            containerHTML,
            overlayHTML,
            overlayHTML,
            overlayHTML,
            overlayHTML,
        ]);
    });
});

function createCropInternals(x: DNDDirectionX, y: DnDDirectionY) {
    const leftOrRight = x == 'w' ? 'left' : 'right';
    const topOrBottom = y == 'n' ? 'top' : 'bottom';
    const rotation = ROTATION[y + x];
    const internal = document.createElement('div');
    internal.setAttribute(
        'style',
        `position:absolute;pointer-events:auto;cursor:${y}${x}-resize;${leftOrRight}:0;${topOrBottom}:0;width:${CROP_HANDLE_SIZE}px;height:${CROP_HANDLE_SIZE}px;transform:rotate(${rotation}deg)`
    );
    const internalLayers = getCropHandleHTML();

    internal.append(...internalLayers);

    return internal;
}

function getCropHandleHTML(): HTMLElement[] {
    const result: HTMLElement[] = [];
    [0, 1].forEach(layer =>
        [0, 1].forEach(dir => {
            result.push(getCropHandleHTMLInternal(layer, dir));
        })
    );
    return result;
}

function getCropHandleHTMLInternal(layer: number, dir: number): HTMLElement {
    const position =
        dir == 0
            ? `right:${layer}px;height:${CROP_HANDLE_WIDTH - layer * 2}px;`
            : `top:${layer}px;width:${CROP_HANDLE_WIDTH - layer * 2}px;`;
    const bgColor = layer == 0 ? 'white' : 'black';
    const internalHandle = document.createElement('div');
    internalHandle.setAttribute(
        'style',
        `position:absolute;left:${layer}px;bottom:${layer}px;${position};background-color:${bgColor}`
    );
    return internalHandle;
}
