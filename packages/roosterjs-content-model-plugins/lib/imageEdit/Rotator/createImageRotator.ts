import { createElement } from '../../pluginUtils/CreateElement/createElement';
import { ImageEditElementClass } from '../types/ImageEditElementClass';
import { isElementOfType, isNodeOfType } from 'roosterjs-content-model-dom';
import type { CreateElementData } from '../../pluginUtils/CreateElement/CreateElementData';
import type { ImageHtmlOptions } from '../types/ImageHtmlOptions';
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
export function createImageRotator(doc: Document, htmlOptions: ImageHtmlOptions) {
    return getRotateHTML(htmlOptions)
        .map(element => {
            const rotator = createElement(element, doc);
            if (isNodeOfType(rotator, 'ELEMENT_NODE') && isElementOfType(rotator, 'div')) {
                return rotator;
            }
        })
        .filter(rotator => !!rotator) as HTMLDivElement[];
}

/**
 * @internal
 * Get HTML for rotate elements, including the rotate handle with icon, and a line between the handle and the image
 *
 */
function getRotateHTML({
    borderColor,
    rotateHandleBackColor,
}: ImageHtmlOptions): CreateElementData[] {
    const handleLeft = ROTATE_SIZE / 2;
    return [
        {
            tag: 'div',
            className: ImageEditElementClass.RotateCenter,
            style: `position:absolute;left:50%;width:1px;background-color:${borderColor};top:${-ROTATE_HANDLE_TOP}px;height:${ROTATE_GAP}px;margin-left:${-ROTATE_WIDTH}px;`,
            children: [
                {
                    tag: 'div',
                    className: ImageEditElementClass.RotateHandle,
                    style: `position:absolute;background-color:${rotateHandleBackColor};border:solid 1px ${borderColor};border-radius:50%;width:${ROTATE_SIZE}px;height:${ROTATE_SIZE}px;left:-${
                        handleLeft + ROTATE_WIDTH
                    }px;cursor:move;top:${-ROTATE_SIZE}px;line-height: 0px;`,
                    children: [getRotateIconHTML(borderColor)],
                },
            ],
        },
    ];
}

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
