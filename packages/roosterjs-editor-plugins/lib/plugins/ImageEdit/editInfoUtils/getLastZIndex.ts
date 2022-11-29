import { getTagOfNode } from 'roosterjs-editor-dom';

/**
 * Search through from editor div to it's root for the latest z-index value
 * @param editor the editor object
 * @returns
 */
export default function getLatestZIndex(editorDiv: HTMLElement) {
    let child: HTMLElement | null = editorDiv;
    let zIndex = child.style.zIndex ? parseInt(child.style.zIndex) : 0;
    do {
        const parent = child?.parentElement;
        if (parent) {
            const parentZIndex = parent.style.zIndex;
            if (parentZIndex) {
                zIndex = parseInt(parentZIndex);
            }
        }
        child = parent;
    } while (child && getTagOfNode(child) !== 'BODY');
    return zIndex;
}
