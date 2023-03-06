import applyChange from '../editInfoUtils/applyChange';
import getTargetSizeByPercentage from '../editInfoUtils/getTargetSizeByPercentage';
import isResizedTo from './isResizedTo';
import { ChangeSource, IEditor } from 'roosterjs-editor-types';
import { getEditInfoFromImage } from '../editInfoUtils/editInfo';
import { loadImage } from './loadImage';

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
        loadImage(image, image.src, () => {
            if (!editor.isDisposed() && editor.contains(image) && editInfo) {
                const lastSrc = image.getAttribute('src');
                const { width, height } = getTargetSizeByPercentage(editInfo, percentage);
                editInfo.widthPx = Math.max(width, minWidth);
                editInfo.heightPx = Math.max(height, minHeight);

                editor.addUndoSnapshot(() => {
                    applyChange(editor, image, editInfo, lastSrc || '', true /*wasResized*/);
                }, ChangeSource.ImageResize);
            }
        });
    }
}
