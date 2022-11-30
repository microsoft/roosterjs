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
        if (child.style.zIndex) {
            zIndex = parseInt(child.style.zIndex);
        }
        child = child.parentElement;
    }
    return zIndex;
}
