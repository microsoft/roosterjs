import { DNDDirectionX, DnDDirectionY } from '../types/DragAndDropContext';

export const RESIZE_HANDLE_SIZE = 10;
export const RESIZE_HANDLE_MARGIN = 6;

export const ROTATE_SIZE = 32;
export const ROTATE_GAP = 15;
export const DEG_PER_RAD = 180 / Math.PI;
export const DEFAULT_ROTATE_HANDLE_HEIGHT = ROTATE_SIZE / 2 + ROTATE_GAP;
export const ROTATE_ICON_MARGIN = 8;
export const ROTATION: Record<string, number> = {
    sw: 0,
    nw: 90,
    ne: 180,
    se: 270,
};
export const ROTATE_WIDTH = 1;
export const ROTATE_HANDLE_TOP = ROTATE_GAP + RESIZE_HANDLE_MARGIN;
export const CROP_HANDLE_SIZE = 22;
export const CROP_HANDLE_WIDTH = 7;
export const Xs: DNDDirectionX[] = ['w', '', 'e'];
export const Ys: DnDDirectionY[] = ['s', '', 'n'];

export const MIN_HEIGHT_WIDTH = 3 * RESIZE_HANDLE_SIZE + 2 * RESIZE_HANDLE_MARGIN;
