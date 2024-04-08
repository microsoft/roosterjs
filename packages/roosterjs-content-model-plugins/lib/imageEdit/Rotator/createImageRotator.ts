import { createElement } from 'roosterjs-content-model-plugins/lib/pluginUtils/CreateElement/createElement';
import { CreateElementData } from 'roosterjs-content-model-plugins/lib/pluginUtils/CreateElement/CreateElementData';
import { IEditor } from 'roosterjs-content-model-types/lib';
import { ImageEditElementClass } from '../types/ImageEditElementClass';
import {
    ROTATE_GAP,
    ROTATE_HANDLE_TOP,
    ROTATE_ICON_MARGIN,
    ROTATE_SIZE,
    ROTATE_WIDTH,
} from '../constants/constants';

/**
 * @internal
 * Get HTML for rotate elements, including the rotate handle with icon, and a line between the handle and the image
 */
export function createImageRotator(
    editor: IEditor,
    borderColor: string,
    rotateHandleBackColor: string
): { rotator: HTMLDivElement; rotatorHandle: HTMLDivElement } {
    const doc = editor.getDocument();
    const rotator = doc.createElement('div');
    rotator.className = ImageEditElementClass.RotateCenter;
    rotator.setAttribute(
        'style',
        `position:absolute;left:50%;width:1px;background-color:${borderColor};top:${-ROTATE_HANDLE_TOP}px;height:${ROTATE_GAP}px;margin-left:${-ROTATE_WIDTH}px;`
    );
    const rotatorHandle = createRotatorHandle(doc, borderColor, rotateHandleBackColor);
    const svg = createElement(getRotateIconHTML(borderColor), doc);
    if (svg) {
        rotatorHandle.appendChild(svg);
    }
    rotator.appendChild(rotatorHandle);
    return { rotator, rotatorHandle };
}

const createRotatorHandle = (doc: Document, borderColor: string, rotateHandleBackColor: string) => {
    const handleLeft = ROTATE_SIZE / 2;
    const handle = doc.createElement('div');
    handle.className = ImageEditElementClass.RotateHandle;
    handle.setAttribute(
        'style',
        `position:absolute;background-color:${rotateHandleBackColor};border:solid 1px ${borderColor};border-radius:50%;width:${ROTATE_SIZE}px;height:${ROTATE_SIZE}px;left:-${
            handleLeft + ROTATE_WIDTH
        }px;cursor:move;top:${-ROTATE_SIZE}px;line-height: 0px;`
    );
    return handle;
};

function getRotateIconHTML(borderColor: string): CreateElementData {
    return {
        tag: 'svg',
        namespace: 'http://www.w3.org/2000/svg',
        style: `width:16px;height:16px;margin: ${ROTATE_ICON_MARGIN}px ${ROTATE_ICON_MARGIN}px`,
        children: [
            {
                tag: 'path',
                namespace: 'http://www.w3.org/2000/svg',
                attributes: {
                    d: 'M 10.5,10.0 A 3.8,3.8 0 1 1 6.7,6.3',
                    transform: 'matrix(1.1 1.1 -1.1 1.1 11.6 -10.8)',
                    ['fill-opacity']: '0',
                    stroke: borderColor,
                },
            },
            {
                tag: 'path',
                namespace: 'http://www.w3.org/2000/svg',
                attributes: {
                    d: 'M12.0 3.648l.884-.884.53 2.298-2.298-.53z',
                    stroke: borderColor,
                },
            },
        ],
    };
}
