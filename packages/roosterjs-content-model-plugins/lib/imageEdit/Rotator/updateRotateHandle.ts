import { DEG_PER_RAD, RESIZE_HANDLE_MARGIN, ROTATE_GAP, ROTATE_SIZE } from '../constants/constants';
import type { Rect } from 'roosterjs-content-model-types';

/**
 * @internal
 * Move rotate handle. When image is very close to the border of editor, rotate handle may not be visible.
 * Fix it by reduce the distance from image to rotate handle
 */
export function updateRotateHandle(
    editorRect: Rect,
    angleRad: number,
    wrapper: HTMLElement,
    rotateCenter: HTMLElement,
    rotateHandle: HTMLElement,
    isSmallImage: boolean
) {
    if (isSmallImage) {
        rotateCenter.style.display = 'none';
        rotateHandle.style.display = 'none';
        return;
    } else {
        rotateCenter.style.display = '';
        rotateHandle.style.display = '';
        const rotateCenterRect = rotateCenter.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();
        const ROTATOR_HEIGHT = ROTATE_SIZE + ROTATE_GAP + RESIZE_HANDLE_MARGIN;
        if (rotateCenterRect && wrapperRect) {
            let adjustedDistance = Number.MAX_SAFE_INTEGER;
            const angle = angleRad * DEG_PER_RAD;

            if (angle < 45 && angle > -45 && wrapperRect.top - editorRect.top < ROTATOR_HEIGHT) {
                const top = rotateCenterRect.top - editorRect.top;
                adjustedDistance = top;
            } else if (
                angle <= -80 &&
                angle >= -100 &&
                wrapperRect.left - editorRect.left < ROTATOR_HEIGHT
            ) {
                const left = rotateCenterRect.left - editorRect.left;
                adjustedDistance = left;
            } else if (
                angle >= 80 &&
                angle <= 100 &&
                editorRect.right - wrapperRect.right < ROTATOR_HEIGHT
            ) {
                const right = rotateCenterRect.right - editorRect.right;
                adjustedDistance = Math.min(editorRect.right - wrapperRect.right, right);
            } else if (
                (angle <= -160 || angle >= 160) &&
                editorRect.bottom - wrapperRect.bottom < ROTATOR_HEIGHT
            ) {
                const bottom = rotateCenterRect.bottom - editorRect.bottom;
                adjustedDistance = Math.min(editorRect.bottom - wrapperRect.bottom, bottom);
            }

            const rotateGap = Math.max(Math.min(ROTATE_GAP, adjustedDistance), 0);
            const rotateTop = Math.max(Math.min(ROTATE_SIZE, adjustedDistance - rotateGap), 0);
            rotateCenter.style.top = -rotateGap - RESIZE_HANDLE_MARGIN + 'px';
            rotateCenter.style.height = rotateGap + 'px';
            rotateHandle.style.top = -rotateTop + 'px';
        }
    }
}
