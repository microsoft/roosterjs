import ImageEditInfo, { CropInfo, ResizeInfo, RotateInfo } from '../types/ImageEditInfo';

const RESIZE_KEYS: (keyof ResizeInfo)[] = ['widthPx', 'heightPx'];
const ROTATE_KEYS: (keyof RotateInfo)[] = ['angleRad'];
const CROP_KEYS: (keyof CropInfo)[] = [
    'leftPercent',
    'rightPercent',
    'topPercent',
    'bottomPercent',
];
const ROTATE_CROP_KEYS: (keyof RotateInfo | keyof CropInfo)[] = [...ROTATE_KEYS, ...CROP_KEYS];
const ALL_KEYS = [...ROTATE_CROP_KEYS, ...RESIZE_KEYS];

/**
 * @internal
 * State of an edit info object for image editing.
 * It is returned by checkEditInfoState() function
 */
export const enum ImageEditInfoState {
    /**
     * Invalid edit info. It means the given edit info object is either null,
     * or not all its member are of correct type
     */
    Invalid,

    /**
     * The edit info shows that it is only potentially edited by resizing action.
     * Image is not rotated or cropped, or event not changed at all.
     */
    ResizeOnly,

    /**
     * When compare with another edit info, this value can be returned when both current
     * edit info and the other one are not been rotated, and they have same cropping
     * percentages. So that they can share the same image src, only width and height
     * need to be adjusted.
     */
    SameWithLast,

    /**
     * When this value is returned, it means the image is edited by either cropping or
     * rotation, or both. Image source can't be reused, need to generate a new image src
     * data uri.
     */
    FullyChanged,
}

/**
 * @internal
 * Check the state of an edit info
 * @param editInfo The edit info to check
 * @param compareTo An optional edit info to compare to
 * @returns If the source edit info is not valid (wrong type, missing field, ...), returns Invalid.
 * If the source edit info doesn't contain any rotation or cropping, returns ResizeOnly
 * If the compare edit info exists, and both of them don't contain rotation, and the have same cropping values,
 * returns SameWithLast. Otherwise, returns FullyChanged
 */
export default function checkEditInfoState(
    editInfo: ImageEditInfo,
    compareTo?: ImageEditInfo
): ImageEditInfoState {
    if (!editInfo || !editInfo.src || ALL_KEYS.some(key => !isNumber(editInfo[key]))) {
        return ImageEditInfoState.Invalid;
    } else if (
        ROTATE_CROP_KEYS.every(key => areSameNumber(editInfo[key], 0)) &&
        !editInfo.flippedHorizontal &&
        !editInfo.flippedVertical &&
        (!compareTo || (compareTo && editInfo.angleRad === compareTo.angleRad))
    ) {
        return ImageEditInfoState.ResizeOnly;
    } else if (
        compareTo &&
        ROTATE_KEYS.every(key => areSameNumber(editInfo[key], 0)) &&
        ROTATE_KEYS.every(key => areSameNumber(compareTo[key], 0)) &&
        CROP_KEYS.every(key => areSameNumber(editInfo[key], compareTo[key])) &&
        compareTo.flippedHorizontal === editInfo.flippedHorizontal &&
        compareTo.flippedVertical === editInfo.flippedVertical
    ) {
        return ImageEditInfoState.SameWithLast;
    } else {
        return ImageEditInfoState.FullyChanged;
    }
}

function isNumber(o: any): o is number {
    return typeof o === 'number';
}

function areSameNumber(n1: number, n2: number) {
    return Math.abs(n1 - n2) < 1e-3;
}
