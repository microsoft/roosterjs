import checkEditInfoState, { ImageEditInfoState } from './checkEditInfoState';
import generateDataURL from './generateDataURL';
import getGeneratedImageSize from './getGeneratedImageSize';
import { deleteEditInfo, getEditInfoFromImage, saveEditInfo } from './editInfo';
import { PluginEventType } from 'roosterjs-editor-types';
import type ImageEditInfo from '../types/ImageEditInfo';
import type { IEditor } from 'roosterjs-editor-types';

/**
 * @internal
 * Apply changes from the edit info of an image, write result to the image
 * @param editor The editor object that contains the image
 * @param image The image to apply the change
 * @param editInfo Edit info that contains the changed information of the image
 * @param previousSrc Last src value of the image before the change was made
 * @param wasResizedOrCropped if the image was resized or cropped apply the new image dimensions
 * @param editingImage (optional) Image in editing state
 */
export default function applyChange(
    editor: IEditor,
    image: HTMLImageElement,
    editInfo: ImageEditInfo,
    previousSrc: string,
    wasResizedOrCropped: boolean,
    editingImage?: HTMLImageElement
) {
    let newSrc = '';

    const initEditInfo = getEditInfoFromImage(editingImage ?? image);
    const state = checkEditInfoState(editInfo, initEditInfo);

    switch (state) {
        case ImageEditInfoState.ResizeOnly:
            // For resize only case, no need to generate a new image, just reuse the original one
            newSrc = editInfo.src;
            break;
        case ImageEditInfoState.SameWithLast:
            // For SameWithLast case, image may be resized but the content is still the same with last one,
            // so no need to create a new image, but just reuse last one
            newSrc = previousSrc;
            break;
        case ImageEditInfoState.FullyChanged:
            // For other cases (cropped, rotated, ...) we need to create a new image to reflect the change
            newSrc = generateDataURL(editingImage ?? image, editInfo);
            break;
    }

    const srcChanged = newSrc != previousSrc;

    if (srcChanged) {
        // If the src is changed, fire an EditImage event so that plugins knows that a new image is used, and can
        // replace the new src with some other string and it will be used and set to the image
        const event = editor.triggerPluginEvent(PluginEventType.EditImage, {
            image: image,
            originalSrc: editInfo.src,
            previousSrc,
            newSrc,
        });
        newSrc = event.newSrc;
    }

    if (newSrc == editInfo.src) {
        // If newSrc is the same with original one, it means there is only size change, but no rotation, no cropping,
        // so we don't need to keep edit info, we can delete it
        deleteEditInfo(image);
    } else {
        // Otherwise, save the new edit info to the image so that next time when we edit the same image, we know
        // the edit info
        saveEditInfo(image, editInfo);
    }

    // Write back the change to image, and set its new size
    const { targetWidth, targetHeight } = getGeneratedImageSize(editInfo);
    image.src = newSrc;

    if (wasResizedOrCropped || state == ImageEditInfoState.FullyChanged) {
        image.width = targetWidth;
        image.height = targetHeight;
        // Remove width/height style so that it won't affect the image size, since style width/height has higher priority
        image.style.removeProperty('width');
        image.style.removeProperty('height');
        image.style.removeProperty('max-width');
    }
}
