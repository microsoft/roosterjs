import { getTagOfNode } from 'roosterjs-editor-dom';

/**
 * @internal
 * Search through from editor div to it's root for the latest z-index value
 * @param editorDiv the editor div element
 * @returns the z index value
 */
export default function getLatestZIndex(editorDiv: HTMLElement) {
    let child: HTMLElement | null = editorDiv;
    let zIndex = 0;
    while (child && getTagOfNode(child) !== 'BODY') {
        const childZIndex = parseInt(child.style.zIndex || getComputedStyle(child).zIndex, 10);
        if (childZIndex) {
            zIndex = Math.max(zIndex, childZIndex);
        }
        child = child.parentElement;
    }
    return zIndex;
}
