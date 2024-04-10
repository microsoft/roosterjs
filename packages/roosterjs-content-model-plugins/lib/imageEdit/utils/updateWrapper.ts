import { IEditor } from 'roosterjs-content-model-types/lib';
import { ResizeHandle } from '../Resizer/createImageResizer';
import { updateResizeHandles } from '../Resizer/updateResizeHandles';
import { updateRotateHandle } from '../Rotator/updateRotateHandle';
import { updateSideHandlesVisibility } from '../Resizer/updateSideHandlesVisibility';

/**
 * @internal
 */
export function updateWrapper(
    editor: IEditor,
    angleRad: number,
    wrapper: HTMLSpanElement,
    rotator?: HTMLElement,
    rotatorHandle?: HTMLElement,
    handles?: ResizeHandle[],
    isSmallImage?: boolean
) {
    const viewport = editor.getVisibleViewport();
    if (viewport && rotator && rotatorHandle) {
        updateRotateHandle(viewport, angleRad, wrapper, rotator, rotatorHandle, !!isSmallImage);
    }

    if (handles) {
        if (angleRad > 0) {
            updateResizeHandles(handles, angleRad);
        }

        updateSideHandlesVisibility(handles, !!isSmallImage);
    }
}
