import getTargetSizeByPercentage from '../utils/getTargetSizeByPercentage';
import isResizedTo from './isResizedTo';
import { applyChange } from '../utils/applyChange';
import { getImageEditInfo } from '../utils/getImageEditInfo';
import { IEditor } from 'roosterjs-content-model-types/lib';
import { loadImage } from '../utils/loadImage';

/**
 * Resize the image by percentage of its natural size. If the image is cropped or rotated,
 * the final size will also calculated with crop and rotate info.
 * @param editor The editor that contains the image
 * @param percentage Percentage to resize to
 * @param minWidth Minimum width
 * @param minHeight Minimum height
 */
export function resizeByPercentage(
    editor: IEditor,
    percentage: number,
    minWidth: number,
    minHeight: number
) {
    const selection = editor.getDOMSelection();
    if (selection?.type === 'image') {
        const image = selection.image;
        const editInfo = getImageEditInfo(image);
        console.log('editInfo', percentage);
        if (!isResizedTo(image, percentage)) {
            loadImage(image, image.src, () => {
                if (editInfo) {
                    const lastSrc = image.getAttribute('src');
                    const { width, height } = getTargetSizeByPercentage(editInfo, percentage);
                    editInfo.widthPx = Math.max(width, minWidth);
                    editInfo.heightPx = Math.max(height, minHeight);
                    applyChange(editor, image, editInfo, lastSrc || '', true /*wasResized*/);
                }
            });
        }
    }
}
