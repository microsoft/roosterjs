import { isElementOfType, isNodeOfType } from 'roosterjs-content-model-dom';

/**
 * @internal
 */
export function filterInnerResizerHandles(resizeHandles: HTMLDivElement[]) {
    return resizeHandles
        .map(resizer => {
            const resizeHandle = resizer.firstElementChild;
            if (
                isNodeOfType(resizeHandle, 'ELEMENT_NODE') &&
                isElementOfType(resizeHandle, 'div')
            ) {
                return resizeHandle;
            }
        })
        .filter(handle => !!handle) as HTMLDivElement[];
}
