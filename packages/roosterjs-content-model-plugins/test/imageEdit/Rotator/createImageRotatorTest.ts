import { createImageRotator } from '../../../lib/imageEdit/Rotator/createImageRotator';
import {
    ROTATE_GAP,
    ROTATE_HANDLE_TOP,
    ROTATE_ICON_MARGIN,
    ROTATE_SIZE,
    ROTATE_WIDTH,
} from '../../../lib/imageEdit/constants/constants';

describe('createImageRotator', () => {
    it('should create the croppers', () => {
        const result = createImageRotator(document, {
            borderColor: '#fff',
            rotateHandleBackColor: '#fff',
        } as any);
        expect(result).toEqual([createRotateHTML('#fff', '#fff')]);
    });
});

function createRotateHTML(borderColor: string, rotateHandleBackColor: string) {
    const handleLeft = ROTATE_SIZE / 2;
    const rotateCenter = document.createElement('div');

    rotateCenter.setAttribute(
        'style',
        `position:absolute;left:50%;width:1px;background-color:${borderColor};top:${-ROTATE_HANDLE_TOP}px;height:${ROTATE_GAP}px;margin-left:${-ROTATE_WIDTH}px;`
    );
    rotateCenter.className = 'r_rotateC';
    const rotateHandle = document.createElement('div');

    rotateHandle.setAttribute(
        'style',
        `position:absolute;background-color:${rotateHandleBackColor};border:solid 1px ${borderColor};border-radius:50%;width:${ROTATE_SIZE}px;height:${ROTATE_SIZE}px;left:-${
            handleLeft + ROTATE_WIDTH
        }px;cursor:move;top:${-ROTATE_SIZE}px;line-height: 0px;`
    );
    rotateHandle.className = 'r_rotateH';
    const icon = getRotateIconHTML();
    rotateHandle.appendChild(icon);
    rotateCenter.appendChild(rotateHandle);
    return rotateCenter;
}

const getRotateIconHTML = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute(
        'style',
        `width:16px;height:16px;margin: ${ROTATE_ICON_MARGIN}px ${ROTATE_ICON_MARGIN}px`
    );
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('d', 'M 10.5,10.0 A 3.8,3.8 0 1 1 6.7,6.3');
    path1.setAttribute('transform', 'matrix(1.1 1.1 -1.1 1.1 11.6 -10.8)');
    path1.setAttribute('style', 'fill-opacity: 0');
    path1.setAttribute('stroke', '#fff');
    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', 'M12.0 3.648l.884-.884.53 2.298-2.298-.53z');
    path1.setAttribute('stroke', '#fff');
    svg.appendChild(path1);
    svg.appendChild(path2);
    return svg;
};
