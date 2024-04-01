import type { DNDDirectionX, DnDDirectionY } from '../types/DragAndDropContext';

/**
 * @internal
 */
export const RESIZE_HANDLE_SIZE = 10;

/**
 * @internal
 */
export const RESIZE_HANDLE_MARGIN = 6;

/**
 * @internal
 */
export const ROTATE_SIZE = 32;

/**
 * @internal
 */
export const ROTATE_GAP = 15;

/**
 * @internal
 */
export const DEG_PER_RAD = 180 / Math.PI;

/**
 * @internal
 */
export const DEFAULT_ROTATE_HANDLE_HEIGHT = ROTATE_SIZE / 2 + ROTATE_GAP;

/**
 * @internal
 */
export const ROTATE_ICON_MARGIN = 8;

/**
 * @internal
 */
export const ROTATION: Record<string, number> = {
    sw: 0,
    nw: 90,
    ne: 180,
    se: 270,
};

/**
 * @internal
 */
export const Xs: DNDDirectionX[] = ['w', '', 'e'];

/**
 * @internal
 */
export const Ys: DnDDirectionY[] = ['s', '', 'n'];

/**
 * @internal
 */
export const ROTATE_WIDTH = 1;

/**
 * @internal
 */
export const ROTATE_HANDLE_TOP = ROTATE_GAP + RESIZE_HANDLE_MARGIN;

/**
 * @internal
 */
export const CROP_HANDLE_SIZE = 22;

/**
 * @internal
 */
export const CROP_HANDLE_WIDTH = 7;

/**
 * @internal
 */
export const XS_CROP: DNDDirectionX[] = ['w', 'e'];

/**
 * @internal
 */
export const YS_CROP: DnDDirectionY[] = ['s', 'n'];

/**
 * @internal
 */
export const MIN_HEIGHT_WIDTH = 3 * RESIZE_HANDLE_SIZE + 2 * RESIZE_HANDLE_MARGIN;
