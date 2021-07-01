import { IMAGE_EDIT_INFO_NAME } from '../types/ImageEditInfo';

/**
 * @internal
 * Delete edit info of an image if any
 * @param image The image to delete edit info from
 */
export default function deleteEditInfo(image: HTMLImageElement) {
    if (image) {
        delete image.dataset[IMAGE_EDIT_INFO_NAME];
    }
}
