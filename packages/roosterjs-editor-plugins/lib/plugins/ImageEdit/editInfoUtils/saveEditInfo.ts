import ImageEditInfo, { IMAGE_EDIT_INFO_NAME } from '../types/ImageEditInfo';

/**
 * @internal
 * Save edit info to image
 * @param image The image to save edit info to
 * @param editInfo The edit info to save
 */
export default function saveEditInfo(image: HTMLImageElement, editInfo: ImageEditInfo) {
    if (image) {
        image.dataset[IMAGE_EDIT_INFO_NAME] = JSON.stringify(editInfo);
    }
}
