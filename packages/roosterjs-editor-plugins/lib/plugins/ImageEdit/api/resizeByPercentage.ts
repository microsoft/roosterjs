import applyChange from '../editInfoUtils/applyChange';
import getEditInfoFromImage from '../editInfoUtils/getEditInfoFromImage';
import getTargetSizeByPercentage from '../editInfoUtils/getTargetSizeByPercentage';
import isResizedTo from './isResizedTo';
import { ChangeSource, IEditor } from 'roosterjs-editor-types';

/**
 * Resize the image by percentage of its natural size. If the image is cropped or rotated,
 * the final size will also calculated with crop and rotate info.
 * @param editor The editor that contains the image
 * @param image The image to resize
 * @param percentage Percentage to resize to
 * @param minWidth Minimum width
 * @param minHeight Minimum height
 */
export default function resizeByPercentage(
    editor: IEditor,
    image: HTMLImageElement,
    percentage: number,
    minWidth: number,
    minHeight: number
) {
    const editInfo = getEditInfoFromImage(image);

    if (!isResizedTo(image, percentage)) {
        loadImage(image, editInfo.src, () => {
            if (!editor.isDisposed() && editor.contains(image)) {
                const lastSrc = image.src;
                const [targetWidth, targetHeight] = getTargetSizeByPercentage(editInfo, percentage);
                editInfo.width = Math.max(targetWidth, minWidth);
                editInfo.height = Math.max(targetHeight, minHeight);

                editor.addUndoSnapshot(() => {
                    applyChange(editor, image, editInfo, lastSrc);
                }, ChangeSource.ImageResize);
            }
        });
    }
}

function loadImage(img: HTMLImageElement, src: string, callback: () => void) {
    img.onload = () => {
        img.onload = null;
        img.onerror = null;
        callback();
    };
    img.onerror = () => {
        img.onload = null;
        img.onerror = null;
        callback();
    };
    img.src = src;
}
