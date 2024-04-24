import getTargetSizeByPercentage from '../utils/getTargetSizeByPercentage';
import { getImageEditInfo } from '../utils/getImageEditInfo';
import { IEditor } from 'roosterjs-content-model-types';
import { setMetadata } from '../utils/imageMetadata';

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
        const { width, height } = getTargetSizeByPercentage(editInfo, percentage);
        editInfo.widthPx = Math.max(width, minWidth);
        editInfo.heightPx = Math.max(height, minHeight);
        setMetadata(image, editInfo);
        editor.triggerEvent('editImage', {
            image,
            previousSrc: image.src,
            newSrc: image.src,
            originalSrc: image.src,
            apiOperation: {
                action: 'reset',
            },
        });
    }
}
