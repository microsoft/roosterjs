import { createImageResizer } from '../../../lib/imageEdit/Resizer/createImageResizer';
import { DNDDirectionX, DnDDirectionY } from '../../../lib/imageEdit/types/DragAndDropContext';
import {
    RESIZE_HANDLE_MARGIN,
    RESIZE_HANDLE_SIZE,
    Xs,
    Ys,
} from '../../../lib/imageEdit/constants/constants';

describe('createImageResizer', () => {
    it('should create the croppers', () => {
        const result = createImageResizer(document);
        const resizers = [...createCorners(), ...createSides()].filter(element => !!element);
        expect(result).toEqual(resizers);
    });
});

const createCorners = () => {
    let corners: HTMLDivElement[] = [];
    Xs.forEach(x =>
        Ys.forEach(y => {
            const handle = (x == '') == (y == '') ? createResizeHandle(x, y) : null;
            if (handle) {
                corners.push(handle);
            }
        })
    );
    return corners;
};

const createSides = () => {
    let sides: HTMLDivElement[] = [];
    Xs.forEach(x =>
        Ys.forEach(y => {
            const handle = (x == '') != (y == '') ? createResizeHandle(x, y) : null;
            if (handle) {
                sides.push(handle);
            }
        })
    );
    return sides;
};

const createHandleStyle = (direction: string, topOrBottom: string, leftOrRight: string) => {
    return `position:relative;width:${RESIZE_HANDLE_SIZE}px;height:${RESIZE_HANDLE_SIZE}px;background-color: #FFFFFF;cursor:${direction}-resize;${topOrBottom}:-${RESIZE_HANDLE_MARGIN}px;${leftOrRight}:-${RESIZE_HANDLE_MARGIN}px;border-radius:100%;border: 2px solid #bfbfbf;box-shadow: 0px 0.36316px 1.36185px rgba(100, 100, 100, 0.25);`;
};

function createResizeHandle(x: DNDDirectionX, y: DnDDirectionY) {
    if (x == '' && y == '') {
        return undefined;
    }
    const leftOrRight = x == 'w' ? 'left' : 'right';
    const topOrBottom = y == 'n' ? 'top' : 'bottom';
    const leftOrRightValue = x == '' ? '50%' : '0px';
    const topOrBottomValue = y == '' ? '50%' : '0px';
    const direction = y + x;
    const resizer = document.createElement('div');
    resizer.setAttribute(
        'style',
        `position:absolute;${leftOrRight}:${leftOrRightValue};${topOrBottom}:${topOrBottomValue}`
    );
    const handle = document.createElement('div');
    handle.setAttribute('style', createHandleStyle(direction, topOrBottom, leftOrRight));
    handle.className = 'r_resizeH';
    handle.dataset['x'] = x;
    handle.dataset['y'] = y;
    resizer.appendChild(handle);
    return resizer;
}
