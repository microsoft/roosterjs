import getTagOfNode from '../utils/getTagOfNode';

/**
 * Search through a element from parent to root for the biggest Z index value
 * @param element the parent element
 * @returns
 */
export default function getBiggestZIndex(element: HTMLElement) {
    let zIndex = parseInt(element.style.zIndex);
    let child: HTMLElement | null = element;
    while (child && getTagOfNode(child) !== 'BODY') {
        const parent: HTMLElement | null = child?.parentElement;
        if (parent) {
            const parentZIndex = parseInt(parent.style?.zIndex) ?? 0;
            if (parentZIndex > zIndex) {
                zIndex = parentZIndex;
            }
        }
        child = parent;
    }
    return zIndex;
}
