import checkEditInfoState, { ImageEditInfoState } from './checkEditInfoState';
import ImageEditInfo, { IMAGE_EDIT_INFO_NAME } from '../types/ImageEditInfo';

/**
 * @internal
 * Get image edit info from an image. If the image doesn't have edit info, create one from this image.
 * When create new edit info, it will have width/height set to the image's current client width/height, and
 * natural width/height set to the image's natural width/height, src set to its current src, and all
 * other fields set to 0.
 * @param image The image to get edit info from
 */
export default function getEditInfoFromImage(image: HTMLImageElement): ImageEditInfo {
    const obj = safeParseJSON(image?.dataset[IMAGE_EDIT_INFO_NAME]) as ImageEditInfo;
    return checkEditInfoState(obj) == ImageEditInfoState.Invalid ? getInitialEditInfo(image) : obj;
}

function getInitialEditInfo(image: HTMLImageElement): ImageEditInfo {
    return {
        src: image.src,
        widthPx: image.clientWidth,
        heightPx: image.clientHeight,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        leftPercent: 0,
        rightPercent: 0,
        topPercent: 0,
        bottomPercent: 0,
        angleRad: 0,
    };
}

function safeParseJSON(json: string): any {
    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
}
